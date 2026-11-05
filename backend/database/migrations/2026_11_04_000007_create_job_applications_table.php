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
        Schema::create('job_applications', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 50);
            $table->string('position');
            $table->string('experience')->nullable();
            $table->string('portfolio_url', 2048)->nullable();
            $table->text('cover_letter')->nullable();
            // Alur moderasi rekrutmen oleh admin: pending -> reviewed -> accepted/rejected
            $table->enum('status', ['pending', 'reviewed', 'accepted', 'rejected'])
                ->default('pending')
                ->index();
            // Catatan internal admin (tidak tampil di halaman publik).
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
