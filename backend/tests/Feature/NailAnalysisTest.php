<?php

namespace Tests\Feature;

use App\Services\GeminiNailAnalysisService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

class NailAnalysisTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /**
     * Test successful nail image upload and analysis with mocked Gemini API service.
     */
    public function test_upload_valid_image_analyzes_and_stores_data(): void
    {
        Storage::fake('public');

        // Valid 1x1 JPEG binary byte header
        $validJpgHeader = "\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00\x48\x00\x48\x00\x00\xFF\xDB\x00\x43\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\x09\x09\x08\x0A\x0C\x14\x0D\x0C\x0B\x0B\x0C\x19\x12\x13\x0F\x14\x1D\x1A\x1F\x1E\x1D\x1A\x1C\x1C\x20\x24\x2E\x27\x20\x22\x2C\x23\x1C\x1C\x28\x37\x29\x2C\x30\x31\x34\x34\x34\x1F\x27\x39\x3D\x38\x32\x3C\x2E\x33\x34\x32\xFF\xC0\x00\x0B\x08\x00\x01\x00\x01\x01\x01\x11\x00\xFF\xC4\x00\x1F\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0A\x0B\xFF\xDA\x00\x08\x01\x01\x00\x00\x3F\x00\xBF\x00\xFF\xD9";
        
        $image = UploadedFile::fake()->createWithContent('nail.jpg', $validJpgHeader);

        // Mock GeminiNailAnalysisService using instance binding
        $mockService = Mockery::mock(GeminiNailAnalysisService::class);
        $mockService->shouldReceive('analyze')
            ->once()
            ->andReturn([
                'nail_bed_shape' => 'Almond',
                'skin_tone' => 'Warm',
                'nail_color' => 'Nude',
                'recommendation_type' => 'Nail Art',
                'design_recommendation' => 'Glitter accent design',
                'ai_match_percentage' => 95.50,
            ]);

        $this->app->instance(GeminiNailAnalysisService::class, $mockService);

        $response = $this->postJson(route('nail-analysis.analyze'), [
            'image' => $image,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'nail_bed_shape' => 'Almond',
                    'skin_tone' => 'Warm',
                    'nail_color' => 'Nude',
                    'recommendation_type' => 'Nail Art',
                    'design_recommendation' => 'Glitter accent design',
                    'ai_match_percentage' => 95.50,
                ],
            ]);

        // Assert record is stored in nail_analyses table
        $this->assertDatabaseHas('nail_analyses', [
            'nail_bed_shape' => 'Almond',
            'skin_tone' => 'Warm',
            'nail_color' => 'Nude',
            'recommendation_type' => 'Nail Art',
            'ai_match_percentage' => 95.50,
        ]);
    }

    /**
     * Test uploading non-image file fails validation with HTTP 422 status.
     */
    public function test_upload_non_image_file_fails_validation(): void
    {
        Storage::fake('public');

        // Fake PDF document instead of an image
        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this->postJson(route('nail-analysis.analyze'), [
            'image' => $file,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['image']);

        // Assert database remains empty
        $this->assertDatabaseCount('nail_analyses', 0);
    }
}
