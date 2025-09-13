<?php

namespace App\Services;

use App\Models\DentistSchedule;
use App\Models\ScheduleException;
use App\Models\ScheduleTemplate;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class ScheduleService
{
    /**
     * Get available time slots for a dentist on a specific date
     * UNIFIED SYSTEM: Uses both DentistSchedule table and User profile working_hours
     * Now includes clinic business hours validation
     */
    public function getAvailableSlots(int $dentistId, string $date, int $duration = null, int $clinicId = null): array
    {
        $dateCarbon = Carbon::parse($date);
        $dentist = User::find($dentistId);

        if (!$dentist) {
            return [];
        }

        // PRIORITY 1: Check DentistSchedule table (Advanced Management)
        $schedules = DentistSchedule::where('user_id', $dentistId)
            ->where('is_available', true)
            ->get();

        $allSlots = [];

        if ($schedules->count() > 0) {
            // Use advanced schedule management
            foreach ($schedules as $schedule) {
                $slots = $schedule->getAvailableTimeSlots($dateCarbon, $duration);
                $allSlots = array_merge($allSlots, $slots);
            }
        } else {
            // FALLBACK: Use profile working_hours (Basic Management)
            $allSlots = $this->getSlotsFromProfileWorkingHours($dentist, $dateCarbon, $duration);
        }

        // Apply clinic business hours filter if clinic ID provided
        if ($clinicId) {
            $allSlots = $this->filterSlotsByClinicHours($allSlots, $dateCarbon, $clinicId);
        }

        // Remove duplicates and sort
        $allSlots = array_unique($allSlots);
        sort($allSlots);

        return $allSlots;
    }

    /**
     * Filter time slots by clinic business hours
     */
    private function filterSlotsByClinicHours(array $slots, Carbon $date, int $clinicId): array
    {
        $clinic = \App\Models\Clinic::find($clinicId);
        if (!$clinic || !$clinic->operating_hours) {
            return $slots; // No business hours set, return all slots
        }

        // Check if it's a holiday
        if (\App\Models\ClinicHoliday::isHoliday($clinicId, $date->format('Y-m-d'))) {
            return []; // Clinic is closed on holidays
        }

        $dayOfWeek = strtolower($date->format('l'));
        $dayHours = $clinic->operating_hours[$dayOfWeek] ?? null;

        // If clinic is closed on this day, return empty array
        if (!$dayHours) {
            return [];
        }

        // Handle different operating hours formats
        if (is_array($dayHours) && count($dayHours) === 2) {
            // Format: ['09:00', '17:00']
            $openTime = $dayHours[0];
            $closeTime = $dayHours[1];
        } elseif (is_array($dayHours) && isset($dayHours['open'])) {
            // Format: {open: '09:00', close: '17:00', is_closed: false}
            if ($dayHours['is_closed'] ?? false) {
                return [];
            }
            $openTime = $dayHours['open'] ?? '09:00';
            $closeTime = $dayHours['close'] ?? '17:00';
        } else {
            // Invalid format, assume closed
            return [];
        }

        // Filter slots that fall within business hours
        return array_filter($slots, function ($slot) use ($openTime, $closeTime) {
            return $slot >= $openTime && $slot < $closeTime;
        });
    }

    /**
     * Get time slots from user profile working_hours (fallback method)
     */
    private function getSlotsFromProfileWorkingHours(User $dentist, Carbon $date, int $duration = null): array
    {
        if (!$dentist->working_hours || !$dentist->is_active) {
            // If no working hours set, generate default slots (9 AM to 5 PM)
            return $this->generateDefaultTimeSlots($date, $duration);
        }

        // Check if date is in unavailable dates
        if (in_array($date->format('Y-m-d'), $dentist->unavailable_dates ?? [])) {
            return [];
        }

        // Get day of week
        $dayOfWeek = strtolower($date->format('l'));
        $workingHours = $dentist->working_hours[$dayOfWeek] ?? null;

        if (!$workingHours) {
            // If no working hours for this day, generate default slots
            return $this->generateDefaultTimeSlots($date, $duration);
        }

        // Generate time slots
        $slotDuration = $duration ?? 30;
        $slots = [];
        $startTime = Carbon::parse($workingHours['start']);
        $endTime = Carbon::parse($workingHours['end']);

        while ($startTime < $endTime) {
            $slots[] = $startTime->format('H:i');
            $startTime->addMinutes($slotDuration);
        }

        // Remove slots that are already booked
        $bookedSlots = $dentist->appointments()
            ->whereDate('scheduled_at', $date->format('Y-m-d'))
            ->where('appointment_status_id', '!=', 4) // Exclude cancelled
            ->pluck('scheduled_at')
            ->map(function ($datetime) {
                return Carbon::parse($datetime)->format('H:i');
            })
            ->toArray();

        return array_values(array_diff($slots, $bookedSlots));
    }

    /**
     * Generate default time slots (9 AM to 5 PM)
     */
    private function generateDefaultTimeSlots(Carbon $date, int $duration = null): array
    {
        // Include weekends for default slots (many clinics work on weekends)
        $slotDuration = $duration ?? 30;
        $slots = [];
        $startTime = Carbon::parse('09:00');
        $endTime = Carbon::parse('17:00');

        while ($startTime < $endTime) {
            $slots[] = $startTime->format('H:i');
            $startTime->addMinutes($slotDuration);
        }

        return $slots;
    }

    /**
     * Check if a dentist is available at a specific time
     */
    public function isDentistAvailable(int $dentistId, string $date, string $time, int $duration = null): bool
    {
        $availableSlots = $this->getAvailableSlots($dentistId, $date, $duration);
        return in_array($time, $availableSlots);
    }

    /**
     * Create schedule from template
     */
    public function createScheduleFromTemplate(string $templateKey, int $dentistId, int $clinicId): array
    {
        $templates = ScheduleTemplate::getDefaultTemplates();

        if (!isset($templates[$templateKey])) {
            throw new \InvalidArgumentException("Template '{$templateKey}' not found");
        }

        $template = $templates[$templateKey];
        return DentistSchedule::createFromTemplate($template, $dentistId, $clinicId);
    }

    /**
     * Create custom schedule
     */
    public function createCustomSchedule(array $scheduleData, int $dentistId, int $clinicId): DentistSchedule
    {
        return DentistSchedule::create([
            'clinic_id' => $clinicId,
            'user_id' => $dentistId,
            'day_of_week' => $scheduleData['day_of_week'] ?? null,
            'start_time' => $scheduleData['start_time'],
            'end_time' => $scheduleData['end_time'],
            'buffer_time' => $scheduleData['buffer_time'] ?? 15,
            'slot_duration' => $scheduleData['slot_duration'] ?? 30,
            'is_available' => $scheduleData['is_available'] ?? true,
            'schedule_type' => $scheduleData['schedule_type'] ?? 'weekly',
            'notes' => $scheduleData['notes'] ?? null,
            'allow_overlap' => $scheduleData['allow_overlap'] ?? false,
            'max_appointments_per_day' => $scheduleData['max_appointments_per_day'] ?? null,
        ]);
    }

    /**
     * Add schedule exception
     */
    public function addScheduleException(int $scheduleId, array $exceptionData): ScheduleException
    {
        return ScheduleException::create([
            'dentist_schedule_id' => $scheduleId,
            'exception_date' => $exceptionData['exception_date'],
            'exception_type' => $exceptionData['exception_type'],
            'modified_start_time' => $exceptionData['modified_start_time'] ?? null,
            'modified_end_time' => $exceptionData['modified_end_time'] ?? null,
            'reason' => $exceptionData['reason'] ?? null,
            'is_recurring_yearly' => $exceptionData['is_recurring_yearly'] ?? false,
        ]);
    }

    /**
     * Get dentist's schedule for a date range
     */
    public function getDentistSchedule(int $dentistId, string $startDate, string $endDate): Collection
    {
        $startCarbon = Carbon::parse($startDate);
        $endCarbon = Carbon::parse($endDate);

        return DentistSchedule::where('user_id', $dentistId)
            ->where(function ($query) use ($startCarbon, $endCarbon) {
                $query->whereBetween('valid_from', [$startCarbon, $endCarbon])
                    ->orWhereBetween('valid_until', [$startCarbon, $endCarbon])
                    ->orWhere(function ($q) use ($startCarbon, $endCarbon) {
                        $q->where('valid_from', '<=', $startCarbon)
                            ->where('valid_until', '>=', $endCarbon);
                    })
                    ->orWhereNull('valid_from')
                    ->orWhereNull('valid_until');
            })
            ->with(['exceptions'])
            ->get();
    }

    /**
     * Get all exceptions for a dentist in a date range
     */
    public function getDentistExceptions(int $dentistId, string $startDate, string $endDate): Collection
    {
        $startCarbon = Carbon::parse($startDate);
        $endCarbon = Carbon::parse($endDate);

        return ScheduleException::whereHas('dentistSchedule', function ($query) use ($dentistId) {
            $query->where('user_id', $dentistId);
        })->whereBetween('exception_date', [$startCarbon, $endCarbon])
            ->get();
    }

    /**
     * Check for scheduling conflicts
     */
    public function checkForConflicts(int $dentistId, string $date, string $startTime, int $duration): bool
    {
        $dateCarbon = Carbon::parse($date);
        $startTimeCarbon = Carbon::parse($startTime);
        $endTimeCarbon = $startTimeCarbon->copy()->addMinutes($duration);

        // Get all schedules for this dentist on this date
        $schedules = DentistSchedule::where('user_id', $dentistId)
            ->where('is_available', true)
            ->get();

        foreach ($schedules as $schedule) {
            if ($schedule->hasConflicts($dateCarbon, $startTimeCarbon, $duration)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get schedule statistics for a dentist
     */
    public function getDentistScheduleStats(int $dentistId, string $startDate, string $endDate): array
    {
        $schedules = $this->getDentistSchedule($dentistId, $startDate, $endDate);
        $exceptions = $this->getDentistExceptions($dentistId, $startDate, $endDate);

        $totalWorkingDays = 0;
        $totalExceptions = $exceptions->count();
        $totalWorkingHours = 0;

        foreach ($schedules as $schedule) {
            if ($schedule->schedule_type === 'weekly') {
                $totalWorkingDays++;
                $startTime = Carbon::parse($schedule->start_time);
                $endTime = Carbon::parse($schedule->end_time);
                $totalWorkingHours += $endTime->diffInHours($startTime);
            }
        }

        return [
            'total_schedules' => $schedules->count(),
            'total_working_days' => $totalWorkingDays,
            'total_exceptions' => $totalExceptions,
            'total_working_hours' => $totalWorkingHours,
            'average_hours_per_day' => $totalWorkingDays > 0 ? round($totalWorkingHours / $totalWorkingDays, 2) : 0,
        ];
    }

    /**
     * Bulk create schedules for multiple dentists
     */
    public function bulkCreateSchedules(array $scheduleData, array $dentistIds, int $clinicId): array
    {
        $results = [];

        foreach ($dentistIds as $dentistId) {
            try {
                $schedules = $this->createScheduleFromTemplate($scheduleData['template'], $dentistId, $clinicId);
                $results[$dentistId] = [
                    'success' => true,
                    'schedules_created' => count($schedules),
                    'schedules' => $schedules
                ];
            } catch (\Exception $e) {
                $results[$dentistId] = [
                    'success' => false,
                    'error' => $e->getMessage()
                ];
            }
        }

        return $results;
    }

    /**
     * Validate schedule data
     */
    public function validateScheduleData(array $data): array
    {
        $errors = [];

        if (empty($data['start_time'])) {
            $errors[] = 'Start time is required';
        }

        if (empty($data['end_time'])) {
            $errors[] = 'End time is required';
        }

        if (!empty($data['start_time']) && !empty($data['end_time'])) {
            $startTime = Carbon::parse($data['start_time']);
            $endTime = Carbon::parse($data['end_time']);

            if ($startTime >= $endTime) {
                $errors[] = 'End time must be after start time';
            }
        }

        if (isset($data['slot_duration']) && $data['slot_duration'] < 15) {
            $errors[] = 'Slot duration must be at least 15 minutes';
        }

        if (isset($data['buffer_time']) && $data['buffer_time'] < 0) {
            $errors[] = 'Buffer time cannot be negative';
        }

        return $errors;
    }

    /**
     * Sync user profile working_hours to DentistSchedule table
     * This creates advanced schedule entries from basic profile settings
     */
    public function syncProfileToSchedule(int $dentistId, int $clinicId): array
    {
        $dentist = User::find($dentistId);
        if (!$dentist || !$dentist->working_hours) {
            return ['success' => false, 'message' => 'No working hours found in profile'];
        }

        $createdSchedules = [];
        $dayMapping = [
            'monday' => 1,
            'tuesday' => 2,
            'wednesday' => 3,
            'thursday' => 4,
            'friday' => 5,
            'saturday' => 6,
            'sunday' => 0,
        ];

        foreach ($dentist->working_hours as $day => $hours) {
            if ($hours) {
                // Check if schedule already exists for this day
                $existingSchedule = DentistSchedule::where('user_id', $dentistId)
                    ->where('day_of_week', $dayMapping[$day])
                    ->where('schedule_type', 'weekly')
                    ->first();

                if (!$existingSchedule) {
                    $schedule = DentistSchedule::create([
                        'clinic_id' => $clinicId,
                        'user_id' => $dentistId,
                        'day_of_week' => $dayMapping[$day],
                        'start_time' => $hours['start'],
                        'end_time' => $hours['end'],
                        'buffer_time' => 15,
                        'slot_duration' => 30,
                        'is_available' => true,
                        'schedule_type' => 'weekly',
                        'notes' => "Synced from profile working hours",
                    ]);

                    $createdSchedules[] = $schedule;
                }
            }
        }

        return [
            'success' => true,
            'message' => count($createdSchedules) . ' schedules created from profile',
            'schedules' => $createdSchedules
        ];
    }

    /**
     * Get unified schedule information for a dentist
     */
    public function getUnifiedScheduleInfo(int $dentistId): array
    {
        $dentist = User::find($dentistId);
        if (!$dentist) {
            return ['error' => 'Dentist not found'];
        }

        // Check if advanced schedules exist
        $advancedSchedules = DentistSchedule::where('user_id', $dentistId)
            ->where('is_available', true)
            ->count();

        return [
            'dentist_id' => $dentistId,
            'dentist_name' => $dentist->name,
            'has_advanced_schedules' => $advancedSchedules > 0,
            'has_profile_hours' => !empty($dentist->working_hours),
            'profile_working_hours' => $dentist->working_hours,
            'is_active' => $dentist->is_active,
            'unavailable_dates' => $dentist->unavailable_dates,
            'schedule_source' => $advancedSchedules > 0 ? 'advanced' : 'profile',
        ];
    }
}
