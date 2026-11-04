<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class NailGeneration extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'nail_generations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nail_analysis_id',
        'nail_art_example_id',
        'design_id',
        'after_image_path',
        'detected_nails_count',
        'gloss_intensity',
        'nail_length_factor',
        'analysis_snapshot',
        'design_snapshot',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'detected_nails_count' => 'integer',
        'gloss_intensity' => 'float',
        'nail_length_factor' => 'float',
        'analysis_snapshot' => 'array',
        'design_snapshot' => 'array',
    ];

    /**
     * Analisis kuku yang menjadi dasar hasil generate.
     */
    public function nailAnalysis(): BelongsTo
    {
        return $this->belongsTo(NailAnalysis::class, 'nail_analysis_id');
    }

    /**
     * Contoh nail art yang dipakai sebagai acuan motif.
     */
    public function nailArtExample(): BelongsTo
    {
        return $this->belongsTo(NailArtExample::class, 'nail_art_example_id');
    }

    /**
     * Full public URL of the generated image.
     */
    public function getAfterImageUrlAttribute(): ?string
    {
        return $this->after_image_path ? Storage::url($this->after_image_path) : null;
    }

    /**
     * Shape the model for API payloads.
     *
     * @return array<string, mixed>
     */
    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'nail_analysis_id' => $this->nail_analysis_id,
            'nail_art_example_id' => $this->nail_art_example_id,
            'design_id' => $this->design_id,
            'after_image_url' => $this->after_image_url,
            'detected_nails_count' => (int) $this->detected_nails_count,
            'gloss_intensity' => $this->gloss_intensity,
            'nail_length_factor' => $this->nail_length_factor,
            'analysis_snapshot' => $this->analysis_snapshot,
            'design_snapshot' => $this->design_snapshot,
            'example' => $this->nailArtExample?->toApiArray(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
