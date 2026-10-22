<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;

use App\Models\Eleve;
use App\Models\Classe;
use App\Models\Level;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    private function getActiveSchoolId(Request $request)
    {
        if ($request->user()->role === 'super_admin' && session('active_school_id')) {
            return session('active_school_id');
        }
        return $request->user()->school_id;
    }

    /**
     * Générer un matricule unique automatiquement.
     * Format : MC-{SCHOOL_ID(3)}-{ANNEE}-{SEQUENCE(5)}
     * Exemple : MC-001-2026-00001
     */
    private function generateMatricule(int $schoolId): string
    {
        $year = date('Y');
        $prefix = 'MC-' . str_pad($schoolId, 3, '0', STR_PAD_LEFT) . '-' . $year . '-';

        // Trouver le dernier numéro de séquence pour cette école et cette année
        $lastMatricule = Eleve::where('school_id', $schoolId)
            ->where('MATRICULE', 'LIKE', $prefix . '%')
            ->orderByRaw('CAST(SUBSTRING(MATRICULE, ' . (strlen($prefix) + 1) . ') AS UNSIGNED) DESC')
            ->value('MATRICULE');

        if ($lastMatricule) {
            $lastNumber = (int) substr($lastMatricule, strlen($prefix));
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }

    public function index(Request $request)
    {
        $schoolId = $this->getActiveSchoolId($request);
        $user = $request->user();

        $query = Eleve::where('school_id', $schoolId);

        $classesQuery = Classe::where('school_id', $schoolId);
        if ($user->role === 'censeur') {
            $managedLevelIds = Level::where('censeur_id', $user->id)->pluck('id');
            $query->whereIn('classe_id', function ($q) use ($managedLevelIds) {
                $q->select('id')->from('classes')->whereIn('level_id', $managedLevelIds);
            });
            $classesQuery->whereIn('level_id', $managedLevelIds);
        }

        return Inertia::render('Students/Index', [
            'students' => $query->with('classe')->latest()->get(),
            'classes' => $classesQuery->orderBy('nom')->get(),
        ]);
    }

    public function edit(Eleve $student, Request $request)
    {
        $schoolId = $this->getActiveSchoolId($request);

        return Inertia::render('Students/Create', [
            'student' => $student,
            'classes' => Classe::where('school_id', $schoolId)->get(),
            'levels' => Level::where('school_id', $schoolId)->get(),
        ]);
    }

    public function create(Request $request)
    {
        $schoolId = $this->getActiveSchoolId($request);

        return Inertia::render('Students/Create', [
            'classes' => Classe::where('school_id', $schoolId)->get(),
            'levels' => Level::where('school_id', $schoolId)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $this->getActiveSchoolId($request);

        $validated = $request->validate([
            'nom' => 'required|string|max:191',
            'prenom' => 'required|string|max:191',
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'required|string|max:191',
            'section' => 'required|string',
            'classe_id' => [
                'required',
                Rule::exists('classes', 'id')->where(function ($query) use ($schoolId) {
                    $query->where('school_id', $schoolId);
                }),
            ],
            'sexe' => 'required|string|in:M,F',
            'parent_phone' => 'required|string|max:25',
            'parent_name' => 'nullable|string|max:191',
            'adresse' => 'nullable|string|max:255',
            'statut' => 'nullable|string|in:nouveau,redoublant,ancien,exclu',
            'MATRICULE' => ['required', 'string', 'max:50', \Illuminate\Validation\Rule::unique('eleves', 'MATRICULE')],
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        $classe = Classe::find($validated['classe_id']);

        $matricule = strtoupper(trim($validated['MATRICULE']));

        // Gérer l'upload de la photo (Cloudinary en priorité, sinon stockage local)
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $cloudinary = new CloudinaryService();
            $cloudinaryUrl = $cloudinary->upload($request->file('photo'), "mocase/students/{$schoolId}");
            if ($cloudinaryUrl) {
                $photoPath = $cloudinaryUrl; // URL Cloudinary complète
            } else {
                // Fallback : stockage local (développement / si Cloudinary non configuré)
                $photoPath = $request->file('photo')->store("photos/students/{$schoolId}", 'public');
            }
        }

        unset($validated['photo']); // Retirer le fichier du tableau validated

        $statut = $validated['statut'] ?? 'nouveau';
        $isRedoublant = ($statut === 'redoublant');

        Eleve::create(array_merge($validated, [
            'school_id' => $schoolId,
            'MATRICULE' => $matricule,
            'photo_path' => $photoPath,
            'classe' => $classe->nom, // Keep for backward compatibility
            'statut' => $statut,
            'is_redoublant' => $isRedoublant,
            'rang1' => 0,
            'rang2' => 0,
            'rang3' => 0,
        ]));

        return redirect()->route('students.index')->with('success', "Élève enregistré avec succès ! Matricule : {$matricule}");
    }

    public function update(Request $request, Eleve $student)
    {
        $schoolId = $this->getActiveSchoolId($request);
        $user = $request->user();

        $validated = $request->validate([
            'nom' => 'required|string|max:191',
            'prenom' => 'required|string|max:191',
            'date_naissance' => 'nullable|date',
            'lieu_naissance' => 'nullable|string|max:191',
            'sexe' => 'nullable|string|in:M,F',
            'classe_id' => [
                'required',
                Rule::exists('classes', 'id')->where(function ($query) use ($schoolId) {
                    $query->where('school_id', $schoolId);
                }),
            ],
            'parent_phone' => 'required|string|max:25',
            'parent_name' => 'nullable|string|max:191',
            'adresse' => 'nullable|string|max:255',
            'statut' => 'nullable|string|in:nouveau,redoublant,ancien,exclu,diplome',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'MATRICULE' => ['required', 'string', 'max:50', \Illuminate\Validation\Rule::unique('eleves', 'MATRICULE')->ignore($student->id)],
        ]);

        // SÉCURITÉ STRICTE SUR L'EXCLUSION : Seul le Directeur / Proviseur peut exclure ou réintégrer un élève exclu
        if (isset($validated['statut'])) {
            if ($student->statut === 'exclu' && $validated['statut'] !== 'exclu') {
                if (!in_array($user->role, ['super_admin', 'proviseur'])) {
                    return back()->with('error', "Seul le Directeur / Proviseur est autorisé à lever l'exclusion d'un élève.");
                }
            }
            if ($validated['statut'] === 'exclu' && $student->statut !== 'exclu') {
                if (!in_array($user->role, ['super_admin', 'proviseur'])) {
                    return back()->with('error', "Seul le Directeur / Proviseur a le pouvoir de prononcer une exclusion.");
                }
            }
            if ($validated['statut'] === 'redoublant') {
                $validated['is_redoublant'] = true;
            } elseif ($validated['statut'] === 'nouveau' || $validated['statut'] === 'ancien') {
                $validated['is_redoublant'] = false;
            }
        }

        // Gérer l'upload de la photo (Cloudinary en priorité, sinon stockage local)
        if ($request->hasFile('photo')) {
            // Supprimer l'ancienne photo si elle existe
            if ($student->photo_path) {
                if (CloudinaryService::isCloudinaryUrl($student->photo_path)) {
                    (new CloudinaryService())->destroy($student->photo_path);
                } elseif (\Illuminate\Support\Facades\Storage::disk('public')->exists($student->photo_path)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($student->photo_path);
                }
            }
            $cloudinary = new CloudinaryService();
            $cloudinaryUrl = $cloudinary->upload($request->file('photo'), "mocase/students/{$schoolId}");
            $validated['photo_path'] = $cloudinaryUrl
                ?? $request->file('photo')->store("photos/students/{$schoolId}", 'public');
        }

        unset($validated['photo']);

        $classe = Classe::find($validated['classe_id']);
        $student->update(array_merge($validated, [
            'classe'     => $classe->nom,
            'MATRICULE'  => strtoupper(trim($validated['MATRICULE'])),
        ]));

        return redirect()->route('students.index')->with('success', 'Informations de l\'élève mises à jour.');
    }

    /**
     * Réintégration d'un élève exclu (Réservé exclusivement au Proviseur / Directeur)
     */
    public function reinstate(Request $request, Eleve $student)
    {
        $user = $request->user();
        if (!in_array($user->role, ['super_admin', 'proviseur'])) {
            return back()->with('error', "Action réservée exclusivement au Chef d'Établissement.");
        }

        $student->update([
            'statut' => $student->is_redoublant ? 'redoublant' : 'ancien',
        ]);

        return back()->with('success', "L'élève {$student->nom} {$student->prenom} a été réintégré avec succès.");
    }

    public function destroy(Eleve $student)
    {
        $student->delete();
        return redirect()->route('students.index')->with('success', 'Élève supprimé du registre.');
    }
}
