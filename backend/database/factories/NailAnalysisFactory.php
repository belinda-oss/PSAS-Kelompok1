<?php

namespace Database\Factories;

use App\Models\NailAnalysis;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NailAnalysis>
 */
class NailAnalysisFactory extends Factory
{
    protected $model = NailAnalysis::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'session_id' => Str::random(40),
            'image_path' => 'nail-uploads/sample_' . Str::random(8) . '.jpg',
            'nail_bed_shape' => fake()->randomElement(['Oval', 'Square', 'Almond', 'Round', 'Coffin']),
            'skin_tone' => fake()->randomElement(['Fair', 'Light', 'Medium', 'Warm', 'Deep']),
            'nail_color' => fake()->randomElement(['Natural', 'Nude', 'Pink', 'Red']),
            'recommendation_type' => fake()->randomElement(['Nail Art', 'Press-on']),
            'design_recommendation' => fake()->sentence(10),
            'ai_match_percentage' => fake()->randomFloat(2, 70, 99),
            'created_at' => now(),
        ];
    }
}
