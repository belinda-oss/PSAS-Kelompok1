<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of published reviews as JSON.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $reviews = Review::where('status', 'published')
            ->latest('created_at')
            ->simplePaginate(6);

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ], 200);
    }

    /**
     * Store a newly created review with default 'pending' status as JSON.
     *
     * @param StoreReviewRequest $request
     * @return JsonResponse
     */
    public function store(StoreReviewRequest $request): JsonResponse
    {
        // Sanitize input to prevent XSS attacks (strip HTML tags & escape special chars)
        $cleanName = htmlspecialchars(strip_tags(trim($request->name)), ENT_QUOTES, 'UTF-8');
        $cleanComment = htmlspecialchars(strip_tags(trim($request->comment)), ENT_QUOTES, 'UTF-8');

        $review = Review::create([
            'name' => $cleanName,
            'rating' => (int) $request->rating,
            'comment' => $cleanComment,
            'status' => 'pending',
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ulasan kamu sedang ditinjau sebelum tampil.',
            'data' => $review,
        ], 201);
    }
}
