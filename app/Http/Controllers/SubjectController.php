<?php

namespace App\Http\Controllers;

use App\Models\Matiere;
use App\Models\Classe;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SubjectController extends Controller
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

        return Inertia::render('Subjects/Index', [
            'subjects' => Matiere::where('school_id', $schoolId)->with('classes')->get(),
            'classes' => Classe::where('school_id', $schoolId)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $this->getActiveSchoolId($request);

        $request->validate([
            'nom' => 'required|string|max:191',
            'coef_default' => 'nullable|integer|min:1',
            'selected_classes' => 'nullable|array',
            'selected_classes.*.id' => 'required_with:selected_classes|exists:classes,id',
            'selected_classes.*.coefficient' => 'required_with:selected_classes|integer|min:1',
        ]);

        return DB::transaction(function () use ($request, $schoolId) {
            $subject = Matiere::create([
                'nom' => $request->nom,
                'coef' => $request->coef_default ?? 1,
                'school_id' => $schoolId,
            ]);

            if ($request->selected_classes) {
                foreach ($request->selected_classes as $classData) {
                    $subject->classes()->attach($classData['id'], [
                        'coefficient' => $classData['coefficient']
                    ]);
                }
            }

            return redirect()->back()->with('success', 'Matière enregistrée avec succès.');
        });
    }

    public function update(Request $request, Matiere $subject)
    {
        $request->validate([
            'nom' => 'required|string|max:191',
            'coef_default' => 'nullable|integer|min:1',
            'selected_classes' => 'nullable|array',
            'selected_classes.*.id' => 'required_with:selected_classes|exists:classes,id',
            'selected_classes.*.coefficient' => 'required_with:selected_classes|integer|min:1',
        ]);

        return DB::transaction(function () use ($request, $subject) {
            $subject->update([
                'nom' => $request->nom,
                'coef' => $request->coef_default ?? 1,
            ]);

            $syncData = [];
            if ($request->selected_classes) {
                foreach ($request->selected_classes as $classData) {
                    $syncData[$classData['id']] = ['coefficient' => $classData['coefficient']];
                }
            }
            $subject->classes()->sync($syncData);

            return redirect()->back()->with('success', 'Matière mise à jour avec succès.');
        });
    }

    public function destroy(Matiere $subject)
    {
        $subject->classes()->detach();
        $subject->delete();
        return redirect()->back()->with('success', 'Matière supprimée.');
    }
}
