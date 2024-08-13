<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
class GiaoVien extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'GiaoVien';
    protected $fillable = [
        'MSGV',
        'TenGV',
        'NgaySinh',
        'GioiTinh',
        'DiaChi',
        'SDT',
        'ChuyenMon',
        'TrangThai'
    ];
    protected $primaryKey = 'MSGV';
    public function monHoc(): BelongsTo{
        return $this->belongsTo(MonHoc::class, 'ChuyenMon', 'MaMH');
    }
    public function taiKhoan():HasOne{
        return $this->hasOne(TKGiaoVien::class,'MSGV','MSGV');
    }
}
