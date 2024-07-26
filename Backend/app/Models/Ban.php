<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ban extends Model
{
    use HasFactory;
    protected $table = 'Ban';
    protected $fillable = [
        'MaBan',
        'TenBan',
    ];
    protected $primaryKey = 'MaBan';
}
