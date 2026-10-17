<?php
use App\Models\Level;
use App\Models\School;

try {
    $schools = School::all();

    // First, delete any Level with NO school_id (global trash)
    Level::whereNull('school_id')->delete();

    foreach ($schools as $school) {
        echo "Traitement de l'école : {$school->name} (ID: {$school->id})\n";

        // 1. Rename existing levels to "Niveau X" format based on their order if possible
        // or just clean up based on current data
        $existingLevels = Level::where('school_id', $school->id)->get();

        foreach ($existingLevels as $level) {
            if ($level->order >= 1 && $level->order <= 7) {
                $level->update(['name' => 'Niveau ' . $level->order]);
            } else {
                // If it's an erroneous level with many classes, we might want to keep it or fix its order
                // But for now, let's just delete if no classes
                if ($level->classes()->count() == 0) {
                    $level->delete();
                }
            }
        }

        // 2. Ensure each school has exactly Level 1 to 7
        for ($i = 1; $i <= 7; $i++) {
            $exists = Level::where('school_id', $school->id)->where('order', $i)->exists();
            if (!$exists) {
                Level::create([
                    'name' => 'Niveau ' . $i,
                    'order' => $i,
                    'school_id' => $school->id,
                ]);
                echo "  -> Créé Niveau $i\n";
            }
        }

        // 3. Delete any level that is NOT Niveau 1-7 and has no classes
        Level::where('school_id', $school->id)
            ->where(function ($q) {
                $q->where('order', '<', 1)->orWhere('order', '>', 7);
            })
            ->whereDoesntHave('classes')
            ->delete();

        // 4. Force name "Niveau X" for all remaining levels
        Level::where('school_id', $school->id)->get()->each(function ($l) {
            $l->update(['name' => 'Niveau ' . $l->order]);
        });
    }

    echo "Standardisation terminée pour toutes les écoles.\n";
} catch (\Exception $e) {
    echo "Erreur : " . $e->getMessage() . "\n";
}
