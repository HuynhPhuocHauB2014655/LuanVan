<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
class TKB extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'TKB';
    protected $fillable = [
        'id',
        'MaNgay',
        'TietDay',
        'MaMH',
        'MaLop',
        'MSGV',
        'MaNK',
    ];
    protected $primaryKey = 'id';

    public function ngayTrongTuan() : BelongsTo {
        return $this->belongsTo(NgayTrongTuan::class, 'MaNgay', 'MaNgay');
    }
    public function monHoc() : BelongsTo {
        return $this->belongsTo(MonHoc::class, 'MaMH', 'MaMH');
    }
    public function lop() : BelongsTo {
        return $this->belongsTo(Lop::class, 'MaLop', 'MaLop');
    }
    public function giaoVien() : BelongsTo {
        return $this->belongsTo(GiaoVien::class, 'MSGV', 'MSGV');
    }
    public function nienKhoa() : BelongsTo {
        return $this->belongsTo(NienKhoa::class, 'MaNK', 'MaNK');
    }
}
