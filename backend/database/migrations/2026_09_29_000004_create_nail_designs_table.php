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
        Schema::create('nail_designs', function (Blueprint $table) {
            $table->id();
            // Slug dipakai sebagai design_id oleh AI Decorator Engine (mis. "sakura_floral")
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('category');
            $table->string('tag')->nullable();
            $table->text('description')->nullable();
            // Warna swatch untuk kartu katalog (hex, mis. "#fda4af")
            $table->string('swatch_color', 32)->nullable();
            $table->string('finish')->nullable();
            $table->string('recommended_skin_tone')->nullable();
            // Path relatif di disk public, mis. "nail-designs/abc123.png"
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
        Schema::dropIfExists('nail_designs');
    }
};
