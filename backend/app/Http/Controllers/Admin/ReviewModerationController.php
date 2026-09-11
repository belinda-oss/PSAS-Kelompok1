<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewModerationController extends Controller
{
    /**
     * Display listing of reviews for moderation with status filter as JSON.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status', 'all');

        $query = Review::query()->latest('created_at');

        if (in_array($status, ['pending', 'published', 'rejected'], true)) {
            $query->where('status', $status);
        }

        $reviews = $query->paginate(15)->withQueryString();

        $counts = [
            'all' => Review::count(),
            'pending' => Review::where('status', 'pending')->count(),
            'published' => Review::where('status', 'published')->count(),
            'rejected' => Review::where('status', 'rejected')->count(),
        ];

        return response()->json([
            'success' => true,
            'filter' => $status,
            'counts' => $counts,
            'data' => $reviews,
        ], 200);
    }

    /**
     * Publish review and set published_at timestamp.
     *
     * @param int|string $id
     * @return JsonResponse
     */
    public function publish($id): JsonResponse
    {
        $review = Review::findOrFail($id);

        $review->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Ulasan dari '{$review->name}' telah berhasil diterbitkan.",
            'data' => $review,
        ], 200);
    }

    /**
     * Reject review.
     *
     * @param int|string $id
     * @return JsonResponse
     */
    public function reject($id): JsonResponse
    {
        $review = Review::findOrFail($id);

        $review->update([
            'status' => 'rejected',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Ulasan dari '{$review->name}' telah ditolak.",
            'data' => $review,
        ], 200);
    }
}
