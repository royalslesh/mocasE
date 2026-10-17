<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('censeurs', function (Blueprint $table) {
            $table->id(); // clé primaire "id"
            $table->string('nom'); // nom du censeur
            $table->string('email')->unique(); // email unique
            $table->string('contact')->nullable(); // contact, optionnel
            $table->string('role'); // rôle
            $table->string('password'); // mot de passe
            $table->timestamps(); // created_at et updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('censeurs');
    }
};
