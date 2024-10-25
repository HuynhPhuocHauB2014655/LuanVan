<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class GroupMember extends Model
{
    use HasFactory;
    protected $table = 'GroupMember';
    protected $fillable = [
        'id',
        'Nhom_id',
        'MaTV'
    ];
    public function group(): BelongsTo{
        return $this->belongsTo(CustomGroup::class,'Nhom_id','id');
    }
}
