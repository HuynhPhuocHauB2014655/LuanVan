<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class PhuHuynh extends Model
{
    use HasFactory;
    protected $table = 'PhuHuynh';
    protected $fillable = [
        'id',
        'TenCha',
        'SDTCha',
        'TenMe',
        'SDTMe',
        'MSHS',
    ];
    public function hocSinh(): BelongsTo{
        return $this->belongsTo(HocSinh::class,'MSHS','MSHS');
    }
}
