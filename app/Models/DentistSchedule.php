<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class DentistSchedule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'clinic_id',
        'user_id',
        'day_of_week',
        'start_time',
        'end_time',
        'buffer_time',
        'is_available',
        'date',
        'exception_type',
        'schedule_type',
        'recurring_pattern',
        'is_template',
        'template_name',
        'valid_from',
        'valid_until',
        'notes',
        'slot_duration',
        'allow_overlap',
        'max_appointments_per_day',
    ];

    protected $casts = [
        'start_time' => 'string',
        'end_time' => 'string',
        'date' => 'date',
        'is_available' => 'boolean',
        'buffer_time' => 'integer',
        'recurring_pattern' => 'array',
        'is_template' => 'boolean',
        'valid_from' => 'date',
        'valid_until' => 'date',
        'slot_duration' => 'integer',
        'allow_overlap' => 'boolean',
        'max_appointments_per_day' => 'integer',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function dentist()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function exceptions()
    {
        return $this->hasMany(ScheduleException::class);
    }

    public function template()
    {
        return $this->belongsTo(ScheduleTemplate::class, 'template_name', 'name');
    }

    public function getAvailableTimeSlots($date, $duration = null)
    {
        // Use provided duration or default slot duration
        $slotDuration = $duration ?? $this->slot_duration ?? 30;

        // Check if schedule is valid for this date
        if (!$this->isValidForDate($date)) {
            return [];
        }

        // Check for exceptions
        $exceptions = $this->exceptions()->where(function ($query) use ($date) {
            $query->where('exception_date', $date)
                ->orWhere(function ($q) use ($date) {
                    $q->where('is_recurring_yearly', true)
                        ->whereRaw('DATE_FORMAT(exception_date, "%m-%d") = ?', [$date->format('m-d')]);
                });
        })->get();

        // If there's a day off exception, return empty
        if ($exceptions->where('exception_type', 'day_off')->count() > 0) {
            return [];
        }

        // Get modified hours if any
        $modifiedHours = $exceptions->where('exception_type', 'modified_hours')->first();

        $startTime = $modifiedHours ? Carbon::parse($modifiedHours->modified_start_time) : Carbon::parse($this->start_time);
        $endTime = $modifiedHours ? Carbon::parse($modifiedHours->modified_end_time) : Carbon::parse($this->end_time);

        $slots = [];
        $currentTime = $startTime->copy();

        // Loop through the schedule, adding buffer time for each potential slot
        while ($currentTime->copy()->addMinutes($slotDuration) <= $endTime) {
            // Check for conflicts with existing appointments
            $isAvailable = !$this->hasConflicts($date, $currentTime, $slotDuration);

            if ($isAvailable) {
                $slots[] = $currentTime->format('H:i');
            }

            $currentTime->addMinutes($slotDuration + $this->buffer_time);
        }

        return $slots;
    }

    /**
     * Check if this schedule is valid for a given date
     */
    public function isValidForDate($date): bool
    {
        // Check validity period
        if ($this->valid_from && $date < $this->valid_from) {
            return false;
        }

        if ($this->valid_until && $date > $this->valid_until) {
            return false;
        }

        // Check if it's a weekly schedule and matches the day of week
        if ($this->schedule_type === 'weekly' && $this->day_of_week !== null) {
            return $date->dayOfWeek == $this->day_of_week;
        }

        // Check if it's a specific date schedule
        if ($this->schedule_type === 'exception' && $this->date) {
            return $date->format('Y-m-d') === $this->date->format('Y-m-d');
        }

        return true;
    }

    private function hasConflicts($date, $startTime, $duration)
    {
        // If overlap is allowed, don't check for conflicts
        if ($this->allow_overlap) {
            return false;
        }

        $endTime = $startTime->copy()->addMinutes($duration);

        // Get appointments for this dentist on this date
        $existingAppointments = $this->dentist->appointments()
            ->whereDate('scheduled_at', $date)
            ->where('appointment_status_id', '!=', 4) // Exclude cancelled appointments
            ->get();

        // Check for overlaps
        foreach ($existingAppointments as $appointment) {
            $appointmentStart = Carbon::parse($appointment->scheduled_at);
            $appointmentEnd = Carbon::parse($appointment->ended_at);

            if (
                ($startTime < $appointmentEnd && $endTime > $appointmentStart)
            ) {
                return true; // Conflict found
            }
        }

        // Check daily appointment limit
        if ($this->max_appointments_per_day) {
            $dailyAppointmentCount = $this->dentist->appointments()
                ->whereDate('scheduled_at', $date)
                ->where('appointment_status_id', '!=', 4)
                ->count();

            if ($dailyAppointmentCount >= $this->max_appointments_per_day) {
                return true; // Daily limit reached
            }
        }

        return false; // No conflicts
    }

    /**
     * Get all available time slots for a dentist on a specific date
     */
    public static function getAvailableSlotsForDentist($dentistId, $date, $duration = null)
    {
        $schedules = self::where('user_id', $dentistId)
            ->where('clinic_id', function ($query) use ($dentistId) {
                $query->select('clinic_id')
                    ->from('users')
                    ->where('id', $dentistId);
            })
            ->where('is_available', true)
            ->get();

        $allSlots = [];
        foreach ($schedules as $schedule) {
            $slots = $schedule->getAvailableTimeSlots($date, $duration);
            $allSlots = array_merge($allSlots, $slots);
        }

        // Remove duplicates and sort
        $allSlots = array_unique($allSlots);
        sort($allSlots);

        return $allSlots;
    }

    /**
     * Create schedule from template
     */
    public static function createFromTemplate($template, $dentistId, $clinicId)
    {
        $schedules = [];
        foreach ($template['schedule_data'] as $daySchedule) {
            $schedules[] = self::create([
                'clinic_id' => $clinicId,
                'user_id' => $dentistId,
                'day_of_week' => $daySchedule['day_of_week'],
                'start_time' => $daySchedule['start_time'],
                'end_time' => $daySchedule['end_time'],
                'buffer_time' => $daySchedule['buffer_time'] ?? 15,
                'slot_duration' => $daySchedule['slot_duration'] ?? 30,
                'is_available' => $daySchedule['is_available'] ?? true,
                'schedule_type' => 'weekly',
            ]);
        }
        return $schedules;
    }
}
