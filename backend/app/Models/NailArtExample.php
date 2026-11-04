<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class NailArtExample extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'nail_art_examples';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'slug',
        'name',
        'category',
        'design_id',
        'description',
        'engine',
        'image_path',
        'is_active',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Full public URL of the uploaded example image.
     *
     * @return string|null
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::url($this->image_path) : null;
    }

    /**
     * Hasil generate yang memakai contoh ini sebagai acuan motif.
     */
    public function generations(): HasMany
    {
        return $this->hasMany(NailGeneration::class, 'nail_art_example_id');
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
            'slug' => $this->slug,
            'name' => $this->name,
            'category' => $this->category,
            'design_id' => $this->design_id,
            'description' => $this->description,
            'engine' => $this->engine,
            'image_url' => $this->image_url,
            'has_image' => (bool) $this->image_path,
            'is_active' => (bool) $this->is_active,
            'sort_order' => (int) $this->sort_order,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Application-level validation rules for NailArtExample.
     *
     * @return array<string, string>
     */
    public static function validationRules(): array
    {
        return [
            'slug' => 'required|string|max:255|regex:/^[a-z0-9_]+$/',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'design_id' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'engine' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ];
    }
}
