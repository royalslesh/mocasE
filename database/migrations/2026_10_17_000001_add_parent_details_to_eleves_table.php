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
        Schema::table('eleves', function (Blueprint $table) {
            if (!Schema::hasColumn('eleves', 'parent_name')) {
                $table->string('parent_name')->nullable()->after('parent_phone');
            }
            if (!Schema::hasColumn('eleves', 'adresse')) {
                $table->string('adresse')->nullable()->after('parent_name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('eleves', function (Blueprint $table) {
            if (Schema::hasColumn('eleves', 'parent_name')) {
                $table->dropColumn('parent_name');
            }
            if (Schema::hasColumn('eleves', 'adresse')) {
                $table->dropColumn('adresse');
            }
        });
    }
};
