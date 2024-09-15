<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class TinNhan extends Model
{
    use HasFactory;
    protected $table = 'TinNhan';
    protected $fillable = [
        'id',
        'TinNhan',
        'NguoiGui',
        'NguoiNhan',
        'TrangThai'
    ];

}
