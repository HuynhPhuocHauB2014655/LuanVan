<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class HocLop extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'HocLop';
    protected $fillable = [
        'MaLop',
        'MSHS',
        'MaHK',
        'MaHL',
        'Diem_TB_HKI',
        'Diem_TB_HKII',
        'Diem_TB_CN'
    ];
    protected $primaryKey = 'MaLop';
    public function hoclop(): HasMany{
        return $this->hasMany(Lop::class,'MaLop','MaLop');
    }
}
