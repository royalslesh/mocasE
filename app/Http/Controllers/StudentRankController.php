<?php

namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\Note;
use Illuminate\Http\Request;

class StudentRankController extends Controller
{
    /**
     * Re-calculate averages and ranks for a class and trimestre.
     */
    public static function updateRankings($classeId, $tri)
    {
        $students = Eleve::where('classe_id', $classeId)->get();
        $moyField = "moy$tri";
        $rankField = "rang$tri";

        foreach ($students as $student) {
            // Get all grades for this student in this trimestre
            $notes = Note::where('eleve_id', $student->id)
                ->where('tri', $tri)
                ->get();

            $totalPoints = 0;
            $totalCoefs = 0;

            foreach ($notes as $note) {
                // Get coefficient from pivot matiere_classe
                $pivot = \Illuminate\Support\Facades\DB::table('matiere_classe')
                    ->where('matiere_id', $note->matiere_id)
                    ->where('classe_id', $note->classe_id)
                    ->first();

                $coef = $pivot ? $pivot->coefficient : 1;
                $totalPoints += ($note->note * $coef);
                $totalCoefs += $coef;
            }

            $average = $totalCoefs > 0 ? $totalPoints / $totalCoefs : 0;
            $student->update([$moyField => $average]);
        }

        // Rank the students
        $rankedStudents = Eleve::where('classe_id', $classeId)
            ->orderByDesc($moyField)
            ->get();

        foreach ($rankedStudents as $index => $s) {
            $s->update([$rankField => $index + 1]);
        }
    }
}
