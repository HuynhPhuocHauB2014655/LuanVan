<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class RenLuyen extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'RenLuyen';
    protected $fillable = [
        'MaRL',
        'TenRL',
    ];
    protected $primaryKey = 'MaRL';
    public function hocLop(): HasMany{
        return $this->hasMany(HocLop::class,'MaRL','MaRL');
    }
    public function hocLopHK1(): HasMany{
        return $this->hasMany(HocLop::class,'MaRL_HK1','MaRL');
    }
    public function hocLopHK2(): HasMany{
        return $this->hasMany(HocLop::class,'MaRL_HK2','MaRL');
    }
}
