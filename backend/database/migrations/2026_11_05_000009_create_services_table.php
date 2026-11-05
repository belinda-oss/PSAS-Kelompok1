<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel `services` untuk katalog layanan Shofi Eyelash.
     *
     * Dijaga dengan hasTable() karena tabel ini sudah dibuat langsung di
     * database pada beberapa environment. Tidak ada seeding data dummy.
     */
    public function up(): void
    {
        if (Schema::hasTable('services')) {
            return;
        }

        Schema::create('services', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 255);
            $table->string('price', 100);
            $table->longText('image'); // data URL Base64 hasil upload
            $table->text('description');
            $table->boolean('is_visible')->default(true);
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
