<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobApplicationController extends Controller
{
    /**
     * Terima lamaran kerja baru dari halaman Recruit.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make(
            $request->all(),
            JobApplication::validationRules(),
            [],
            [
                'full_name' => 'nama lengkap',
                'email' => 'email',
                'phone' => 'nomor WhatsApp',
                'position' => 'posisi',
                'portfolio_url' => 'tautan portofolio',
                'cover_letter' => 'pesan singkat',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Sanitasi teks bebas agar aman ditampilkan di dashboard admin.
        $data['full_name'] = htmlspecialchars(strip_tags(trim($data['full_name'])), ENT_QUOTES, 'UTF-8');
        $data['phone'] = htmlspecialchars(strip_tags(trim($data['phone'])), ENT_QUOTES, 'UTF-8');
        $data['position'] = htmlspecialchars(strip_tags(trim($data['position'])), ENT_QUOTES, 'UTF-8');
        $data['experience'] = isset($data['experience'])
            ? htmlspecialchars(strip_tags(trim($data['experience'])), ENT_QUOTES, 'UTF-8')
            : null;
        $data['cover_letter'] = isset($data['cover_letter'])
            ? htmlspecialchars(strip_tags(trim($data['cover_letter'])), ENT_QUOTES, 'UTF-8')
            : null;
        $data['is_reviewed'] = false;

        $application = JobApplication::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Lamaran kamu berhasil dikirim. Tim HRD akan meninjau kualifikasi kamu.',
            'data' => $application->toApiArray(),
        ], 201);
    }
}
