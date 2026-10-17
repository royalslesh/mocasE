<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Level;
use Inertia\Inertia;

class LevelController extends Controller
{
    private function getActiveSchoolId(Request $request)
    {
        if ($request->user()->role === 'super_admin' && session('active_school_id')) {
            return session('active_school_id');
        }
        return $request->user()->school_id;
    }

    public function index(Request $request)
    {
        $schoolId = $this->getActiveSchoolId($request);

        return Inertia::render('Levels/Index', [
            'levels' => Level::where('school_id', $schoolId)
                ->with(['censeur', 'surveillant'])
                ->orderBy('order')
                ->get(),
            'available_censeurs' => \App\Models\User::where('school_id', $schoolId)
                ->where('role', 'censeur')
                ->get(),
            'available_surveillants' => \App\Models\User::where('school_id', $schoolId)
                ->where('role', 'surveillant')
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        return back()->with('error', 'La structure des 7 niveaux est fixe et ne peut pas être modifiée.');
    }

    public function update(Request $request, Level $level)
    {
        $request->validate([
            'name' => 'required|string|max:191',
            'order' => 'required|integer|min:1|max:7',
            'censeur_id' => 'required|exists:users,id',
            'surveillant_id' => 'nullable|exists:users,id'
        ]);

        $schoolId = $this->getActiveSchoolId($request);

        // Check if censeur is already assigned to another level
        if ($request->censeur_id !== $level->censeur_id) {
            $exists = Level::where('school_id', $schoolId)
                ->where('censeur_id', $request->censeur_id)
                ->exists();
            if ($exists) {
                return back()->with('error', 'Ce censeur est déjà assigné à un autre niveau.');
            }
        }

        $level->update($request->only('name', 'order', 'censeur_id', 'surveillant_id'));

        // Update all classes of this level with the new censeur
        \App\Models\Classe::where('level_id', $level->id)->update(['censeur_id' => $request->censeur_id]);

        return redirect()->back()->with('success', 'Niveau mis à jour.');
    }

    public function destroy(Level $level)
    {
        return back()->with('error', 'La suppression des niveaux de base est désactivée pour préserver la structure académique.');
    }
}
