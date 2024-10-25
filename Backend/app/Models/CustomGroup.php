<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomGroup extends Model
{
    use HasFactory;
    protected $table = 'CustomGroup';
    protected $fillable = [
        'id',
        'TenNhom',
    ];
    public function member(): HasMany{
        return $this->hasMany(GroupMember::class,'Nhom_id','id');
    }
    public function message():hasMany{
        return $this->hasMany(GroupMessage::class,'Nhom_id','id');
    }
}
