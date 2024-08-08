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
    ];
    protected $primaryKey = 'id';

    public function ngayTrongTuan() : BelongsTo {
        return $this->belongsTo(NgayTrongTuan::class, 'MaNgay', 'MaNgay');
    }
    public function monHoc() : BelongsTo {
        return $this->belongsTo(MonHoc::class, 'MaMH', 'MaMH');
    }
    public function lopHoc() : BelongsTo {
        return $this->belongsTo(LopHoc::class, 'MaLop', 'MaLop');
    }
    public function giaoVien() : BelongsTo {
        return $this->belongsTo(GiaoVien::class, 'MSGV', 'MSGV');
    }
}
