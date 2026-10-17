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
            $table->foreignId('filiere_id')->nullable()->constrained('filieres')->onDelete('set null');
            $table->boolean('seq1_auth')->default(false);
            $table->boolean('seq2_auth')->default(false);
            $table->boolean('seq3_auth')->default(false);
            $table->boolean('seq4_auth')->default(false);
            $table->boolean('seq5_auth')->default(false);
            $table->boolean('seq6_auth')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->dropForeign(['filiere_id']);
            $table->dropColumn(['filiere_id', 'seq1_auth', 'seq2_auth', 'seq3_auth', 'seq4_auth', 'seq5_auth', 'seq6_auth']);
        });
    }
};
