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
        Schema::create('timetables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignId('classe_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('matiere_id')->constrained('matieres')->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('jour', 20); // lundi, mardi, mercredi, jeudi, vendredi, samedi
            $table->string('heure_debut', 10); // ex: 07:30
            $table->string('heure_fin', 10);   // ex: 08:30
            $table->string('salle', 50)->nullable();
            $table->integer('order')->default(1);
            $table->timestamps();

            $table->index(['school_id', 'classe_id', 'jour']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timetables');
    }
};
