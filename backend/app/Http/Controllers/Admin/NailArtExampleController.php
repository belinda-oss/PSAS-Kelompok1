<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NailArtExample;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class NailArtExampleController extends Controller
{
    /** Folder tujuan upload di disk public. */
    private const UPLOAD_DIR = 'nail-art-examples';

    /** Batas ukuran gambar: 4 MB. */
    private const MAX_KB = 4096;

    /**
     * List every nail art example (aktif + nonaktif) untuk dashboard admin.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $examples = NailArtExample::orderBy('sort_order')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar contoh nail art berhasil dimuat.',
            'count' => $examples->count(),
            'data' => $examples->map(fn (NailArtExample $example) => $example->toApiArray())->values(),
        ]);
    }

    /**
     * Simpan contoh nail art baru beserta gambarnya.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $rules = NailArtExample::validationRules();
        $rules['slug'] .= '|unique:nail_art_examples,slug';
        $rules['image'] = 'nullable|image|mimes:jpg,jpeg,png,webp|max:' . self::MAX_KB;

        $validator = Validator::make(
            $request->all(),
            $rules,
            [],
            ['image' => 'gambar contoh nail art']
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store(self::UPLOAD_DIR, 'public');
        }

        $data['engine'] = $data['engine'] ?? 'YOLOv8 + MediaPipe';
        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = (int) $request->input('sort_order', 0);

        $example = NailArtExample::create($data);

        return response()->json([
            'success' => true,
            'message' => "Contoh nail art '{$example->name}' berhasil ditambahkan.",
            'data' => $example->toApiArray(),
        ], 201);
    }

    /**
     * Perbarui contoh nail art. File gambar opsional — bila tidak diunggah,
     * gambar lama dipertahankan.
     *
     * @param  Request  $request
     * @param  NailArtExample  $nailArtExample
     * @return JsonResponse
     */
    public function update(Request $request, NailArtExample $nailArtExample): JsonResponse
    {
        $rules = [
            'slug' => 'sometimes|required|string|max:255|regex:/^[a-z0-9_]+$/|unique:nail_art_examples,slug,' . $nailArtExample->id,
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'design_id' => 'sometimes|nullable|string|max:255',
            'description' => 'sometimes|nullable|string',
            'engine' => 'sometimes|nullable|string|max:255',
            'image' => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp|max:' . self::MAX_KB,
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
        ];

        $validator = Validator::make($request->all(), $rules, [], ['image' => 'gambar contoh nail art']);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            $this->deleteOldImage($nailArtExample);
            $data['image_path'] = $request->file('image')->store(self::UPLOAD_DIR, 'public');
        }

        $nailArtExample->update($data);

        return response()->json([
            'success' => true,
            'message' => "Contoh nail art '{$nailArtExample->fresh()->name}' berhasil diperbarui.",
            'data' => $nailArtExample->fresh()->toApiArray(),
        ]);
    }

    /**
     * Aktifkan / nonaktifkan tampilan contoh di katalog publik.
     *
     * @param  Request  $request
     * @param  NailArtExample  $nailArtExample
     * @return JsonResponse
     */
    public function toggle(Request $request, NailArtExample $nailArtExample): JsonResponse
    {
        $nailArtExample->is_active = $request->boolean('is_active', ! $nailArtExample->is_active);
        $nailArtExample->save();

        return response()->json([
            'success' => true,
            'message' => $nailArtExample->is_active
                ? "Contoh '{$nailArtExample->name}' kini tampil di katalog publik."
                : "Contoh '{$nailArtExample->name}' disembunyikan dari katalog publik.",
            'data' => $nailArtExample->toApiArray(),
        ]);
    }

    /**
     * Hapus contoh nail art beserta file gambarnya.
     *
     * @param  NailArtExample  $nailArtExample
     * @return JsonResponse
     */
    public function destroy(NailArtExample $nailArtExample): JsonResponse
    {
        $name = $nailArtExample->name;
        $this->deleteOldImage($nailArtExample);
        $nailArtExample->delete();

        return response()->json([
            'success' => true,
            'message' => "Contoh nail art '{$name}' telah dihapus.",
        ]);
    }

    /**
     * Hapus file gambar lama dari disk public bila ada.
     */
    private function deleteOldImage(NailArtExample $example): void
    {
        if ($example->image_path && Storage::disk('public')->exists($example->image_path)) {
            Storage::disk('public')->delete($example->image_path);
        }
    }
}
