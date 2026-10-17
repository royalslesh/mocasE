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
        Schema::table('classes', function (Blueprint $table) {
            // Drop legacy foreign key if it exists
            // The name is usually table_column_foreign
            $table->dropForeign(['censeur_id']);

            // Re-create pointing to users table
            $table->foreign('censeur_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->dropForeign(['censeur_id']);
            $table->foreign('censeur_id')->references('id')->on('censeurs');
        });
    }
};
