<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewModerationController extends Controller
{
    /**
     * List every review (pending, approved, hidden) for the admin dashboard.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status', 'all');

        $query = Review::query()->latest('created_at');

        $dbStatus = Review::toDatabaseStatus((string) $status);
        if ($dbStatus !== null) {
            $query->where('status', $dbStatus);
        }

        $reviews = $query->get();

        $counts = [
            'all' => Review::count(),
            'pending' => Review::where('status', 'pending')->count(),
            'approved' => Review::where('status', 'published')->count(),
            'hidden' => Review::where('status', 'rejected')->count(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Daftar ulasan berhasil dimuat.',
            'filter' => $status,
            'counts' => $counts,
            'count' => $reviews->count(),
            'data' => $reviews->map(fn (Review $review) => $review->toApiArray())->values(),
        ], 200);
    }

    /**
     * Update a review moderation status.
     *
     * Accepted statuses: pending, approved, hidden.
     *
     * @param  Request  $request
     * @param  Review  $review
     * @return JsonResponse
     */
    public function update(Request $request, Review $review): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,approved,hidden,published,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $dbStatus = Review::toDatabaseStatus($validator->validated()['status']);

        $review->update([
            'status' => $dbStatus,
            'published_at' => $dbStatus === 'published' ? ($review->published_at ?? now()) : null,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Ulasan dari '{$review->name}' berhasil diperbarui.",
            'data' => $review->fresh()->toApiArray(),
        ], 200);
    }

    /**
     * Delete a review permanently.
     *
     * @param  Review  $review
     * @return JsonResponse
     */
    public function destroy(Review $review): JsonResponse
    {
        $name = $review->name;
        $review->delete();

        return response()->json([
            'success' => true,
            'message' => "Ulasan dari '{$name}' telah dihapus.",
        ], 200);
    }
}
