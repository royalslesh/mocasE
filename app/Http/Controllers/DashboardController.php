<?php

namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\Classe;
use App\Models\Matiere;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $schoolId = null;

        if ($user->role === 'super_admin' && session('active_school_id')) {
            $schoolId = session('active_school_id');
        } else {
            $schoolId = $user->school_id;
        }

        $stats = [
            'students_count' => 0,
            'classes_count' => 0,
            'subjects_count' => 0,
            'staff_count' => 0,
            'finances_total' => 0,
            'finances_today' => 0,
        ];

        if ($schoolId) {
            $studentsQuery = Eleve::where('school_id', $schoolId);
            $classesQuery = Classe::where('school_id', $schoolId);

            if ($user->role === 'censeur') {
                $managedLevelIds = \App\Models\Level::where('censeur_id', $user->id)->pluck('id');
                $classesQuery->whereIn('level_id', $managedLevelIds);
                $studentsQuery->whereIn('classe_id', function ($q) use ($managedLevelIds) {
                    $q->select('id')->from('classes')->whereIn('level_id', $managedLevelIds);
                });
            }

            $stats['students_count'] = $studentsQuery->count();
            $stats['classes_count'] = $classesQuery->count();
            $stats['subjects_count'] = Matiere::where('school_id', $schoolId)->count();

            // For staff, we count users associated with this school who are not students or super admins
            $stats['staff_count'] = \App\Models\User::where('school_id', $schoolId)
                ->whereNotIn('role', ['etudiant', 'super_admin'])
                ->count();
        }
        if ($user->role === 'enseignant') {
            $assignments = \App\Models\TeacherAssignment::where('user_id', $user->id)
                ->where('school_id', $schoolId)
                ->with(['subject', 'classe.level'])
                ->get();

            // Total students across their assigned classes
            $classeIds = $assignments->pluck('classe_id')->filter()->unique();
            $studentsCount = \App\Models\Eleve::whereIn('classe_id', $classeIds)->count();

            return Inertia::render('Enseignant/Dashboard', [
                'assignments' => $assignments,
                'students_count' => $studentsCount,
            ]);
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats
        ]);
    }
}
