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
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'date' => 'date',
        'is_available' => 'boolean',
        'buffer_time' => 'integer',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function dentist()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getAvailableTimeSlots($date, $duration)
    {
        $slots = [];
        $currentTime = Carbon::parse($this->start_time);
        $endTime = Carbon::parse($this->end_time);

        // Loop through the schedule, adding buffer time for each potential slot
        while ($currentTime->copy()->addMinutes($duration) <= $endTime) {
            // Check for conflicts with existing appointments
            $isAvailable = !$this->hasConflicts($date, $currentTime, $duration);

            if ($isAvailable) {
                $slots[] = $currentTime->format('H:i');
            }

            $currentTime->addMinutes($duration + $this->buffer_time);
        }

        return $slots;
    }

    private function hasConflicts($date, $startTime, $duration)
    {
        $endTime = $startTime->copy()->addMinutes($duration);

        // Get appointments for this dentist on this date
        $existingAppointments = $this->dentist->appointments()
            ->whereDate('scheduled_at', $date)
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

        return false; // No conflicts
    }
}
