<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'job_applications';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'position',
        'experience',
        'portfolio_url',
        'cover_letter',
        'is_reviewed',
        'admin_notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_reviewed' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Shape the model for the public / admin API payloads.
     *
     * @return array<string, mixed>
     */
    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'position' => $this->position,
            'experience' => $this->experience,
            'portfolio_url' => $this->portfolio_url,
            'cover_letter' => $this->cover_letter,
            'is_reviewed' => (bool) $this->is_reviewed,
            'review_label' => $this->is_reviewed ? 'Sudah Ditinjau' : 'Belum Ditinjau',
            'admin_notes' => $this->admin_notes,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Application-level validation rules for a new job application.
     *
     * @return array<string, string>
     */
    public static function validationRules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'position' => 'required|string|max:255',
            'experience' => 'nullable|string|max:255',
            'portfolio_url' => 'nullable|url|max:2048',
            'cover_letter' => 'nullable|string|max:5000',
        ];
    }
}
