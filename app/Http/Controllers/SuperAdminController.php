<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SuperAdminController extends Controller
{
    public function index()
    {
        // On réinitialise l'école active quand on revient à la liste globale
        session()->forget('active_school_name');

        return Inertia::render('SuperAdmin/Schools/Index', [
            'schools' => School::with(['proviseur', 'adjoint'])->get()
        ]);
    }

    public function storeSchool(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'proviseur_name' => 'required|string|max:255',
            'proviseur_email' => 'required|email|unique:users,email',
            'adjoint_name' => 'nullable|string|max:255',
            'adjoint_email' => 'nullable|email|unique:users,email',
            'sections_config' => 'nullable|array',
            'theme_color' => 'nullable|string|max:50',
        ]);

        return DB::transaction(function () use ($request) {
            $school = School::create([
                'name' => $request->name,
                'sections_config' => $request->sections_config,
                'theme_color' => $request->theme_color ?? 'emerald',
                'super_admin_consent' => true, // Granted by default — Proviseur can revoke
            ]);

            $proviseur = User::create([
                'name' => $request->proviseur_name,
                'email' => $request->proviseur_email,
                'password' => Hash::make('Mocas2026'), // Default temporary password
                'role' => User::ROLE_PROVISEUR,
                'school_id' => $school->id,
            ]);

            $school->update(['proviseur_id' => $proviseur->id]);

            if ($request->adjoint_name) {
                $adjoint = User::create([
                    'name' => $request->adjoint_name,
                    'email' => $request->adjoint_email,
                    'password' => Hash::make('Mocas2026'),
                    'role' => User::ROLE_PROVISEUR, // Assistant Proviseur also has Proviseur role
                    'school_id' => $school->id,
                ]);
                $school->update(['adjoint_id' => $adjoint->id]);
            }

            // Automate creation of 7 levels for the new school
            $defaultLevels = [
                ['name' => 'Sixième', 'order' => 1],
                ['name' => 'Cinquième', 'order' => 2],
                ['name' => 'Quatrième', 'order' => 3],
                ['name' => 'Troisième', 'order' => 4],
                ['name' => 'Seconde', 'order' => 5],
                ['name' => 'Première', 'order' => 6],
                ['name' => 'Terminale', 'order' => 7],
            ];

            foreach ($defaultLevels as $levelData) {
                \App\Models\Level::create([
                    'name' => $levelData['name'],
                    'order' => $levelData['order'],
                    'school_id' => $school->id,
                ]);
            }

            return redirect()->back()->with('success', 'École, Proviseur et Niveaux créés avec succès.');
        });
    }

    public function manage(School $school)
    {
        // Stockage du nom et de l'id de l'école en session pour la gestion globale
        session([
            'active_school_name' => $school->name,
            'active_school_id' => $school->id,
        ]);

        // Chargement des informations liées à l'école pour la gestion
        $school->load(['proviseur', 'adjoint']);

        return Inertia::render('SuperAdmin/Schools/Manage', [
            'school' => $school
        ]);
    }

    public function update(Request $request, School $school)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'contacts' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $school->update($request->only('name', 'city', 'contacts', 'description'));

        return redirect()->back()->with('success', 'Établissement mis à jour avec succès.');
    }

    public function toggleSchoolStatus(School $school)
    {
        $school->update(['is_active' => !$school->is_active]);
        return redirect()->back()->with('success', 'Statut de l\'école mis à jour.');
    }

    public function toggleSuperAdminConsent(School $school)
    {
        $school->update(['super_admin_consent' => !$school->super_admin_consent]);
        return redirect()->back()->with('success', 'Consentement mis à jour.');
    }
}
