<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\ReviewModerationController;
use App\Http\Controllers\NailAnalysisController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes (API-Only Decoupled Backend)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'PSAS Kelompok 1 Backend API is running.',
        'version' => '1.0.0',
    ], 200);
});

// Public API Routes
Route::post('/nail-analysis', [NailAnalysisController::class, 'analyze'])
    ->middleware(['web', 'throttle:10,1'])
    ->name('nail-analysis.analyze');

Route::get('/reviews', [ReviewController::class, 'index'])
    ->middleware('web')
    ->name('reviews.index');

Route::post('/reviews', [ReviewController::class, 'store'])
    ->middleware(['web', 'throttle:10,1'])
    ->name('reviews.store');

// Admin Auth Routes (Unprotected)
Route::middleware(['web'])->prefix('admin')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('admin.login.submit');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
});

// Protected Admin Review Moderation Routes Group
Route::middleware(['web', 'auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/reviews', [ReviewModerationController::class, 'index'])->name('reviews.index');
    Route::post('/reviews/{id}/publish', [ReviewModerationController::class, 'publish'])->name('reviews.publish');
    Route::post('/reviews/{id}/reject', [ReviewModerationController::class, 'reject'])->name('reviews.reject');
});

Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API endpoint not found.',
    ], 404);
});
