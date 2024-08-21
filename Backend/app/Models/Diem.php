<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Diem extends Model
{
    use HasFactory;
    protected $table = 'Diem';
    protected $fillable = [
        'id',
        'MSHS',
        'MaMH',
        'Diem',
        'MaLoai',
        'MaHK',
    ];
    public function hocSinh(): BelongsTo{
        return $this->belongsTo(HocSinh::class, 'MSHS', 'MSHS');
    }
    public function monHoc(): BelongsTo{
        return $this->belongsTo(MonHoc::class, 'MaMH', 'MaMH');
    }
    public function hocKi(): BelongsTo{
        return $this->belongsTo(HocKi::class, 'MaHK', 'MaHK');
    }
}
