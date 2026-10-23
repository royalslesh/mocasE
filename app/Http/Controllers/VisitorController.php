<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\School;
use App\Models\User;
use App\Models\Level;
use App\Models\Eleve;
use App\Models\Bulletin;
use App\Models\Classe;
use App\Models\Matiere;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

class VisitorController extends Controller
{
    public function welcome()
    {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    public function schools()
    {
        return Inertia::render('Visitor/Schools', [
            'schools' => School::where('is_active', true)->get()
        ]);
    }

    public function schoolDetails(School $school)
    {
        // On récupère les niveaux qui ont des classes dans cette école
        $levels = Level::whereHas('classes', function ($query) use ($school) {
            $query->where('school_id', $school->id);
        })->with([
                    'classes' => function ($query) use ($school) {
                        $query->where('school_id', $school->id)->withCount('eleves');
                    }
                ])->get();

        // Calcul du taux de réussite global (Moyenne >= 10 sur moy1)
        $totalEleves = Eleve::where('school_id', $school->id)->count();
        $elevesReussis = Eleve::where('school_id', $school->id)
            ->where('moy1', '>=', 10)
            ->count();

        $successRate = $totalEleves > 0 ? round(($elevesReussis / $totalEleves) * 100, 1) : 0;

        // Matières de l'école
        $matieres = Matiere::where('school_id', $school->id)->get();

        // Store school context for global theme persistence
        session([
            'active_school_name' => $school->name,
            'active_school_id' => $school->id
        ]);

        $teacherCount = User::where('school_id', $school->id)->where('role', 'enseignant')->count();

        return Inertia::render('Visitor/SchoolDetails', [
            'school' => $school,
            'levels' => $levels,
            'matieres' => $matieres,
            'academic_histories' => $school->histories()->get(),
            'stats' => [
                'student_count' => $totalEleves,
                'success_rate' => $successRate,
                'class_count' => Classe::where('school_id', $school->id)->count(),
                'subject_count' => $matieres->count(),
                'teacher_count' => $teacherCount,
            ]
        ]);
    }

    /**
     * Affichage du bulletin d'un élève pour les parents / visiteurs (accès par matricule, public).
     */
    public function showBulletin(string $matricule)
    {
        $eleve = \App\Models\Eleve::where('MATRICULE', strtoupper(trim($matricule)))
            ->with('classe')
            ->first();

        if (!$eleve) {
            return Inertia::render('Visitor/Bulletin', [
                'eleve'    => null,
                'error'    => "Aucun élève trouvé avec le matricule « " . strtoupper($matricule) . " ».",
                'searched' => strtoupper($matricule),
            ]);
        }

        $school = School::find($eleve->school_id);

        if ($school && !$school->is_report_cards_visible) {
            return Inertia::render('Visitor/Bulletin', [
                'eleve'    => null,
                'error'    => 'Les bulletins ne sont pas encore disponibles pour cet établissement.',
                'searched' => strtoupper($matricule),
            ]);
        }

        $sequences = \App\Models\Note::where('eleve_id', $eleve->id)
            ->where('classe_id', $eleve->classe_id)
            ->select('sequence')->distinct()->orderBy('sequence')->pluck('sequence');

        $currentSeq = $sequences->last() ?? 1;

        $classe = \App\Models\Classe::with(['matieres'])->find($eleve->classe_id);
        $notes  = \App\Models\Note::where('eleve_id', $eleve->id)
            ->where('sequence', $currentSeq)
            ->get();

        $matieres = $classe ? $classe->matieres()->get() : collect();
        $notesFormatees = $matieres->map(function ($matiere) use ($notes) {
            $note    = $notes->firstWhere('matiere_id', $matiere->id);
            $coef    = $matiere->pivot->coefficient ?? $matiere->coef ?? 1;
            $noteVal = $note ? floatval($note->note) : null;
            $appreciation = null;
            if ($noteVal !== null) {
                if ($noteVal >= 18)      $appreciation = 'Très Bien';
                elseif ($noteVal >= 16)  $appreciation = 'Bien';
                elseif ($noteVal >= 14)  $appreciation = 'Assez Bien';
                elseif ($noteVal >= 12)  $appreciation = 'Passable';
                elseif ($noteVal >= 10)  $appreciation = 'Insuffisant';
                else                     $appreciation = 'Très Insuffisant';
            }
            return [
                'matiere_id'   => $matiere->id,
                'nom'          => $matiere->nom,
                'groupe'       => $matiere->groupe ?? 'Matières',
                'coef'         => $coef,
                'note'         => $noteVal,
                'note_coef'    => $noteVal !== null ? round($noteVal * $coef, 2) : null,
                'appreciation' => $appreciation,
                'critique'     => $noteVal !== null && $noteVal < 8,
            ];
        });

        $notesAvecVal  = $notesFormatees->filter(fn($n) => $n['note'] !== null);
        $totalCoef     = $notesAvecVal->sum('coef');
        $moyenneEleve  = $totalCoef > 0
            ? round($notesAvecVal->sum('note_coef') / $totalCoef, 2)
            : null;

        $photoUrl = null;
        if ($eleve->photo_path) {
            $photoUrl = str_starts_with($eleve->photo_path, 'http')
                ? $eleve->photo_path
                : asset('storage/' . $eleve->photo_path);
        }

        return Inertia::render('Visitor/Bulletin', [
            'eleve'        => array_merge($eleve->toArray(), ['photo_url' => $photoUrl]),
            'school'       => $school,
            'notes'        => $notesFormatees->values(),
            'sequences'    => $sequences->values(),
            'currentSeq'   => $currentSeq,
            'moyenneEleve' => $moyenneEleve,
            'classe'       => $classe ? ['nom' => $classe->nom, 'section' => $classe->section] : null,
        ]);
    }
}
