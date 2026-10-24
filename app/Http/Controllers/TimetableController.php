<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\Eleve;
use App\Models\Matiere;
use App\Models\School;
use App\Models\Timetable;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimetableController extends Controller
{
    private function getSchoolId(): int
    {
        $user = auth()->user();
        if ($user->role === 'super_admin' && session('active_school_id')) {
            return (int) session('active_school_id');
        }
        return (int) $user->school_id;
    }

    /**
     * Interface de gestion des emplois du temps (Directeur / Proviseur / Censeur)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!in_array($user->role, ['super_admin', 'proviseur', 'censeur', 'surveillant'])) {
            abort(403, "Accès réservé à la direction et à la vie scolaire.");
        }

        $schoolId = $this->getSchoolId();

        $classesQuery = Classe::where('school_id', $schoolId)->orderBy('nom');
        if ($user->role === 'censeur') {
            $managedLevelIds = \App\Models\Level::where('censeur_id', $user->id)->pluck('id');
            $classesQuery->whereIn('level_id', $managedLevelIds);
        }
        $classes = $classesQuery->get();

        $selectedClasseId = $request->query('classe_id', $classes->first()?->id);
        $selectedClasse = $classes->firstWhere('id', (int) $selectedClasseId);

        $slots = [];
        if ($selectedClasse) {
            $slots = Timetable::where('classe_id', $selectedClasse->id)
                ->with(['matiere', 'teacher'])
                ->orderBy('order')
                ->orderBy('heure_debut')
                ->get();
        }

        $matieres = Matiere::where('school_id', $schoolId)->orderBy('nom')->get();
        $teachers = User::where('school_id', $schoolId)->where('role', 'enseignant')->orderBy('name')->get();

        return Inertia::render('Proviseur/Timetables/Index', [
            'classes'        => $classes,
            'selectedClasse' => $selectedClasse,
            'slots'          => $slots,
            'matieres'       => $matieres,
            'teachers'       => $teachers,
            'userRole'       => $user->role,
        ]);
    }

    /**
     * Enregistrer ou mettre à jour un créneau horaire
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!in_array($user->role, ['super_admin', 'proviseur', 'censeur'])) {
            abort(403, "Accès non autorisé.");
        }

        $schoolId = $this->getSchoolId();

        $validated = $request->validate([
            'id'          => 'nullable|exists:timetables,id',
            'classe_id'   => 'required|exists:classes,id',
            'matiere_id'  => 'required|exists:matieres,id',
            'teacher_id'  => 'nullable|exists:users,id',
            'jour'        => 'required|in:lundi,mardi,mercredi,jeudi,vendredi,samedi',
            'heure_debut' => 'required|string|max:10',
            'heure_fin'   => 'required|string|max:10',
            'salle'       => 'nullable|string|max:50',
            'order'       => 'nullable|integer',
        ]);

        $classe = Classe::findOrFail($validated['classe_id']);
        if ($user->role !== 'super_admin' && $classe->school_id !== $schoolId) {
            abort(403, "Cette classe n'appartient pas à votre établissement.");
        }

        Timetable::updateOrCreate(
            ['id' => $validated['id'] ?? null],
            [
                'school_id'   => $schoolId,
                'classe_id'   => $validated['classe_id'],
                'matiere_id'  => $validated['matiere_id'],
                'teacher_id'  => $validated['teacher_id'] ?? null,
                'jour'        => strtolower($validated['jour']),
                'heure_debut' => $validated['heure_debut'],
                'heure_fin'   => $validated['heure_fin'],
                'salle'       => $validated['salle'] ?? null,
                'order'       => $validated['order'] ?? 1,
            ]
        );

        return redirect()->back()->with('success', 'Créneau d\'emploi du temps enregistré avec succès.');
    }

    /**
     * Supprimer un créneau
     */
    public function destroy(Timetable $timetable)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['super_admin', 'proviseur', 'censeur'])) {
            abort(403, "Accès non autorisé.");
        }

        if ($user->role !== 'super_admin' && $timetable->school_id !== $this->getSchoolId()) {
            abort(403, "Action interdite.");
        }

        $timetable->delete();

        return redirect()->back()->with('success', 'Créneau supprimé.');
    }

    /**
     * Générateur automatique de grille standard pour une classe (Lundi - Vendredi, 7 périodes/jour)
     */
    public function generateTemplate(Request $request)
    {
        $user = $request->user();
        if (!in_array($user->role, ['super_admin', 'proviseur', 'censeur'])) {
            abort(403, "Accès non autorisé.");
        }

        $schoolId = $this->getSchoolId();

        $request->validate([
            'classe_id' => 'required|exists:classes,id',
        ]);

        $classe = Classe::with('matieres')->findOrFail($request->classe_id);
        if ($user->role !== 'super_admin' && $classe->school_id !== $schoolId) {
            abort(403, "Action non autorisée.");
        }

        $matieres = $classe->matieres;
        if ($matieres->isEmpty()) {
            $matieres = Matiere::where('school_id', $schoolId)->get();
        }
        if ($matieres->isEmpty()) {
            return redirect()->back()->with('error', 'Veuillez d\'abord ajouter des matières dans votre établissement.');
        }

        $defaultPeriods = [
            ['order' => 1, 'start' => '07:30', 'end' => '08:30'],
            ['order' => 2, 'start' => '08:30', 'end' => '09:30'],
            ['order' => 3, 'start' => '09:30', 'end' => '10:30'],
            ['order' => 4, 'start' => '10:45', 'end' => '11:45'],
            ['order' => 5, 'start' => '11:45', 'end' => '12:45'],
            ['order' => 6, 'start' => '13:15', 'end' => '14:15'],
            ['order' => 7, 'start' => '14:15', 'end' => '15:15'],
        ];

        $days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
        $matCount = $matieres->count();
        $matIdx = 0;

        foreach ($days as $day) {
            foreach ($defaultPeriods as $period) {
                // Créer le créneau s'il n'existe pas déjà
                $exists = Timetable::where('classe_id', $classe->id)
                    ->where('jour', $day)
                    ->where('order', $period['order'])
                    ->exists();

                if (!$exists) {
                    $selectedMatiere = $matieres[$matIdx % $matCount];
                    Timetable::create([
                        'school_id'   => $schoolId,
                        'classe_id'   => $classe->id,
                        'matiere_id'  => $selectedMatiere->id,
                        'jour'        => $day,
                        'heure_debut' => $period['start'],
                        'heure_fin'   => $period['end'],
                        'order'       => $period['order'],
                    ]);
                    $matIdx++;
                }
            }
        }

        return redirect()->back()->with('success', 'Grille d\'emploi du temps générée avec succès pour la classe.');
    }

    /**
     * IMPRESSION OFFICIELLE : Feuille d'Appel Journalière pour le Surveillant Général & Proviseur
     * Affiche pour la journée et la classe ciblée les heures de cours selon l'emploi du temps
     * et chaque élève avec case Présent / Absent / Retard.
     */
    public function dailySheet(Request $request)
    {
        $user = $request->user();
        if (!in_array($user->role, ['super_admin', 'proviseur', 'censeur', 'surveillant'])) {
            abort(403, "Accès réservé au personnel administratif et à la surveillance générale.");
        }

        $schoolId = $this->getSchoolId();
        $school = School::findOrFail($schoolId);

        $classeId = $request->query('classe_id');
        if (!$classeId) {
            return redirect()->back()->with('error', 'Veuillez sélectionner une classe.');
        }

        $classe = Classe::with(['eleves' => function ($q) {
            $q->orderBy('nom')->orderBy('prenom');
        }])->findOrFail($classeId);

        if ($user->role !== 'super_admin' && $classe->school_id !== $schoolId) {
            abort(403, "Cette classe n'appartient pas à votre établissement.");
        }

        // Date ciblée (défaut = aujourd'hui)
        $dateStr = $request->query('date', now()->format('Y-m-d'));
        try {
            $date = Carbon::parse($dateStr);
        } catch (\Throwable $e) {
            $date = now();
        }

        // Jour de la semaine en minuscule français (ex: lundi, mardi...)
        $dayNames = [
            1 => 'lundi',
            2 => 'mardi',
            3 => 'mercredi',
            4 => 'jeudi',
            5 => 'vendredi',
            6 => 'samedi',
            7 => 'dimanche',
        ];
        $jour = $dayNames[$date->dayOfWeekIso] ?? 'lundi';

        // Créneaux d'emploi du temps pour cette classe ce jour
        $slots = Timetable::where('classe_id', $classe->id)
            ->where('jour', $jour)
            ->with(['matiere', 'teacher'])
            ->orderBy('order')
            ->orderBy('heure_debut')
            ->get();

        // Si aucun créneau n'a encore été configuré pour ce jour précis,
        // générer des créneaux horaires par défaut pour que le SG puisse faire l'appel sans blocage
        if ($slots->isEmpty()) {
            $slots = collect([
                (object) ['order' => 1, 'heure_debut' => '07:30', 'heure_fin' => '08:30', 'matiere' => (object) ['nom' => 'Période 1'], 'teacher' => null],
                (object) ['order' => 2, 'heure_debut' => '08:30', 'heure_fin' => '09:30', 'matiere' => (object) ['nom' => 'Période 2'], 'teacher' => null],
                (object) ['order' => 3, 'heure_debut' => '09:30', 'heure_fin' => '10:30', 'matiere' => (object) ['nom' => 'Période 3'], 'teacher' => null],
                (object) ['order' => 4, 'heure_debut' => '10:45', 'heure_fin' => '11:45', 'matiere' => (object) ['nom' => 'Période 4'], 'teacher' => null],
                (object) ['order' => 5, 'heure_debut' => '11:45', 'heure_fin' => '12:45', 'matiere' => (object) ['nom' => 'Période 5'], 'teacher' => null],
                (object) ['order' => 6, 'heure_debut' => '13:15', 'heure_fin' => '14:15', 'matiere' => (object) ['nom' => 'Période 6'], 'teacher' => null],
                (object) ['order' => 7, 'heure_debut' => '14:15', 'heure_fin' => '15:15', 'matiere' => (object) ['nom' => 'Période 7'], 'teacher' => null],
            ]);
        }

        return view('exports.daily-attendance', [
            'school' => $school,
            'classe' => $classe,
            'date'   => $date,
            'jour'   => ucfirst($jour),
            'slots'  => $slots,
            'user'   => $user,
        ]);
    }
}
