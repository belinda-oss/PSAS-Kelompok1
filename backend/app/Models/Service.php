<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

/**
 * Layanan salon Shofi Eyelash (tabel `services`).
 *
 * Kolom `image` (LONGTEXT) menyimpan gambar hasil upload sebagai data URL
 * Base64 (`data:image/jpeg;base64,...`) sehingga tidak bergantung pada
 * symlink storage maupun URL eksternal.
 */
class Service extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'services';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'price',
        'image',
        'description',
        'is_visible',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_visible' => 'boolean',
    ];

    /**
     * Hanya layanan yang ditandai "Tampil di Web".
     */
    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_visible', true);
    }

    /**
     * Ubah file upload menjadi data URL Base64 untuk disimpan di kolom `image`.
     */
    public static function imageToDataUrl(UploadedFile $file): string
    {
        $mime = $file->getMimeType() ?: 'image/jpeg';

        return 'data:' . $mime . ';base64,' . base64_encode((string) file_get_contents($file->getRealPath()));
    }

    /**
     * Shape the model for the public / admin API payloads.
     *
     * @return array<string, mixed>
     */
    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'description' => $this->description,
            'image' => $this->image,
            'is_visible' => (bool) $this->is_visible,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
