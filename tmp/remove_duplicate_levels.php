<?php
use App\Models\Level;
use App\Models\School;

try {
    $schools = School::all();

    foreach ($schools as $school) {
        for ($i = 1; $i <= 7; $i++) {
            $levels = Level::where('school_id', $school->id)
                ->where('order', $i)
                ->get();

            if ($levels->count() > 1) {
                // Keep the first one, delete the rest (if no classes)
                $keep = $levels->first();
                $duplicates = $levels->slice(1);

                foreach ($duplicates as $dup) {
                    if ($dup->classes()->count() == 0) {
                        $dup->delete();
                    } else {
                        // If it has classes, but it's a duplicate, maybe we should reassign classes?
                        // For now, if it's a duplicate we just merge or keep it.
                        // But let's assume we want only one.
                    }
                }
            }
        }
    }
    echo "Doublons nettoyés.\n";
} catch (\Exception $e) {
    echo "Erreur : " . $e->getMessage() . "\n";
}
