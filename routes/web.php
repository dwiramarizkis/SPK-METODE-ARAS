<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KriteriaController;
use App\Http\Controllers\KalkulasiHistoryController;

// SPA Catch-all route - must be at the end
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

// API Routes
Route::prefix('api')->group(function () {
    Route::get('/kriteria', [KriteriaController::class, 'index']);
    Route::post('/kriteria', [KriteriaController::class, 'store']);
    Route::get('/kriteria/{id}', [KriteriaController::class, 'show']);
    Route::put('/kriteria/{id}', [KriteriaController::class, 'update']);
    Route::delete('/kriteria/{id}', [KriteriaController::class, 'destroy']);
    
    Route::get('/alternatif', function() {
        return response()->json(\App\Models\Alternatif::with('nilaiAlternatif')->get()->map(function($alt) {
            return [
                'id' => $alt->id,
                'kode_alternatif' => $alt->kode_alternatif,
                'nama_alternatif' => $alt->nama_alternatif,
                'nilai' => $alt->nilaiAlternatif->pluck('nilai', 'kriteria_id')->toArray()
            ];
        }));
    });
    
    // Kalkulasi History Routes
    Route::get('/history', [KalkulasiHistoryController::class, 'index']);
    Route::post('/history', [KalkulasiHistoryController::class, 'store']);
    Route::get('/history/{id}', [KalkulasiHistoryController::class, 'show']);
    Route::delete('/history/{id}', [KalkulasiHistoryController::class, 'destroy']);
});
