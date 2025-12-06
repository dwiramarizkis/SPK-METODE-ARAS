<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Alternatif;
use App\Models\NilaiAlternatif;
use App\Models\Kriteria;

class AlternatifSeeder extends Seeder
{
    public function run(): void
    {
        $alternatif = [
            ['kode_alternatif' => 'A1', 'nama_alternatif' => 'Perumahan Griya Asri'],
            ['kode_alternatif' => 'A2', 'nama_alternatif' => 'Perumahan Bumi Indah'],
            ['kode_alternatif' => 'A3', 'nama_alternatif' => 'Perumahan Citra Raya'],
            ['kode_alternatif' => 'A4', 'nama_alternatif' => 'Perumahan Duta Mas'],
            ['kode_alternatif' => 'A5', 'nama_alternatif' => 'Perumahan Elang Residence'],
        ];

        foreach ($alternatif as $alt) {
            Alternatif::create($alt);
        }

        // Nilai untuk setiap alternatif (C1: Jarak, C2: Fasilitas, C3: Keamanan, C4: Harga)
        $nilai = [
            // A1: Griya Asri
            ['alternatif_id' => 1, 'kriteria_id' => 1, 'nilai' => 5],   // Jarak 5km
            ['alternatif_id' => 1, 'kriteria_id' => 2, 'nilai' => 8],   // Fasilitas 8/10
            ['alternatif_id' => 1, 'kriteria_id' => 3, 'nilai' => 7],   // Keamanan 7/10
            ['alternatif_id' => 1, 'kriteria_id' => 4, 'nilai' => 500], // Harga 500jt
            
            // A2: Bumi Indah
            ['alternatif_id' => 2, 'kriteria_id' => 1, 'nilai' => 3],
            ['alternatif_id' => 2, 'kriteria_id' => 2, 'nilai' => 9],
            ['alternatif_id' => 2, 'kriteria_id' => 3, 'nilai' => 8],
            ['alternatif_id' => 2, 'kriteria_id' => 4, 'nilai' => 650],
            
            // A3: Citra Raya
            ['alternatif_id' => 3, 'kriteria_id' => 1, 'nilai' => 8],
            ['alternatif_id' => 3, 'kriteria_id' => 2, 'nilai' => 6],
            ['alternatif_id' => 3, 'kriteria_id' => 3, 'nilai' => 6],
            ['alternatif_id' => 3, 'kriteria_id' => 4, 'nilai' => 400],
            
            // A4: Duta Mas
            ['alternatif_id' => 4, 'kriteria_id' => 1, 'nilai' => 2],
            ['alternatif_id' => 4, 'kriteria_id' => 2, 'nilai' => 9],
            ['alternatif_id' => 4, 'kriteria_id' => 3, 'nilai' => 9],
            ['alternatif_id' => 4, 'kriteria_id' => 4, 'nilai' => 750],
            
            // A5: Elang Residence
            ['alternatif_id' => 5, 'kriteria_id' => 1, 'nilai' => 6],
            ['alternatif_id' => 5, 'kriteria_id' => 2, 'nilai' => 7],
            ['alternatif_id' => 5, 'kriteria_id' => 3, 'nilai' => 8],
            ['alternatif_id' => 5, 'kriteria_id' => 4, 'nilai' => 550],
        ];

        foreach ($nilai as $n) {
            NilaiAlternatif::create($n);
        }
    }
}
