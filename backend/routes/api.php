<?php

use App\Http\Controllers\NailAnalysisController;
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
