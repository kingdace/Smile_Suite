<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    // Constants for patient status
    const STATUS_NEW = 'new';
    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';

    // Constants for patient categories
    const CATEGORY_REGULAR = 'regular';
    const CATEGORY_VIP = 'vip';
    const CATEGORY_EMERGENCY = 'emergency';
    const CATEGORY_PEDIATRIC = 'pediatric';
    const CATEGORY_SENIOR = 'senior';
    const CATEGORY_NEW = 'new';
    const CATEGORY_RETURNING = 'returning';
    const CATEGORY_NONE = 'none';

    // Constants for blood types
    const BLOOD_TYPE_A_POSITIVE = 'A+';
    const BLOOD_TYPE_A_NEGATIVE = 'A-';
    const BLOOD_TYPE_B_POSITIVE = 'B+';
    const BLOOD_TYPE_B_NEGATIVE = 'B-';
    const BLOOD_TYPE_AB_POSITIVE = 'AB+';
    const BLOOD_TYPE_AB_NEGATIVE = 'AB-';
    const BLOOD_TYPE_O_POSITIVE = 'O+';
    const BLOOD_TYPE_O_NEGATIVE = 'O-';
    const BLOOD_TYPE_UNKNOWN = 'unknown';

    // Constants for last dental visit options
    const LAST_VISIT_NO_PREVIOUS = 'No previous visit';
    const LAST_VISIT_WITHIN_3_MONTHS = 'Within 3 months';
    const LAST_VISIT_WITHIN_6_MONTHS = 'Within 6 months';
    const LAST_VISIT_WITHIN_1_YEAR = 'Within 1 year';
    const LAST_VISIT_MORE_THAN_1_YEAR = 'More than 1 year';

    protected $fillable = [
        'clinic_id',
        'user_id',
        'first_name',
        'last_name',
        'email',
        'email_verified',
        'email_verified_at',
        'email_verification_token',
        'email_verification_token_expires_at',
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
        'category',
        'tags',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'medical_history' => 'array',
        'allergies' => 'array',
        'email_verified' => 'boolean',
        'email_verified_at' => 'datetime',
        'email_verification_token_expires_at' => 'datetime',
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

    public function reviews()
    {
        return $this->hasMany(Review::class);
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

    /**
     * Get patient status based on last dental visit
     */
    public function getStatusAttribute()
    {
        if (!$this->last_dental_visit) {
            return self::STATUS_NEW;
        }

        $lastVisitText = $this->last_dental_visit;

        if ($lastVisitText === self::LAST_VISIT_NO_PREVIOUS || empty($lastVisitText)) {
            return self::STATUS_NEW;
        }

        if (str_contains($lastVisitText, self::LAST_VISIT_WITHIN_3_MONTHS) ||
            str_contains($lastVisitText, self::LAST_VISIT_WITHIN_6_MONTHS) ||
            str_contains($lastVisitText, self::LAST_VISIT_WITHIN_1_YEAR)) {
            return self::STATUS_ACTIVE;
        }

        if (str_contains($lastVisitText, self::LAST_VISIT_MORE_THAN_1_YEAR)) {
            return self::STATUS_INACTIVE;
        }

        return self::STATUS_ACTIVE;
    }

    /**
     * Get display name for category
     */
    public function getCategoryDisplayNameAttribute()
    {
        $categoryMap = [
            self::CATEGORY_REGULAR => 'Regular Patient',
            self::CATEGORY_VIP => 'VIP Patient',
            self::CATEGORY_EMERGENCY => 'Emergency Patient',
            self::CATEGORY_PEDIATRIC => 'Pediatric Patient',
            self::CATEGORY_SENIOR => 'Senior Patient',
            self::CATEGORY_NEW => 'New Patient',
            self::CATEGORY_RETURNING => 'Returning Patient',
            self::CATEGORY_NONE => 'No Category',
        ];

        return $categoryMap[$this->category] ?? $this->category;
    }

    /**
     * Check if patient is new
     */
    public function isNew()
    {
        return $this->status === self::STATUS_NEW;
    }

    /**
     * Check if patient is active
     */
    public function isActive()
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Check if patient is inactive
     */
    public function isInactive()
    {
        return $this->status === self::STATUS_INACTIVE;
    }

    /**
     * Get all available categories
     */
    public static function getAvailableCategories()
    {
        return [
            self::CATEGORY_REGULAR => 'Regular Patient',
            self::CATEGORY_VIP => 'VIP Patient',
            self::CATEGORY_EMERGENCY => 'Emergency Patient',
            self::CATEGORY_PEDIATRIC => 'Pediatric Patient',
            self::CATEGORY_SENIOR => 'Senior Patient',
            self::CATEGORY_NEW => 'New Patient',
            self::CATEGORY_RETURNING => 'Returning Patient',
            self::CATEGORY_NONE => 'No Category',
        ];
    }

    /**
     * Get all available blood types
     */
    public static function getAvailableBloodTypes()
    {
        return [
            self::BLOOD_TYPE_A_POSITIVE => 'A+',
            self::BLOOD_TYPE_A_NEGATIVE => 'A-',
            self::BLOOD_TYPE_B_POSITIVE => 'B+',
            self::BLOOD_TYPE_B_NEGATIVE => 'B-',
            self::BLOOD_TYPE_AB_POSITIVE => 'AB+',
            self::BLOOD_TYPE_AB_NEGATIVE => 'AB-',
            self::BLOOD_TYPE_O_POSITIVE => 'O+',
            self::BLOOD_TYPE_O_NEGATIVE => 'O-',
            self::BLOOD_TYPE_UNKNOWN => 'Unknown',
        ];
    }

    /**
     * Get all available last dental visit options
     */
    public static function getAvailableLastVisitOptions()
    {
        return [
            self::LAST_VISIT_NO_PREVIOUS => 'No previous visit',
            self::LAST_VISIT_WITHIN_3_MONTHS => 'Within 3 months',
            self::LAST_VISIT_WITHIN_6_MONTHS => 'Within 6 months',
            self::LAST_VISIT_WITHIN_1_YEAR => 'Within 1 year',
            self::LAST_VISIT_MORE_THAN_1_YEAR => 'More than 1 year',
        ];
    }

    /**
     * Scope for new patients
     */
    public function scopeNew($query)
    {
        return $query->where(function($q) {
            $q->whereNull('last_dental_visit')
              ->orWhere('last_dental_visit', '')
              ->orWhere('last_dental_visit', self::LAST_VISIT_NO_PREVIOUS);
        });
    }

    /**
     * Scope for active patients
     */
    public function scopeActive($query)
    {
        return $query->where(function($q) {
            $q->where('last_dental_visit', self::LAST_VISIT_WITHIN_3_MONTHS)
              ->orWhere('last_dental_visit', self::LAST_VISIT_WITHIN_6_MONTHS)
              ->orWhere('last_dental_visit', self::LAST_VISIT_WITHIN_1_YEAR)
              ->orWhere('last_dental_visit', 'like', '%Within 3 months%')
              ->orWhere('last_dental_visit', 'like', '%Within 6 months%')
              ->orWhere('last_dental_visit', 'like', '%Within 1 year%');
        });
    }

    /**
     * Scope for inactive patients
     */
    public function scopeInactive($query)
    {
        return $query->where(function($q) {
            $q->where('last_dental_visit', self::LAST_VISIT_MORE_THAN_1_YEAR)
              ->orWhere('last_dental_visit', 'like', '%More than 1 year%')
              ->orWhere('last_dental_visit', 'like', '%more than 1 year%');
        });
    }

    /**
     * Check if patient has a linked user account
     */
    public function hasUserAccount(): bool
    {
        return !is_null($this->user_id);
    }

    /**
     * Check if patient email is verified
     */
    public function isEmailVerified(): bool
    {
        return $this->email_verified && !is_null($this->email_verified_at);
    }

    /**
     * Generate email verification token
     */
    public function generateEmailVerificationToken(): string
    {
        $token = \Illuminate\Support\Str::random(64);
        $this->update([
            'email_verification_token' => $token,
            'email_verification_token_expires_at' => now()->addHours(24),
        ]);
        return $token;
    }

    /**
     * Verify email with token
     */
    public function verifyEmail(string $token): bool
    {
        if ($this->email_verification_token !== $token) {
            return false;
        }

        if ($this->email_verification_token_expires_at && $this->email_verification_token_expires_at->isPast()) {
            return false;
        }

        $this->update([
            'email_verified' => true,
            'email_verified_at' => now(),
            'email_verification_token' => null,
            'email_verification_token_expires_at' => null,
        ]);

        return true;
    }

    /**
     * Link patient to a user account
     */
    public function linkToUser(User $user): bool
    {
        if ($user->user_type !== User::TYPE_PATIENT) {
            return false;
        }

        $this->update(['user_id' => $user->id]);
        return true;
    }

    /**
     * Unlink patient from user account
     */
    public function unlinkFromUser(): bool
    {
        $this->update(['user_id' => null]);
        return true;
    }

    /**
     * Find patient by email across all clinics
     */
    public static function findByEmail(string $email)
    {
        return self::where('email', $email)->first();
    }

    /**
     * Find patient by email within a specific clinic
     */
    public static function findByEmailInClinic(string $email, int $clinicId)
    {
        return self::where('email', $email)
                   ->where('clinic_id', $clinicId)
                   ->first();
    }

    /**
     * Check if email exists in any clinic
     */
    public static function emailExists(string $email): bool
    {
        return self::where('email', $email)->exists();
    }

    /**
     * Check if email exists in specific clinic
     */
    public static function emailExistsInClinic(string $email, int $clinicId): bool
    {
        return self::where('email', $email)
                   ->where('clinic_id', $clinicId)
                   ->exists();
    }
}
