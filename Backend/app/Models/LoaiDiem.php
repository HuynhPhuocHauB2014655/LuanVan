<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class LoaiDiem extends Model
{
    use HasFactory;
    protected $table = 'LoaiDiem';
    protected $primaryKey = 'MaLoai';
    public $incrementing = false;
    protected $fillable = [
        'MaLoai',
        'TenLoai',
    ];
    public function diem(): HasMany{
        return $this->hasMany(Diem::class, 'MaLoai', 'MaLoai');
    }
}
