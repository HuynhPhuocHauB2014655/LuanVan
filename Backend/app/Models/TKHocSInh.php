<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Hash;
class TKHocSinh extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'TaiKhoanHS';
    protected $fillable = [
        'MatKhau',
        'MSHS'
    ];
    protected $primaryKey = 'MSHS';

    public function hocSinh() : BelongsTo {
        return $this->belongsTo(HocSInh::class, 'MSHS', 'MSHS');
    }

    public function setMatKhauAttribute($value)
    {
        $this->attributes['MatKhau'] = Hash::make($value);
    }
}
