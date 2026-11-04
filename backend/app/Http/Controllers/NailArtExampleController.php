<?php

namespace App\Http\Controllers;

use App\Models\NailArtExample;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NailArtExampleController extends Controller
{
    /**
     * Public catalog of active nail art examples used by the AI generator.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = NailArtExample::query()->orderBy('sort_order')->orderBy('name');

        if ($request->boolean('all')) {
            $query->orderByDesc('is_active');
        } else {
            $query->where('is_active', true);
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        if ($designId = $request->query('design_id')) {
            $query->where('design_id', $designId);
        }

        $examples = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Katalog contoh nail art berhasil dimuat.',
            'count' => $examples->count(),
            'categories' => $examples->pluck('category')->unique()->values(),
            'data' => $examples->map(fn (NailArtExample $example) => $example->toApiArray())->values(),
        ]);
    }

    /**
     * Return a single example image as base64 so the AI generator can consume
     * the texture without cross-origin canvas problems.
     *
     * @param  string  $slug
     * @return JsonResponse
     */
    public function texture(string $slug): JsonResponse
    {
        $example = NailArtExample::where('slug', $slug)->first();

        if (! $example) {
            return response()->json([
                'success' => false,
                'message' => "Contoh nail art '{$slug}' tidak ditemukan.",
            ], 404);
        }

        if (! $example->image_path) {
            return response()->json([
                'success' => false,
                'message' => "Contoh '{$example->name}' belum memiliki gambar.",
            ], 404);
        }

        $disk = Storage::disk('public');
        if (! $disk->exists($example->image_path)) {
            return response()->json([
                'success' => false,
                'message' => "File gambar untuk contoh '{$example->name}' tidak ditemukan di storage.",
            ], 404);
        }

        $bytes = $disk->get($example->image_path);
        $mime = $disk->mimeType($example->image_path) ?: 'image/png';

        return response()->json([
            'success' => true,
            'message' => 'Texture contoh nail art berhasil dimuat.',
            'data' => [
                'id' => $example->slug,
                'name' => $example->name,
                'design_id' => $example->design_id,
                'image_url' => $example->image_url,
                'image_base64' => 'data:' . $mime . ';base64,' . base64_encode($bytes),
            ],
        ]);
    }
}
