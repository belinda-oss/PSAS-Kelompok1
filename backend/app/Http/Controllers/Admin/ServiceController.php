<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    /** Batas ukuran gambar: 4 MB. */
    private const MAX_KB = 4096;

    /** Atribut tampilan untuk pesan validasi. */
    private const ATTRIBUTES = [
        'name' => 'nama layanan',
        'price' => 'harga',
        'description' => 'deskripsi layanan',
        'image' => 'gambar layanan',
    ];

    /**
     * Semua layanan (tampil + disembunyikan) untuk dashboard admin.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $services = Service::orderByDesc('created_at')->orderByDesc('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar layanan berhasil dimuat.',
            'count' => $services->count(),
            'data' => $services->map(fn (Service $service) => $service->toApiArray())->values(),
        ]);
    }

    /**
     * Simpan layanan baru. Gambar wajib diunggah (multipart/form-data).
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|string|max:100',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp,gif|max:' . self::MAX_KB,
            'is_visible' => 'sometimes|boolean',
        ], [], self::ATTRIBUTES);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $service = Service::create([
            'name' => $request->input('name'),
            'price' => $request->input('price'),
            'description' => $request->input('description'),
            'image' => Service::imageToDataUrl($request->file('image')),
            'is_visible' => $request->boolean('is_visible', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Layanan '{$service->name}' berhasil ditambahkan.",
            'data' => $service->fresh()->toApiArray(),
        ], 201);
    }

    /**
     * Perbarui layanan. Gambar opsional — bila tidak diunggah, gambar lama
     * dipertahankan.
     *
     * @param  Request  $request
     * @param  Service  $service
     * @return JsonResponse
     */
    public function update(Request $request, Service $service): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|string|max:100',
            'description' => 'sometimes|required|string',
            'image' => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp,gif|max:' . self::MAX_KB,
            'is_visible' => 'sometimes|boolean',
        ], [], self::ATTRIBUTES);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $data = $request->only(['name', 'price', 'description']);

        if ($request->has('is_visible')) {
            $data['is_visible'] = $request->boolean('is_visible');
        }

        if ($request->hasFile('image')) {
            $data['image'] = Service::imageToDataUrl($request->file('image'));
        }

        $service->update($data);
        $service->refresh();

        return response()->json([
            'success' => true,
            'message' => "Layanan '{$service->name}' berhasil diperbarui.",
            'data' => $service->toApiArray(),
        ]);
    }

    /**
     * Toggle "Tampil di Web" / "Sembunyikan". Bila `is_visible` dikirim,
     * nilainya dipakai; jika tidak, status dibalik.
     *
     * @param  Request  $request
     * @param  Service  $service
     * @return JsonResponse
     */
    public function toggle(Request $request, Service $service): JsonResponse
    {
        $service->is_visible = $request->has('is_visible')
            ? $request->boolean('is_visible')
            : ! $service->is_visible;
        $service->save();

        return response()->json([
            'success' => true,
            'message' => $service->is_visible
                ? "Layanan '{$service->name}' kini tampil di website publik."
                : "Layanan '{$service->name}' disembunyikan dari website publik.",
            'data' => $service->toApiArray(),
        ]);
    }

    /**
     * Hapus layanan.
     *
     * @param  Service  $service
     * @return JsonResponse
     */
    public function destroy(Service $service): JsonResponse
    {
        $name = $service->name;
        $service->delete();

        return response()->json([
            'success' => true,
            'message' => "Layanan '{$name}' telah dihapus.",
        ]);
    }

    /**
     * Format standar respons validasi gagal.
     *
     * @param  mixed  $errors
     */
    private function validationError($errors): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $errors->first() ?: 'Validasi gagal.',
            'errors' => $errors,
        ], 422);
    }
}
