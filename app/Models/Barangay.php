<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'name',
        'city_municipality_code',
    ];

    public function cityMunicipality()
    {
        return $this->belongsTo(CityMunicipality::class, 'city_municipality_code', 'code');
    }
}
