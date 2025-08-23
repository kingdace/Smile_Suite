<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'clinic_id',
        'patient_id',
        'assigned_to',
        'scheduled_at',
        'ended_at',
        'status',
        'payment_status',
        'reason',
        'notes',
        'duration',
        'is_recurring',
        'recurring_parent_id',
        'appointment_type_id',
        'appointment_status_id',
        'service_id',
        'created_by',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'ended_at' => 'datetime',
        'is_recurring' => 'boolean',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(AppointmentType::class, 'appointment_type_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(AppointmentStatus::class, 'appointment_status_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignedDentist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function treatments()
    {
        return $this->hasMany(Treatment::class);
    }

    public function recurringPattern()
    {
        return $this->hasOne(RecurringAppointment::class);
    }

    public function recurringAppointments()
    {
        return $this->hasMany(Appointment::class, 'recurring_parent_id');
    }

    public function parentAppointment()
    {
        return $this->belongsTo(Appointment::class, 'recurring_parent_id');
    }

    public function getAvailableTimeSlots($date, $duration)
    {
        $schedule = DentistSchedule::where('user_id', $this->assigned_to)
            ->where(function ($query) use ($date) {
                $query->where('date', $date)
                    ->orWhere(function ($q) use ($date) {
                        $q->whereNull('date')
                            ->where('day_of_week', $date->dayOfWeek);
                    });
            })
            ->where('is_available', true)
            ->first();

        if (!$schedule) {
            return [];
        }

        return $schedule->getAvailableTimeSlots($date, $duration);
    }
}
