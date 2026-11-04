<?php

namespace Tests\Feature;

use App\Models\NailAnalysis;
use App\Models\NailArtExample;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class NailArtGenerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_generation_is_linked_to_analysis_and_auto_matches_example(): void
    {
        Storage::fake('public');

        Storage::disk('public')->put('nail-uploads/hand.jpg', 'fake-jpeg-bytes');

        $analysis = NailAnalysis::create([
            'session_id' => 'test-session',
            'image_path' => 'nail-uploads/hand.jpg',
            'nail_bed_shape' => 'Almond',
            'skin_tone' => 'Warm Golden',
            'nail_color' => 'Nude',
            'recommendation_type' => 'Nail Art',
            'design_recommendation' => 'Korean blush jelly ombre dengan glitter halus',
            'ai_match_percentage' => 95.50,
        ]);

        $blush = NailArtExample::create([
            'slug' => 'contoh_blush_jelly',
            'name' => 'Contoh Korean Blush Jelly',
            'category' => 'Trending Korean',
            'design_id' => 'blush_jelly',
            'description' => 'Gradasi jelly pink transparan dengan glitter halus.',
            'engine' => 'YOLOv8 + MediaPipe',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        NailArtExample::create([
            'slug' => 'contoh_starry_night',
            'name' => 'Contoh Celestial Starry Night',
            'category' => 'Mystic Galaxy',
            'design_id' => 'starry_night',
            'description' => 'Nuansa biru malam dengan rasi bintang perak.',
            'engine' => 'YOLOv8 + MediaPipe',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        Http::fake([
            '*/api/v1/nail-art-decorate' => Http::response([
                'status' => 'success',
                'design' => ['id' => 'blush_jelly', 'name' => 'Korean Blush Jelly Ombre'],
                'detected_nails_count' => 5,
                'nails' => [['id' => 1]],
                'analysis' => ['skin_tone' => 'Warm Golden'],
                'before_image' => 'data:image/jpeg;base64,YmVmb3Jl',
                'after_image' => 'data:image/png;base64,YWZ0ZXI=',
            ]),
        ]);

        $response = $this->postJson('/api/nail-art-generate', [
            'nail_analysis_id' => $analysis->id,
            'nail_length_factor' => 1.1,
            'gloss_intensity' => 0.9,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.nail_analysis_id', $analysis->id)
            ->assertJsonPath('data.nail_art_example_id', $blush->id)
            ->assertJsonPath('data.design_id', 'blush_jelly');

        $this->assertDatabaseHas('nail_generations', [
            'nail_analysis_id' => $analysis->id,
            'nail_art_example_id' => $blush->id,
            'design_id' => 'blush_jelly',
            'detected_nails_count' => 5,
        ]);

        $generation = $analysis->generations()->first();
        $this->assertNotNull($generation);
        $this->assertNotNull($generation->after_image_path);
        Storage::disk('public')->assertExists($generation->after_image_path);

        Http::assertSent(function ($request) use ($blush) {
            return $request->url() === 'http://127.0.0.1:8001/api/v1/nail-art-decorate'
                && $request['design_id'] === $blush->design_id;
        });
    }

    public function test_generation_history_can_be_loaded_from_analysis(): void
    {
        Storage::fake('public');

        $analysis = NailAnalysis::create([
            'session_id' => 'test-session',
            'image_path' => 'nail-uploads/hand.jpg',
            'recommendation_type' => 'Nail Art',
        ]);

        $generation = $analysis->generations()->create([
            'design_id' => 'blush_jelly',
            'after_image_path' => 'nail-generations/result.png',
            'detected_nails_count' => 5,
        ]);

        $response = $this->getJson("/api/nail-analyses/{$analysis->id}/generations");

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('count', 1)
            ->assertJsonPath('data.0.id', $generation->id)
            ->assertJsonPath('data.0.nail_analysis_id', $analysis->id);
    }
}
