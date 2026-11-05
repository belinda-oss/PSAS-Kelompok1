<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\JobApplicationController as AdminJobApplicationController;
use App\Http\Controllers\Admin\NailArtExampleController as AdminNailArtExampleController;
use App\Http\Controllers\Admin\NailDesignController as AdminNailDesignController;
use App\Http\Controllers\Admin\ReviewModerationController as AdminReviewModerationController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\NailAnalysisController;
use App\Http\Controllers\NailArtExampleController;
use App\Http\Controllers\NailArtGenerationController;
use App\Http\Controllers\NailDesignController;
use App\Http\Controllers\ReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public API Routes (prefix /api automatically applied)
Route::post('/nail-analysis', [NailAnalysisController::class, 'analyze'])
    ->middleware('throttle:10,1')
    ->name('api.nail-analysis.analyze');

Route::get('/reviews', [ReviewController::class, 'index'])
    ->name('api.reviews.index');

Route::post('/reviews', [ReviewController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('api.reviews.store');

/*
|--------------------------------------------------------------------------
| Nail Art Design Catalog
|--------------------------------------------------------------------------
| Sumber data tunggal untuk motif kuku. Admin mengunggah gambar desain lewat
| dashboard admin; katalog publik membacanya dari tabel `nail_designs`.
|
*/

// Katalog publik (dipakai kartu katalog di halaman Nail Art Decorator)
Route::get('/nail-designs', [NailDesignController::class, 'index'])
    ->name('api.nail-designs.index');

// Texture desain sebagai base64 agar bisa diteruskan ke AI Decorator Engine
// tanpa masalah cross-origin pada browser.
Route::get('/nail-designs/{slug}/texture', [NailDesignController::class, 'texture'])
    ->name('api.nail-designs.texture');

/*
|--------------------------------------------------------------------------
| Nail Art Generation Examples (YOLOv8 + MediaPipe)
|--------------------------------------------------------------------------
| Tabel `nail_art_examples` menyimpan gambar contoh nail art yang dipakai
| oleh engine generator kuku (YOLOv8 + MediaPipe). Admin dapat menambah,
| mengubah, menyembunyikan, dan menghapus contoh dari dashboard.
|
*/

// Katalog publik contoh nail art untuk engine generator
Route::get('/nail-art-examples', [NailArtExampleController::class, 'index'])
    ->name('api.nail-art-examples.index');

// Texture contoh sebagai base64 agar mudah diteruskan ke engine AI
Route::get('/nail-art-examples/{slug}/texture', [NailArtExampleController::class, 'texture'])
    ->name('api.nail-art-examples.texture');

/*
|--------------------------------------------------------------------------
| Nail Art Generation (linked to nail analyses)
|--------------------------------------------------------------------------
| Endpoint ini menjembatani analisis kuku (tabel `nail_analyses`) dengan
| engine generator YOLOv8 + MediaPipe. Hasil generate disimpan di tabel
| `nail_generations` dan terhubung ke analisis asalnya.
|
*/

Route::post('/nail-art-generate', [NailArtGenerationController::class, 'store'])
    ->middleware('throttle:20,1')
    ->name('api.nail-art-generate.store');

Route::get('/nail-analyses/{nailAnalysis}/generations', [NailArtGenerationController::class, 'byAnalysis'])
    ->name('api.nail-analyses.generations.index');

/*
|--------------------------------------------------------------------------
| Recruitment / Job Applications
|--------------------------------------------------------------------------
| Form "APPLY NOW" di halaman /recruit menyimpan lamaran ke tabel
| `job_applications`. Dashboard admin membaca, memoderasi status, dan
| menghapus lamaran dari endpoint /api/admin/job-applications.
|
*/

// Kirim lamaran dari halaman publik Recruit
Route::post('/job-applications', [JobApplicationController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('api.job-applications.store');

/*
|--------------------------------------------------------------------------
| Admin API
|--------------------------------------------------------------------------
| Login dibatasi (throttle) dan seluruh endpoint admin dilindungi token
| Sanctum + middleware `admin`. Frontend menyimpan token setelah login.
|
*/

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'apiLogin'])
        ->middleware('throttle:5,1')
        ->name('api.admin.login');

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/me', [AdminAuthController::class, 'apiMe'])
            ->name('api.admin.me');
        Route::post('/logout', [AdminAuthController::class, 'apiLogout'])
            ->name('api.admin.logout');
        Route::post('/change-password', [AdminAuthController::class, 'apiChangePassword'])
            ->name('api.admin.change-password');

        // CRUD desain nail art (dashboard admin)
        Route::get('/nail-designs', [AdminNailDesignController::class, 'index'])
            ->name('api.admin.nail-designs.index');
        Route::post('/nail-designs', [AdminNailDesignController::class, 'store'])
            ->name('api.admin.nail-designs.store');
        Route::put('/nail-designs/{nailDesign}', [AdminNailDesignController::class, 'update'])
            ->name('api.admin.nail-designs.update');
        Route::patch('/nail-designs/{nailDesign}', [AdminNailDesignController::class, 'toggle'])
            ->name('api.admin.nail-designs.toggle');
        Route::delete('/nail-designs/{nailDesign}', [AdminNailDesignController::class, 'destroy'])
            ->name('api.admin.nail-designs.destroy');

        // CRUD contoh nail art (dashboard admin)
        Route::get('/nail-art-examples', [AdminNailArtExampleController::class, 'index'])
            ->name('api.admin.nail-art-examples.index');
        Route::post('/nail-art-examples', [AdminNailArtExampleController::class, 'store'])
            ->name('api.admin.nail-art-examples.store');
        Route::put('/nail-art-examples/{nailArtExample}', [AdminNailArtExampleController::class, 'update'])
            ->name('api.admin.nail-art-examples.update');
        Route::patch('/nail-art-examples/{nailArtExample}', [AdminNailArtExampleController::class, 'toggle'])
            ->name('api.admin.nail-art-examples.toggle');
        Route::delete('/nail-art-examples/{nailArtExample}', [AdminNailArtExampleController::class, 'destroy'])
            ->name('api.admin.nail-art-examples.destroy');

        // Moderasi ulasan website (dashboard admin)
        Route::get('/reviews', [AdminReviewModerationController::class, 'index'])
            ->name('api.admin.reviews.index');
        Route::patch('/reviews/{review}', [AdminReviewModerationController::class, 'update'])
            ->name('api.admin.reviews.update');
        Route::delete('/reviews/{review}', [AdminReviewModerationController::class, 'destroy'])
            ->name('api.admin.reviews.destroy');

        // CRUD lamaran kerja (dashboard admin)
        Route::get('/job-applications', [AdminJobApplicationController::class, 'index'])
            ->name('api.admin.job-applications.index');
        Route::patch('/job-applications/{jobApplication}', [AdminJobApplicationController::class, 'update'])
            ->name('api.admin.job-applications.update');
        Route::delete('/job-applications/{jobApplication}', [AdminJobApplicationController::class, 'destroy'])
            ->name('api.admin.job-applications.destroy');
    });
});

Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API endpoint not found.',
    ], 404);
});
