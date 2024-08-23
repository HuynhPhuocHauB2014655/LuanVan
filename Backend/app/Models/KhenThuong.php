<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class KhenThuong extends Model
{
    use HasFactory;
    protected $table = 'KhenThuong';
    protected $fillable = [
        'id',
        'MSHS',
        'MaNK',
        'MaLop',
        'KhenThuong',
        'TrangThai'
    ];
    public function lop(): HasMany{
        return $this->hasMany(Lop::class,'MaLop','MaLop');
    }
    public function hocSinh(): HasMany{
        return $this->hasMany(HocSinh::class,'MSHS','MSHS');
    }
    public function nienKhoa(): HasMany{
        return $this->hasMany(NienKhoa::class,'MaNK','MaNK');
    }
}
