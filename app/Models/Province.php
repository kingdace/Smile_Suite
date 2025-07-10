<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'name',
        'region_code',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class, 'region_code', 'code');
    }

    public function cities()
    {
        return $this->hasMany(CityMunicipality::class, 'province_code', 'code');
    }

    public function municipalities()
    {
        return $this->hasMany(CityMunicipality::class, 'province_code', 'code');
    }
}
