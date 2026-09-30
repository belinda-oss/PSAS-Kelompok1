<?php

namespace App\Http\Controllers;

use App\Models\NailDesign;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NailDesignController extends Controller
{
    /**
     * Public catalog of active nail art designs (used by the frontend catalog grid).
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = NailDesign::query()->orderBy('sort_order')->orderBy('name');

        // Default: hanya desain aktif. Admin bisa meminta semua lewat ?all=1
        if ($request->boolean('all')) {
            $query->orderByDesc('is_active');
        } else {
            $query->where('is_active', true);
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        $designs = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Katalog desain kuku berhasil dimuat.',
            'count' => $designs->count(),
            'categories' => $designs->pluck('category')->unique()->values(),
            'data' => $designs->map(fn (NailDesign $d) => $d->toApiArray())->values(),
        ]);
    }

    /**
     * Return a single design's image as base64 so the browser can forward it to the
     * AI Decorator Engine without cross-origin canvas/tainted-image problems.
     *
     * @param  string  $slug
     * @return JsonResponse
     */
    public function texture(string $slug): JsonResponse
    {
        $design = NailDesign::where('slug', $slug)->first();

        if (! $design) {
            return response()->json([
                'success' => false,
                'message' => "Desain '{$slug}' tidak ditemukan.",
            ], 404);
        }

        if (! $design->image_path) {
            return response()->json([
                'success' => false,
                'message' => "Desain '{$design->name}' belum memiliki gambar. AI akan memakai motif prosedural bawaan.",
            ], 404);
        }

        $disk = Storage::disk('public');
        if (! $disk->exists($design->image_path)) {
            return response()->json([
                'success' => false,
                'message' => "File gambar untuk desain '{$design->name}' tidak ditemukan di storage.",
            ], 404);
        }

        $bytes = $disk->get($design->image_path);
        $mime = $disk->mimeType($design->image_path) ?: 'image/png';

        return response()->json([
            'success' => true,
            'message' => 'Texture desain berhasil dimuat.',
            'data' => [
                'id' => $design->slug,
                'name' => $design->name,
                'image_url' => $design->image_url,
                'image_base64' => 'data:' . $mime . ';base64,' . base64_encode($bytes),
            ],
        ]);
    }
}
