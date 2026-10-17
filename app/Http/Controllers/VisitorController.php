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
            ]
        ]);
    }
}
