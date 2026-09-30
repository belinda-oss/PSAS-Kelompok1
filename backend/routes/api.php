<?php

use App\Http\Controllers\Admin\NailDesignController as AdminNailDesignController;
use App\Http\Controllers\NailAnalysisController;
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

// CRUD dashboard admin
Route::get('/admin/nail-designs', [AdminNailDesignController::class, 'index'])
    ->name('api.admin.nail-designs.index');
Route::post('/admin/nail-designs', [AdminNailDesignController::class, 'store'])
    ->name('api.admin.nail-designs.store');
Route::put('/admin/nail-designs/{nailDesign}', [AdminNailDesignController::class, 'update'])
    ->name('api.admin.nail-designs.update');
Route::patch('/admin/nail-designs/{nailDesign}', [AdminNailDesignController::class, 'toggle'])
    ->name('api.admin.nail-designs.toggle');
Route::delete('/admin/nail-designs/{nailDesign}', [AdminNailDesignController::class, 'destroy'])
    ->name('api.admin.nail-designs.destroy');
