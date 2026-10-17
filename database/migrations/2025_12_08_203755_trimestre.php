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
        Schema::create('trimestre', function (Blueprint $table) {
            $table->id();
            $table->decimal('note', 4, 2);
            $table->foreignId('eleve_id')->constrained('eleves');
            $table->foreignId('matiere_id')->constrained('matieres');
            $table->integer('coef');
            $table->foreignId('classe_id')->constrained('classes');
            $table->integer('trimestre');
            $table->string('mention');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('trimestre');
    }
};
