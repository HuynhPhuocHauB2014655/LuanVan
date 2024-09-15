<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NhomTinNhan extends Model
{
    use HasFactory;
    protected $table = 'NhomTinNhan';
    protected $fillable = [
        'id',
        'TenNhom',
        'MaLop'
    ];
    public function thanhVien(): HasMany{
        return $this->hasMany(ThanhVienNhom::class,'nhom_id','id');
    }
    public function lop(): BelongsTo{
        return $this->belongsTo(Lop::class,'MaLop','MaLop');
    }
}
