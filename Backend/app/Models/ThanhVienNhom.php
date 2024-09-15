<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class ThanhVienNhom extends Model
{
    use HasFactory;
    protected $table = 'ThanhVienNhom';
    protected $fillable = [
        'id',
        'Nhom_id',
        'MaTV'
    ];
    public function nhom(): BelongsTo{
        return $this->belongsTo(nhom::class,'Nhom_id','id');
    }
}
