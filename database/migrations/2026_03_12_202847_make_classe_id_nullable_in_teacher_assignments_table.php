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
        Schema::table('teacher_assignments', function (Blueprint $table) {
            $table->foreignId('classe_id')->nullable()->change();
            
            if (!Schema::hasColumn('teacher_assignments', 'school_id')) {
                $table->foreignId('school_id')->nullable()->after('subject_id')->constrained('schools')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teacher_assignments', function (Blueprint $table) {
            $table->foreignId('classe_id')->nullable(false)->change();
            $table->dropForeign(['school_id']);
            $table->dropColumn('school_id');
        });
    }
};
