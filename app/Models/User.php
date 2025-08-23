<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    // User types
    const TYPE_CLINIC_STAFF = 'clinic_staff'; // admin, dentist, staff
    const TYPE_PATIENT = 'patient'; // Smile Suite patient portal users
    const TYPE_SYSTEM_ADMIN = 'system_admin'; // Smile Suite system admin

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'password',
        'clinic_id',
        'role', // admin, dentist, staff (for clinic_staff type)
        'user_type', // clinic_staff, patient, system_admin
        'email_verified_at',
        'registration_verification_code',
        'registration_verification_expires_at',
        'registration_verified',
        // Dentist-specific fields
        'license_number',
        'specialties',
        'qualifications',
        'years_experience',
        'bio',
        'profile_photo',
        'working_hours',
        'unavailable_dates',
        'is_active',
        'last_active_at',
        'emergency_contact',
        'emergency_phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'registration_verification_expires_at' => 'datetime',
            'registration_verified' => 'boolean',
            'password' => 'hashed',
            'working_hours' => 'array',
            'unavailable_dates' => 'array',
            'specialties' => 'array',
            'qualifications' => 'array',
            'is_active' => 'boolean',
            'last_active_at' => 'datetime',
        ];
    }

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

    public function patients()
    {
        return $this->hasMany(Patient::class, 'user_id');
    }

    /**
     * Check if user is clinic staff
     */
    public function isClinicStaff(): bool
    {
        return $this->user_type === self::TYPE_CLINIC_STAFF;
    }

    /**
     * Check if user is a patient
     */
    public function isPatient(): bool
    {
        return $this->user_type === self::TYPE_PATIENT;
    }

    /**
     * Check if user is system admin
     */
    public function isSystemAdmin(): bool
    {
        return $this->user_type === self::TYPE_SYSTEM_ADMIN;
    }

    /**
     * Get patient profile for this user (if they are a patient)
     */
    public function getPatientProfile()
    {
        if (!$this->isPatient()) {
            return null;
        }

        // Return the first patient record associated with this user
        return $this->patients()->first();
    }

    /**
     * Get all clinic records for this patient across different clinics
     */
    public function getClinicRecords()
    {
        if (!$this->isPatient()) {
            return collect();
        }

        return $this->patients()->with('clinic')->get();
    }

    /**
     * Get available user types
     */
    public static function getAvailableUserTypes(): array
    {
        return [
            self::TYPE_CLINIC_STAFF => 'Clinic Staff',
            self::TYPE_PATIENT => 'Patient',
            self::TYPE_SYSTEM_ADMIN => 'System Admin',
        ];
    }

    /**
     * Determine user_type based on role
     * This ensures consistency when creating users
     */
    public static function getUserTypeFromRole(string $role): string
    {
        return match ($role) {
            'admin' => self::TYPE_SYSTEM_ADMIN,
            'patient' => self::TYPE_PATIENT,
            'clinic_admin', 'dentist', 'staff' => self::TYPE_CLINIC_STAFF,
            default => self::TYPE_CLINIC_STAFF, // Safe default
        };
    }

    /**
     * Generate registration verification code
     */
    public function generateRegistrationVerificationCode(): string
    {
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $this->update([
            'registration_verification_code' => $code,
            'registration_verification_expires_at' => now()->addMinutes(15),
            'registration_verified' => false,
        ]);
        return $code;
    }

    /**
     * Verify registration with code
     */
    public function verifyRegistration(string $code): bool
    {
        if ($this->registration_verification_code !== $code) {
            return false;
        }

        if ($this->registration_verification_expires_at && $this->registration_verification_expires_at->isPast()) {
            return false;
        }

        $result = $this->update([
            'registration_verified' => true,
            'email_verified_at' => now(),
            'registration_verification_code' => null,
            'registration_verification_expires_at' => null,
        ]);

        return $result;
    }

    /**
     * Check if registration is verified
     */
    public function isRegistrationVerified(): bool
    {
        return $this->registration_verified;
    }

    /**
     * Check if registration verification has expired
     */
    public function isRegistrationVerificationExpired(): bool
    {
        return $this->registration_verification_expires_at && $this->registration_verification_expires_at->isPast();
    }

    // ==================== DENTIST-SPECIFIC METHODS ====================

    /**
     * Check if user is a dentist
     */
    public function isDentist(): bool
    {
        return $this->role === 'dentist' && $this->user_type === self::TYPE_CLINIC_STAFF;
    }

    /**
     * Check if user is clinic admin
     */
    public function isClinicAdmin(): bool
    {
        return $this->role === 'clinic_admin' && $this->user_type === self::TYPE_CLINIC_STAFF;
    }

    /**
     * Check if user is staff
     */
    public function isStaff(): bool
    {
        return $this->role === 'staff' && $this->user_type === self::TYPE_CLINIC_STAFF;
    }

    /**
     * Get dentist specialties as array
     */
    public function getSpecialties(): array
    {
        return $this->specialties ?? [];
    }

    /**
     * Get dentist qualifications as array
     */
    public function getQualifications(): array
    {
        return $this->qualifications ?? [];
    }

    /**
     * Get working hours for a specific day
     */
    public function getWorkingHours(string $day): ?array
    {
        return $this->working_hours[$day] ?? null;
    }

    /**
     * Check if dentist is available on a specific date and time
     */
    public function isAvailableOn(string $date, string $time = null): bool
    {
        if (!$this->is_active) {
            return false;
        }

        // Check if date is in unavailable dates
        if (in_array($date, $this->unavailable_dates ?? [])) {
            return false;
        }

        // Get day of week
        $dayOfWeek = strtolower(date('l', strtotime($date)));

        // Check working hours for that day
        $workingHours = $this->getWorkingHours($dayOfWeek);
        if (!$workingHours) {
            return false;
        }

        // If time is provided, check if it's within working hours
        if ($time) {
            $timeCarbon = \Carbon\Carbon::parse($time);
            $startTime = \Carbon\Carbon::parse($workingHours['start']);
            $endTime = \Carbon\Carbon::parse($workingHours['end']);

            return $timeCarbon->between($startTime, $endTime);
        }

        return true;
    }

    /**
     * Get all dentists for a clinic
     */
    public static function getDentistsForClinic(int $clinicId): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('clinic_id', $clinicId)
            ->where('role', 'dentist')
            ->where('user_type', self::TYPE_CLINIC_STAFF)
            ->where('is_active', true)
            ->get();
    }

    /**
     * Get available time slots for a dentist on a specific date
     */
    public function getAvailableTimeSlots(string $date): array
    {
        if (!$this->isAvailableOn($date)) {
            return [];
        }

        $dayOfWeek = strtolower(date('l', strtotime($date)));
        $workingHours = $this->getWorkingHours($dayOfWeek);

        if (!$workingHours) {
            return [];
        }

        // Generate time slots (30-minute intervals)
        $slots = [];
        $startTime = \Carbon\Carbon::parse($workingHours['start']);
        $endTime = \Carbon\Carbon::parse($workingHours['end']);

        while ($startTime < $endTime) {
            $slots[] = $startTime->format('H:i');
            $startTime->addMinutes(30);
        }

        // Remove slots that are already booked
        $bookedSlots = $this->appointments()
            ->whereDate('scheduled_at', $date)
            ->pluck('scheduled_at')
            ->map(function ($datetime) {
                return \Carbon\Carbon::parse($datetime)->format('H:i');
            })
            ->toArray();

        return array_values(array_diff($slots, $bookedSlots));
    }

    /**
     * Get profile photo URL
     */
    public function getProfilePhotoUrl(): string
    {
        if ($this->profile_photo) {
            return asset('storage/' . $this->profile_photo);
        }

        // Return default avatar based on role
        if ($this->isDentist()) {
            return asset('images/default-dentist-avatar.png');
        }

        return asset('images/default-avatar.png');
    }

    /**
     * Get full name with title based on role
     */
    public function getFullNameWithTitle(): string
    {
        if ($this->isDentist()) {
            return "Dr. {$this->name}";
        }

        return $this->name;
    }

    /**
     * Scope to get only active users
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only dentists
     */
    public function scopeDentists($query)
    {
        return $query->where('role', 'dentist')
                    ->where('user_type', self::TYPE_CLINIC_STAFF);
    }

    /**
     * Scope to get only clinic staff
     */
    public function scopeClinicStaff($query)
    {
        return $query->where('user_type', self::TYPE_CLINIC_STAFF);
    }
}
