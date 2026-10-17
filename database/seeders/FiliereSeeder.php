<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\School;
use App\Models\Filiere;

class FiliereSeeder extends Seeder
{
    public function run(): void
    {
        $schools = School::all();
        $defaultFilieres = ['C', 'D', 'TI', 'ESP', 'ITA'];

        foreach ($schools as $school) {
            foreach ($defaultFilieres as $filiereName) {
                Filiere::firstOrCreate([
                    'nom' => $filiereName,
                    'school_id' => $school->id
                ]);
            }
        }
    }
}
