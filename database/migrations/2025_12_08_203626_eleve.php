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
        Schema::create('eleves', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->date('date_naissance');
            $table->string('lieu_naissance');
            $table->string('section');
            $table->integer('classe_id');
            $table->string('MATRICULE')->unique();
            $table->string('sexe');
             $table->string('classe');
            $table->decimal('moy1', 4, 2)->nullable();
            $table->integer('rang1')->nullable();
            $table->decimal('moy2', 4, 2)->nullable();
            $table->integer('rang2')->nullable();
            $table->decimal('moy3', 4, 2)->nullable();
            $table->integer('rang3')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('eleves');
    }
};
