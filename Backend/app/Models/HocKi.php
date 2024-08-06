<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class HocKi extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'HocKi';
    protected $primaryKey = 'MaHK';
    protected $fillable = [
        'MaHK',
        'TenHK',
        "MaNK"
    ];
    public function nienkhoa():BelongsTo{
        return $this->belongsTo(NienKhoa::class,'MaNK','MaNK');
    }
}
