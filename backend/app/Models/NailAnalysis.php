<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NailAnalysis extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'nail_analyses';

    /**
     * The name of the "updated at" column.
     * Disable updated_at timestamp since only created_at is used.
     *
     * @var string|null
     */
    const UPDATED_AT = null;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'session_id',
        'image_path',
        'nail_bed_shape',
        'skin_tone',
        'nail_color',
        'recommendation_type',
        'design_recommendation',
        'ai_match_percentage',
        'created_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'ai_match_percentage' => 'decimal:2',
        'created_at' => 'datetime',
    ];
}
