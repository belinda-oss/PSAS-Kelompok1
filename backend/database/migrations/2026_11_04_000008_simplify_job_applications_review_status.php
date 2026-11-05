<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            // Status moderasi disederhanakan menjadi dua keadaan saja:
            // sudah ditinjau (true) atau belum ditinjau (false).
            $table->boolean('is_reviewed')->default(false)->index()->after('cover_letter');
        });

        // Pindahkan data lama: reviewed/accepted dianggap sudah ditinjau.
        DB::table('job_applications')
            ->whereIn('status', ['reviewed', 'accepted'])
            ->update(['is_reviewed' => true]);

        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->enum('status', ['pending', 'reviewed', 'accepted', 'rejected'])
                ->default('pending')
                ->index();
        });

        DB::table('job_applications')
            ->where('is_reviewed', true)
            ->update(['status' => 'reviewed']);

        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn('is_reviewed');
        });
    }
};
