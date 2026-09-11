<?php

namespace App\Services;

use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;
use RuntimeException;

class GeminiNailAnalysisService
{
    /**
     * Gemini API model name.
     */
    protected string $model = 'gemini-3.6-flash';

    /**
     * Allowed image file extensions and mime types.
     */
    protected array $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    protected array $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    /**
     * Maximum file size in bytes (5 MB).
     */
    protected int $maxSizeBytes = 5242880;

    /**
     * Allowed recommendation_type enum values.
     */
    public const RECOMMENDATION_NAIL_ART = 'Nail Art';
    public const RECOMMENDATION_PRESS_ON = 'Press-on';

    /**
     * Analyze nail image using Gemini API.
     *
     * @param UploadedFile|string $file
     * @param int $maxRetries
     * @return array
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function analyze(UploadedFile|string $file, int $maxRetries = 3): array
    {
        // 1. Strict server-side image verification (extension, mime type, deep binary check, size)
        $this->validateImageFile($file);

        // 2. Retrieve Gemini API key
        $apiKey = config('services.gemini.key');
        if (empty($apiKey)) {
            throw new RuntimeException("Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file or config/services.php.");
        }

        $mimeType = $this->getFileMimeType($file);
        $base64Data = base64_encode($this->getFileContent($file));

        $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$apiKey}";

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        [
                            'text' => $this->getPromptText(),
                        ],
                        [
                            'inline_data' => [
                                'mime_type' => $mimeType,
                                'data' => $base64Data,
                            ],
                        ],
                    ],
                ],
            ],
            'generationConfig' => [
                'response_mime_type' => 'application/json',
            ],
        ];

        $lastExceptionMessage = null;

        // 3. Retry loop (up to maxRetries attempts)
        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                $response = Http::timeout(30)
                    ->acceptJson()
                    ->post($endpoint, $payload);

                if (!$response->successful()) {
                    $errorBody = $response->body();
                    $lastExceptionMessage = "HTTP {$response->status()} error: " . $this->sanitizeApiKey($errorBody, $apiKey);
                    continue;
                }

                $responseText = $response->json('candidates.0.content.parts.0.text') ?? $response->body();

                // 4. Clean and parse JSON response
                $parsedData = $this->cleanAndParseJson($responseText);

                if (!$parsedData || !is_array($parsedData)) {
                    $lastExceptionMessage = "Attempt {$attempt}: Failed to parse valid JSON from Gemini response.";
                    continue;
                }

                // 5. Normalize & validate recommendation_type enum
                $rawRecommendation = $parsedData['recommendation_type'] ?? null;
                $normalizedType = $this->normalizeRecommendationType($rawRecommendation);

                if (!$normalizedType) {
                    $lastExceptionMessage = "Attempt {$attempt}: Invalid recommendation_type '{$rawRecommendation}'. Expected 'Nail Art' or 'Press-on'.";
                    continue;
                }

                $parsedData['recommendation_type'] = $normalizedType;

                // Format & return structured result
                return [
                    'nail_bed_shape' => $parsedData['nail_bed_shape'] ?? null,
                    'skin_tone' => $parsedData['skin_tone'] ?? null,
                    'nail_color' => $parsedData['nail_color'] ?? null,
                    'recommendation_type' => $parsedData['recommendation_type'],
                    'design_recommendation' => $parsedData['design_recommendation'] ?? null,
                    'ai_match_percentage' => isset($parsedData['ai_match_percentage']) ? (float) $parsedData['ai_match_percentage'] : null,
                ];

            } catch (Exception $e) {
                $lastExceptionMessage = "Attempt {$attempt} failed: " . $this->sanitizeApiKey($e->getMessage(), $apiKey);
            }
        }

        // 6. Throw clear exception if failed after max retries (ensuring API Key is never leaked)
        $safeMessage = $this->sanitizeApiKey($lastExceptionMessage ?? 'Unknown error', $apiKey);
        throw new RuntimeException("Gemini Nail Analysis failed after {$maxRetries} attempts. Reason: {$safeMessage}");
    }

    /**
     * Clean markdown fence (```json ... ```) from Gemini response and decode to array.
     *
     * @param string $text
     * @return array|null
     */
    public function cleanAndParseJson(string $text): ?array
    {
        $cleaned = trim($text);

        // Strip markdown code block wrappers (e.g. ```json ... ``` or ``` ...)
        $cleaned = preg_replace('/^```(?:json)?\s*/i', '', $cleaned);
        $cleaned = preg_replace('/\s*```$/i', '', $cleaned);

        // Extract JSON object structure if surrounded by extra text
        if (preg_match('/\{.*\}/s', $cleaned, $matches)) {
            $cleaned = $matches[0];
        }

        $decoded = json_decode($cleaned, true);

        return is_array($decoded) ? $decoded : null;
    }

