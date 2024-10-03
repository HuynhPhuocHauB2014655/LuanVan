<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Hash;
class Admin extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'admin';
    protected $fillable = [
        'TaiKhoan',
        'MatKhau'
    ];
    protected $primaryKey = 'TaiKhoan';
    public function setMatKhauAttribute($value)
    {
        $this->attributes['MatKhau'] = Hash::make($value);
    }
}
