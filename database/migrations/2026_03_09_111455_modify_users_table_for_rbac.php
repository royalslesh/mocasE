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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('visiteur')->after('email');
            $table->unsignedBigInteger('school_id')->nullable()->after('role');
            $table->string('status')->default('active')->after('school_id'); // active, blocked

            if (Schema::hasColumn('users', 'is_admin')) {
                $table->dropColumn('is_admin');
            }

            $table->foreign('school_id')->references('id')->on('schools')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['school_id']);
            $table->dropColumn(['role', 'school_id', 'status']);
            $table->boolean('is_admin')->default(false);
        });
    }
};
