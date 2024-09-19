<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class HocLop extends Model
{
    use HasFactory;
    protected $table = 'HocLop';
    protected $fillable = [
        'id',
        'MaLop',
        'MSHS',
        'MaRL',
        'MaHL',
        'Diem_TB_HKI',
        'Diem_TB_HKII',
        'Diem_TB_CN',
        'MaNK',
        'MaRL_HK1',
        'MaRL_HK2',
        'MaRLL',
        'MaHL_HK1',
        'MaHL_HK2',
        'MaHLL',
        'MaTT'
    ];
    public function lop(): BelongsTo{
        return $this->belongsTo(Lop::class,'MaLop','MaLop');
    }
    public function hocSinh():BelongsTo{
        return $this->belongsTo(HocSinh::class,'MSHS','MSHS');
    }
    public function hocLuc(): BelongsTo{
        return $this->belongsTo(HocLuc::class,'MaHL','MaHL');
    }
    public function hocLucHK1(): BelongsTo{
        return $this->belongsTo(HocLuc::class,'MaHL_HK1','MaHL');
    }
    public function hocLucHK2(): BelongsTo{
        return $this->belongsTo(HocLuc::class,'MaHL_HK2','MaHL');
    }
    public function hocLucLai(): BelongsTo{
        return $this->belongsTo(HocLuc::class,'MaHLL','MaHL');
    }
    public function renLuyen(): BelongsTo{
        return $this->belongsTo(RenLuyen::class,'MaRL','MaRL');
    }
    public function renLuyenHK1(): BelongsTo{
        return $this->belongsTo(RenLuyen::class,'MaRL_HK1','MaRL');
    }
    public function renLuyenHK2(): BelongsTo{
        return $this->belongsTo(RenLuyen::class,'MaRL_HK2','MaRL');
    }
    public function renLuyenLai(): BelongsTo{
        return $this->belongsTo(RenLuyen::class,'MaRLL','MaRL');
    }
    public function trangThai(): BelongsTo{
        return $this->belongsTo(TrangThai::class,'MaTT','MaTT');
    }
}
