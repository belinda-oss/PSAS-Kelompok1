<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NailDesign;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class NailDesignController extends Controller
{
    /** Folder tujuan upload di disk public. */
    private const UPLOAD_DIR = 'nail-designs';

    /** Batas ukuran gambar: 4 MB. */
    private const MAX_KB = 4096;

    /**
     * List every design (aktif + nonaktif) untuk dashboard admin.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $designs = NailDesign::orderBy('sort_order')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar desain kuku berhasil dimuat.',
            'count' => $designs->count(),
            'data' => $designs->map(fn (NailDesign $d) => $d->toApiArray())->values(),
        ]);
    }

    /**
     * Simpan desain baru beserta gambarnya.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $rules = NailDesign::validationRules();
        $rules['slug'] .= '|unique:nail_designs,slug';
        // Single source of truth untuk batas ukuran upload.
        $rules['image'] = 'nullable|image|mimes:jpg,jpeg,png,webp|max:' . self::MAX_KB;

        $validator = Validator::make(
            $request->all(),
            $rules,
            [],
            ['image' => 'gambar desain']
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

        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = (int) $request->input('sort_order', 0);

        $design = NailDesign::create($data);

        return response()->json([
            'success' => true,
            'message' => "Desain '{$design->name}' berhasil ditambahkan.",
            'data' => $design->toApiArray(),
        ], 201);
    }

    /**
     * Perbarui desain yang sudah ada. File gambar bersifat opsional —
     * bila tidak diunggah, gambar lama dipertahankan.
     *
     * @param  Request  $request
     * @param  NailDesign  $nailDesign
     * @return JsonResponse
     */
    public function update(Request $request, NailDesign $nailDesign): JsonResponse
    {
        $rules = [
            'slug' => 'sometimes|required|string|max:255|regex:/^[a-z0-9_]+$/|unique:nail_designs,slug,' . $nailDesign->id,
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'tag' => 'sometimes|nullable|string|max:255',
            'description' => 'sometimes|nullable|string',
            'swatch_color' => 'sometimes|nullable|string|max:32',
            'finish' => 'sometimes|nullable|string|max:255',
            'recommended_skin_tone' => 'sometimes|nullable|string|max:255',
            'image' => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp|max:' . self::MAX_KB,
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
        ];

        $validator = Validator::make($request->all(), $rules, [], ['image' => 'gambar desain']);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            $this->deleteOldImage($nailDesign);
            $data['image_path'] = $request->file('image')->store(self::UPLOAD_DIR, 'public');
        }

        $nailDesign->update($data);

        return response()->json([
            'success' => true,
            'message' => "Desain '{$nailDesign->fresh()->name}' berhasil diperbarui.",
            'data' => $nailDesign->fresh()->toApiArray(),
        ]);
    }

    /**
     * Aktifkan / nonaktifkan tampilan desain di katalog publik.
     *
     * @param  Request  $request
     * @param  NailDesign  $nailDesign
     * @return JsonResponse
     */
    public function toggle(Request $request, NailDesign $nailDesign): JsonResponse
    {
        $nailDesign->is_active = $request->boolean('is_active', ! $nailDesign->is_active);
        $nailDesign->save();

        return response()->json([
            'success' => true,
            'message' => $nailDesign->is_active
                ? "Desain '{$nailDesign->name}' kini tampil di katalog publik."
                : "Desain '{$nailDesign->name}' disembunyikan dari katalog publik.",
            'data' => $nailDesign->toApiArray(),
        ]);
    }

    /**
     * Hapus desain beserta file gambarnya.
     *
     * @param  NailDesign  $nailDesign
     * @return JsonResponse
     */
    public function destroy(NailDesign $nailDesign): JsonResponse
    {
        $name = $nailDesign->name;
        $this->deleteOldImage($nailDesign);
        $nailDesign->delete();

        return response()->json([
            'success' => true,
            'message' => "Desain '{$name}' telah dihapus.",
        ]);
    }

    /**
     * Hapus file gambar lama dari disk public bila ada.
     */
    private function deleteOldImage(NailDesign $design): void
    {
        if ($design->image_path && Storage::disk('public')->exists($design->image_path)) {
            Storage::disk('public')->delete($design->image_path);
        }
    }
}
