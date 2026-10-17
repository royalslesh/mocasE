<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('discipline_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->cascadeOnDelete();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // Le SG qui a fait la saisie
            
            $table->string('type'); // absence, retard, avertissement, blame, exclusion
            $table->integer('valeur')->default(0); // ex: 2 (heures), 1 (retard), 3 (jours exclusion)
            $table->string('motif')->nullable();
            $table->date('date_incident');
            $table->integer('sequence'); // Séquence (1 à 6)
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discipline_records');
    }
};
