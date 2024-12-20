<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class TinNhan extends Model
{
    use HasFactory;
    protected $table = 'TinNhan';
    protected $fillable = [
        'id',
        'TinNhan',
        'NguoiGui',
        'NguoiNhan',
        'TrangThai',
        'Nhom_id'
    ];
    public function nhom():BelongsTo{
        return $this->belongsTo(NhomTinNhan::class,'Nhom_id','id');
    }
}
