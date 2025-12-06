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

        // Auto-generate kode kriteria
        $count = Kriteria::count();
        $kodeKriteria = 'C' . ($count + 1);

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
        $kriteria = Kriteria::findOrFail($id);
        return response()->json($kriteria);
    }

    public function update(Request $request, $id)
    {
        $kriteria = Kriteria::findOrFail($id);

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
        $kriteria = Kriteria::findOrFail($id);
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
