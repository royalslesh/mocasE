<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SchoolBrandingController extends Controller
{
    public function edit(Request $request)
    {
        $school = $request->user()->school;

        return Inertia::render('Proviseur/Branding/Edit', [
            'school' => $school
        ]);
    }

    public function update(Request $request)
    {
        $school = $request->user()->school;

        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'region' => 'nullable|string|max:100',
            'departement' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:255',
            'contacts' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
        ]);

        $data = $request->only('name', 'city', 'contacts', 'description', 'code', 'region', 'departement');

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($school->logo_path) {
                Storage::disk('public')->delete($school->logo_path);
            }
            $data['logo_path'] = $request->file('logo')->store('logos', 'public');
        }

        $school->update($data);

        return redirect()->back()->with('success', 'Branding de l\'école mis à jour avec succès.');
    }

    public function toggleConsent(Request $request)
    {
        $school = $request->user()->school;
        $school->update(['super_admin_consent' => !$school->super_admin_consent]);

        return redirect()->back()->with('success', 'Consentement Super Admin mis à jour.');
    }

    public function toggleGrades(Request $request)
    {
        $school = $request->user()->school;
        $school->update(['is_grades_submission_open' => !$school->is_grades_submission_open]);

        $status = $school->is_grades_submission_open ? 'OUVERT' : 'FERMÉ';
        return redirect()->back()->with('success', "Le remplissage des notes est maintenant $status.");
    }

    public function toggleReports(Request $request)
    {
        $school = $request->user()->school;
        $school->update(['is_report_cards_visible' => !$school->is_report_cards_visible]);

        $status = $school->is_report_cards_visible ? 'PUBLIÉS' : 'MASQUÉS';
        return redirect()->back()->with('success', "Les bulletins sont maintenant $status.");
    }
}
