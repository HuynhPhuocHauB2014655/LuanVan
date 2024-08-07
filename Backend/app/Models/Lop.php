<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
class Lop extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'Lop';
    protected $fillable = [
        'MaLop',
        'TenLop',
        'MaKhoi',
        'MaNK',
    ];
    protected $primaryKey = 'MaLop';
    public function hocSinh(): BelongsToMany{
        return $this->belongsToMany(HocSinh::class,'HocLop','MaLop','MSHS');
    }
    public function nienKhoa(): BelongsTo{
        return $this->belongsTo(NienKhoa::class,'MaNK','MaNK');
    }
}