    /**
     * Normalize recommendation_type variations to valid enum value ('Nail Art' or 'Press-on').
     *
     * @param string|null $type
     * @return string|null
     */
    public function normalizeRecommendationType(?string $type): ?string
    {
        if (empty($type)) {
            return null;
        }

        $cleaned = strtolower(trim($type));
        $cleaned = str_replace(['_', '-'], ' ', $cleaned);

        if (in_array($cleaned, ['nail art', 'nailart', 'art'])) {
            return self::RECOMMENDATION_NAIL_ART;
        }

        if (in_array($cleaned, ['press on', 'presson', 'press'])) {
            return self::RECOMMENDATION_PRESS_ON;
        }

        return null;
    }

    /**
     * Strict server-side image verification.
     * Checks size, extension, real MIME type, and deep binary image headers (getimagesize).
     *
     * @param UploadedFile|string $file
     * @return void
     *
     * @throws InvalidArgumentException
     */
    protected function validateImageFile(UploadedFile|string $file): void
    {
        if ($file instanceof UploadedFile && !$file->isValid()) {
            throw new InvalidArgumentException("File gambar yang diunggah tidak valid.");
        }

        $filePath = $file instanceof UploadedFile ? $file->getRealPath() : $file;

        // 1. File existence & readability check
        if (!file_exists($filePath) || !is_readable($filePath)) {
            throw new InvalidArgumentException("File gambar tidak ditemukan atau tidak dapat dibaca.");
        }

        // 2. Server-side File Size Validation (Max 5 MB)
        $fileSize = filesize($filePath);
        if ($fileSize === false || $fileSize > $this->maxSizeBytes) {
            throw new InvalidArgumentException("Ukuran file gambar melebihi batas maksimum 5 MB.");
        }

        // 3. Extension check
        $originalName = $file instanceof UploadedFile ? $file->getClientOriginalName() : $filePath;
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

        if (!in_array($extension, $this->allowedExtensions, true)) {
            throw new InvalidArgumentException("Ekstensi file [{$extension}] tidak diizinkan. Format yang diperbolehkan: jpg, jpeg, png, webp.");
        }

        // 4. Strict Server MIME Type Verification via finfo
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $detectedMime = strtolower(finfo_file($finfo, $filePath) ?: '');
        finfo_close($finfo);

        if (!in_array($detectedMime, $this->allowedMimeTypes, true)) {
            throw new InvalidArgumentException("Tipe konten file [{$detectedMime}] tidak valid. Hanya file gambar asli yang diizinkan.");
        }

        // 5. Deep Binary Header Verification (getimagesize)
        // Ensures the file is genuinely an image and not a disguised executable/PHP script
        $imageInfo = @getimagesize($filePath);
        if ($imageInfo === false || !in_array($imageInfo[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) {
            throw new InvalidArgumentException("File yang diunggah sanitasinya tidak lolos sebagai gambar murni.");
        }
    }

    /**
     * Redact API Key from any error message to prevent exposure in logs or responses.
     */
    protected function sanitizeApiKey(string $message, string $apiKey): string
    {
        if (empty($apiKey)) {
            return $message;
        }

        return str_replace($apiKey, '[REDACTED_API_KEY]', $message);
    }

    /**
     * Get MIME type from UploadedFile or path string.
     */
    protected function getFileMimeType(UploadedFile|string $file): string
    {
        if ($file instanceof UploadedFile) {
            return $file->getMimeType() ?: 'image/jpeg';
        }

        return mime_content_type($file) ?: 'image/jpeg';
    }

    /**
     * Get binary content from UploadedFile or path string.
     */
    protected function getFileContent(UploadedFile|string $file): string
    {
        if ($file instanceof UploadedFile) {
            return $file->get();
        }

        return file_get_contents($file);
    }

    /**
     * Get system prompt for Gemini analysis.
     */
    protected function getPromptText(): string
    {
        return <<<'PROMPT'
You are an expert AI nail and hand analyst. Analyze the provided image and produce a structured JSON output with the exact keys described below:

- "nail_bed_shape": string (e.g. "Oval", "Square", "Almond", "Round", "Coffin", "Stiletto")
- "skin_tone": string (e.g. "Fair", "Light", "Medium", "Warm", "Deep")
- "nail_color": string (e.g. "Natural", "Nude", "Pink", "Red", "Translucent")
- "recommendation_type": string (Must be EXACTLY "Nail Art" or "Press-on")
- "design_recommendation": string (Detailed description of aesthetic recommendations based on nail shape and skin tone)
- "ai_match_percentage": number (Match confidence percentage between 0 and 100, e.g. 94.50)

Return ONLY the raw JSON object without any additional text or markdown formatting.
PROMPT;
    }
}
