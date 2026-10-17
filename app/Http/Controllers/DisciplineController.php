<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\DisciplineRecord;
use App\Models\Eleve;
use App\Models\Level;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DisciplineController extends Controller
{
    private function getSchoolId()
    {
        $user = auth()->user();
        if ($user->role === User::ROLE_SUPER_ADMIN && session('active_school_id')) {
            return session('active_school_id');
        }
        return $user->school_id;
    }

    /**
     * Tableau de bord discipline - liste les niveaux/classes du SG.
     */
    public function index(Request $request)
    {
        $schoolId = $this->getSchoolId();
        $user = auth()->user();

        $levelsQuery = Level::where('school_id', $schoolId)->with(['classes', 'surveillant']);
        if ($user->role === 'surveillant') {
            $levelsQuery->where('surveillant_id', $user->id);
        }
        $levels = $levelsQuery->orderBy('order')->get();

        $currentSeq = (int)$request->get('seq', 1);

        $records = DisciplineRecord::where('school_id', $schoolId)
            ->where('sequence', $currentSeq)
            ->with('eleve')
            ->latest()
            ->take(50)
            ->get();

        return Inertia::render('Discipline/Index', [
            'levels'     => $levels,
            'records'    => $records,
            'currentSeq' => $currentSeq,
            'userRole'   => $user->role,
        ]);
    }

    /**
     * Fiche discipline d une classe.
     */
    public function classe(Request $request, Classe $classe)
    {
        $schoolId = $this->getSchoolId();
        $user = auth()->user();

        if ($user->role === 'surveillant') {
            $level = Level::where('surveillant_id', $user->id)
                ->where('id', $classe->level_id)
                ->where('school_id', $schoolId)
                ->first();
            if (!$level) {
                return redirect()->route('discipline.index')->with('error', 'Acces refuse.');
            }
        }

        $seq = (int)$request->get('seq', 1);

        $eleves = Eleve::where('classe_id', $classe->id)
            ->orderBy('nom')
            ->with(['disciplineRecords' => function ($q) use ($seq) {
                $q->where('sequence', $seq)->orderBy('date_incident', 'desc');
            }])
            ->get();

        return Inertia::render('Discipline/Classe', [
            'classe'  => $classe->load('level'),
            'eleves'  => $eleves,
            'seq'     => $seq,
        ]);
    }

    /**
     * Saisie rapide multi-eleves.
     */
    public function store(Request $request)
    {
        $request->validate([
            'eleve_ids'     => 'required|array|min:1',
            'eleve_ids.*'   => 'exists:eleves,id',
            'type'          => 'required|in:absence,retard,avertissement_conduite,avertissement_travail,blame,exclusion',
            'valeur'        => 'required|integer|min:1|max:30',
            'motif'         => 'nullable|string|max:255',
            'date_incident' => 'required|date',
            'sequence'      => 'required|integer|between:1,6',
        ]);

        $user = auth()->user();
        if ($request->type === 'exclusion') {
            if (!in_array($user->role, [User::ROLE_SUPER_ADMIN, User::ROLE_PROVISEUR, 'super_admin', 'proviseur'])) {
                return back()->with('error', "Seul le Chef d'Établissement (Directeur / Proviseur) est habilité à prononcer une exclusion manuelle.");
            }
        }

        $schoolId = $this->getSchoolId();

        foreach ($request->eleve_ids as $eleveId) {
            DisciplineRecord::create([
                'eleve_id'      => $eleveId,
                'school_id'     => $schoolId,
                'user_id'       => $user->id,
                'type'          => $request->type,
                'valeur'        => $request->valeur,
                'motif'         => $request->motif,
                'date_incident' => $request->date_incident,
                'sequence'      => $request->sequence,
            ]);

            $eleve = Eleve::find($eleveId);
            if ($eleve) {
                if ($request->type === 'exclusion') {
                    $eleve->update(['statut' => 'exclu']);
                } else {
                    $eleve->checkExclusionStatus();
                }
            }
        }

        $count = count($request->eleve_ids);
        return redirect()->back()->with('success', "Enregistrement effectué pour {$count} élève(s).");
    }

    /**
     * Supprimer un enregistrement.
     */
    public function destroy(DisciplineRecord $disciplineRecord)
    {
        $schoolId = $this->getSchoolId();
        if ($disciplineRecord->school_id !== $schoolId) {
            return back()->with('error', 'Acces refuse.');
        }
        $disciplineRecord->delete();
        return redirect()->back()->with('success', 'Enregistrement supprime.');
    }
}
