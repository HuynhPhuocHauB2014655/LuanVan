<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class NgayTrongTuan extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'NgayTrongTuan';
    protected $fillable = [
        'MaNgay',
        'TenNgay',
    ];
    protected $primaryKey = 'MaNgay';
}
