<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'clinic_id',
        'patient_id',
        'appointment_id',
        'title',
        'content',
        'rating',
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
