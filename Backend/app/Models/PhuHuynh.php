<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Hash;

class PhuHuynh extends Model
{
    use HasFactory;
    protected $table = 'PhuHuynh';
    protected $fillable = [
        'id',
        'TenCha',
        'SDTCha',
        'TenMe',
        'SDTMe',
        'MSHS',
        'TaiKhoan',
        'MatKhau',
    ];
    public function hocSinh(): BelongsTo{
        return $this->belongsTo(HocSinh::class,'MSHS','MSHS');
    }
    public function setMatKhauAttribute($value)
    {
        $this->attributes['MatKhau'] = Hash::make($value);
    }
}
