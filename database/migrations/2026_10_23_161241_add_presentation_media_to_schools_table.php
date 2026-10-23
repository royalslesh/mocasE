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
        Schema::table('schools', function (Blueprint $table) {
            if (!Schema::hasColumn('schools', 'motto')) {
                $table->string('motto', 255)->nullable()->after('name');
            }
            if (!Schema::hasColumn('schools', 'video_url')) {
                $table->string('video_url', 500)->nullable()->after('description');
            }
            if (!Schema::hasColumn('schools', 'cover_image_path')) {
                $table->string('cover_image_path', 500)->nullable()->after('logo_path');
            }
            if (!Schema::hasColumn('schools', 'gallery_images')) {
                $table->json('gallery_images')->nullable()->after('cover_image_path');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $table->dropColumn(['motto', 'video_url', 'cover_image_path', 'gallery_images']);
        });
    }
};
