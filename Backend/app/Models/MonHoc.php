<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class MonHoc extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'MonHoc';
    protected $primaryKey = 'MaMH';
    protected $fillable = [
        'MaMH',
        'TenMH',
    ];
    public function giaoVien():HasMany{
        return $this->hasMany(GiaoVien::class,'ChuyenMon','MaMH');
    }
}
