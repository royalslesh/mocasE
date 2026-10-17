<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Classe;
use App\Models\Eleve;
use App\Models\Note;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────
    // Données communes : notes + stats de classe + infos école + prof principal
    // ─────────────────────────────────────────────────────────────────────────
    private function buildReportData(Eleve $student, int $sequence): array
    {
        $classeId = $student->classe_id;
        $schoolId = $student->school_id;

        // Toutes les notes de l'élève pour cette séquence
        $notesEleve = Note::with('matiere')
            ->where('eleve_id', $student->id)
            ->where('sequence', $sequence)
            ->where('classe_id', $classeId)
            ->get();

        // Matières de la classe (avec coefficients depuis pivot)
        $classe = Classe::with(['professeurPrincipal', 'school', 'level'])
            ->find($classeId);
        $matieres = $classe ? $classe->matieres()->get() : collect();

        // Construction du tableau des notes avec coefficient pivot
        $notesFormatees = $matieres->map(function ($matiere) use ($notesEleve) {
            $note = $notesEleve->firstWhere('matiere_id', $matiere->id);
            $coef = $matiere->pivot->coefficient ?? $matiere->coef ?? 1;
            $noteVal = $note ? floatval($note->note) : null;
            $noteCoef = $noteVal !== null ? round($noteVal * $coef, 2) : null;

            $appreciation = null;
            if ($noteVal !== null) {
                if ($noteVal >= 18) $appreciation = 'Très Bien';
                elseif ($noteVal >= 16) $appreciation = 'Bien';
                elseif ($noteVal >= 14) $appreciation = 'Assez Bien';
                elseif ($noteVal >= 12) $appreciation = 'Passable';
                elseif ($noteVal >= 10) $appreciation = 'Insuffisant';
                else $appreciation = 'Très Insuffisant';
            }

            return [
                'matiere_id'   => $matiere->id,
                'nom'          => $matiere->nom,
                'attribut'     => $matiere->attribut ?? '',
                'coef'         => $coef,
                'note'         => $noteVal,
                'note_coef'    => $noteCoef,
                'appreciation' => $appreciation,
                'critique'     => $noteVal !== null && $noteVal < 10,
                'categori'     => $matiere->categori ?? 'Général',
            ];
        });

        // Moyenne pondérée de l'élève
        $totalCoef  = $notesFormatees->whereNotNull('note')->sum('coef');
        $totalNoteCoef = $notesFormatees->whereNotNull('note_coef')->sum('note_coef');
        $moyenneEleve  = $totalCoef > 0 ? round($totalNoteCoef / $totalCoef, 2) : null;

        // ── Stats de toute la salle ──────────────────────────────────────────
        $classmates = Eleve::where('classe_id', $classeId)->where('school_id', $schoolId)->get();
        $moyennesClasse = [];

        foreach ($classmates as $cm) {
            $cmNotes = Note::with('matiere')
                ->where('eleve_id', $cm->id)
                ->where('sequence', $sequence)
                ->where('classe_id', $classeId)
                ->get();

            $cmTotalCoef = 0;
            $cmTotalNote = 0;
            foreach ($matieres as $m) {
                $n = $cmNotes->firstWhere('matiere_id', $m->id);
                $coef = $m->pivot->coefficient ?? $m->coef ?? 1;
                if ($n) {
                    $cmTotalCoef += $coef;
                    $cmTotalNote += floatval($n->note) * $coef;
                }
            }
            if ($cmTotalCoef > 0) {
                $moyennesClasse[$cm->id] = round($cmTotalNote / $cmTotalCoef, 2);
            }
        }

        arsort($moyennesClasse);
        $rang = array_search($student->id, array_keys($moyennesClasse));
        $rang = $rang !== false ? $rang + 1 : null;

        $moyenneValues    = array_values($moyennesClasse);
        $moyennePremier   = count($moyenneValues) > 0 ? $moyenneValues[0] : null;
        $moyenneDernier   = count($moyenneValues) > 0 ? end($moyenneValues) : null;
        $moyenneClasse    = count($moyenneValues) > 0 ? round(array_sum($moyenneValues) / count($moyenneValues), 2) : null;
        $effectifTotal    = count($moyennesClasse);
        $nbReussi         = count(array_filter($moyenneValues, fn($m) => $m >= 10));
        $tauxReussite     = $effectifTotal > 0 ? round($nbReussi / $effectifTotal * 100, 1) : 0;

        // Matières critiques
        $matieresCritiques = $notesFormatees->where('critique', true)->values();

        // ── Discipline de l'élève pour la séquence ───────────────────────────
        $disciplineRecords = \App\Models\DisciplineRecord::where('eleve_id', $student->id)
            ->where('sequence', $sequence)
            ->get();

        $heuresAbsence = $disciplineRecords->where('type', 'absence')->sum('valeur');
        $nombreRetards = $disciplineRecords->where('type', 'retard')->sum('valeur') ?: $disciplineRecords->where('type', 'retard')->count();
        $avertissements = $disciplineRecords->where('type', 'avertissement')->count();
        $blames = $disciplineRecords->where('type', 'blame')->count();
        $exclusionsJours = $disciplineRecords->where('type', 'exclusion')->sum('valeur');

        $conduite = 'Bonne';
        if ($exclusionsJours > 0 || $blames > 0) {
            $conduite = 'Mauvaise';
        } elseif ($avertissements > 0 || $heuresAbsence > 10) {
            $conduite = 'Passable';
        } elseif ($heuresAbsence === 0 && $nombreRetards === 0) {
            $conduite = 'Exemplaire';
        }

        $disciplineData = [
            'absences'       => $heuresAbsence,
            'retards'        => $nombreRetards,
            'avertissements' => $avertissements,
            'blames'         => $blames,
            'exclusions'     => $exclusionsJours,
            'conduite'       => $conduite,
            'records'        => $disciplineRecords->map(fn($r) => [
                'type'          => $r->type,
                'valeur'        => $r->valeur,
                'motif'         => $r->motif,
                'date_incident' => $r->date_incident ? $r->date_incident->format('d/m/Y') : null,
            ])->values(),
        ];

        // Infos école
        $school = School::find($schoolId);

        return [
            'sequence'          => $sequence,
            'trimestre'         => (int) ceil($sequence / 2),
            'notes'             => $notesFormatees->values(),
            'matieres_critiques'=> $matieresCritiques,
            'discipline'        => $disciplineData,
            'moyenne_eleve'     => $moyenneEleve,
            'rang'              => $rang,
            'effectif_total'    => $effectifTotal,
            'moyenne_classe'    => $moyenneClasse,
            'moyenne_premier'   => $moyennePremier,
            'moyenne_dernier'   => $moyenneDernier,
            'taux_reussite'     => $tauxReussite,
            'prof_principal'    => $classe?->professeurPrincipal ? [
                'id'   => $classe->professeurPrincipal->id,
                'name' => $classe->professeurPrincipal->name,
            ] : null,
            'classe_info' => [
                'id'              => $classe?->id,
                'nom'             => $classe?->nom,
                'annee_academique'=> $classe?->annee_academique ?? (date('Y') . '-' . (date('Y') + 1)),
                'section'         => $classe?->section,
            ],
            'school' => $school ? [
                'name'        => $school->name,
                'city'        => $school->city,
                'contacts'    => $school->contacts,
                'logo_path'     => $school->logo_path,
                'academic_year' => $school->academic_year ?? '2025/2026',
                'theme_color'   => $school->theme_color ?? 'emerald',
            ] : null,
        ];
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Données trimestrielles : moyenne des 2 séquences du trimestre
    // ─────────────────────────────────────────────────────────────────────────
    private function buildTrimData(Eleve $student, int $trimestre): array
    {
        $seq1 = ($trimestre * 2) - 1;
        $seq2 = $trimestre * 2;

        $d1 = $this->buildReportData($student, $seq1);
        $d2 = $this->buildReportData($student, $seq2);

        // Moyenne trimestrielle = moyenne des 2 séquences
        $moy1 = $d1['moyenne_eleve'];
        $moy2 = $d2['moyenne_eleve'];

        if ($moy1 !== null && $moy2 !== null) {
            $moyTri = round(($moy1 + $moy2) / 2, 2);
        } elseif ($moy1 !== null) {
            $moyTri = $moy1;
        } elseif ($moy2 !== null) {
            $moyTri = $moy2;
        } else {
            $moyTri = null;
        }

        // Fusionner les notes séquence 1 & 2 côte à côte
        $notesSq1 = collect($d1['notes'])->keyBy('matiere_id');
        $notesSq2 = collect($d2['notes'])->keyBy('matiere_id');

        $notesCombinees = $notesSq1->map(function ($n1, $id) use ($notesSq2) {
            $n2 = $notesSq2->get($id);
            $moyMat = null;
            if ($n1['note'] !== null && $n2 && $n2['note'] !== null) {
                $moyMat = round(($n1['note'] + $n2['note']) / 2, 2);
            } elseif ($n1['note'] !== null) {
                $moyMat = $n1['note'];
            } elseif ($n2 && $n2['note'] !== null) {
                $moyMat = $n2['note'];
            }

            return array_merge($n1, [
                'note_seq1'   => $n1['note'],
                'note_seq2'   => $n2['note'] ?? null,
                'note'        => $moyMat,
                'critique'    => $moyMat !== null && $moyMat < 10,
            ]);
        });

        // ── Discipline trimestrielle cumulée (2 séquences) ───────────────────
        $trimDisciplineRecords = \App\Models\DisciplineRecord::where('eleve_id', $student->id)
            ->whereIn('sequence', [$seq1, $seq2])
            ->get();

        $heuresAbsenceTri = $trimDisciplineRecords->where('type', 'absence')->sum('valeur');
        $nombreRetardsTri = $trimDisciplineRecords->where('type', 'retard')->sum('valeur') ?: $trimDisciplineRecords->where('type', 'retard')->count();
        $avertissementsTri = $trimDisciplineRecords->where('type', 'avertissement')->count();
        $blamesTri = $trimDisciplineRecords->where('type', 'blame')->count();
        $exclusionsJoursTri = $trimDisciplineRecords->where('type', 'exclusion')->sum('valeur');

        $conduiteTri = 'Bonne';
        if ($exclusionsJoursTri > 0 || $blamesTri > 0) {
            $conduiteTri = 'Mauvaise';
        } elseif ($avertissementsTri > 0 || $heuresAbsenceTri > 20) {
            $conduiteTri = 'Passable';
        } elseif ($heuresAbsenceTri === 0 && $nombreRetardsTri === 0) {
            $conduiteTri = 'Exemplaire';
        }

        $trimDisciplineData = [
            'absences'       => $heuresAbsenceTri,
            'retards'        => $nombreRetardsTri,
            'avertissements' => $avertissementsTri,
            'blames'         => $blamesTri,
            'exclusions'     => $exclusionsJoursTri,
            'conduite'       => $conduiteTri,
            'records'        => $trimDisciplineRecords->map(fn($r) => [
                'type'          => $r->type,
                'valeur'        => $r->valeur,
                'motif'         => $r->motif,
                'date_incident' => $r->date_incident ? $r->date_incident->format('d/m/Y') : null,
                'sequence'      => $r->sequence,
            ])->values(),
        ];

        return array_merge($d1, [
            'trimestre'          => $trimestre,
            'sequence'           => null,
            'notes'              => $notesCombinees->values(),
            'moyenne_eleve'      => $moyTri,
            'matieres_critiques' => $notesCombinees->where('critique', true)->values(),
            'discipline'         => $trimDisciplineData,
            'is_trimestriel'     => true,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PAGE : Aperçu du bulletin (Inertia)
    // ─────────────────────────────────────────────────────────────────────────
    public function show(Request $request, $id)
    {
        $student = Eleve::with('classe')->findOrFail($id);
        $user    = $request->user();
        $school  = $user->school;

        $isPublished = $school ? $school->is_report_cards_visible : true;
        $isMgmt      = in_array($user->role, ['super_admin', 'proviseur', 'censeur']);

        if (!$isPublished && !$isMgmt) {
            return Inertia::render('Reports/Show', [
                'student'      => $student,
                'is_published' => false,
                'message'      => 'Le calcul des moyennes et la préparation des bulletins sont en cours.',
            ]);
        }

        $sequence  = (int) $request->query('seq', 1);
        $trimestre = (int) ceil($sequence / 2);

        $seqData  = $this->buildReportData($student, $sequence);
        $trimData = $this->buildTrimData($student, $trimestre);

        $term = "Séquence $sequence";
        $signature = DB::table('report_card_signatures')
            ->where('eleve_id', $id)
            ->where('term_or_sequence', $term)
            ->first();

        $isCenseurForThisLevel = false;
        if ($user->role === 'censeur' && $student->classe) {
            $isCenseurForThisLevel = $student->classe->level->censeur_id === $user->id;
        }

        // Liste des séquences disponibles
        $sequences = Note::where('eleve_id', $id)
            ->where('classe_id', $student->classe_id)
            ->select('sequence')->distinct()->pluck('sequence')->sort()->values();

        return Inertia::render('Reports/Show', [
            'student'        => $student,
            'seq_data'       => $seqData,
            'trim_data'      => $trimData,
            'current_seq'    => $sequence,
            'available_seqs' => $sequences,
            'is_signed'      => (bool) $signature,
            'can_sign'       => in_array($user->role, ['proviseur', 'super_admin']),
            'can_print'      => $isMgmt || $isCenseurForThisLevel,
            'is_published'   => true,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PDF : Bulletin Séquentiel
    // ─────────────────────────────────────────────────────────────────────────
    public function downloadPdf(Request $request, $id, $sequence)
    {
        $student = Eleve::with('classe')->findOrFail($id);
        $data    = $this->buildReportData($student, (int) $sequence);
        $viewData = array_merge($data, ['student' => $student]);

        if (app()->bound('dompdf.wrapper')) {
            $pdf = app('dompdf.wrapper');
            $pdf->loadView('pdf.bulletin', $viewData);
            $pdf->setPaper('A4', 'portrait');

            $filename = 'bulletin_' . str_replace(' ', '_', strtolower($student->nom))
                . '_seq' . $sequence . '.pdf';

            return $pdf->download($filename);
        }

        return view('pdf.bulletin', $viewData);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PDF : Bulletin Trimestriel
    // ─────────────────────────────────────────────────────────────────────────
    public function downloadPdfTrimestre(Request $request, $id, $trimestre)
    {
        $student = Eleve::with('classe')->findOrFail($id);
        $data    = $this->buildTrimData($student, (int) $trimestre);
        $viewData = array_merge($data, ['student' => $student]);

        if (app()->bound('dompdf.wrapper')) {
            $pdf = app('dompdf.wrapper');
            $pdf->loadView('pdf.bulletin_trimestre', $viewData);
            $pdf->setPaper('A4', 'portrait');

            $filename = 'bulletin_' . str_replace(' ', '_', strtolower($student->nom))
                . '_tri' . $trimestre . '.pdf';

            return $pdf->download($filename);
        }

        return view('pdf.bulletin_trimestre', $viewData);
    }

    /**
     * Impression groupée de tous les bulletins d'une classe (1 bulletin par page A4)
     */
    public function classBulletins(Request $request, $classeId, $sequence = 1)
    {
        $classe = Classe::with(['school', 'level'])->findOrFail($classeId);
        $school = $classe->school ?? School::find($classe->school_id);

        $students = Eleve::where('classe_id', $classeId)
            ->orderBy('nom')
            ->orderBy('prenom')
            ->get();

        $reports = [];
        foreach ($students as $student) {
            $data = $this->buildReportData($student, (int) $sequence);
            $reports[] = array_merge($data, ['student' => $student]);
        }

        return view('pdf.class_bulletins', [
            'reports'  => $reports,
            'classe'   => $classe,
            'school'   => $school,
            'sequence' => (int) $sequence,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PDF : Tableau d'Honneur Séquentiel (Moyenne >= 14/20)
    // ─────────────────────────────────────────────────────────────────────────
    public function downloadTableauHonneur(Request $request, $id, $sequence)
    {
        $student = Eleve::with('classe.professeurPrincipal')->findOrFail($id);
        $data = $this->buildReportData($student, (int) $sequence);
        $moyenne = floatval($data['moyenne_eleve'] ?? 0);

        if ($moyenne < 14.00) {
            return back()->with('error', "Le Tableau d'Honneur est décerné uniquement aux élèves ayant une moyenne supérieure ou égale à 14.00/20 (Moyenne actuelle : {$moyenne}/20).");
        }

        $single = [
            'student'      => $student,
            'moyenne'      => $moyenne,
            'rang'         => $data['rang'],
            'total_eleves' => $data['effectif_total'],
            'classe'       => $student->classe,
            'term_label'   => "Séquence {$sequence}",
        ];

        $viewData = [
            'single' => $single,
            'school' => $data['school'],
        ];

        if (app()->bound('dompdf.wrapper')) {
            $pdf = app('dompdf.wrapper');
            $pdf->loadView('pdf.tableau_honneur', $viewData);
            $pdf->setPaper('A4', 'landscape');
            $filename = 'tableau_honneur_' . str_replace(' ', '_', strtolower($student->nom)) . "_seq{$sequence}.pdf";
            return $pdf->download($filename);
        }

        return view('pdf.tableau_honneur', $viewData);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PDF : Tableau d'Honneur Trimestriel (Moyenne >= 14/20)
    // ─────────────────────────────────────────────────────────────────────────
    public function downloadTableauHonneurTrimestre(Request $request, $id, $trimestre)
    {
        $student = Eleve::with('classe.professeurPrincipal')->findOrFail($id);
        $data = $this->buildTrimData($student, (int) $trimestre);
        $moyenne = floatval($data['moyenne_eleve'] ?? 0);

        if ($moyenne < 14.00) {
            return back()->with('error', "Le Tableau d'Honneur est décerné uniquement aux élèves ayant une moyenne supérieure ou égale à 14.00/20 (Moyenne trimestrielle : {$moyenne}/20).");
        }

        $single = [
            'student'      => $student,
            'moyenne'      => $moyenne,
            'rang'         => $data['rang'] ?? null,
            'total_eleves' => $data['effectif_total'] ?? null,
            'classe'       => $student->classe,
            'term_label'   => "Trimestre {$trimestre}",
        ];

        $viewData = [
            'single' => $single,
            'school' => $data['school'],
        ];

        if (app()->bound('dompdf.wrapper')) {
            $pdf = app('dompdf.wrapper');
            $pdf->loadView('pdf.tableau_honneur', $viewData);
            $pdf->setPaper('A4', 'landscape');
            $filename = 'tableau_honneur_' . str_replace(' ', '_', strtolower($student->nom)) . "_tri{$trimestre}.pdf";
            return $pdf->download($filename);
        }

        return view('pdf.tableau_honneur', $viewData);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PDF : Tableaux d'Honneur de toute une classe (Lot des élèves avec Moyenne >= 14)
    // ─────────────────────────────────────────────────────────────────────────
    public function classTableauHonneur(Request $request, $classeId, $sequence = 1)
    {
        $classe = Classe::with(['school', 'professeurPrincipal', 'level'])->findOrFail($classeId);
        $school = $classe->school ?? School::find($classe->school_id);

        $students = Eleve::where('classe_id', $classeId)
            ->whereNotIn('statut', ['exclu', 'diplome'])
            ->orderBy('nom')
            ->orderBy('prenom')
            ->get();

        $honorees = [];
        foreach ($students as $student) {
            $data = $this->buildReportData($student, (int) $sequence);
            $moyenne = floatval($data['moyenne_eleve'] ?? 0);
            if ($moyenne >= 14.00) {
                $honorees[] = [
                    'student'      => $student,
                    'moyenne'      => $moyenne,
                    'rang'         => $data['rang'],
                    'total_eleves' => $data['effectif_total'],
                    'classe'       => $classe,
                    'term_label'   => "Séquence {$sequence}",
                ];
            }
        }

        if (empty($honorees)) {
            return back()->with('error', "Aucun élève de la classe {$classe->nom} n'a atteint le seuil d'excellence de 14.00/20 pour la Séquence {$sequence}.");
        }

        // Trier par moyenne décroissante
        usort($honorees, fn($a, $b) => $b['moyenne'] <=> $a['moyenne']);

        $viewData = [
            'honorees' => $honorees,
            'school'   => [
                'name'          => $school->name,
                'city'          => $school->city,
                'contacts'      => $school->contacts,
                'logo_path'     => $school->logo_path,
                'academic_year' => $school->academic_year ?? '2025/2026',
            ],
        ];

        if (app()->bound('dompdf.wrapper')) {
            $pdf = app('dompdf.wrapper');
            $pdf->loadView('pdf.tableau_honneur', $viewData);
            $pdf->setPaper('A4', 'landscape');
            $filename = "tableaux_honneur_{$classe->nom}_seq{$sequence}.pdf";
            return $pdf->download($filename);
        }

        return view('pdf.tableau_honneur', $viewData);
    }


    // ─────────────────────────────────────────────────────────────────────────
    // Signature numérique du proviseur
    // ─────────────────────────────────────────────────────────────────────────
    public function sign(Request $request, $id)
    {
        $user = $request->user();
        if (!in_array($user->role, ['proviseur', 'super_admin'])) {
            abort(403, 'Seul le proviseur peut signer les bulletins.');
        }

        $sequence = $request->input('sequence', 1);
        $term     = "Séquence $sequence";

        DB::table('report_card_signatures')->updateOrInsert(
            ['eleve_id' => $id, 'term_or_sequence' => $term],
            [
                'proviseur_id' => $user->id,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]
        );

        return back()->with('success', "Bulletin Séquence $sequence signé numériquement avec succès.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Attribution du Professeur Principal (AJAX via route PUT)
    // ─────────────────────────────────────────────────────────────────────────
    public function setPrincipalTeacher(Request $request, $classeId)
    {
        $user = $request->user();
        if (!in_array($user->role, ['proviseur', 'super_admin', 'censeur'])) {
            abort(403);
        }

        $request->validate([
            'principal_teacher_id' => 'nullable|exists:users,id',
            'annee_academique'     => 'nullable|string|max:9',
        ]);

        $classe = Classe::where('school_id', $user->school_id ?? session('active_school_id'))
            ->findOrFail($classeId);

        $classe->update([
            'principal_teacher_id' => $request->principal_teacher_id,
            'annee_academique'     => $request->annee_academique,
        ]);

        return back()->with('success', 'Professeur principal assigné avec succès.');
    }
}
