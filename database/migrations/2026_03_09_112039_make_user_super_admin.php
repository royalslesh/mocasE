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
        $user = \App\Models\User::first();
        if ($user) {
            $user->update([
                'role' => 'super_admin',
                'status' => 'active'
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $user = \App\Models\User::first();
        if ($user) {
            $user->update(['role' => 'visiteur']);
        }
    }
};
