<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class NienKhoaHienTai extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'NK_Hientai';
    protected $primaryKey = 'NienKhoa';
    protected $fillable = [
        'NienKhoa',
        'TenNK',
        'NgayBD',
        'HanSuaDiem',
    ];
}
