<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;

class Review extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'reviews';

    /**
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
        'name',
        'rating',
        'comment',
        'status',
        'published_at',
        'created_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'integer',
        'created_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    /**
     * Application-level validation rules for Review model.
     *
     * @return array<string, string>
     */
    public static function validationRules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
            'status' => 'nullable|in:pending,published,rejected',
            'published_at' => 'nullable|date',
        ];
    }

    /**
     * The "booted" method of the model.
     * Enforces rating validation (1-5) at application level on model saving.
     */
    protected static function booted(): void
    {
        static::saving(function (Review $review) {
            if ($review->rating < 1 || $review->rating > 5) {
                throw new InvalidArgumentException('Rating value must be between 1 and 5.');
            }
        });
    }
}
