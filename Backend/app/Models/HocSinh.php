<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
class HocSinh extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'HocSinh';
    protected $fillable = [
        'MSHS',
        'HoTen',
        'NgaySinh',
        'GioiTinh',
        'DiaChi',
        'QueQuan',
        'SDT',
        'TonGiao',
        'DanToc',
        'MaBan'
    ];
    protected $primaryKey = 'MSHS';
    public function ban(): BelongsTo{
        return $this->belongsTo(Ban::class,'MaBan','MaBan');
    }
    public function lop(): BelongsToMany{
        return $this->belongsToMany(Lop::class,'HocLop','MSHS','MaLop');
    }
}
