<?php

namespace Tests\Feature;

use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test submitting valid review saves record with default 'pending' status.
     */
    public function test_submit_valid_review_stores_with_pending_status(): void
    {
        $payload = [
            'name' => 'Jane Doe',
            'rating' => 5,
            'comment' => 'Sangat puas dengan pelayanan nail art nya!',
        ];

        $response = $this->postJson(route('reviews.store'), $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Ulasan kamu sedang ditinjau sebelum tampil.',
            ]);

        $this->assertDatabaseHas('reviews', [
            'name' => 'Jane Doe',
            'rating' => 5,
            'comment' => 'Sangat puas dengan pelayanan nail art nya!',
            'status' => 'pending',
        ]);
    }

    /**
     * Test that pending reviews DO NOT appear on the public reviews endpoint.
     */
    public function test_pending_reviews_do_not_appear_on_public_endpoint(): void
    {
        // Create 1 pending review
        $pendingReview = Review::factory()->create([
            'name' => 'Pending User',
            'status' => 'pending',
        ]);

        $response = $this->getJson(route('reviews.index'));

        $response->assertStatus(200);

        // Assert pending review name is not present in the dataset
        $data = $response->json('data.data');
        $names = collect($data)->pluck('name');
        
        $this->assertNotContains('Pending User', $names);
    }

    /**
     * Test that published reviews DO appear on the public reviews endpoint.
     */
    public function test_published_reviews_appear_on_public_endpoint(): void
    {
        // Create 1 published review
        $publishedReview = Review::factory()->published()->create([
            'name' => 'Published Customer',
            'rating' => 5,
            'comment' => 'Layanan sangat memuaskan.',
        ]);

        $response = $this->getJson(route('reviews.index'));

        $response->assertStatus(200);

        $data = $response->json('data.data');
        $names = collect($data)->pluck('name');

        $this->assertContains('Published Customer', $names);
    }

    /**
     * Test submitting rating outside 1-5 range fails validation (HTTP 422).
     */
    public function test_submit_invalid_rating_outside_range_fails_validation(): void
    {
        // Test rating = 0 (too low)
        $responseLow = $this->postJson(route('reviews.store'), [
            'name' => 'John Doe',
            'rating' => 0,
            'comment' => 'Komentar tes rating 0',
        ]);

        $responseLow->assertStatus(422)
            ->assertJsonValidationErrors(['rating']);

        // Test rating = 6 (too high)
        $responseHigh = $this->postJson(route('reviews.store'), [
            'name' => 'John Doe',
            'rating' => 6,
            'comment' => 'Komentar tes rating 6',
        ]);

        $responseHigh->assertStatus(422)
            ->assertJsonValidationErrors(['rating']);

        $this->assertDatabaseCount('reviews', 0);
    }
}
