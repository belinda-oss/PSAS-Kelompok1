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
        Schema::create('nail_generations', function (Blueprint $table) {
            $table->id();
            // Menghubungkan hasil generate dengan analisis kuku yang dipakai.
            $table->foreignId('nail_analysis_id')
                ->nullable()
                ->constrained('nail_analyses')
                ->nullOnDelete();
            // Contoh nail art yang menjadi acuan motif hasil generate.
            $table->foreignId('nail_art_example_id')
                ->nullable()
                ->constrained('nail_art_examples')
                ->nullOnDelete();
            // design_id motif yang dikirim ke engine AI (mis. "blush_jelly").
            $table->string('design_id')->nullable()->index();
            // Path hasil generate di disk public.
            $table->string('after_image_path')->nullable();
            $table->unsignedInteger('detected_nails_count')->default(0);
            $table->decimal('gloss_intensity', 4, 2)->nullable();
            $table->decimal('nail_length_factor', 4, 2)->nullable();
            // Snapshot agar riwayat tetap terbaca walau data analisis berubah.
            $table->json('analysis_snapshot')->nullable();
            $table->json('design_snapshot')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nail_generations');
    }
};
