<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class PhanCong extends Model
{
    use HasFactory;
    protected $table = 'PhanCongDay';
    protected $fillable = [
        'id',
        'MSGV',
        'MaMH',
        'MaLop'
    ];

    public function lop(): BelongsTo{
        return $this->belongsTo(Lop::class,'MaLop','MaLop');
    }
    public function monHoc(): BelongsTo{
        return $this->belongsTo(MonHoc::class,'MaMH','MaMH');
    }
    public function giaoVien(): BelongsTo{
        return $this->belongsTo(GiaoVien::class,'MSGV','MSGV');
    }
}
