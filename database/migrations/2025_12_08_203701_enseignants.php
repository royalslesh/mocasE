<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enseignants', function (Blueprint $table) {




            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('matière');
            $table->string('email')->unique(); // email unique
            $table->string('contact')->nullable(); // contact, optionnel
            $table->string('password');
            $table->integer('matiere_id');
            $table->timestamps();

        });


        Schema::create('enseignant_classes', function (Blueprint $table) {
            $table->foreignId('classe_id')->constrained('classes');
            $table->foreignId('enseignant_id')->constrained('enseignants');
            $table->primary(['classe_id', 'enseignant_id']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('enseignant_classes');
    }
}

;
