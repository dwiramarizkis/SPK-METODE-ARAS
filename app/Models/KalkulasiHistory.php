<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KalkulasiHistory extends Model
{
    protected $table = 'kalkulasi_history';

    protected $fillable = [
        'user_id',
        'nama_kalkulasi',
        'data_alternatif',
        'data_kriteria',
        'hasil_perhitungan',
        'proses_perhitungan',
    ];

    protected $casts = [
        'data_alternatif' => 'array',
        'data_kriteria' => 'array',
        'hasil_perhitungan' => 'array',
        'proses_perhitungan' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
