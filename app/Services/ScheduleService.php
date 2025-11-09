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

        // Remove slots that overlap with existing appointments
        // This properly handles appointments with different durations
        $existingAppointments = $dentist->appointments()
            ->whereDate('scheduled_at', $date->format('Y-m-d'))
            ->where('appointment_status_id', '!=', 4) // Exclude cancelled
            ->whereNull('deleted_at')
            ->get(['scheduled_at', 'ended_at', 'duration']);

        // Filter out slots that overlap with any existing appointment
        $availableSlots = array_filter($slots, function ($slotTime) use ($existingAppointments, $date, $slotDuration, $dentist) {
            $slotStart = Carbon::parse($date->format('Y-m-d') . ' ' . $slotTime);
            $slotEnd = $slotStart->copy()->addMinutes($slotDuration);

            foreach ($existingAppointments as $appointment) {
                $appointmentStart = Carbon::parse($appointment->scheduled_at);
                
                // Use ended_at if available, otherwise calculate from duration
                if ($appointment->ended_at) {
                    $appointmentEnd = Carbon::parse($appointment->ended_at);
                } else {
                    // Fallback: calculate from duration if ended_at is not set
                    $appointmentDuration = $appointment->duration ?? 30;
                    $appointmentEnd = $appointmentStart->copy()->addMinutes($appointmentDuration);
                }

                // Check if slot overlaps with appointment
                // Overlap occurs if: slot starts before appointment ends AND slot ends after appointment starts
                // This ensures that appointments that end exactly when a slot starts don't block that slot
                // Example: Appointment 9:00-9:30, Slot 9:30-10:00 -> NO overlap (9:30 is boundary)
                // Example: Appointment 9:00-9:30, Slot 9:15-9:45 -> OVERLAP (slot starts during appointment)
                $overlaps = $slotStart < $appointmentEnd && $slotEnd > $appointmentStart;
                
                if ($overlaps) {
                    // Only log in debug mode to avoid log bloat in production
                    if (config('app.debug')) {
                        Log::debug('Slot overlaps with appointment - excluded', [
                            'dentist_id' => $dentist->id,
                            'slot_time' => $slotTime,
                            'slot_start' => $slotStart->format('Y-m-d H:i:s'),
                            'slot_end' => $slotEnd->format('Y-m-d H:i:s'),
                            'appointment_id' => $appointment->id,
                            'appointment_start' => $appointmentStart->format('Y-m-d H:i:s'),
                            'appointment_end' => $appointmentEnd->format('Y-m-d H:i:s'),
                            'appointment_duration' => $appointment->duration ?? 'N/A',
                        ]);
                    }
                    return false; // Slot overlaps, exclude it
                }
            }

            return true; // Slot is available
        });
        
        // Log available slots for debugging (only in debug mode to avoid log bloat)
        if (config('app.debug')) {
            Log::debug('Available slots after filtering', [
                'dentist_id' => $dentist->id,
                'date' => $date->format('Y-m-d'),
                'slot_duration' => $slotDuration,
                'total_slots_generated' => count($slots),
                'total_appointments' => $existingAppointments->count(),
                'available_slots' => array_values($availableSlots),
            ]);
        }

        // If the date is today, filter out past time slots
        $today = Carbon::today();
        if ($date->isSameDay($today)) {
            $now = Carbon::now();
            $bufferMinutes = 30;
            $cutoffTime = $now->copy()->addMinutes($bufferMinutes)->format('H:i');
            
            $availableSlots = array_filter($availableSlots, function ($slot) use ($cutoffTime) {
                return $slot >= $cutoffTime;
            });
        }

        return array_values($availableSlots);
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
            $slotTime = $startTime->format('H:i');
            $hour = (int) $startTime->format('H');
            $minute = (int) $startTime->format('i');
            
            // Exclude lunch time (12:01 PM - 12:59 PM)
            if (!($hour === 12 && $minute > 0)) {
                $slots[] = $slotTime;
            }
            
            $startTime->addMinutes($slotDuration);
        }

        // If the date is today, filter out past time slots
        $today = Carbon::today();
        if ($date->isSameDay($today)) {
            $now = Carbon::now();
            $bufferMinutes = 30;
            $cutoffTime = $now->copy()->addMinutes($bufferMinutes)->format('H:i');
            
            $slots = array_filter($slots, function ($slot) use ($cutoffTime) {
                return $slot >= $cutoffTime;
            });
        }

        return array_values($slots);
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

    /**
     * Get clinic-wide available time slots for a specific date
     * Aggregates availability across all active dentists in the clinic
     * Returns time slots where at least one dentist is available
     */
    public function getClinicAvailableSlots(int $clinicId, string $date, int $duration = null): array
    {
        try {
            $dateCarbon = Carbon::parse($date);
        } catch (\Exception $e) {
            Log::error('Error parsing date in getClinicAvailableSlots', [
                'date' => $date,
                'error' => $e->getMessage(),
                'clinic_id' => $clinicId,
            ]);
            return [];
        }

        try {
            $clinic = \App\Models\Clinic::find($clinicId);

            if (!$clinic) {
                Log::warning('Clinic not found in getClinicAvailableSlots', [
                    'clinic_id' => $clinicId,
                ]);
                return [];
            }

            // Check clinic operating hours first
            $clinicHours = $this->getClinicOperatingHoursForDate($clinic, $dateCarbon);
            if (empty($clinicHours)) {
                return []; // Clinic is closed on this date
            }

            // Get all active dentists for this clinic
            $dentists = User::where('clinic_id', $clinicId)
                ->where('role', 'dentist')
                ->where('is_active', true)
                ->get();

            if ($dentists->isEmpty()) {
                // No dentists, but clinic might have operating hours
                // Generate slots based on clinic hours only
                try {
                    return $this->generateSlotsFromClinicHours($clinicHours, $duration, $dateCarbon);
                } catch (\Exception $e) {
                    Log::error('Error generating slots from clinic hours', [
                        'error' => $e->getMessage(),
                        'clinic_id' => $clinicId,
                        'date' => $date,
                        'trace' => $e->getTraceAsString(),
                    ]);
                    return [];
                }
            }

            // Aggregate available slots from all dentists
            $allAvailableSlots = [];
            foreach ($dentists as $dentist) {
                try {
                    // Get slots for this dentist, passing clinicId to ensure business hours are applied
                    $dentistSlots = $this->getAvailableSlots($dentist->id, $date, $duration, $clinicId);
                    $allAvailableSlots = array_merge($allAvailableSlots, $dentistSlots);
                } catch (\Exception $e) {
                    Log::warning('Error getting slots for dentist', [
                        'dentist_id' => $dentist->id,
                        'error' => $e->getMessage(),
                    ]);
                    // Continue with other dentists if one fails
                    continue;
                }
            }

            // Count how many dentists are available for each slot (for future use)
            $slotAvailabilityCount = [];
            foreach ($allAvailableSlots as $slot) {
                $slotAvailabilityCount[$slot] = ($slotAvailabilityCount[$slot] ?? 0) + 1;
            }

            // Remove duplicates and sort
            $uniqueSlots = array_unique($allAvailableSlots);
            sort($uniqueSlots);

            // Filter by clinic operating hours
            try {
                $filteredSlots = $this->filterSlotsByClinicHours($uniqueSlots, $dateCarbon, $clinicId);
            } catch (\Exception $e) {
                Log::error('Error filtering slots by clinic hours', [
                    'error' => $e->getMessage(),
                    'clinic_id' => $clinicId,
                ]);
                $filteredSlots = $uniqueSlots; // Use unfiltered slots if filtering fails
            }

            // Exclude lunch time (12:01 PM - 12:59 PM) - lunch break
            $filteredSlots = array_filter($filteredSlots, function ($slot) {
                try {
                    $parts = explode(':', $slot);
                    if (count($parts) !== 2) {
                        return false; // Invalid format
                    }
                    $hour = (int) $parts[0];
                    $minute = (int) $parts[1];
                    // Exclude 12:01 to 12:59 (lunch time)
                    if ($hour === 12 && $minute > 0) {
                        return false;
                    }
                    return true;
                } catch (\Exception $e) {
                    return false; // Skip invalid slots
                }
            });

            // If the date is today, filter out past time slots
            try {
                $today = Carbon::today();
                if ($dateCarbon->isSameDay($today)) {
                    $now = Carbon::now();
                    
                    // Filter out slots that have already passed (add 30 minutes buffer for safety)
                    $bufferMinutes = 30;
                    $cutoffTime = $now->copy()->addMinutes($bufferMinutes)->format('H:i');
                    
                    $filteredSlots = array_filter($filteredSlots, function ($slot) use ($cutoffTime) {
                        return $slot >= $cutoffTime;
                    });
                }
            } catch (\Exception $e) {
                Log::warning('Error filtering past time slots for today', [
                    'error' => $e->getMessage(),
                    'date' => $dateCarbon->format('Y-m-d'),
                ]);
                // Continue without filtering if there's an error
            }

            return array_values($filteredSlots);
        } catch (\Exception $e) {
            Log::error('Unexpected error in getClinicAvailableSlots', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'clinic_id' => $clinicId,
                'date' => $date,
            ]);
            return []; // Return empty array on error instead of throwing
        }
    }

    /**
     * Get availability status for multiple dates (for calendar display)
     * Returns array with date as key and availability status: 'available', 'limited', 'full', 'closed'
     */
    public function getClinicAvailabilityStatus(int $clinicId, string $startDate, string $endDate, int $duration = null): array
    {
        $startCarbon = Carbon::parse($startDate);
        $endCarbon = Carbon::parse($endDate);
        $clinic = \App\Models\Clinic::find($clinicId);

        if (!$clinic) {
            return [];
        }

        $availabilityStatus = [];
        $currentDate = $startCarbon->copy();

        while ($currentDate <= $endCarbon) {
            $dateKey = $currentDate->format('Y-m-d');
            
            // Check if clinic is closed (holiday or no operating hours for this day)
            $clinicHours = $this->getClinicOperatingHoursForDate($clinic, $currentDate);
            if (empty($clinicHours)) {
                $availabilityStatus[$dateKey] = 'closed';
                $currentDate->addDay();
                continue;
            }

            // Get available slots for this date
            $availableSlots = $this->getClinicAvailableSlots($clinicId, $dateKey, $duration);
            
            if (empty($availableSlots)) {
                $availabilityStatus[$dateKey] = 'full';
            } else {
                // Check if there are any existing appointments on this date
                // This includes ALL appointments (regardless of how they were created - old system or new calendar)
                // Only count active appointments (exclude cancelled)
                $existingAppointmentsCount = \App\Models\Appointment::where('clinic_id', $clinicId)
                    ->whereDate('scheduled_at', $dateKey)
                    ->where('appointment_status_id', '!=', 4) // Exclude cancelled (status ID 4)
                    ->whereNull('deleted_at') // Also exclude soft-deleted appointments
                    ->count();
                
                // If there are existing appointments, mark as "limited" (yellow)
                // This ensures users see that the date has some bookings, even if there are still many slots available
                // This addresses the user's concern: dates with appointments should show yellow, not green
                if ($existingAppointmentsCount > 0) {
                    $availabilityStatus[$dateKey] = 'limited';
                    
                    Log::debug('Availability status: limited (has appointments)', [
                        'clinic_id' => $clinicId,
                        'date' => $dateKey,
                        'appointment_count' => $existingAppointmentsCount,
                        'available_slots' => count($availableSlots),
                    ]);
                } else {
                    // No appointments yet, determine status based on slot availability ratio
                    // Consider it "limited" if less than 25% of potential slots are available
                    $potentialSlots = $this->calculatePotentialSlots($clinicHours, $duration);
                    $availabilityRatio = count($availableSlots) / max($potentialSlots, 1);
                    
                    if ($availabilityRatio < 0.25) {
                        $availabilityStatus[$dateKey] = 'limited';
                    } else {
                        $availabilityStatus[$dateKey] = 'available';
                    }
                }
            }

            $currentDate->addDay();
        }

        return $availabilityStatus;
    }

    /**
     * Get clinic operating hours for a specific date
     * Returns array with 'open' and 'close' times, or empty array if closed
     */
    private function getClinicOperatingHoursForDate(\App\Models\Clinic $clinic, Carbon $date): array
    {
        // Check if it's a holiday
        if (\App\Models\ClinicHoliday::isHoliday($clinic->id, $date->format('Y-m-d'))) {
            return [];
        }

        if (!$clinic->operating_hours) {
            // No operating hours set, use default (9 AM to 5 PM)
            return ['open' => '09:00', 'close' => '17:00'];
        }

        $dayOfWeek = strtolower($date->format('l'));
        $dayHours = $clinic->operating_hours[$dayOfWeek] ?? null;

        if (!$dayHours) {
            return [];
        }

        // Handle different operating hours formats
        if (is_array($dayHours) && count($dayHours) === 2) {
            // Format: ['09:00', '17:00']
            return ['open' => $dayHours[0], 'close' => $dayHours[1]];
        } elseif (is_array($dayHours) && isset($dayHours['open'])) {
            // Format: {open: '09:00', close: '17:00', is_closed: false}
            if ($dayHours['is_closed'] ?? false) {
                return [];
            }
            return [
                'open' => $dayHours['open'] ?? '09:00',
                'close' => $dayHours['close'] ?? '17:00'
            ];
        }

        return [];
    }

    /**
     * Generate time slots from clinic operating hours
     */
    private function generateSlotsFromClinicHours(array $clinicHours, int $duration = null, Carbon $date = null): array
    {
        $slotDuration = $duration ?? 30;
        $slots = [];
        $startTime = Carbon::parse($clinicHours['open']);
        $endTime = Carbon::parse($clinicHours['close']);

        while ($startTime < $endTime) {
            $slotTime = $startTime->format('H:i');
            $hour = (int) $startTime->format('H');
            $minute = (int) $startTime->format('i');
            
            // Exclude lunch time (12:01 PM - 12:59 PM)
            if (!($hour === 12 && $minute > 0)) {
                $slots[] = $slotTime;
            }
            
            $startTime->addMinutes($slotDuration);
        }

        // If the date is today, filter out past time slots
        if ($date) {
            $today = Carbon::today();
            if ($date->isSameDay($today)) {
                $now = Carbon::now();
                $bufferMinutes = 30;
                $cutoffTime = $now->copy()->addMinutes($bufferMinutes)->format('H:i');
                
                $slots = array_filter($slots, function ($slot) use ($cutoffTime) {
                    return $slot >= $cutoffTime;
                });
            }
        }

        return array_values($slots);
    }

    /**
     * Calculate potential number of slots for a given operating hours and duration
     */
    private function calculatePotentialSlots(array $clinicHours, int $duration = null): int
    {
        $slotDuration = $duration ?? 30;
        $startTime = Carbon::parse($clinicHours['open']);
        $endTime = Carbon::parse($clinicHours['close']);
        $slots = 0;

        while ($startTime < $endTime) {
            $slots++;
            $startTime->addMinutes($slotDuration);
        }

        return $slots;
    }
}
