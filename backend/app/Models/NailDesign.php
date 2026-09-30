<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class NailDesign extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'nail_designs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'slug',
        'name',
        'category',
        'tag',
        'description',
        'swatch_color',
        'finish',
        'recommended_skin_tone',
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
     * Full public URL of the uploaded design image (null when admin belum mengunggah).
     *
     * @return string|null
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::url($this->image_path) : null;
    }

    /**
     * Shape the model for the public / admin API payloads.
     *
     * The frontend catalog expects the same keys the AI Decorator Engine uses,
     * so `id` mirrors `slug` (that is what gets posted as design_id).
     *
     * @return array<string, mixed>
     */
    public function toApiArray(): array
    {
        return [
            'id' => $this->slug,
            'slug' => $this->slug,
            'name' => $this->name,
            'category' => $this->category,
            'tag' => $this->tag,
            'description' => $this->description,
            'swatch_color' => $this->swatch_color,
            'finish' => $this->finish,
            'recommended_skin_tone' => $this->recommended_skin_tone,
            'image_url' => $this->image_url,
            'has_image' => (bool) $this->image_path,
            'is_active' => (bool) $this->is_active,
            'sort_order' => (int) $this->sort_order,
        ];
    }

    /**
     * Application-level validation rules for NailDesign model.
     *
     * The slug unique-check is appended by the controller because it needs the
     * id of the record being updated (which only exists at request time).
     *
     * @return array<string, string>
     */
    public static function validationRules(): array
    {
        return [
            'slug' => 'required|string|max:255|regex:/^[a-z0-9_]+$/',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'tag' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'swatch_color' => 'nullable|string|max:32',
            'finish' => 'nullable|string|max:255',
            'recommended_skin_tone' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ];
    }
}
