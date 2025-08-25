<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Treatment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'clinic_id',
        'patient_id',
        'appointment_id',
        'service_id',
        'user_id',
        'name',
        'description',
        'cost',
        'status',
        'notes',
        'start_date',
        'end_date',
        'diagnosis',
        'procedures_details',
        'images',
        'recommendations',
        'tooth_numbers',
        'prescriptions',
        'follow_up_notes',
        'materials_used',
        'insurance_info',
        'payment_status',
        'vital_signs',
        'allergies',
        'medical_history',
        'consent_forms',
        'treatment_phase',
        'outcome',
        'next_appointment_date',
        'estimated_duration_minutes',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'next_appointment_date' => 'date',
        'procedures_details' => 'array',
        'images' => 'array',
        'tooth_numbers' => 'array',
        'prescriptions' => 'array',
        'materials_used' => 'array',
        'insurance_info' => 'array',
        'vital_signs' => 'array',
        'consent_forms' => 'array',
        'estimated_duration_minutes' => 'integer',
    ];

    // Status constants
    const STATUS_SCHEDULED = 'scheduled';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    // Payment status constants
    const PAYMENT_PENDING = 'pending';
    const PAYMENT_PARTIAL = 'partial';
    const PAYMENT_COMPLETED = 'completed';

    // Treatment phases
    const PHASE_INITIAL = 'initial';
    const PHASE_TREATMENT = 'treatment';
    const PHASE_FOLLOW_UP = 'follow_up';
    const PHASE_MAINTENANCE = 'maintenance';

    // Outcomes
    const OUTCOME_SUCCESSFUL = 'successful';
    const OUTCOME_PARTIAL = 'partial';
    const OUTCOME_FAILED = 'failed';
    const OUTCOME_PENDING = 'pending';

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'id';
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function dentist()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Scopes for filtering
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByService($query, $serviceId)
    {
        return $query->where('service_id', $serviceId);
    }

    public function scopeByPaymentStatus($query, $paymentStatus)
    {
        return $query->where('payment_status', $paymentStatus);
    }

    public function scopeByPhase($query, $phase)
    {
        return $query->where('treatment_phase', $phase);
    }

    public function scopeByOutcome($query, $outcome)
    {
        return $query->where('outcome', $outcome);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('start_date', [$startDate, $endDate]);
    }

    // Helper methods
    public function isCompleted()
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function isInProgress()
    {
        return $this->status === self::STATUS_IN_PROGRESS;
    }

    public function isScheduled()
    {
        return $this->status === self::STATUS_SCHEDULED;
    }

    public function isCancelled()
    {
        return $this->status === self::STATUS_CANCELLED;
    }

    public function isPaymentCompleted()
    {
        return $this->payment_status === self::PAYMENT_COMPLETED;
    }

    public function isPaymentPending()
    {
        return $this->payment_status === self::PAYMENT_PENDING;
    }

    public function isPaymentPartial()
    {
        return $this->payment_status === self::PAYMENT_PARTIAL;
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            self::STATUS_COMPLETED => 'green',
            self::STATUS_IN_PROGRESS => 'blue',
            self::STATUS_SCHEDULED => 'yellow',
            self::STATUS_CANCELLED => 'red',
            default => 'gray',
        };
    }

    public function getPaymentStatusColorAttribute()
    {
        return match($this->payment_status) {
            self::PAYMENT_COMPLETED => 'green',
            self::PAYMENT_PARTIAL => 'yellow',
            self::PAYMENT_PENDING => 'red',
            default => 'gray',
        };
    }

    public function getFormattedCostAttribute()
    {
        return '₱' . number_format($this->cost, 2);
    }

    public function getDurationFormattedAttribute()
    {
        if (!$this->estimated_duration_minutes) {
            return 'Not specified';
        }

        $hours = floor($this->estimated_duration_minutes / 60);
        $minutes = $this->estimated_duration_minutes % 60;

        if ($hours > 0) {
            return $hours . 'h ' . $minutes . 'm';
        }

        return $minutes . ' minutes';
    }
}
