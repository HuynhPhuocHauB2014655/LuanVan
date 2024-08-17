<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Belongsto;


class DanhGia extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'DanhGia';
    protected $fillable = [
        'id',
        'DanhGia',
        'MSHS',
        'MaMH',
        'MaHK'
    ];
    public function hocSinh(): Belongsto{
        return $this->belongsTo(HocSinh::class,'MSHS','MSHS');
    }
    public function monHoc(): Belongsto{
        return $this->belongsTo(MonHoc::class,'MaMH','MaMH');
    }
    public function hocKi(): Belongsto{
        return $this->belongsTo(HocKi::class,'MaHK','MaHK');
    }
}
