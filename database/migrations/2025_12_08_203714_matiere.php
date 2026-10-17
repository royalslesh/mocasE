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
        Schema::create('matieres', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->integer('attribut');
            $table->integer('coef');
            $table->integer('categori');
            $table->timestamps();
        });
    }

    public function down()
   {
     
    Schema::dropIfExists('matieres');


    }
   };
