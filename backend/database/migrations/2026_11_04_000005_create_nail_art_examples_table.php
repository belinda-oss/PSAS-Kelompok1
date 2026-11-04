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
        Schema::create('nail_art_examples', function (Blueprint $table) {
            $table->id();
            // Slug dipakai sebagai identifier publik contoh nail art.
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('category');
            // design_id menghubungkan contoh dengan motif yang dipakai AI Decorator
            // (mis. "blush_jelly") agar generator YOLOv8 + MediaPipe tahu pola tujuan.
            $table->string('design_id')->nullable()->index();
            $table->text('description')->nullable();
            // Engine yang dipakai untuk menghasilkan contoh (default YOLOv8 + MediaPipe).
            $table->string('engine')->default('YOLOv8 + MediaPipe');
            // Path relatif di disk public, mis. "nail-art-examples/abc123.png"
            $table->string('image_path')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nail_art_examples');
    }
};
