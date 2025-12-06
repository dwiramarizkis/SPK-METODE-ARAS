<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Kriteria;

class KriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kriteria = [
            [
                'nama_kriteria' => 'Jarak ke Pusat Kota',
                'kode_kriteria' => 'C1',
                'bobot' => 0.40,
                'jenis' => 'cost',
            ],
            [
                'nama_kriteria' => 'Ketersediaan Fasilitas Publik',
                'kode_kriteria' => 'C2',
                'bobot' => 0.30,
                'jenis' => 'benefit',
            ],
            [
                'nama_kriteria' => 'Tingkat Keamanan',
                'kode_kriteria' => 'C3',
                'bobot' => 0.20,
                'jenis' => 'benefit',
            ],
            [
                'nama_kriteria' => 'Harga Rumah Rata-rata',
                'kode_kriteria' => 'C4',
                'bobot' => 0.10,
                'jenis' => 'cost',
            ],
        ];

        foreach ($kriteria as $item) {
            Kriteria::create($item);
        }
    }
}
