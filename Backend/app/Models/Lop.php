<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use \Illuminate\Database\Eloquent\Relations\HasMany;
class Lop extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'Lop';
    protected $fillable = [
        'MaLop',
        'TenLop',
        'MaKhoi',
        'MaNK',
    ];
    protected $primaryKey = 'MaLop';
    public function hocSinh(): BelongsToMany{
        return $this->belongsToMany(HocSinh::class,'HocLop','MaLop','MSHS');
    }
    public function nienKhoa(): BelongsTo{
        return $this->belongsTo(NienKhoa::class,'MaNK','MaNK');
    }
    public function giaoVien(): BelongsTo{
        return $this->belongsTo(GiaoVIen::class,'MSGV','MSGV');
    }
    public function tkb(): HasMany{
        return $this->hasMany(TKB::class,'MaLop','MaLop');
    }
    public function phanCong(): HasMany{
        return $this->hasMany(PhanCong::class,'MaLop','MaLop');
    }
}
