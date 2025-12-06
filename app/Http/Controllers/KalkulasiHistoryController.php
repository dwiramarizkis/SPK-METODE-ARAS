<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KalkulasiHistory;
use Illuminate\Support\Facades\Validator;

class KalkulasiHistoryController extends Controller
{
    public function index()
    {
        // Get history for current user (you can get user_id from session/auth)
        // For now, we'll get all history
        $history = KalkulasiHistory::with('user')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($history);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_kalkulasi' => 'required|string|max:255',
            'data_alternatif' => 'required|array',
            'data_kriteria' => 'required|array',
            'hasil_perhitungan' => 'required|array',
            'proses_perhitungan' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Get user_id from localStorage (passed from frontend)
        $userId = $request->input('user_id', 1); // Default to 1 if not provided

        $history = KalkulasiHistory::create([
            'user_id' => $userId,
            'nama_kalkulasi' => $request->nama_kalkulasi,
            'data_alternatif' => $request->data_alternatif,
            'data_kriteria' => $request->data_kriteria,
            'hasil_perhitungan' => $request->hasil_perhitungan,
            'proses_perhitungan' => $request->proses_perhitungan,
        ]);

        return response()->json($history, 201);
    }

    public function show($id)
    {
        $history = KalkulasiHistory::with('user')->findOrFail($id);
        return response()->json($history);
    }

    public function destroy($id)
    {
        $history = KalkulasiHistory::findOrFail($id);
        $history->delete();
        
        return response()->json(['message' => 'History deleted successfully']);
    }
}
