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
            if (!Schema::hasColumn('classes', 'school_id')) {
                $table->foreignId('school_id')->nullable()->constrained('schools')->onDelete('cascade');
            }
        });

        Schema::table('matieres', function (Blueprint $table) {
            if (!Schema::hasColumn('matieres', 'school_id')) {
                $table->foreignId('school_id')->nullable()->constrained('schools')->onDelete('cascade');
            }
        });

        Schema::table('eleves', function (Blueprint $table) {
            if (!Schema::hasColumn('eleves', 'school_id')) {
                $table->foreignId('school_id')->nullable()->constrained('schools')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->dropForeign(['school_id']);
            $table->dropColumn('school_id');
        });

        Schema::table('matieres', function (Blueprint $table) {
            $table->dropForeign(['school_id']);
            $table->dropColumn('school_id');
        });

        Schema::table('eleves', function (Blueprint $table) {
            $table->dropForeign(['school_id']);
            $table->dropColumn('school_id');
        });
    }
};
