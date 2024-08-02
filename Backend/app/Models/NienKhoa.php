<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class NienKhoa extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'NienKhoa';
    protected $primaryKey = 'MaNK';
    protected $fillable = [
        'MaNK',
        'TenNK',
    ];
    public function hocki(){
        return $this->hasMany(HocKi::class,'MaNK','MaNK');
    }
}
