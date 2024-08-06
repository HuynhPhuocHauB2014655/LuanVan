<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


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
    ];
    protected $primaryKey = 'MSGV';
    public function monHoc(): BelongsTo{
        return $this->belongsTo(MonHoc::class, 'ChuyenMon', 'MaMH');
    }
}
