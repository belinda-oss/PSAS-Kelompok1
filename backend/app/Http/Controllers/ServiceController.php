<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    /**
     * Daftar layanan yang tampil di website publik (is_visible = true).
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $services = Service::visible()->orderByDesc('created_at')->orderByDesc('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar layanan berhasil dimuat.',
            'count' => $services->count(),
            'data' => $services->map(fn (Service $service) => $service->toApiArray())->values(),
        ]);
    }
}
