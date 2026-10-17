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
        Schema::create('principales', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('role');
            $table->string('email')->unique();
            $table->string('contact');
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('principales');
    }
}

;
