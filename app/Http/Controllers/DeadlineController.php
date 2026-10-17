<?php

namespace App\Http\Controllers;

use App\Models\GradingDeadline;
use App\Models\GradeExtensionRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeadlineController extends Controller
{
    /**
     * Display deadlines and extension requests to Proviseur
     */
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        
        $deadlines = GradingDeadline::where('school_id', $schoolId)->orderBy('sequence')->get();
        $requests = GradeExtensionRequest::where('school_id', $schoolId)
                        ->with(['teacher', 'classe', 'subject'])
                        ->latest()
                        ->get();

        return Inertia::render('Proviseur/Deadlines', [
            'deadlines' => $deadlines,
            'extensionRequests' => $requests,
        ]);
    }

    /**
     * Save deadlines (bulk)
     */
    public function storeDeadlines(Request $request)
    {
        $schoolId = $request->user()->school_id;
        
        $request->validate([
            'deadlines' => 'required|array',
            'deadlines.*.sequence' => 'required|integer|min:1|max:6',
            'deadlines.*.start_date' => 'nullable|date',
            'deadlines.*.end_date' => 'nullable|date|after_or_equal:deadlines.*.start_date',
        ]);

        foreach ($request->deadlines as $d) {
            GradingDeadline::updateOrCreate(
                ['school_id' => $schoolId, 'sequence' => $d['sequence']],
                [
                    'start_date' => $d['start_date'] ?? null,
                    'end_date' => $d['end_date'] ?? null,
                ]
            );
        }

        return back()->with('success', 'Délais mis à jour avec succès.');
    }

    /**
     * Teacher requests an extension
     */
    public function requestExtension(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'classe_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:matieres,id',
            'sequence' => 'required|integer|min:1|max:6',
            'reason' => 'required|string|max:500',
        ]);

        GradeExtensionRequest::create([
            'user_id' => $user->id,
            'school_id' => $user->school_id,
            'classe_id' => $request->classe_id,
            'subject_id' => $request->subject_id,
            'sequence' => $request->sequence,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Votre demande de dérogation a été envoyée au directeur.');
    }

    /**
     * Proviseur responds to an extension request
     */
    public function respondToExtension(Request $request, GradeExtensionRequest $extension)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        if ($extension->school_id !== $request->user()->school_id) {
            abort(403);
        }

        $extension->update(['status' => $request->status]);

        return back()->with('success', 'Le statut de la demande a été mis à jour.');
    }
}
