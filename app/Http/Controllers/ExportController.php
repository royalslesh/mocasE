<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\Level;
use App\Models\User;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExportController extends Controller
{
    /**
     * Détermine le school_id actif selon le rôle
     */
    private function getSchoolId(): int
    {
        $user = Auth::user();
        if ($user->role === 'super_admin' && session('active_school_id')) {
            return session('active_school_id');
        }
        return $user->school_id;
    }

    /**
     * Centre de téléchargement & exports (UI Inertia)
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $schoolId = $this->getSchoolId();

        $classesQuery = Classe::where('school_id', $schoolId)->withCount('eleves');
        if ($user->role === 'censeur') {
            $managedLevelIds = Level::where('censeur_id', $user->id)->pluck('id');
            $classesQuery->whereIn('level_id', $managedLevelIds);
        }
        $classes = $classesQuery->orderBy('nom')->get();

        return \Inertia\Inertia::render('Proviseur/Exports/Index', [
            'classes' => $classes,
            'userRole' => $user->role,
        ]);
    }

    /**
     * Export liste des élèves d'une classe en HTML imprimable / PDF
     * Accessible : proviseur (tout), censeur (son niveau uniquement)
     */
    public function studentList(Request $request)
    {
        $user = Auth::user();
        $schoolId = $this->getSchoolId();
        $school = School::find($schoolId);

        $classeId = $request->query('classe_id');
        $filtre = $request->query('filtre', 'tous'); // tous | redoublants | nouveaux

        // Vérification accès censeur : seulement son niveau
        $query = Classe::where('school_id', $schoolId)->with(['eleves', 'level']);

        if ($user->role === 'censeur') {
            $managedLevelIds = Level::where('censeur_id', $user->id)->pluck('id');
            $query->whereIn('level_id', $managedLevelIds);
        }

        if ($classeId) {
            $query->where('id', $classeId);
        }

        $classes = $query->get();

        // Filtrer les élèves selon le filtre demandé
        $classes->each(function ($classe) use ($filtre) {
            if ($filtre === 'redoublants') {
                $classe->eleves = $classe->eleves->where('redoublant', true)->values();
            } elseif ($filtre === 'nouveaux') {
                $classe->eleves = $classe->eleves->where('redoublant', false)->values();
            }
        });

        // Générer HTML → retourner en vue imprimable
        return view('exports.student-list', [
            'classes' => $classes,
            'school'  => $school,
            'filtre'  => $filtre,
            'user'    => $user,
        ]);
    }

    /**
     * Export liste du personnel
     * Proviseur : tout le personnel | Censeur : ses enseignants uniquement
     */
    public function staffList(Request $request)
    {
        $user = Auth::user();
        $schoolId = $this->getSchoolId();
        $school = School::find($schoolId);

        $query = User::where('school_id', $schoolId)
                     ->whereNotIn('role', ['super_admin', 'proviseur', 'eleve'])
                     ->with('teacherAssignments.subject', 'teacherAssignments.classe');

        if ($user->role === 'censeur') {
            $managedLevelIds = Level::where('censeur_id', $user->id)->pluck('id');
            // Censeur ne voit que les enseignants affectés à des classes de son niveau
            $query->where('role', 'enseignant')
                  ->whereHas('teacherAssignments.classe', function ($q) use ($managedLevelIds) {
                      $q->whereIn('level_id', $managedLevelIds);
                  });
        }

        $staff = $query->orderBy('role')->orderBy('name')->get();

        return view('exports.staff-list', [
            'staff'  => $staff,
            'school' => $school,
            'user'   => $user,
        ]);
    }

    /**
     * Export / Planche de cartes d'identité scolaires (Badges élèves)
     * Accessible : proviseur (toute l'école), censeur (ses niveaux uniquement)
     */
    public function idCards(Request $request)
    {
        $user = Auth::user();
        $schoolId = $this->getSchoolId();
        $school = School::find($schoolId);

        $classeId = $request->query('classe_id');
        $studentId = $request->query('student_id');

        $query = \App\Models\Eleve::whereHas('classe', function ($q) use ($schoolId) {
            $q->where('school_id', $schoolId);
        })->with('classe.level');

        if ($user->role === 'censeur') {
            $managedLevelIds = Level::where('censeur_id', $user->id)->pluck('id');
            $query->whereHas('classe', function ($q) use ($managedLevelIds) {
                $q->whereIn('level_id', $managedLevelIds);
            });
        }

        if ($studentId) {
            $query->where('id', $studentId);
        } elseif ($classeId) {
            $query->where('classe_id', $classeId);
        }

        $students = $query->orderBy('classe_id')->orderBy('nom')->get();

        return view('exports.id-cards', [
            'students' => $students,
            'school'   => $school,
            'user'     => $user,
            'classeId' => $classeId,
        ]);
    }
}
