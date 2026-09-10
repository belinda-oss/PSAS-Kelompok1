<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNailAnalysisRequest;
use App\Models\NailAnalysis;
use App\Services\GeminiNailAnalysisService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class NailAnalysisController extends Controller
{
    /**
     * Handle nail analysis request.
     *
     * @param StoreNailAnalysisRequest $request
     * @param GeminiNailAnalysisService $service
     * @return JsonResponse
     */
    public function analyze(StoreNailAnalysisRequest $request, GeminiNailAnalysisService $service): JsonResponse
    {
        try {
            $imageFile = $request->file('image');

            // 1. Store uploaded image to storage/app/public/nail-uploads
            $storedPath = $imageFile->store('nail-uploads', 'public');

            // 2. Call Gemini AI Analysis Service
            $analysisResult = $service->analyze($imageFile);

            // 3. Get anonymous session ID
            $sessionId = session()->getId();

            // 4. Save analysis result to database
            $nailAnalysis = NailAnalysis::create([
                'session_id' => $sessionId,
                'image_path' => $storedPath,
                'nail_bed_shape' => $analysisResult['nail_bed_shape'] ?? null,
                'skin_tone' => $analysisResult['skin_tone'] ?? null,
                'nail_color' => $analysisResult['nail_color'] ?? null,
                'recommendation_type' => $analysisResult['recommendation_type'],
                'design_recommendation' => $analysisResult['design_recommendation'] ?? null,
                'ai_match_percentage' => $analysisResult['ai_match_percentage'] ?? null,
            ]);

            // 5. Return JSON response for AJAX consumption
            return response()->json([
                'success' => true,
                'message' => 'Analisis kuku berhasil diproses.',
                'data' => [
                    'id' => $nailAnalysis->id,
                    'session_id' => $nailAnalysis->session_id,
                    'image_url' => Storage::url($storedPath),
                    'nail_bed_shape' => $nailAnalysis->nail_bed_shape,
                    'skin_tone' => $nailAnalysis->skin_tone,
                    'nail_color' => $nailAnalysis->nail_color,
                    'recommendation_type' => $nailAnalysis->recommendation_type,
                    'design_recommendation' => $nailAnalysis->design_recommendation,
                    'ai_match_percentage' => $nailAnalysis->ai_match_percentage,
                    'created_at' => $nailAnalysis->created_at?->toIso8601String(),
                ],
            ], 200);

        } catch (Exception $e) {
            $apiKey = config('services.gemini.key');
            $rawMsg = $e->getMessage() ?: 'Terjadi kesalahan saat memproses analisis kuku.';
            $safeMsg = !empty($apiKey) ? str_replace($apiKey, '[REDACTED_API_KEY]', $rawMsg) : $rawMsg;

            return response()->json([
                'success' => false,
                'message' => $safeMsg,
            ], 422);
        }
    }
}
