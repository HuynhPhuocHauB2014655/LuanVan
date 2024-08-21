<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class TrangThai extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'TrangThai';
    protected $fillable = [
        'MaTT',
        'TenTT',
    ];
    protected $primaryKey = 'MaTT';
    public function hocLop(): HasMany{
        return $this->hasMany(HocLop::class,'MaTT','MaTT');
    }
}
