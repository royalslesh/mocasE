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
        // 1. Colonnes sur la table schools
        Schema::table('schools', function (Blueprint $table) {
            if (!Schema::hasColumn('schools', 'academic_year')) {
                $table->string('academic_year')->default('2025-2026')->after('is_active');
            }
            if (!Schema::hasColumn('schools', 'passing_grade')) {
                $table->decimal('passing_grade', 4, 2)->default(10.00)->after('academic_year');
            }
            if (!Schema::hasColumn('schools', 'repeat_grade')) {
                $table->decimal('repeat_grade', 4, 2)->default(8.50)->after('passing_grade');
            }
        });

        // 2. Colonne progression sur classes
        Schema::table('classes', function (Blueprint $table) {
            if (!Schema::hasColumn('classes', 'next_classe_id')) {
                $table->unsignedBigInteger('next_classe_id')->nullable()->after('capacity');
            }
        });

        // 3. Colonnes délibération & statut annuel sur eleves
        Schema::table('eleves', function (Blueprint $table) {
            if (!Schema::hasColumn('eleves', 'moy_annuelle')) {
                $table->decimal('moy_annuelle', 4, 2)->nullable()->after('rang3');
            }
            if (!Schema::hasColumn('eleves', 'rang_annuel')) {
                $table->integer('rang_annuel')->nullable()->after('moy_annuelle');
            }
            if (!Schema::hasColumn('eleves', 'decision_passage')) {
                $table->string('decision_passage')->nullable()->after('rang_annuel'); // 'admis', 'redouble', 'exclu', 'diplome'
            }
            if (!Schema::hasColumn('eleves', 'decision_override')) {
                $table->boolean('decision_override')->default(false)->after('decision_passage');
            }
            if (!Schema::hasColumn('eleves', 'statut')) {
                $table->string('statut')->default('actif')->after('decision_override'); // 'actif', 'exclu', 'diplome', 'archive'
            }
            if (!Schema::hasColumn('eleves', 'next_classe_id')) {
                $table->unsignedBigInteger('next_classe_id')->nullable()->after('statut');
            }
            if (!Schema::hasColumn('eleves', 'is_redoublant')) {
                $table->boolean('is_redoublant')->default(false)->after('next_classe_id');
            }
        });

        // 4. Table d'historique et archives annuelles
        if (!Schema::hasTable('academic_year_histories')) {
            Schema::create('academic_year_histories', function (Blueprint $table) {
                $table->id();
                $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
                $table->string('academic_year'); // ex: '2025-2026'
                $table->integer('total_students')->default(0);
                $table->integer('total_passed')->default(0);
                $table->integer('total_repeated')->default(0);
                $table->integer('total_excluded')->default(0);
                $table->decimal('success_rate', 5, 2)->default(0.00);
                $table->json('classes_stats')->nullable(); // Détails par classe (taux réussite, etc.)
                $table->timestamp('closed_at')->nullable();
                $table->foreignId('closed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_year_histories');

        Schema::table('eleves', function (Blueprint $table) {
            $table->dropColumn([
                'moy_annuelle',
                'rang_annuel',
                'decision_passage',
                'decision_override',
                'statut',
                'next_classe_id',
                'is_redoublant',
            ]);
        });

        Schema::table('classes', function (Blueprint $table) {
            $table->dropColumn('next_classe_id');
        });

        Schema::table('schools', function (Blueprint $table) {
            $table->dropColumn([
                'academic_year',
                'passing_grade',
                'repeat_grade',
            ]);
        });
    }
};
