<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Hash;
class TKGiaoVien extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'TaiKhoanGV';
    protected $fillable = [
        'MatKhau',
        'MSGV'
    ];
    protected $primaryKey = 'MSGV';

    public function giaoVien() : BelongsTo {
        return $this->belongsTo(GiaoVien::class, 'MSGV', 'MSGV');
    }

    public function setMatKhauAttribute($value)
    {
        $this->attributes['MatKhau'] = Hash::make($value);
    }
}
