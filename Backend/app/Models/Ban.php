<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Ban extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'Ban';
    protected $fillable = [
        'MaBan',
        'TenBan',
    ];
    protected $primaryKey = 'MaBan';
    public function hocSinh(): HasMany{
        return $this->hasMany(HocSinh::class,'MaBan','MaBan');
    }
}
