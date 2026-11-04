<?php

namespace App\Http\Controllers;

use App\Models\NailAnalysis;
use App\Services\NailArtGenerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class NailArtGenerationController extends Controller
{
    /**
     * Generate gambar nail art dan hubungkan hasilnya ke analisis kuku.
     */
    public function store(Request $request, NailArtGenerationService $service): JsonResponse
    {
        $validated = $request->validate([
            'nail_analysis_id' => 'nullable|integer|exists:nail_analyses,id',
            'nail_art_example_id' => 'nullable|integer|exists:nail_art_examples,id',
            'design_id' => 'nullable|string|max:255',
            'image_base64' => 'nullable|string',
            'nail_length_factor' => 'nullable|numeric|min:0.5|max:2',
            'gloss_intensity' => 'nullable|numeric|min:0|max:1',
        ]);

        try {
            $result = $service->generate($validated);
        } catch (RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }

        $generation = $result['generation'];

        return response()->json([
            'success' => true,
            'message' => 'Gambar nail art berhasil di-generate dan disimpan.',
            'data' => [
                'id' => $generation->id,
                'nail_analysis_id' => $generation->nail_analysis_id,
                'nail_art_example_id' => $generation->nail_art_example_id,
                'design_id' => $generation->design_id,
                'before_image' => $result['before_image'],
                'after_image' => $result['after_image'],
                'after_image_url' => $generation->after_image_url,
                'detected_nails_count' => $generation->detected_nails_count,
                'nails' => $result['detected_nails'],
                'analysis' => $result['analysis'],
                'design' => $result['design'],
                'example' => $generation->nailArtExample?->toApiArray(),
                'created_at' => $generation->created_at?->toIso8601String(),
            ],
        ], 201);
    }

    /**
     * Riwayat gambar yang di-generate dari satu analisis kuku.
     */
    public function byAnalysis(NailAnalysis $nailAnalysis): JsonResponse
    {
        $generations = $nailAnalysis->generations()
            ->with('nailArtExample')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Riwayat generate untuk analisis ini berhasil dimuat.',
            'count' => $generations->count(),
            'data' => $generations
                ->map(fn ($generation) => $generation->toApiArray())
                ->values(),
        ]);
    }
}
