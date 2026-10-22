<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Groupe de matières pour organiser le bulletin (ex: "Sciences", "Langues", "Littéraire")
        Schema::table('matieres', function (Blueprint $table) {
            if (!Schema::hasColumn('matieres', 'groupe')) {
                $table->string('groupe', 100)->nullable()->after('attribut');
            }
        });

        // Code/Matricule officiel de l'établissement (affiché sur les listes)
        Schema::table('schools', function (Blueprint $table) {
            if (!Schema::hasColumn('schools', 'code')) {
                $table->string('code', 30)->nullable()->after('academic_year');
            }
        });
    }

    public function down(): void
    {
        Schema::table('matieres', function (Blueprint $table) {
            if (Schema::hasColumn('matieres', 'groupe')) {
                $table->dropColumn('groupe');
            }
        });
        Schema::table('schools', function (Blueprint $table) {
            if (Schema::hasColumn('schools', 'code')) {
                $table->dropColumn('code');
            }
        });
    }
};
