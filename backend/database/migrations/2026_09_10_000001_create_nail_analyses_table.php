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
        Schema::create('nail_analyses', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->index();
            $table->string('image_path');
            $table->string('nail_bed_shape')->nullable();
            $table->string('skin_tone')->nullable();
            $table->string('nail_color')->nullable();
            $table->enum('recommendation_type', ['Nail Art', 'Press-on']);
            $table->text('design_recommendation')->nullable();
            $table->decimal('ai_match_percentage', 5, 2)->nullable();
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nail_analyses');
    }
};
