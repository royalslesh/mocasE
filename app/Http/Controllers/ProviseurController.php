<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\School;
use App\Models\TeacherAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProviseurController extends Controller
{
    /**
     * Display a listing of the staff for the current school.
     */
    public function staffIndex()
    {
        $schoolId = auth()->user()->school_id;

        if (!$schoolId && auth()->user()->role !== User::ROLE_SUPER_ADMIN) {
            return redirect()->route('dashboard')->with('error', 'Aucun établissement associé.');
        }

        // Si c'est un Super Admin qui gère l'école via la session
        if (auth()->user()->role === User::ROLE_SUPER_ADMIN && session('active_school_id')) {
            $schoolId = session('active_school_id');
        }

        $staff = User::where('school_id', $schoolId)
            ->whereIn('role', [User::ROLE_PROVISEUR, User::ROLE_CENSEUR, User::ROLE_ENSEIGNANT, 'surveillant', 'comptable'])
            ->with(['teacherAssignments.subject', 'teacherAssignments.classe'])
            ->get();

        $levels = \App\Models\Level::where('school_id', $schoolId)->orderBy('order')->get();
        $subjects = \App\Models\Matiere::where('school_id', $schoolId)->with('classes')->orderBy('nom')->get();
        $classes = \App\Models\Classe::where('school_id', $schoolId)->orderBy('nom')->get();

        return Inertia::render('Proviseur/Staff/Index', [
            'staff' => $staff,
            'levels' => $levels,
            'subjects' => $subjects,
            'classes' => $classes,
            'roles' => [
                ['value' => User::ROLE_CENSEUR, 'label' => 'Censeur'],
                ['value' => User::ROLE_ENSEIGNANT, 'label' => 'Enseignant'],
                ['value' => 'surveillant', 'label' => 'Surveillant Général'],
                ['value' => 'comptable', 'label' => 'Comptable / Économe'],
            ]
        ]);
    }

    /**
     * Store a newly created staff member.
     */
    public function storeStaff(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|string|in:censeur,enseignant,etudiant,proviseur,comptable,surveillant',
            'level_id' => 'nullable|exists:levels,id',
            'assignments' => 'nullable|array',
            'assignments.*.subject_id' => 'required_with:assignments|exists:matieres,id',
            'assignments.*.classe_ids' => 'array',
            'assignments.*.classe_ids.*' => 'exists:classes,id',
        ]);

        $schoolId = auth()->user()->school_id;
        if (auth()->user()->role === User::ROLE_SUPER_ADMIN && session('active_school_id')) {
            $schoolId = session('active_school_id');
        }

        $level = null;
        if ($request->role === User::ROLE_CENSEUR && $request->level_id) {
            $level = \App\Models\Level::findOrFail($request->level_id);
            if ($level->censeur_id) {
                return back()->with('error', 'Ce niveau a déjà un censeur assigné.');
            }
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make('Mocas2026'), // Default password
            'role' => $request->role,
            'school_id' => $schoolId,
        ]);

        if ($request->role === User::ROLE_CENSEUR && $level) {
            $level->update(['censeur_id' => $user->id]);
        }

        if ($request->role === User::ROLE_ENSEIGNANT && !empty($request->assignments)) {
            foreach ($request->assignments as $assignment) {
                if (empty($assignment['classe_ids'])) {
                    TeacherAssignment::create([
                        'user_id' => $user->id,
                        'subject_id' => $assignment['subject_id'],
                        'classe_id' => null,
                        'school_id' => $schoolId,
                    ]);
                } else {
                    foreach ($assignment['classe_ids'] as $classeId) {
                        TeacherAssignment::create([
                            'user_id' => $user->id,
                            'subject_id' => $assignment['subject_id'],
                            'classe_id' => $classeId,
                            'school_id' => $schoolId,
                        ]);
                    }
                }
            }
        }

        return redirect()->back()->with('success', 'Nouveau membre du personnel créé avec succès ! Mot de passe provisoire : Mocas2026');
    }

    public function updateStaff(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|string|in:censeur,enseignant,etudiant,proviseur,comptable,surveillant',
            'level_id' => 'nullable|exists:levels,id',
            'assignments' => 'nullable|array',
            'assignments.*.subject_id' => 'required_with:assignments|exists:matieres,id',
            'assignments.*.classe_ids' => 'array',
            'assignments.*.classe_ids.*' => 'exists:classes,id',
        ]);

        $schoolId = auth()->user()->school_id;
        if (auth()->user()->role === User::ROLE_SUPER_ADMIN && session('active_school_id')) {
            $schoolId = session('active_school_id');
        }

        // Handle Censeur Level Swap
        if ($request->role === User::ROLE_CENSEUR) {
            $currentLevel = \App\Models\Level::where('censeur_id', $user->id)->first();
            $newLevelId = $request->level_id;

            if (!$currentLevel || $currentLevel->id != $newLevelId) {
                // Check if new level is already taken by someone else
                $isTaken = \App\Models\Level::where('school_id', $schoolId)
                    ->where('id', $newLevelId)
                    ->whereNotNull('censeur_id')
                    ->where('censeur_id', '!=', $user->id)
                    ->exists();

                if ($isTaken) {
                    return back()->with('error', 'Ce niveau est déjà assigné à un autre censeur.');
                }

                // Unassign old level if exists
                if ($currentLevel) {
                    $currentLevel->update(['censeur_id' => null]);
                    \App\Models\Classe::where('level_id', $currentLevel->id)->update(['censeur_id' => null]);
                }

                // Assign new level
                $newLevel = \App\Models\Level::findOrFail($newLevelId);
                $newLevel->update(['censeur_id' => $user->id]);

                // Propagate to classes of the new level
                \App\Models\Classe::where('level_id', $newLevelId)->update(['censeur_id' => $user->id]);
            }
        } elseif ($user->role === User::ROLE_CENSEUR && $request->role !== User::ROLE_CENSEUR) {
            // Role changed from Censeur to something else, unassign everything
            \App\Models\Level::where('censeur_id', $user->id)->update(['censeur_id' => null]);
            \App\Models\Classe::where('censeur_id', $user->id)->update(['censeur_id' => null]);
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        // Update subject assignments for enseignants
        if ($request->role === User::ROLE_ENSEIGNANT && $request->assignments) {
            TeacherAssignment::where('user_id', $user->id)->delete();
            foreach ($request->assignments as $assignment) {
                if (empty($assignment['classe_ids'])) {
                    TeacherAssignment::create([
                        'user_id' => $user->id,
                        'subject_id' => $assignment['subject_id'],
                        'classe_id' => null,
                        'school_id' => $schoolId,
                    ]);
                } else {
                    foreach ($assignment['classe_ids'] as $classeId) {
                        TeacherAssignment::create([
                            'user_id' => $user->id,
                            'subject_id' => $assignment['subject_id'],
                            'classe_id' => $classeId,
                            'school_id' => $schoolId,
                        ]);
                    }
                }
            }
        }

        return redirect()->back()->with('success', 'Profil mis à jour avec succès.');
    }

    /**
     * Delete a staff member.
     */
    public function destroyStaff(User $user)
    {
        // Don't allow deleting the proviseur themselves through this route easily
        if ($user->role === User::ROLE_PROVISEUR) {
            return back()->with('error', 'Le proviseur ne peut être supprimé ici.');
        }

        // If censeur, unassign levels
        if ($user->role === User::ROLE_CENSEUR) {
            \App\Models\Level::where('censeur_id', $user->id)->update(['censeur_id' => null]);
            \App\Models\Classe::where('censeur_id', $user->id)->update(['censeur_id' => null]);
        }

        $user->delete();
        return redirect()->back()->with('success', 'Membre du personnel supprimé.');
    }

    /**
     * Reset / update password for a staff member.
     */
    public function updatePassword(Request $request, User $user)
    {
        $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        $schoolId = auth()->user()->school_id;
        if (auth()->user()->role === User::ROLE_SUPER_ADMIN && session('active_school_id')) {
            $schoolId = session('active_school_id');
        }

        // Security: only allow updating staff of the same school
        if ($user->school_id !== $schoolId && auth()->user()->role !== User::ROLE_SUPER_ADMIN) {
            return back()->with('error', 'Accès refusé.');
        }

        $user->update(['password' => Hash::make($request->password)]);

        return redirect()->back()->with('success', "Mot de passe de {$user->name} mis à jour avec succès.");
    }
}
