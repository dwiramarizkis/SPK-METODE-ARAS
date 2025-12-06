<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kriteria;
use Illuminate\Support\Facades\Validator;

class KriteriaController extends Controller
{
    public function index()
    {
        $kriteria = Kriteria::orderBy('id')->get();
        return response()->json($kriteria);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_kriteria' => 'required|string|max:255',
            'bobot' => 'required|numeric|min:0|max:1',
            'jenis' => 'required|in:benefit,cost',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Auto-generate kode kriteria - cari nomor tertinggi yang ada
        $lastKriteria = Kriteria::orderBy('id', 'desc')->first();
        
        if ($lastKriteria) {
            // Extract nomor dari kode terakhir (misal: C3 -> 3)
            $lastNumber = (int) str_replace('C', '', $lastKriteria->kode_kriteria);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }
        
        $kodeKriteria = 'C' . $newNumber;

        $kriteria = Kriteria::create([
            'nama_kriteria' => $request->nama_kriteria,
            'kode_kriteria' => $kodeKriteria,
            'bobot' => $request->bobot,
            'jenis' => $request->jenis,
        ]);

        return response()->json($kriteria, 201);
    }

    public function show($id)
    {
        $kriteria = Kriteria::find($id);
        
        if (!$kriteria) {
            return response()->json(['error' => 'Kriteria tidak ditemukan'], 404);
        }
        
        return response()->json($kriteria);
    }

    public function update(Request $request, $id)
    {
        $kriteria = Kriteria::find($id);
        
        if (!$kriteria) {
            return response()->json(['error' => 'Kriteria tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_kriteria' => 'required|string|max:255',
            'bobot' => 'required|numeric|min:0|max:1',
            'jenis' => 'required|in:benefit,cost',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update tanpa mengubah kode_kriteria
        $kriteria->update([
            'nama_kriteria' => $request->nama_kriteria,
            'bobot' => $request->bobot,
            'jenis' => $request->jenis,
        ]);

        return response()->json($kriteria);
    }

    public function destroy($id)
    {
        $kriteria = Kriteria::find($id);
        
        if (!$kriteria) {
            return response()->json(['error' => 'Kriteria tidak ditemukan'], 404);
        }
        
        $kriteria->delete();

        // Reorder kode kriteria setelah delete
        $allKriteria = Kriteria::orderBy('id')->get();
        foreach ($allKriteria as $index => $item) {
            $item->kode_kriteria = 'C' . ($index + 1);
            $item->save();
        }

        return response()->json(['message' => 'Kriteria deleted successfully']);
    }
}
