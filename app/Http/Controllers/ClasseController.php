<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\Level;
use App\Models\Filiere;
use App\Models\Matiere;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class ClasseController extends Controller
{
    private function getActiveSchoolId(Request $request)
    {
        if ($request->user()->role === 'super_admin' && session('active_school_id')) {
            return session('active_school_id');
        }
        return $request->user()->school_id;
    }

    public function index(Request $request)
    {
        $schoolId = $this->getActiveSchoolId($request);
        $user = $request->user();

        $classesQuery = Classe::where('school_id', $schoolId);
        $levelsQuery = Level::where('school_id', $schoolId);

        if ($user->role === 'censeur') {
            $managedLevelIds = Level::where('censeur_id', $user->id)->pluck('id');
            $levelsQuery->where('censeur_id', $user->id);
            $classesQuery->whereIn('level_id', $managedLevelIds);
        }

        return Inertia::render('Classes/Index', [
            'classes' => $classesQuery->with(['level.censeur', 'filiere', 'matieres', 'professeurPrincipal'])->get(),
            'levels' => $levelsQuery->with('censeur')->orderBy('order')->get(),
            'filieres' => Filiere::where('school_id', $schoolId)->get(),
            'teachers' => \App\Models\User::where('school_id', $schoolId)->whereIn('role', ['enseignant', 'censeur', 'proviseur'])->select('id', 'name', 'role')->get(),
        ]);
    }

    private function generateAutoIncrementedClassName($schoolId, $levelId, $baseNom, $section)
    {
        $baseNom = trim($baseNom);

        if ($section === 'anglophone') {
            // Détection si l'utilisateur a déjà spécifié une lettre explicite (ex: FORM 1 A)
            if (preg_match('/ [A-Z]$/i', $baseNom)) {
                return strtoupper($baseNom);
            }

            // Compter les classes existantes commençant par ce nom dans ce niveau
            $existingCount = Classe::where('school_id', $schoolId)
                ->where('level_id', $levelId)
                ->where('nom', 'LIKE', $baseNom . '%')
                ->count();

            $letter = chr(65 + $existingCount); // 0 -> A, 1 -> B, 2 -> C...
            return strtoupper($baseNom . ' ' . $letter);
        } else {
            // Section Francophone / Bilingue: SIXIEME 1, SIXIEME BILINGUE 1...
            if (preg_match('/\d+$/', $baseNom)) {
                return strtoupper($baseNom);
            }

            $existingCount = Classe::where('school_id', $schoolId)
                ->where('level_id', $levelId)
                ->where('nom', 'LIKE', $baseNom . '%')
                ->count();

            $nextNumber = $existingCount + 1;
            return strtoupper($baseNom . ' ' . $nextNumber);
        }
    }

    /**
     * Assigner automatiquement les matières par défaut à une classe nouvellement créée.
     */
    private function assignDefaultSubjects(Classe $classe, int $levelOrder, string $section, ?string $serie, ?string $lv2)
    {
        // Déterminer la clé de section dans la config (francophone, anglophone, bilingue)
        $configSection = in_array($section, ['bilingue', 'anglophone']) ? $section : 'francophone';
        $defaults = config("subjects_defaults.{$configSection}");

        if (!$defaults || !isset($defaults[$levelOrder])) {
            return; // Pas de défauts pour ce niveau/section
        }

        $levelDefaults = $defaults[$levelOrder];

        // Déterminer quelle variante utiliser
        if ($serie && isset($levelDefaults[$serie])) {
            // Niveau avec séries (5, 6, 7) : utiliser la série spécifique
            $subjects = $levelDefaults[$serie];
        } elseif (isset($levelDefaults['default'])) {
            // Niveau sans séries : utiliser les défauts
            $subjects = $levelDefaults['default'];
        } else {
            return;
        }

        $schoolId = $classe->school_id;

        foreach ($subjects as $subjectData) {
            $subjectName = $subjectData['nom'];
            $coefficient = $subjectData['coef'];

            // Remplacer le placeholder LV2 par le vrai nom de langue
            if ($subjectName === 'LV2') {
                if ($lv2) {
                    $subjectName = $lv2; // Ex: "Espagnol", "Allemand"
                } else {
                    continue; // Pas de LV2 sélectionnée, on skip
                }
            }

            // Chercher ou créer la matière pour cette école
            $matiere = Matiere::firstOrCreate(
                ['nom' => $subjectName, 'school_id' => $schoolId],
                ['coef' => $coefficient, 'attribut' => 0, 'categori' => 0]
            );

            // Créer l'entrée dans la table pivot matiere_classe
            $classe->matieres()->syncWithoutDetaching([
                $matiere->id => ['coefficient' => $coefficient]
            ]);
        }
    }

    public function store(Request $request)
    {
        $schoolId = $this->getActiveSchoolId($request);

        $request->validate([
            'nom' => 'required|string|max:255',
            'section' => 'nullable|string|in:francophone,anglophone,bilingue',
            'level_id' => [
                'required',
                Rule::exists('levels', 'id')->where(function ($query) use ($schoolId) {
                    $query->where('school_id', $schoolId);
                }),
            ],
            'filiere_id' => 'nullable|exists:filieres,id',
            'code' => 'nullable|string|max:50',
            'serie' => 'nullable|string|in:A4,C,D',
            'lv2' => 'nullable|string|max:100',
            'principal_teacher_id' => 'nullable|exists:users,id',
            'annee_academique' => 'nullable|string|max:20',
        ]);

        $level = Level::findOrFail($request->level_id);
        $filiere = $request->filiere_id ? Filiere::find($request->filiere_id) : null;
        $section = $request->input('section', 'francophone');

        // Validation: Un censeur DOIT être assigné au niveau
        if (!$level->censeur_id) {
            return back()->with('error', "Impossible de créer une classe pour ce niveau car aucun censeur n'y est encore assigné.");
        }

        // Auto-incrémentation du nom de la classe (ex: SIXIEME 1, FORM 1 A)
        $finalNom = $this->generateAutoIncrementedClassName($schoolId, $level->id, $request->nom, $section);

        return DB::transaction(function () use ($request, $schoolId, $level, $section, $finalNom) {
            $classe = Classe::create([
                'nom' => $finalNom,
                'section' => $section,
                'level_id' => $request->level_id,
                'censeur_id' => $level->censeur_id,
                'filiere_id' => $request->filiere_id,
                'school_id' => $schoolId,
                'code' => $request->code,
                'principal_teacher_id' => $request->principal_teacher_id,
                'annee_academique' => $request->annee_academique ?? (date('Y') . '-' . (date('Y') + 1)),
            ]);

            // Mapper le code LV2 vers un nom lisible
            $lv2Map = [
                'ESPAGNOLE' => 'Espagnol',
                'ALLEMANDE' => 'Allemand',
                'ITALIENNE' => 'Italien',
                'CHINOISE' => 'Chinois',
                'ARABE' => 'Arabe',
            ];
            $lv2Name = isset($lv2Map[$request->lv2]) ? $lv2Map[$request->lv2] : $request->lv2;

            // Assigner les matières par défaut si demandé par l'utilisateur
            if ($request->boolean('auto_subjects', true)) {
                $this->assignDefaultSubjects($classe, $level->order, $section, $request->serie, $lv2Name);
                return redirect()->back()->with('success', "Classe {$finalNom} créée avec succès. Les matières par défaut ont été assignées.");
            }

            return redirect()->back()->with('success', "Classe {$finalNom} créée avec succès (salle vierge).");
        });
    }

    public function toggleSequenceAuth(Request $request, Classe $classe)
    {
        $user = $request->user();
        if ($user->role !== 'proviseur' && ($user->role !== 'censeur' || $classe->level?->censeur_id !== $user->id)) {
            return back()->with('error', "Vous n'êtes pas autorisé à modifier les autorisations de cette classe.");
        }

        $request->validate([
            'sequence' => 'required|integer|min:1|max:6',
        ]);

        $targetSeq = (int) $request->sequence;
        $targetField = "seq{$targetSeq}_auth";
        $currentlyOpen = (bool) $classe->$targetField;

        // Règle stricte : 1 seule séquence débloquée à la fois
        // Si elle est déjà ouverte, on la ferme (tout devient verrouillé)
        if ($currentlyOpen) {
            $classe->update([$targetField => false]);
            return back()->with('success', "Séquence {$targetSeq} verrouillée pour la classe {$classe->nom}.");
        }

        // Sinon, on ouvre UNIQUEMENT la séquence choisie et on ferme STRICTEMENT toutes les autres
        $updates = [];
        for ($s = 1; $s <= 6; $s++) {
            $updates["seq{$s}_auth"] = ($s === $targetSeq);
        }

        $classe->update($updates);

        return back()->with('success', "Séquence {$targetSeq} ouverte exclusivement pour la classe {$classe->nom} (les autres séquences sont verrouillées).");
    }

    /**
     * Déverrouillage exclusif d'une séquence pour TOUTES les classes de l'école (Proviseur uniquement)
     */
    public function toggleAllClassesSequence(Request $request)
    {
        $user = $request->user();
        if (!in_array($user->role, ['proviseur', 'super_admin'])) {
            return back()->with('error', "Action réservée au Proviseur / Chef d'établissement.");
        }

        $request->validate([
            'sequence' => 'required|integer|min:1|max:6',
        ]);

        $schoolId = $this->getSchoolId();
        $targetSeq = (int) $request->sequence;

        // Vérifier si la séquence est déjà ouverte sur la première classe pour déterminer l'action
        $firstClass = Classe::where('school_id', $schoolId)->first();
        $isAlreadyOpen = $firstClass ? (bool) $firstClass->{"seq{$targetSeq}_auth"} : false;

        $updates = [];
        for ($s = 1; $s <= 6; $s++) {
            // Si déjà ouverte, on verrouille tout. Sinon, seule la séquence cible est ouverte
            $updates["seq{$s}_auth"] = $isAlreadyOpen ? false : ($s === $targetSeq);
        }

        Classe::where('school_id', $schoolId)->update($updates);

        $msg = $isAlreadyOpen 
            ? "Toutes les séquences ont été verrouillées pour l'ensemble des classes de l'établissement."
            : "Séquence {$targetSeq} ouverte exclusivement pour l'ensemble de l'établissement (Séquences 1 à 6 mutuellement exclusives).";

        return back()->with('success', $msg);
    }


    public function destroy(Classe $classe)
    {
        $classe->delete();
        return redirect()->back()->with('success', 'Classe supprimée.');
    }

    public function update(Request $request, Classe $classe)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'principal_teacher_id' => 'nullable|exists:users,id',
            'annee_academique' => 'nullable|string|max:20',
        ]);

        $classe->update($request->only('nom', 'code', 'principal_teacher_id', 'annee_academique'));
        return redirect()->back()->with('success', 'Classe mise à jour avec succès.');
    }
}