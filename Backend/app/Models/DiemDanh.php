<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiemDanh extends Model
{
    use HasFactory;
    protected $table = 'DiemDanh';
    protected $fillable = [
        'id',
        'MSHS',
        'TrangThai',
        'TietHoc',
    ];
    public function hocSinh(): BelongsTo{
        return $this->belongsTo(HocSInh::class,'MSHS','MSHS');
    }
    public function tietHoc(): BelongsTo{
        return $this->belongsTo(TietHoc::class,'TietHoc','id');
    }
}
