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
        Schema::table('schools', function (Blueprint $table) {
            $table->string('city')->nullable();
            $table->string('contacts')->nullable();
            $table->text('description')->nullable();
            $table->string('logo_path')->nullable();
            $table->boolean('super_admin_consent')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $table->dropColumn(['city', 'contacts', 'description', 'logo_path', 'super_admin_consent']);
        });
    }
};
