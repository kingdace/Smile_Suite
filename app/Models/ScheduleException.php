<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScheduleException extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'dentist_schedule_id',
        'exception_date',
        'exception_type',
        'modified_start_time',
        'modified_end_time',
        'reason',
        'is_recurring_yearly',
    ];

    protected $casts = [
        'exception_date' => 'date',
        'modified_start_time' => 'datetime',
        'modified_end_time' => 'datetime',
        'is_recurring_yearly' => 'boolean',
    ];

    public function dentistSchedule()
    {
        return $this->belongsTo(DentistSchedule::class);
    }

    public function dentist()
    {
        return $this->hasOneThrough(User::class, DentistSchedule::class, 'id', 'id', 'dentist_schedule_id', 'user_id');
    }

    /**
     * Check if this exception applies to a given date
     */
    public function appliesToDate($date): bool
    {
        if ($this->exception_date->format('Y-m-d') === $date->format('Y-m-d')) {
            return true;
        }

        // Check for yearly recurring exceptions
        if ($this->is_recurring_yearly) {
            return $this->exception_date->format('m-d') === $date->format('m-d');
        }

        return false;
    }

    /**
     * Get exception types
     */
    public static function getExceptionTypes(): array
    {
        return [
            'day_off' => 'Day Off',
            'modified_hours' => 'Modified Hours',
            'unavailable' => 'Unavailable',
            'holiday' => 'Holiday',
            'vacation' => 'Vacation',
            'training' => 'Training',
            'personal' => 'Personal Leave',
            'sick' => 'Sick Leave',
        ];
    }

    /**
     * Create a yearly recurring exception
     */
    public static function createYearlyRecurring($scheduleId, $date, $type, $reason = null)
    {
        return self::create([
            'dentist_schedule_id' => $scheduleId,
            'exception_date' => $date,
            'exception_type' => $type,
            'reason' => $reason,
            'is_recurring_yearly' => true,
        ]);
    }

    /**
     * Get all exceptions for a dentist on a specific date
     */
    public static function getExceptionsForDate($dentistId, $date)
    {
        return self::whereHas('dentistSchedule', function ($query) use ($dentistId) {
            $query->where('user_id', $dentistId);
        })->where(function ($query) use ($date) {
            $query->where('exception_date', $date)
                ->orWhere(function ($q) use ($date) {
                    $q->where('is_recurring_yearly', true)
                        ->whereRaw('DATE_FORMAT(exception_date, "%m-%d") = ?', [$date->format('m-d')]);
                });
        })->get();
    }
}
