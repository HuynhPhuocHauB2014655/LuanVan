<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
