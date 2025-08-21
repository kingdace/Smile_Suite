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
}
