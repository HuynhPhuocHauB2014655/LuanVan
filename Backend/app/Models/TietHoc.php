<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TietHoc extends Model
{
    use HasFactory;
    protected $table = 'TietHoc';
    protected $fillable = [
        'id',
        'MaLop',
        'MSGV',
        'DanhGia',
        'NoiDung',
        'MaNgay',
        'TietDay',
        'Ngay',


    ];
    public function giaoVien(): BelongsTo{
        return $this->belongsTo(GiaoVien::class,'MSGV','MSGV');
    }
    public function lop(): BelongsTo{
        return $this->belongsTo(Lop::class,'MaLop','MaLop');
    }
    public function diemDanh(): HasMany{
        return $this->hasMany(DiemDanh::class,'TietHoc','id');
    }
}
