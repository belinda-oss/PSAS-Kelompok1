<?php

namespace App\Services;

use App\Models\NailAnalysis;
use App\Models\NailArtExample;
use App\Models\NailGeneration;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class NailArtGenerationService
{
    public function __construct(
        private readonly NailArtExampleMatcher $matcher
    ) {
    }

    /**
     * Generate gambar nail art dari analisis kuku yang sudah tersimpan.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function generate(array $data): array
    {
        $analysis = isset($data['nail_analysis_id'])
            ? NailAnalysis::find($data['nail_analysis_id'])
            : null;

        $example = $this->resolveExample($data, $analysis);
        $designId = $data['design_id'] ?? $example?->design_id ?? 'blush_jelly';

        $imageBase64 = $data['image_base64'] ?? $this->imageBase64FromAnalysis($analysis);

        if (! $imageBase64) {
            throw new RuntimeException(
                'Foto tangan/kuku tidak ditemukan. Silakan unggah ulang atau jalankan analisis terlebih dahulu.'
            );
        }

        $payload = [
            'image_base64' => $imageBase64,
            'design_id' => $designId,
            'nail_length_factor' => $data['nail_length_factor'] ?? 1.0,
            'gloss_intensity' => $data['gloss_intensity'] ?? 0.85,
        ];

        $result = $this->callAiService($payload);

        $afterImage = $result['after_image'] ?? null;
        $afterImagePath = $afterImage ? $this->storeBase64Image($afterImage) : null;

        $generation = NailGeneration::create([
            'nail_analysis_id' => $analysis?->id,
            'nail_art_example_id' => $example?->id,
            'design_id' => $designId,
            'after_image_path' => $afterImagePath,
            'detected_nails_count' => (int) ($result['detected_nails_count'] ?? 0),
            'gloss_intensity' => $payload['gloss_intensity'],
            'nail_length_factor' => $payload['nail_length_factor'],
            'analysis_snapshot' => $analysis ? $this->analysisSnapshot($analysis) : null,
            'design_snapshot' => $result['design'] ?? $example?->toApiArray(),
        ]);

        return [
            'generation' => $generation->load('nailArtExample'),
            'before_image' => $result['before_image'] ?? null,
            'after_image' => $afterImage,
            'detected_nails' => $result['nails'] ?? [],
            'analysis' => $result['analysis'] ?? null,
            'design' => $result['design'] ?? $example?->toApiArray(),
        ];
    }

    /**
     * Tentukan contoh nail art yang dipakai: pilihan eksplisit, design_id,
     * atau hasil pencocokan otomatis dari analisis kuku.
     *
     * @param  array<string, mixed>  $data
     */
    private function resolveExample(array $data, ?NailAnalysis $analysis): ?NailArtExample
    {
        if (! empty($data['nail_art_example_id'])) {
            return NailArtExample::find($data['nail_art_example_id']);
        }

        if (! empty($data['design_id'])) {
            return NailArtExample::query()
                ->where('design_id', $data['design_id'])
                ->where('is_active', true)
                ->first()
                ?? NailArtExample::query()->where('design_id', $data['design_id'])->first();
        }

        return $analysis ? $this->matcher->match($analysis) : null;
    }

    /**
     * Ambil gambar yang dianalisis dari storage sebagai data URL.
     */
    private function imageBase64FromAnalysis(?NailAnalysis $analysis): ?string
    {
        if (! $analysis?->image_path) {
            return null;
        }

        $disk = Storage::disk('public');

        if (! $disk->exists($analysis->image_path)) {
            return null;
        }

        $mime = $disk->mimeType($analysis->image_path) ?: 'image/jpeg';

        return 'data:' . $mime . ';base64,' . base64_encode($disk->get($analysis->image_path));
    }

    /**
     * Panggil FastAPI AI Microservice untuk menerapkan motif nail art.
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function callAiService(array $payload): array
    {
        $baseUrl = rtrim(
            (string) config('services.ai_service.url', 'http://127.0.0.1:8001'),
            '/'
        );

        try {
            $response = Http::timeout(120)
                ->acceptJson()
                ->asForm()
                ->post($baseUrl . '/api/v1/nail-art-decorate', $payload);
        } catch (\Throwable $e) {
            throw new RuntimeException(
                'Gagal menghubungi AI Microservice: ' . $e->getMessage()
            );
        }

        if (! $response->successful()) {
            $detail = $response->json('detail')
                ?? $response->json('message')
                ?? 'AI Microservice gagal memproses gambar.';

            throw new RuntimeException($detail);
        }

        $result = $response->json();

        if (! is_array($result) || ($result['status'] ?? null) !== 'success') {
            throw new RuntimeException(
                $result['detail'] ?? 'AI Microservice mengembalikan respons yang tidak valid.'
            );
        }

        return $result;
    }

    /**
     * Simpan hasil generate (data URL base64) ke disk public.
     */
    private function storeBase64Image(string $dataUrl): ?string
    {
        if (! preg_match('/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/s', $dataUrl, $matches)) {
            return null;
        }

        $mime = $matches[1];
        $binary = base64_decode($matches[2], true);

        if ($binary === false) {
            return null;
        }

        $extension = match ($mime) {
            'image/jpeg', 'image/jpg' => 'jpg',
            'image/webp' => 'webp',
            default => 'png',
        };

        $path = 'nail-generations/' . uniqid('nail_', true) . '.' . $extension;
        Storage::disk('public')->put($path, $binary);

        return $path;
    }

    /**
     * Snapshot hasil analisis untuk riwayat generate.
     *
     * @return array<string, mixed>
     */
    private function analysisSnapshot(NailAnalysis $analysis): array
    {
        return [
            'id' => $analysis->id,
            'session_id' => $analysis->session_id,
            'image_path' => $analysis->image_path,
            'nail_bed_shape' => $analysis->nail_bed_shape,
            'skin_tone' => $analysis->skin_tone,
            'nail_color' => $analysis->nail_color,
            'recommendation_type' => $analysis->recommendation_type,
            'design_recommendation' => $analysis->design_recommendation,
            'ai_match_percentage' => $analysis->ai_match_percentage,
        ];
    }
}
