<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    // Service Categories
    const CATEGORY_GENERAL = 'general';
    const CATEGORY_COSMETIC = 'cosmetic';
    const CATEGORY_ORTHODONTICS = 'orthodontics';
    const CATEGORY_SURGERY = 'surgery';
    const CATEGORY_PEDIATRIC = 'pediatric';
    const CATEGORY_EMERGENCY = 'emergency';
    const CATEGORY_PREVENTIVE = 'preventive';
    const CATEGORY_RESTORATIVE = 'restorative';
    const CATEGORY_ENDODONTICS = 'endodontics';
    const CATEGORY_PERIODONTICS = 'periodontics';
    const CATEGORY_PROSTHODONTICS = 'prosthodontics';

    protected $fillable = [
        'clinic_id',
        'name',
        'description',
        'category',
        'subcategory',
        'code',
        'price',
        'cost_price',
        'insurance_price',
        'is_insurance_eligible',
        'insurance_codes',
        'duration_minutes',
        'procedure_details',
        'preparation_instructions',
        'post_procedure_care',
        'requires_consultation',
        'is_emergency_service',
        'advance_booking_days',
        'max_daily_bookings',
        'is_active',
        'sort_order',
        'tags',
        'notes',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'insurance_price' => 'decimal:2',
        'is_insurance_eligible' => 'boolean',
        'insurance_codes' => 'array',
        'duration_minutes' => 'integer',
        'requires_consultation' => 'boolean',
        'is_emergency_service' => 'boolean',
        'advance_booking_days' => 'integer',
        'max_daily_bookings' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'tags' => 'array',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function dentists()
    {
        return $this->belongsToMany(User::class, 'service_dentist')
                    ->withPivot([
                        'is_primary_specialist',
                        'is_available',
                        'experience_years',
                        'specialization_notes',
                        'custom_price',
                        'custom_duration_minutes'
                    ])
                    ->withTimestamps();
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function treatments()
    {
        return $this->hasMany(Treatment::class);
    }

    /**
     * Get all available service categories
     */
    public static function getAvailableCategories()
    {
        return [
            self::CATEGORY_GENERAL => 'General Dentistry',
            self::CATEGORY_COSMETIC => 'Cosmetic Dentistry',
            self::CATEGORY_ORTHODONTICS => 'Orthodontics',
            self::CATEGORY_SURGERY => 'Oral Surgery',
            self::CATEGORY_PEDIATRIC => 'Pediatric Dentistry',
            self::CATEGORY_EMERGENCY => 'Emergency Services',
            self::CATEGORY_PREVENTIVE => 'Preventive Care',
            self::CATEGORY_RESTORATIVE => 'Restorative Dentistry',
            self::CATEGORY_ENDODONTICS => 'Endodontics',
            self::CATEGORY_PERIODONTICS => 'Periodontics',
            self::CATEGORY_PROSTHODONTICS => 'Prosthodontics',
        ];
    }

    /**
     * Get subcategories for a specific category
     */
    public static function getSubcategories($category)
    {
        $subcategories = [
            self::CATEGORY_GENERAL => [
                'checkup' => 'Regular Checkup',
                'cleaning' => 'Teeth Cleaning',
                'xray' => 'Dental X-Ray',
                'consultation' => 'Consultation',
            ],
            self::CATEGORY_COSMETIC => [
                'whitening' => 'Teeth Whitening',
                'veneers' => 'Dental Veneers',
                'bonding' => 'Dental Bonding',
                'contouring' => 'Teeth Contouring',
            ],
            self::CATEGORY_ORTHODONTICS => [
                'braces' => 'Traditional Braces',
                'invisalign' => 'Invisalign',
                'retainers' => 'Retainers',
                'adjustment' => 'Braces Adjustment',
            ],
            self::CATEGORY_SURGERY => [
                'extraction' => 'Tooth Extraction',
                'wisdom_teeth' => 'Wisdom Teeth Removal',
                'implant' => 'Dental Implant',
                'bone_grafting' => 'Bone Grafting',
            ],
            self::CATEGORY_PEDIATRIC => [
                'child_checkup' => 'Child Checkup',
                'fluoride_treatment' => 'Fluoride Treatment',
                'sealants' => 'Dental Sealants',
                'space_maintainers' => 'Space Maintainers',
            ],
            self::CATEGORY_EMERGENCY => [
                'pain_relief' => 'Pain Relief',
                'broken_tooth' => 'Broken Tooth Repair',
                'lost_filling' => 'Lost Filling',
                'abscess' => 'Dental Abscess',
            ],
            self::CATEGORY_PREVENTIVE => [
                'cleaning' => 'Professional Cleaning',
                'fluoride' => 'Fluoride Treatment',
                'sealants' => 'Dental Sealants',
                'education' => 'Oral Health Education',
            ],
            self::CATEGORY_RESTORATIVE => [
                'filling' => 'Dental Filling',
                'crown' => 'Dental Crown',
                'bridge' => 'Dental Bridge',
                'inlay_onlay' => 'Inlay/Onlay',
            ],
            self::CATEGORY_ENDODONTICS => [
                'root_canal' => 'Root Canal Treatment',
                'retreatment' => 'Root Canal Retreatment',
                'apicoectomy' => 'Apicoectomy',
            ],
            self::CATEGORY_PERIODONTICS => [
                'scaling' => 'Scaling and Root Planing',
                'gum_surgery' => 'Gum Surgery',
                'pocket_reduction' => 'Pocket Reduction',
            ],
            self::CATEGORY_PROSTHODONTICS => [
                'denture' => 'Dentures',
                'partial_denture' => 'Partial Dentures',
                'implant_crown' => 'Implant Crown',
                'full_mouth_reconstruction' => 'Full Mouth Reconstruction',
            ],
        ];

        return $subcategories[$category] ?? [];
    }

    /**
     * Get price for a specific dentist (with custom pricing)
     */
    public function getPriceForDentist($dentistId = null)
    {
        if (!$dentistId) {
            return $this->price;
        }

        $pivot = $this->dentists()->where('user_id', $dentistId)->first()?->pivot;
        
        if ($pivot && $pivot->custom_price) {
            return $pivot->custom_price;
        }

        return $this->price;
    }

    /**
     * Get duration for a specific dentist (with custom duration)
     */
    public function getDurationForDentist($dentistId = null)
    {
        if (!$dentistId) {
            return $this->duration_minutes;
        }

        $pivot = $this->dentists()->where('user_id', $dentistId)->first()?->pivot;
        
        if ($pivot && $pivot->custom_duration_minutes) {
            return $pivot->custom_duration_minutes;
        }

        return $this->duration_minutes;
    }

    /**
     * Check if service is available for a specific dentist
     */
    public function isAvailableForDentist($dentistId)
    {
        $pivot = $this->dentists()->where('user_id', $dentistId)->first()?->pivot;
        
        if (!$pivot) {
            return false; // Dentist not assigned to this service
        }

        return $pivot->is_available && $this->is_active;
    }

    /**
     * Get available dentists for this service
     */
    public function getAvailableDentists()
    {
        return $this->dentists()
                    ->wherePivot('is_available', true)
                    ->where('is_active', true)
                    ->get();
    }

    /**
     * Scope for active services
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for services by category
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope for emergency services
     */
    public function scopeEmergency($query)
    {
        return $query->where('is_emergency_service', true);
    }

    /**
     * Scope for insurance eligible services
     */
    public function scopeInsuranceEligible($query)
    {
        return $query->where('is_insurance_eligible', true);
    }

    /**
     * Get formatted price with currency
     */
    public function getFormattedPriceAttribute()
    {
        return '₱' . number_format($this->price, 2);
    }

    /**
     * Get formatted duration
     */
    public function getFormattedDurationAttribute()
    {
        $hours = floor($this->duration_minutes / 60);
        $minutes = $this->duration_minutes % 60;
        
        if ($hours > 0) {
            return $hours . 'h ' . $minutes . 'm';
        }
        
        return $minutes . ' minutes';
    }
}
