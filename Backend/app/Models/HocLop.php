<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class HocLop extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'HocLop';
    protected $fillable = [
        'MaLop',
        'MSHS',
        'MaHK',
        'MaHL',
        'Diem_TB_HKI',
        'Diem_TB_HKII',
        'Diem_TB_CN',
        'MaNK'
    ];
    public function getKeyName()
    {
        return ['MaLop', 'MSHS', 'MaNK'];
    }

    protected function performUpdate(\Illuminate\Database\Eloquent\Builder $query)
    {
        foreach ($this->getKeyName() as $keyName) {
            $query->where($keyName, '=', $this->getAttribute($keyName));
        }

        return $query->update($this->getDirty());
    }
    public function hoclop(): HasMany{
        return $this->hasMany(Lop::class,'MaLop','MaLop');
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
    public function renLuyen(): BelongsTo{
        return $this->belongsTo(RenLuyen::class,'MaRL','MaRL');
    }
    public function renLuyenHK1(): BelongsTo{
        return $this->belongsTo(RenLuyen::class,'MaRL_HK1','MaRL');
    }
    public function renLuyenHK2(): BelongsTo{
        return $this->belongsTo(RenLuyen::class,'MaRL_HK2','MaRL');
    }
}
