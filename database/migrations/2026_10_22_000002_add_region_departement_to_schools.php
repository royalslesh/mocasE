<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            if (!Schema::hasColumn('schools', 'region')) {
                $table->string('region', 100)->nullable()->after('city');
            }
            if (!Schema::hasColumn('schools', 'departement')) {
                $table->string('departement', 100)->nullable()->after('region');
            }
        });
    }

    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            if (Schema::hasColumn('schools', 'region')) {
                $table->dropColumn('region');
            }
            if (Schema::hasColumn('schools', 'departement')) {
                $table->dropColumn('departement');
            }
        });
    }
};
