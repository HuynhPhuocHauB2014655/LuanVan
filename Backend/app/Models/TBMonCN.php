<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class TBMonCN extends Model
{
    use HasFactory;
    protected $table = 'TBMonCN';
    protected $fillable = [
        'id',
        'MSHS',
        'MaMH',
        'MaNK',
        'Diem',
    ];
    public function hocSinh(): BelongsTo{
        return $this->belongsTo(HocSinh::class, 'MSHS', 'MSHS');
    }
    public function monHoc(): BelongsTo{
        return $this->belongsTo(MonHoc::class, 'MaMH', 'MaMH');
    }
    public function nienKhoa(): BelongsTo{
        return $this->belongsTo(NienKhoa::class, 'MaNK', 'MaNK');
    }
}
