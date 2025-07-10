<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'clinic_id',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'date_of_birth',
        'gender',
        'address',
        'street_address',
        'region_code',
        'province_code',
        'city_municipality_code',
        'barangay_code',
        'postal_code',
        'address_details',
        'medical_history',
        'allergies',
        'emergency_contact_name',
        'emergency_contact_number',
        'emergency_contact_relationship',
        'insurance_provider',
        'insurance_policy_number',
        'blood_type',
        'occupation',
        'marital_status',
        'last_dental_visit',
        'notes',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'last_dental_visit' => 'date',
        'medical_history' => 'array',
        'allergies' => 'array',
    ];

    protected $appends = ['full_name'];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function treatments()
    {
        return $this->hasMany(Treatment::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Define the relationship to the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAgeAttribute()
    {
        return $this->date_of_birth->age;
    }
}
