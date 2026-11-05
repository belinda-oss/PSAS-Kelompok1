<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ServiceTest extends TestCase
{
    use RefreshDatabase;

    /** PNG 1x1 transparan. */
    private const PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    private function fakeImage(string $name = 'layanan.png'): UploadedFile
    {
        return UploadedFile::fake()->createWithContent($name, base64_decode(self::PNG_BASE64));
    }

    private function actingAsAdmin(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        Sanctum::actingAs($admin);
    }

    public function test_public_endpoint_returns_empty_list_when_no_services(): void
    {
        $this->getJson('/api/services')
            ->assertOk()
            ->assertJson(['success' => true, 'count' => 0, 'data' => []]);
    }

    public function test_admin_endpoints_require_authentication(): void
    {
        $this->getJson('/api/admin/services')->assertStatus(401);
    }

    public function test_admin_full_crud_flow(): void
    {
        $this->actingAsAdmin();

        // CREATE (multipart upload -> base64 data URL)
        $created = $this->post('/api/admin/services', [
            'name' => 'Eyelash Extension',
            'price' => 'Rp 250.000',
            'description' => 'Classic lash set.',
            'image' => $this->fakeImage(),
        ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Eyelash Extension')
            ->assertJsonPath('data.is_visible', true)
            ->json('data');

        $this->assertStringStartsWith('data:image/png;base64,', $created['image']);
        $originalImage = $created['image'];
        $id = $created['id'];

        // Public endpoint shows visible service
        $this->getJson('/api/services')->assertJsonPath('count', 1);

        // UPDATE without new file keeps the previous image
        $this->post("/api/admin/services/{$id}", [
            '_method' => 'PUT',
            'name' => 'Russian Volume',
            'price' => 'Rp 300.000',
            'description' => 'Volume lash set.',
        ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Russian Volume')
            ->assertJsonPath('data.image', $originalImage);

        // PATCH toggle -> hidden from public
        $this->patchJson("/api/admin/services/{$id}", ['is_visible' => false])
            ->assertOk()
            ->assertJsonPath('data.is_visible', false);

        $this->getJson('/api/services')->assertJsonPath('count', 0);
        $this->getJson('/api/admin/services')->assertJsonPath('count', 1);

        // DELETE
        $this->deleteJson("/api/admin/services/{$id}")->assertOk();
        $this->assertDatabaseCount('services', 0);
    }

    public function test_create_requires_image_file(): void
    {
        $this->actingAsAdmin();

        $this->postJson('/api/admin/services', [
            'name' => 'Foot Spa',
            'price' => 'Rp 150.000',
            'description' => 'Relaxing foot spa.',
        ])->assertStatus(422)->assertJsonValidationErrors('image');

        $this->assertSame(0, Service::count());
    }
}
