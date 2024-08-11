<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Hash;
class Admin extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $table = 'admin';
    protected $fillable = [
        'MaBaoMat'
    ];
    protected $primaryKey = 'MaBaoMat';
    public function setMaBaoMatAttribute($value)
    {
        $this->attributes['MaBaoMat'] = Hash::make($value);
    }
}
