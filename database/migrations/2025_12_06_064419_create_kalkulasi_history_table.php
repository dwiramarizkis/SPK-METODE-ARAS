<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kalkulasi_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nama_kalkulasi');
            $table->json('data_alternatif'); // Menyimpan semua alternatif dan nilai
            $table->json('data_kriteria'); // Snapshot kriteria saat kalkulasi
            $table->json('hasil_perhitungan'); // Hasil ranking
            $table->json('proses_perhitungan'); // Step-by-step process
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kalkulasi_history');
    }
};
