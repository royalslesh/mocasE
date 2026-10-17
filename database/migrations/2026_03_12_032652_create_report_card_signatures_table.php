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
        Schema::create('report_card_signatures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->string('term_or_sequence'); // e.g., 'Trimestre 1', 'Séquence 2'
            $table->foreignId('proviseur_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            // Un bulletin ne peut être signé qu'une seule fois par période
            $table->unique(['eleve_id', 'term_or_sequence']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_card_signatures');
    }
};
