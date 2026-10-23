<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Services\CloudinaryService;
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
            'name'                  => 'required|string|max:255',
            'motto'                 => 'nullable|string|max:255',
            'code'                  => 'nullable|string|max:50',
            'region'                => 'nullable|string|max:100',
            'departement'           => 'nullable|string|max:100',
            'city'                  => 'nullable|string|max:255',
            'contacts'              => 'nullable|string|max:255',
            'description'           => 'nullable|string',
            'video_url'             => 'nullable|string|max:500',
            'logo'                  => 'nullable|image|max:4096',
            'cover_image'           => 'nullable|image|max:8192',
            'gallery_files'         => 'nullable|array',
            'gallery_files.*'       => 'nullable|image|max:8192',
            'remove_gallery_index'  => 'nullable|integer',
        ]);

        $data = $request->only('name', 'motto', 'city', 'contacts', 'description', 'video_url', 'code', 'region', 'departement');

        $cloudinary = new CloudinaryService();

        // 1. Logo
        if ($request->hasFile('logo')) {
            if ($cloudinary->isConfigured()) {
                try {
                    $data['logo_path'] = $cloudinary->upload($request->file('logo'), 'schools/logos');
                } catch (\Throwable $e) {
                    $data['logo_path'] = $request->file('logo')->store('logos', 'public');
                }
            } else {
                $data['logo_path'] = $request->file('logo')->store('logos', 'public');
            }
        }

        // 2. Cover / Banner
        if ($request->hasFile('cover_image')) {
            if ($cloudinary->isConfigured()) {
                try {
                    $data['cover_image_path'] = $cloudinary->upload($request->file('cover_image'), 'schools/covers');
                } catch (\Throwable $e) {
                    $data['cover_image_path'] = $request->file('cover_image')->store('schools/covers', 'public');
                }
            } else {
                $data['cover_image_path'] = $request->file('cover_image')->store('schools/covers', 'public');
            }
        }

        // 3. Galerie de photos
        $existingGallery = $school->gallery_images ?? [];
        if (!is_array($existingGallery)) {
            $existingGallery = [];
        }

        // Supprimer une image spécifique si demandé
        if ($request->has('remove_gallery_index') && is_numeric($request->remove_gallery_index)) {
            $idx = (int) $request->remove_gallery_index;
            if (isset($existingGallery[$idx])) {
                array_splice($existingGallery, $idx, 1);
                $data['gallery_images'] = array_values($existingGallery);
            }
        }

        // Ajouter de nouvelles photos
        if ($request->hasFile('gallery_files')) {
            foreach ($request->file('gallery_files') as $file) {
                $imgUrl = null;
                if ($cloudinary->isConfigured()) {
                    try {
                        $imgUrl = $cloudinary->upload($file, 'schools/gallery');
                    } catch (\Throwable $e) {
                        $imgUrl = asset('storage/' . $file->store('schools/gallery', 'public'));
                    }
                } else {
                    $imgUrl = asset('storage/' . $file->store('schools/gallery', 'public'));
                }
                if ($imgUrl) {
                    $existingGallery[] = $imgUrl;
                }
            }
            $data['gallery_images'] = array_values($existingGallery);
        }

        $school->update($data);

        return redirect()->back()->with('success', 'Présentation & branding de l\'école mis à jour avec succès.');
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
