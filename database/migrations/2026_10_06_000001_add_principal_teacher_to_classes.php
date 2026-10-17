<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            if (!Schema::hasColumn('classes', 'principal_teacher_id')) {
                $table->unsignedBigInteger('principal_teacher_id')->nullable()->after('censeur_id');
                $table->foreign('principal_teacher_id')->references('id')->on('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('classes', 'annee_academique')) {
                $table->string('annee_academique')->nullable()->after('principal_teacher_id')
                    ->comment('Ex: 2025-2026');
            }
        });
    }

    public function down(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->dropForeign(['principal_teacher_id']);
            $table->dropColumn(['principal_teacher_id', 'annee_academique']);
        });
    }
};
