<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class GroupMessage extends Model
{
    use HasFactory;
    protected $table = 'GroupMessage';
    protected $fillable = [
        'id',
        'TinNhan',
        'NguoiGui',
        'NguoiNhan',
        'TrangThai',
        'Nhom_id'
    ];
    public function group():BelongsTo{
        return $this->belongsTo(CustomGroup::class,'Nhom_id','id');
    }
}
