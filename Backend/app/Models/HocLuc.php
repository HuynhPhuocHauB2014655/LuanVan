<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class HocLuc extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'HocLuc';
    protected $fillable = [
        'MaHL',
        'TenHL',
    ];
    protected $primaryKey = 'MaHL';
    public function hocLop(): HasMany{
        return $this->hasMany(HocLop::class,'MaHL','MaHL');
    }
    public function hocLopHK1(): HasMany{
        return $this->hasMany(HocLop::class,'MaHL_HK1','MaHL');
    }
    public function hocLopHK2(): HasMany{
        return $this->hasMany(HocLop::class,'MaHL_HK2','MaHL');
    }
}
