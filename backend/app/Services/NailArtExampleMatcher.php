<?php

namespace App\Services;

use App\Models\NailAnalysis;
use App\Models\NailArtExample;

class NailArtExampleMatcher
{
    /**
     * Preferensi tone kulit per design_id agar rekomendasi Gemini selaras
     * dengan motif yang dipakai engine YOLOv8 + MediaPipe.
     *
     * @var array<string, array<int, string>>
     */
    private const DESIGN_SKIN_TONES = [
        'blush_jelly' => ['fair', 'light', 'warm', 'cool', 'medium'],
        'french_gold' => ['semua', 'all', 'fair', 'light', 'medium', 'warm', 'deep'],
        'aurora_glaze' => ['fair', 'light', 'cool', 'rose', 'rosy'],
        'sakura_floral' => ['warm', 'golden', 'medium', 'tan'],
        'starry_night' => ['cool', 'deep', 'olive', 'dark'],
        'ruby_velvet' => ['warm', 'medium', 'deep', 'tan', 'dark'],
        'cute_doodle' => ['semua', 'all', 'fair', 'light', 'medium', 'warm', 'cool'],
        'rose_foil' => ['warm', 'golden', 'tan', 'medium'],
    ];

    /**
     * Pilih contoh nail art yang paling cocok dengan hasil analisis kuku.
     */
    public function match(NailAnalysis $analysis): ?NailArtExample
    {
        $examples = NailArtExample::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        if ($examples->isEmpty()) {
            return null;
        }

        $haystack = $this->normalize(implode(' ', array_filter([
            $analysis->design_recommendation,
            $analysis->nail_color,
            $analysis->nail_bed_shape,
            $analysis->recommendation_type,
            $analysis->skin_tone,
        ])));

        $skinTone = $this->normalize($analysis->skin_tone);
        $best = $examples->first();
        $bestScore = -1;

        foreach ($examples as $example) {
            $score = $this->scoreExample($example, $haystack, $skinTone);

            if ($score > $bestScore) {
                $bestScore = $score;
                $best = $example;
            }
        }

        return $best;
    }

    /**
     * Hitung skor kecocokan satu contoh terhadap hasil analisis.
     */
    private function scoreExample(NailArtExample $example, string $haystack, string $skinTone): int
    {
        $score = 0;

        $designId = $this->normalize($example->design_id);
        $designTokens = $this->tokens($designId);

        if ($designId !== '' && str_contains($haystack, $designId)) {
            $score += 8;
        }

        foreach ($designTokens as $token) {
            if (str_contains($haystack, $token)) {
                $score += 3;
            }
        }

        foreach ($this->tokens($this->normalize($example->name)) as $token) {
            if (str_contains($haystack, $token)) {
                $score += 2;
            }
        }

        foreach ($this->tokens($this->normalize($example->category)) as $token) {
            if (str_contains($haystack, $token)) {
                $score += 2;
            }
        }

        foreach ($this->tokens($this->normalize($example->description)) as $token) {
            if (str_contains($haystack, $token)) {
                $score += 1;
            }
        }

        foreach (self::DESIGN_SKIN_TONES[$example->design_id] ?? [] as $tone) {
            if ($skinTone !== '' && str_contains($skinTone, $tone)) {
                $score += 4;
                break;
            }
        }

        return $score;
    }

    /**
     * Pecah teks menjadi token bermakna untuk pencocokan kata kunci.
     *
     * @return array<int, string>
     */
    private function tokens(string $value): array
    {
        $tokens = preg_split('/[\s_]+/', $value) ?: [];

        return array_values(array_unique(array_filter(
            $tokens,
            fn (string $token) => strlen($token) > 3
        )));
    }

    /**
     * Normalisasi teks agar pencocokan tidak sensitif terhadap tanda baca.
     */
    private function normalize(?string $value): string
    {
        $value = strtolower((string) $value);
        $value = str_replace(
            ['é', 'è', 'ê', 'á', 'à', 'ä', 'ö', 'ü', 'ñ'],
            ['e', 'e', 'e', 'a', 'a', 'a', 'o', 'u', 'n'],
            $value
        );

        return preg_replace('/[^a-z0-9\s]+/', ' ', $value) ?? '';
    }
}
