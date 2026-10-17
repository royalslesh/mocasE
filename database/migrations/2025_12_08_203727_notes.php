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
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->decimal('note', 4, 2);
            $table->date('date');
            $table->foreignId('eleve_id')->constrained('eleves');
            $table->foreignId('matiere_id')->constrained('matieres');
            $table->foreignId('classe_id')->constrained('classes');
            $table->foreignId('enseignant_id')->constrained('enseignants');
            $table->integer('sequence');
            $table->integer('tri');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('notes');
    }
}
;
