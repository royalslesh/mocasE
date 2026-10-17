<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->integer('capacity')->nullable()->after('section');
        });

        Schema::table('schools', function (Blueprint $table) {
            $table->boolean('enrollments_open')->default(true)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->dropColumn('capacity');
        });

        Schema::table('schools', function (Blueprint $table) {
            $table->dropColumn('enrollments_open');
        });
    }
};