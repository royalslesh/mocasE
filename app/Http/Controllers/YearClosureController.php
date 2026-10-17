<?php

namespace App\Http\Controllers;

use App\Models\AcademicYearHistory;
use App\Models\Classe;
use App\Models\Eleve;
use App\Models\Level;
use App\Models\Note;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class YearClosureController extends Controller
{
    private function getActiveSchool(Request $request): School
    {
        $user = $request->user();
        if ($user->role === 'super_admin' && session('active_school_id')) {
            return School::findOrFail(session('active_school_id'));
        }
        return School::findOrFail($user->school_id);
    }

    /**
     * Dashboard de Clôture d'Année & Délibérations
     */
    public function index(Request $request)
    {
        $school = $this->getActiveSchool($request);

        $classes = Classe::where('school_id', $school->id)
            ->with(['level', 'nextClasse'])
            ->withCount('eleves')
            ->get();

        // Récupérer les élèves actifs de l'école avec leur classe
        $students = Eleve::where('school_id', $school->id)
            ->whereNotIn('statut', ['exclu', 'diplome'])
            ->with(['classe.level', 'nextClasse'])
            ->orderBy('classe_id')
            ->orderBy('rang_annuel')
            ->get();

        // Historique des années passées
        $histories = AcademicYearHistory::where('school_id', $school->id)
            ->with('closedBy:id,name')
            ->orderBy('closed_at', 'desc')
            ->get();

        // Synthèse des délibérations actuelles
        $totalStudents = $students->count();
        $calculatedCount = $students->whereNotNull('moy_annuelle')->count();
        $passedCount = $students->whereIn('decision_passage', ['admis', 'diplome'])->count();
        $repeatedCount = $students->where('decision_passage', 'redouble')->count();
        $excludedCount = $students->where('decision_passage', 'exclu')->count();
        $successRate = $totalStudents > 0 ? round(($passedCount / $totalStudents) * 100, 1) : 0;

        return Inertia::render('Proviseur/YearClosure/Index', [
            'school' => [
                'id' => $school->id,
                'name' => $school->name,
                'academic_year' => $school->academic_year ?? '2025-2026',
                'passing_grade' => floatval($school->passing_grade ?? 10.00),
                'repeat_grade'  => floatval($school->repeat_grade ?? 8.50),
            ],
            'classes' => $classes,
            'students' => $students,
            'histories' => $histories,
            'stats' => [
                'total_students'   => $totalStudents,
                'calculated_count' => $calculatedCount,
                'passed_count'     => $passedCount,
                'repeated_count'   => $repeatedCount,
                'excluded_count'   => $excludedCount,
                'success_rate'     => $successRate,
            ],
        ]);
    }

    /**
     * Mise à jour des seuils de passage et redoublement
     */
    public function updateThresholds(Request $request)
    {
        $school = $this->getActiveSchool($request);

        $request->validate([
            'passing_grade' => 'required|numeric|min:0|max:20',
            'repeat_grade'  => 'required|numeric|min:0|max:20|lte:passing_grade',
            'academic_year' => 'required|string|max:20',
        ]);

        $school->update([
            'passing_grade' => $request->passing_grade,
            'repeat_grade'  => $request->repeat_grade,
            'academic_year' => $request->academic_year,
        ]);

        return back()->with('success', 'Paramètres de délibération mis à jour avec succès.');
    }

    /**
     * Configuration de la classe suivante pour une classe
     */
    public function updateClassProgression(Request $request, Classe $classe)
    {
        $school = $this->getActiveSchool($request);
        if ($classe->school_id !== $school->id) {
            abort(403);
        }

        $request->validate([
            'next_classe_id' => 'nullable|exists:classes,id',
        ]);

        $classe->update([
            'next_classe_id' => $request->next_classe_id,
        ]);

        return back()->with('success', 'Progression de la classe mise à jour.');
    }

    /**
     * Calcul automatique des moyennes annuelles, classements et décisions
     */
    public function calculate(Request $request)
    {
        $school = $this->getActiveSchool($request);
        $passingGrade = floatval($school->passing_grade ?? 10.00);
        $repeatGrade = floatval($school->repeat_grade ?? 8.50);

        $classes = Classe::where('school_id', $school->id)->with('level')->get();
        $allClasses = $classes->keyBy('id');

        DB::transaction(function () use ($school, $passingGrade, $repeatGrade, $classes, $allClasses) {
            foreach ($classes as $classe) {
                $students = Eleve::where('classe_id', $classe->id)
                    ->where('school_id', $school->id)
                    ->whereNotIn('statut', ['exclu', 'diplome'])
                    ->get();

                if ($students->isEmpty()) {
                    continue;
                }

                $isTerminale = ($classe->level && $classe->level->order >= 7) || str_contains(strtolower($classe->nom), 'tle') || str_contains(strtolower($classe->nom), 'terminale');

                // 1. Calculer la moyenne annuelle de chaque élève
                foreach ($students as $student) {
                    $trimMoyennes = array_filter([$student->moy1, $student->moy2, $student->moy3], fn($m) => $m !== null);

                    if (!empty($trimMoyennes)) {
                        $moyAnnuelle = round(array_sum($trimMoyennes) / count($trimMoyennes), 2);
                    } else {
                        // Secours : calcul depuis les notes réelles enregistrées
                        $notes = Note::where('eleve_id', $student->id)->get();
                        $moyAnnuelle = $notes->isNotEmpty() ? round($notes->avg('note'), 2) : 0.00;
                    }

                    $student->moy_annuelle = $moyAnnuelle;

                    // Si la décision n'a pas été forcée manuellement par le proviseur
                    if (!$student->decision_override) {
                        if ($moyAnnuelle >= $passingGrade) {
                            $student->decision_passage = $isTerminale ? 'diplome' : 'admis';
                        } elseif ($moyAnnuelle >= $repeatGrade) {
                            $student->decision_passage = 'redouble';
                        } else {
                            $student->decision_passage = 'exclu';
                        }
                    }

                    // Détermination de la classe suivante proposée
                    if ($student->decision_passage === 'admis') {
                        if ($classe->next_classe_id) {
                            $student->next_classe_id = $classe->next_classe_id;
                        } else {
                            // Chercher une classe du niveau supérieur
                            $nextLevelOrder = ($classe->level?->order ?? 1) + 1;
                            $nextLevel = Level::where('school_id', $school->id)->where('order', $nextLevelOrder)->first();
                            if ($nextLevel) {
                                $nextClass = Classe::where('school_id', $school->id)
                                    ->where('level_id', $nextLevel->id)
                                    ->first();
                                $student->next_classe_id = $nextClass?->id;
                            }
                        }
                    } elseif ($student->decision_passage === 'redouble') {
                        $student->next_classe_id = $classe->id;
                    } else {
                        $student->next_classe_id = null;
                    }

                    $student->save();
                }

                // 2. Calculer le rang annuel dans la classe
                $rankedStudents = Eleve::where('classe_id', $classe->id)
                    ->where('school_id', $school->id)
                    ->whereNotIn('statut', ['exclu', 'diplome'])
                    ->orderBy('moy_annuelle', 'desc')
                    ->get();

                $currentRank = 1;
                foreach ($rankedStudents as $s) {
                    $s->rang_annuel = $currentRank++;
                    $s->save();
                }
            }
        });

        return back()->with('success', 'Calculs annuels et délibérations effectués avec succès.');
    }

    /**
     * Ajustement manuel de la décision d'un élève par le Proviseur
     */
    public function updateStudentDecision(Request $request, Eleve $student)
    {
        $school = $this->getActiveSchool($request);
        if ($student->school_id !== $school->id) {
            abort(403);
        }

        $request->validate([
            'decision_passage' => 'required|in:admis,redouble,exclu,diplome',
            'next_classe_id'   => 'nullable|exists:classes,id',
        ]);

        $student->update([
            'decision_passage'  => $request->decision_passage,
            'next_classe_id'    => $request->next_classe_id,
            'decision_override' => true,
        ]);

        return back()->with('success', "Décision pour {$student->nom} {$student->prenom} mise à jour.");
    }

    /**
     * Basculement automatique et clôture définitive de l'année scolaire
     */
    public function closeYear(Request $request)
    {
        $school = $this->getActiveSchool($request);
        $user = $request->user();

        $students = Eleve::where('school_id', $school->id)
            ->whereNotIn('statut', ['exclu', 'diplome'])
            ->with(['classe.level'])
            ->get();

        if ($students->isEmpty() || $students->whereNull('decision_passage')->count() > 0) {
            return back()->with('error', 'Impossible de clôturer : tous les élèves doivent être délibérés avant la clôture.');
        }

        DB::transaction(function () use ($school, $students, $user) {
            $totalStudents = $students->count();
            $totalPassed = $students->whereIn('decision_passage', ['admis', 'diplome'])->count();
            $totalRepeated = $students->where('decision_passage', 'redouble')->count();
            $totalExcluded = $students->where('decision_passage', 'exclu')->count();
            $successRate = $totalStudents > 0 ? round(($totalPassed / $totalStudents) * 100, 2) : 0.00;

            // Construire les statistiques par classe
            $classesStats = [];
            $groupedByClass = $students->groupBy('classe_id');

            foreach ($groupedByClass as $classeId => $classStudents) {
                $classe = Classe::find($classeId);
                $passed = $classStudents->whereIn('decision_passage', ['admis', 'diplome'])->count();
                $repeated = $classStudents->where('decision_passage', 'redouble')->count();
                $excluded = $classStudents->where('decision_passage', 'exclu')->count();
                $classCount = $classStudents->count();
                $rate = $classCount > 0 ? round(($passed / $classCount) * 100, 2) : 0;

                $topStudent = $classStudents->sortByDesc('moy_annuelle')->first();

                $classesStats[] = [
                    'classe_id'    => $classeId,
                    'classe_nom'   => $classe?->nom ?? 'Inconnue',
                    'section'      => $classe?->section ?? '',
                    'total'        => $classCount,
                    'passed'       => $passed,
                    'repeated'     => $repeated,
                    'excluded'     => $excluded,
                    'success_rate' => $rate,
                    'top_student'  => $topStudent ? "{$topStudent->nom} {$topStudent->prenom}" : '—',
                    'top_avg'      => $topStudent?->moy_annuelle ?? null,
                ];
            }

            // 1. Archiver l'année scolaire terminée
            AcademicYearHistory::create([
                'school_id'      => $school->id,
                'academic_year'  => $school->academic_year ?? '2025-2026',
                'total_students' => $totalStudents,
                'total_passed'   => $totalPassed,
                'total_repeated' => $totalRepeated,
                'total_excluded' => $totalExcluded,
                'success_rate'   => $successRate,
                'classes_stats'  => $classesStats,
                'closed_at'      => now(),
                'closed_by'      => $user->id,
            ]);

            // 2. Basculer les élèves vers leur nouvelle situation
            foreach ($students as $student) {
                if ($student->decision_passage === 'diplome') {
                    $student->statut = 'diplome';
                    $student->classe_id = null;
                } elseif ($student->decision_passage === 'exclu') {
                    $student->statut = 'exclu';
                    $student->classe_id = null;
                } elseif ($student->decision_passage === 'admis') {
                    if ($student->next_classe_id) {
                        $student->classe_id = $student->next_classe_id;
                        $nextCl = Classe::find($student->next_classe_id);
                        if ($nextCl) {
                            $student->classe = $nextCl->nom;
                        }
                    }
                    $student->statut = 'ancien';
                    $student->is_redoublant = false;
                } elseif ($student->decision_passage === 'redouble') {
                    $student->statut = 'redoublant';
                    $student->is_redoublant = true;
                }

                // Réinitialiser les moyennes et décisions pour la nouvelle année
                $student->moy1 = null;
                $student->rang1 = null;
                $student->moy2 = null;
                $student->rang2 = null;
                $student->moy3 = null;
                $student->rang3 = null;
                $student->moy_annuelle = null;
                $student->rang_annuel = null;
                $student->decision_passage = null;
                $student->decision_override = false;
                $student->next_classe_id = null;

                $student->save();
            }

            // 3. Incrémenter l'année scolaire de l'établissement
            // Ex: "2025-2026" -> "2026-2027"
            $currentYear = $school->academic_year ?? '2025-2026';
            if (preg_match('/(\d{4})-(\d{4})/', $currentYear, $matches)) {
                $y1 = intval($matches[1]) + 1;
                $y2 = intval($matches[2]) + 1;
                $nextAcademicYear = "{$y1}-{$y2}";
            } else {
                $nextAcademicYear = date('Y') . '-' . (date('Y') + 1);
            }

            $school->update([
                'academic_year'              => $nextAcademicYear,
                'is_grades_submission_open' => false,
                'is_report_cards_visible'    => false,
            ]);

            // Mettre à jour l'année académique des classes
            Classe::where('school_id', $school->id)->update([
                'annee_academique' => $nextAcademicYear,
            ]);
        });

        return back()->with('success', "Clôture d'année réussie ! L'école est désormais passée à la nouvelle année scolaire.");
    }
}
