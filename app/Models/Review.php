<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Pre-defined review categories and their values
     */
    const REVIEW_CATEGORIES = [
        'professionalism' => [
            5 => 'Excellent',
            4 => 'Good',
            3 => 'Average',
            2 => 'Poor',
            1 => 'Very Poor'
        ],
        'communication' => [
            5 => 'Excellent',
            4 => 'Good',
            3 => 'Average',
            2 => 'Poor',
            1 => 'Very Poor'
        ],
        'treatment_quality' => [
            5 => 'Excellent',
            4 => 'Good',
            3 => 'Average',
            2 => 'Poor',
            1 => 'Very Poor'
        ],
        'bedside_manner' => [
            5 => 'Excellent',
            4 => 'Good',
            3 => 'Average',
            2 => 'Poor',
            1 => 'Very Poor'
        ]
    ];

    protected $fillable = [
        'clinic_id',
        'patient_id',
        'appointment_id',
        'staff_id',
        'title',
        'content',
        'rating',
        'professionalism_rating',
        'communication_rating',
        'treatment_quality_rating',
        'bedside_manner_rating',
        'comment',
        'source',
        'external_review_id',
        'status',
        'is_verified',
        'helpful_count',
        'reported_count',
        'review_date',
    ];

    protected $casts = [
        'rating' => 'integer',
        'professionalism_rating' => 'integer',
        'communication_rating' => 'integer',
        'treatment_quality_rating' => 'integer',
        'bedside_manner_rating' => 'integer',
        'is_verified' => 'boolean',
        'helpful_count' => 'integer',
        'reported_count' => 'integer',
        'review_date' => 'datetime',
    ];

    /**
     * Get the clinic that owns the review.
     */
    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    /**
     * Get the patient who wrote the review.
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Get the appointment associated with the review.
     */
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    /**
     * Get the staff member (doctor) being reviewed.
     */
    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id')
                    ->where('role', 'dentist');
    }

    /**
     * Scope to get only approved reviews.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope to get reviews by source.
     */
    public function scopeBySource($query, $source)
    {
        return $query->where('source', $source);
    }

    /**
     * Scope to get verified reviews.
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope to get reviews for a specific doctor.
     */
    public function scopeForDoctor($query, $doctorId)
    {
        return $query->where('staff_id', $doctorId);
    }

    /**
     * Scope to get clinic-only reviews (no staff_id).
     */
    public function scopeClinicOnly($query)
    {
        return $query->whereNull('staff_id');
    }

    /**
     * Scope to get doctor reviews only.
     */
    public function scopeDoctorReviews($query)
    {
        return $query->whereNotNull('staff_id');
    }

    /**
     * Get the average rating for a clinic.
     */
    public static function getAverageRating($clinicId)
    {
        return self::where('clinic_id', $clinicId)
            ->approved()
            ->avg('rating');
    }

    /**
     * Get the total review count for a clinic.
     */
    public static function getReviewCount($clinicId)
    {
        return self::where('clinic_id', $clinicId)
            ->approved()
            ->count();
    }

    /**
     * Get rating distribution for a clinic.
     */
    public static function getRatingDistribution($clinicId)
    {
        return self::where('clinic_id', $clinicId)
            ->approved()
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->get();
    }

    /**
     * Check if a patient has already reviewed this clinic.
     */
    public static function hasPatientReviewed($clinicId, $patientId)
    {
        return self::where('clinic_id', $clinicId)
            ->where('patient_id', $patientId)
            ->exists();
    }

    /**
     * Check if a patient has already reviewed a specific doctor.
     */
    public static function hasPatientReviewedDoctor($clinicId, $patientId, $doctorId)
    {
        return self::where('clinic_id', $clinicId)
            ->where('patient_id', $patientId)
            ->where('staff_id', $doctorId)
            ->exists();
    }

    /**
     * Get the average rating for a specific doctor.
     */
    public static function getDoctorAverageRating($doctorId)
    {
        return self::where('staff_id', $doctorId)
            ->approved()
            ->avg('rating');
    }

    /**
     * Get the total review count for a specific doctor.
     */
    public static function getDoctorReviewCount($doctorId)
    {
        return self::where('staff_id', $doctorId)
            ->approved()
            ->count();
    }

    /**
     * Get category-specific average ratings for a doctor.
     */
    public static function getDoctorCategoryRatings($doctorId)
    {
        return self::where('staff_id', $doctorId)
            ->approved()
            ->selectRaw('
                AVG(professionalism_rating) as avg_professionalism,
                AVG(communication_rating) as avg_communication,
                AVG(treatment_quality_rating) as avg_treatment_quality,
                AVG(bedside_manner_rating) as avg_bedside_manner
            ')
            ->first();
    }

    /**
     * Get the display name for the reviewer.
     */
    public function getReviewerNameAttribute()
    {
        if ($this->patient && $this->patient->user) {
            return $this->patient->user->name;
        }

        if ($this->patient) {
            return $this->patient->first_name . ' ' . $this->patient->last_name;
        }

        return 'Anonymous';
    }

    /**
     * Get the formatted review date.
     */
    public function getFormattedDateAttribute()
    {
        return $this->review_date ? $this->review_date->diffForHumans() : $this->created_at->diffForHumans();
    }

    /**
     * Get the source display name.
     */
    public function getSourceDisplayNameAttribute()
    {
        return match($this->source) {
            'internal' => 'Smile Suite',
            'google' => 'Google',
            'external' => 'External',
            'manual' => 'Manual Entry',
            default => ucfirst($this->source)
        };
    }
}
