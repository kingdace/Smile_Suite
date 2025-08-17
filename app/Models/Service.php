<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'clinic_id',
        'name',
        'description',
        'price',
        'is_active',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}
