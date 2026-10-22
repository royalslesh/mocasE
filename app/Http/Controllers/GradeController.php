<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Note;
use App\Models\Eleve;
use App\Models\Matiere;
use App\Models\Classe;
use App\Models\TeacherAssignment;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class GradeController extends Controller
{
    public function create(Request $request)
    {
        $user = $request->user()->load('school');
        $schoolId = $user->school_id;

        // Charger les classes de l'école avec leurs matières (relation pivot matiere_classe) et leurs élèves
        if ($user->role === 'enseignant') {
            // Pour un enseignant, récupérer uniquement ses affectations
            $assignments = TeacherAssignment::where('user_id', $user->id)
                ->with(['classe.matieres', 'subject'])
                ->get();

            // Salles uniques de cet enseignant
            $classes = $assignments->pluck('classe')->unique('id')->values();

            // Mapper les matières autorisées par classe pour l'enseignant
            $teacherSubjectMap = [];
            foreach ($assignments as $a) {
                if ($a->classe_id && $a->subject) {
                    $teacherSubjectMap[$a->classe_id][] = [
                        'id' => $a->subject->id,
                        'nom' => $a->subject->nom,
                        'coefficient' => $a->subject->pivot ? $a->subject->pivot->coefficient : 1,
                    ];
                }
            }
        } else {
            // Proviseur, Censeur, Super Admin : toutes les classes de leur périmètre
            $classesQuery = Classe::where('school_id', $schoolId)->with(['matieres', 'eleves']);

            if ($user->role === 'censeur') {
                $managedLevelIds = \App\Models\Level::where('censeur_id', $user->id)->pluck('id');
                $classesQuery->whereIn('level_id', $managedLevelIds);
            }

            $classes = $classesQuery->get();
            $teacherSubjectMap = null;
        }

        // Formater les données des classes pour le frontend avec leurs matières spécifiques
        $formattedClasses = $classes->map(function ($classe) use ($user, $teacherSubjectMap) {
            // Si enseignant, prendre uniquement les matières qui lui sont assignées dans cette classe
            if ($user->role === 'enseignant' && isset($teacherSubjectMap[$classe->id])) {
                $matieres = $teacherSubjectMap[$classe->id];
            } else {
                // Sinon prendre toutes les matières rattachées à la classe via matiere_classe
                $matieres = $classe->matieres->map(function ($m) {
                    return [
                        'id' => $m->id,
                        'nom' => $m->nom,
                        'coefficient' => $m->pivot ? $m->pivot->coefficient : 1,
                    ];
                });
            }

            return [
                'id' => $classe->id,
                'nom' => $classe->nom,
                'section' => $classe->section,
                'seq1_auth' => (bool) $classe->seq1_auth,
                'seq2_auth' => (bool) $classe->seq2_auth,
                'seq3_auth' => (bool) $classe->seq3_auth,
                'seq4_auth' => (bool) $classe->seq4_auth,
                'seq5_auth' => (bool) $classe->seq5_auth,
                'seq6_auth' => (bool) $classe->seq6_auth,
                'matieres' => $matieres,
                'eleves' => $classe->eleves()->orderBy('nom')->get(['id', 'nom', 'prenom', 'MATRICULE', 'sexe', 'photo_path']),
            ];
        });

        // Charger les notes déjà saisies (pour pré-remplissage)
        $existingNotes = Note::whereIn('classe_id', $formattedClasses->pluck('id'))
            ->get(['id', 'eleve_id', 'matiere_id', 'sequence', 'note']);

        $school = $user->school;

        $deadlines = \App\Models\GradingDeadline::where('school_id', $schoolId)->get();
        
        $extensionsQuery = \App\Models\GradeExtensionRequest::where('school_id', $schoolId);
        if ($user->role === 'enseignant') {
            $extensionsQuery->where('user_id', $user->id);
        }
        $extensions = $extensionsQuery->get();

        return Inertia::render('Grades/Create', [
            'classes' => $formattedClasses,
            'existingNotes' => $existingNotes,
            'isSubmissionOpen' => $school ? (bool) $school->is_grades_submission_open : true,
            'userRole' => $user->role,
            'deadlines' => $deadlines,
            'extensions' => $extensions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'classe_id' => 'required|exists:classes,id',
            'matiere_id' => 'required|exists:matieres,id',
            'sequence' => 'required|integer|min:1|max:6',
            'notes' => 'required|array',
            'notes.*.student_id' => 'required|exists:eleves,id',
            'notes.*.score' => 'nullable|numeric|min:0|max:20',
        ]);

        $user = $request->user();
        $classe = Classe::findOrFail($request->classe_id);
        $sequence = (int) $request->sequence;
        $school = $user->school;

        // 0. Vérification Autorisation Globale Établissement
        if ($school && !$school->is_grades_submission_open && !in_array($user->role, ['super_admin', 'proviseur'])) {
            return back()->with('error', "La saisie des notes a été fermée à l'échelle de l'établissement.");
        }

        // 1. Vérification Autorisation Censeur par Séquence
        $authField = "seq{$sequence}_auth";
        if (!$classe->$authField && !in_array($user->role, ['super_admin', 'proviseur'])) {
            return back()->with('error', "La saisie des notes pour la séquence {$sequence} dans la classe {$classe->nom} n'est pas autorisée par le Censeur.");
        }

        // 2. Vérification strictes des droits Enseignant
        if ($user->role === 'enseignant') {
            $hasAssignment = TeacherAssignment::where('user_id', $user->id)
                ->where('classe_id', $request->classe_id)
                ->where('subject_id', $request->matiere_id)
                ->exists();

            if (!$hasAssignment) {
                return back()->with('error', "Sécurité : Vous n'êtes pas l'enseignant attribué à cette matière dans cette classe.");
            }
        }

        // 2bis. Verrouillage : Une fois validée par l'enseignant, modification interdite sans accord du Censeur ou Proviseur
        if ($user->role === 'enseignant') {
            $alreadyValidated = Note::where('classe_id', $request->classe_id)
                ->where('matiere_id', $request->matiere_id)
                ->where('sequence', $sequence)
                ->exists();

            if ($alreadyValidated) {
                $hasExtension = \App\Models\GradeExtensionRequest::where('school_id', $school->id)
                    ->where('user_id', $user->id)
                    ->where('classe_id', $request->classe_id)
                    ->where('subject_id', $request->matiere_id)
                    ->where('sequence', $sequence)
                    ->where('status', 'approved')
                    ->exists();

                if (!$hasExtension) {
                    return back()->with('error', "Ces notes ont déjà été validées. Toute modification ultérieure nécessite l'accord préalable du Censeur ou du Proviseur via une demande d'autorisation.");
                }
            }
        }

        // 3. Vérification des Délais (Grading Deadlines)
        $deadline = \App\Models\GradingDeadline::where('school_id', $school->id)->where('sequence', $sequence)->first();
        if ($deadline && ($deadline->start_date || $deadline->end_date)) {
            $now = now();
            $isOpen = true;
            if ($deadline->start_date && $now->lt($deadline->start_date)) $isOpen = false;
            if ($deadline->end_date && $now->gt($deadline->end_date->endOfDay())) $isOpen = false;

            if (!$isOpen && !in_array($user->role, ['super_admin', 'proviseur'])) {
                // Vérifier s'il y a une demande d'extension approuvée
                $hasExtension = \App\Models\GradeExtensionRequest::where('school_id', $school->id)
                    ->where('user_id', $user->id)
                    ->where('classe_id', $request->classe_id)
                    ->where('subject_id', $request->matiere_id)
                    ->where('sequence', $sequence)
                    ->where('status', 'approved')
                    ->exists();

                if (!$hasExtension) {
                    return back()->with('error', "Le délai de saisie pour la séquence {$sequence} est expiré. Veuillez demander une dérogation.");
                }
            }
        }

        $tri = (int) ceil($sequence / 2);

        return DB::transaction(function () use ($request, $tri, $sequence) {
            $savedCount = 0;
            foreach ($request->notes as $noteData) {
                // Accepter uniquement les notes valides renseignées
                if (isset($noteData['score']) && $noteData['score'] !== '' && $noteData['score'] !== null) {
                    Note::updateOrCreate(
                        [
                            'eleve_id' => $noteData['student_id'],
                            'matiere_id' => $request->matiere_id,
                            'sequence' => $sequence,
                        ],
                        [
                            'note' => (float) $noteData['score'],
                            'classe_id' => $request->classe_id,
                            'tri' => $tri,
                        ]
                    );

                    $this->updateStudentRankings($noteData['student_id'], $tri);
                    $savedCount++;
                }
            }

            return redirect()->back()->with('success', "Succès : {$savedCount} note(s) enregistrée(s) avec succès pour la Séquence {$sequence} !");
        });
    }

    /**
     * Sauvegarde automatique d'une note unique en arrière-plan (AJAX / instantané)
     */
    public function storeSingle(Request $request)
    {
        $validated = $request->validate([
            'classe_id' => 'required|exists:classes,id',
            'matiere_id' => 'required|exists:matieres,id',
            'sequence' => 'required|integer|min:1|max:6',
            'student_id' => 'required|exists:eleves,id',
            'score' => 'nullable|numeric|min:0|max:20',
        ]);

        $user = $request->user();
        $classe = Classe::findOrFail($validated['classe_id']);
        $sequence = (int) $validated['sequence'];
        $school = $user->school;

        // Vérification autorisations
        if ($school && !$school->is_grades_submission_open && !in_array($user->role, ['super_admin', 'proviseur'])) {
            return response()->json(['error' => "La saisie des notes a été fermée par la direction."], 403);
        }

        $authField = "seq{$sequence}_auth";
        if (!$classe->$authField && !in_array($user->role, ['super_admin', 'proviseur'])) {
            return response()->json(['error' => "La saisie n'est pas autorisée par le Censeur pour la Séquence {$sequence}."], 403);
        }

        if ($user->role === 'enseignant') {
            $hasAssignment = TeacherAssignment::where('user_id', $user->id)
                ->where('classe_id', $validated['classe_id'])
                ->where('subject_id', $validated['matiere_id'])
                ->exists();

            if (!$hasAssignment) {
                return response()->json(['error' => "Non autorisé pour cette matière."], 403);
            }

            // Verrouillage note existante
            $existingNote = Note::where('eleve_id', $validated['student_id'])
                ->where('matiere_id', $validated['matiere_id'])
                ->where('sequence', $sequence)
                ->first();

            if ($existingNote && $existingNote->note !== null) {
                $hasExtension = \App\Models\GradeExtensionRequest::where('school_id', $school->id)
                    ->where('user_id', $user->id)
                    ->where('classe_id', $validated['classe_id'])
                    ->where('subject_id', $validated['matiere_id'])
                    ->where('sequence', $sequence)
                    ->where('status', 'approved')
                    ->exists();

                if (!$hasExtension) {
                    return response()->json(['error' => "Cette note a déjà été validée. Toute modification nécessite l'accord du Censeur ou du Proviseur."], 403);
                }
            }
        }

        $tri = (int) ceil($sequence / 2);

        if ($validated['score'] === null || $validated['score'] === '') {
            Note::where('eleve_id', $validated['student_id'])
                ->where('matiere_id', $validated['matiere_id'])
                ->where('sequence', $sequence)
                ->delete();
            $this->updateStudentRankings($validated['student_id'], $tri);
            return response()->json(['status' => 'deleted', 'student_id' => $validated['student_id']]);
        }

        Note::updateOrCreate(
            [
                'eleve_id' => $validated['student_id'],
                'matiere_id' => $validated['matiere_id'],
                'sequence' => $sequence,
            ],
            [
                'note' => (float) $validated['score'],
                'classe_id' => $validated['classe_id'],
                'tri' => $tri,
            ]
        );

        $this->updateStudentRankings($validated['student_id'], $tri);

        return response()->json([
            'status' => 'saved',
            'student_id' => $validated['student_id'],
            'score' => (float) $validated['score'],
        ]);
    }


    protected function updateStudentRankings($student_id, $tri)
    {
        $student = Eleve::find($student_id);
        if (!$student) return;

        // Récupérer les moyennes pondérées par coefficients
        $notes = Note::where('eleve_id', $student_id)
            ->where('tri', $tri)
            ->get();

        $totalPoints = 0;
        $totalCoefs = 0;

        foreach ($notes as $note) {
            $pivot = DB::table('matiere_classe')
                ->where('matiere_id', $note->matiere_id)
                ->where('classe_id', $note->classe_id)
                ->first();

            $coef = $pivot ? (float) $pivot->coefficient : 1.0;
            $totalPoints += ($note->note * $coef);
            $totalCoefs += $coef;
        }

        $average = $totalCoefs > 0 ? $totalPoints / $totalCoefs : 0;

        $moyField = "moy{$tri}";
        $student->{$moyField} = round($average, 2);
        $student->save();

        // Mettre à jour les rangs de la classe entière pour ce trimestre
        $students = Eleve::where('classe_id', $student->classe_id)
            ->orderByDesc($moyField)
            ->get();

        $rankField = "rang{$tri}";
        foreach ($students as $index => $s) {
            $s->{$rankField} = $index + 1;
            $s->save();
        }
    }
}
