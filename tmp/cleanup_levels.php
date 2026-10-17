<?php
use App\Models\Level;

try {
    // Target school ID 1 (Nadine Pany's school)
    $schoolId = 1;

    // 1. Delete all existing levels for this school to start fresh
    Level::where('school_id', $schoolId)->orWhereNull('school_id')->delete();

    // 2. Create the 7 mandatory levels
    $levels = [
        ['name' => 'Sixième', 'order' => 1],
        ['name' => 'Cinquième', 'order' => 2],
        ['name' => 'Quatrième', 'order' => 3],
        ['name' => 'Troisième', 'order' => 4],
        ['name' => 'Seconde', 'order' => 5],
        ['name' => 'Première', 'order' => 6],
        ['name' => 'Terminale', 'order' => 7],
    ];

    foreach ($levels as $l) {
        Level::create([
            'name' => $l['name'],
            'order' => $l['order'],
            'school_id' => $schoolId,
        ]);
    }

    echo "Niveaux réinitialisés avec succès pour l'école ID $schoolId.\n";
} catch (\Exception $e) {
    echo "Erreur lors de la réinitialisation : " . $e->getMessage() . "\n";
}
