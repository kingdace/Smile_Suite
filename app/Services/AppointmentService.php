<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\AppointmentStatus;
use App\Models\AppointmentType;
use App\Models\Clinic;
use App\Models\Patient;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AppointmentService
{
    protected $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    /**
     * Create a new appointment
     */
    public function createAppointment(array $data, int $clinicId, int $createdBy): Appointment
    {
        // Validate appointment data
        $validationErrors = $this->validateAppointmentData($data);
        if (!empty($validationErrors)) {
            throw new \InvalidArgumentException(implode(', ', $validationErrors));
        }

        // Validate against clinic business hours
        $businessHoursErrors = $this->validateBusinessHours($data, $clinicId);
        if (!empty($businessHoursErrors)) {
            throw new \InvalidArgumentException(implode(', ', $businessHoursErrors));
        }

        // Check for scheduling conflicts
        if ($this->hasSchedulingConflict($data['assigned_to'], $data['scheduled_at'], $data['duration'] ?? 30)) {
            throw new \InvalidArgumentException('This time slot conflicts with an existing appointment.');
        }

        // Check dentist availability
        if (!$this->isDentistAvailable($data['assigned_to'], $data['scheduled_at'], $data['duration'] ?? 30)) {
            throw new \InvalidArgumentException('Dentist is not available at this time.');
        }

        // Calculate end time
        $scheduledAt = Carbon::parse($data['scheduled_at']);
        $duration = $data['duration'] ?? 30;
        $endedAt = $scheduledAt->copy()->addMinutes($duration);

        // Determine appointment status based on type
        $statusId = $this->determineAppointmentStatus($data['appointment_type_id']);

        // Create the appointment
        $appointment = Appointment::create([
            'clinic_id' => $clinicId,
            'patient_id' => $data['patient_id'],
            'assigned_to' => $data['assigned_to'],
            'scheduled_at' => $scheduledAt,
            'ended_at' => $endedAt,
            'duration' => $duration,
            'appointment_type_id' => $data['appointment_type_id'],
            'appointment_status_id' => $statusId,
            'payment_status' => $data['payment_status'] ?? 'pending',
            'reason' => $data['reason'] ?? '',
            'notes' => $data['notes'] ?? '',
            'service_id' => $data['service_id'] ?? null,
            'created_by' => $createdBy,
        ]);

        Log::info('Appointment created successfully', [
            'appointment_id' => $appointment->id,
            'patient_id' => $data['patient_id'],
            'dentist_id' => $data['assigned_to'],
            'scheduled_at' => $scheduledAt,
        ]);

        return $appointment;
    }

    /**
     * Update an existing appointment
     */
    public function updateAppointment(Appointment $appointment, array $data): Appointment
    {
        // Validate appointment data
        $validationErrors = $this->validateAppointmentData($data, $appointment->id);
        if (!empty($validationErrors)) {
            throw new \InvalidArgumentException(implode(', ', $validationErrors));
        }

        // Check for scheduling conflicts (excluding current appointment)
        if (isset($data['scheduled_at']) || isset($data['assigned_to'])) {
            $scheduledAt = $data['scheduled_at'] ?? $appointment->scheduled_at;
            $assignedTo = $data['assigned_to'] ?? $appointment->assigned_to;
            $duration = $data['duration'] ?? $appointment->duration;

            if ($this->hasSchedulingConflict($assignedTo, $scheduledAt, $duration, $appointment->id)) {
                throw new \InvalidArgumentException('This time slot conflicts with an existing appointment.');
            }
        }

        // Calculate new end time if scheduled_at or duration changed
        if (isset($data['scheduled_at']) || isset($data['duration'])) {
            $scheduledAt = Carbon::parse($data['scheduled_at'] ?? $appointment->scheduled_at);
            $duration = $data['duration'] ?? $appointment->duration;
            $data['ended_at'] = $scheduledAt->copy()->addMinutes($duration);
        }

        // Update appointment
        $appointment->update($data);

        // Handle cancellation
        if (isset($data['appointment_status_id']) && $data['appointment_status_id'] == 4) { // Cancelled
            $appointment->update(['cancelled_at' => now()]);
        }

        Log::info('Appointment updated successfully', [
            'appointment_id' => $appointment->id,
            'updated_fields' => array_keys($data),
        ]);

        return $appointment;
    }

    /**
     * Cancel an appointment
     */
    public function cancelAppointment(Appointment $appointment, string $reason = null): Appointment
    {
        $cancelledStatus = AppointmentStatus::where('name', 'Cancelled')->first();

        if (!$cancelledStatus) {
            throw new \InvalidArgumentException('Cancelled status not found');
        }

        $appointment->update([
            'appointment_status_id' => $cancelledStatus->id,
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);

        Log::info('Appointment cancelled', [
            'appointment_id' => $appointment->id,
            'reason' => $reason,
        ]);

        return $appointment;
    }

    /**
     * Reschedule an appointment
     */
    public function rescheduleAppointment(Appointment $appointment, string $newDateTime, int $newDentistId = null): Appointment
    {
        $newScheduledAt = Carbon::parse($newDateTime);
        $dentistId = $newDentistId ?? $appointment->assigned_to;

        // Check for conflicts
        if ($this->hasSchedulingConflict($dentistId, $newScheduledAt, $appointment->duration, $appointment->id)) {
            throw new \InvalidArgumentException('This time slot conflicts with an existing appointment.');
        }

        // Check dentist availability
        if (!$this->isDentistAvailable($dentistId, $newScheduledAt, $appointment->duration)) {
            throw new \InvalidArgumentException('Dentist is not available at this time.');
        }

        $newEndedAt = $newScheduledAt->copy()->addMinutes($appointment->duration);

        $appointment->update([
            'scheduled_at' => $newScheduledAt,
            'ended_at' => $newEndedAt,
            'assigned_to' => $dentistId,
        ]);

        Log::info('Appointment rescheduled', [
            'appointment_id' => $appointment->id,
            'new_scheduled_at' => $newScheduledAt,
            'new_dentist_id' => $dentistId,
        ]);

        return $appointment;
    }

    /**
     * Get available time slots for a dentist on a specific date
     */
    public function getAvailableTimeSlots(int $dentistId, string $date, int $duration = null): array
    {
        return $this->scheduleService->getAvailableSlots($dentistId, $date, $duration);
    }

    /**
     * Check if a dentist is available at a specific time
     */
    public function isDentistAvailable(int $dentistId, string $dateTime, int $duration = null): bool
    {
        $date = Carbon::parse($dateTime)->format('Y-m-d');
        $time = Carbon::parse($dateTime)->format('H:i');

        return $this->scheduleService->isDentistAvailable($dentistId, $date, $time, $duration);
    }

    /**
     * Check for scheduling conflicts
     */
    public function hasSchedulingConflict(int $dentistId, string $dateTime, int $duration, int $excludeAppointmentId = null): bool
    {
        $scheduledAt = Carbon::parse($dateTime);
        $endedAt = $scheduledAt->copy()->addMinutes($duration);

        $query = Appointment::where('assigned_to', $dentistId)
            ->where('appointment_status_id', '!=', 4) // Exclude cancelled appointments
            ->where(function ($query) use ($scheduledAt, $endedAt) {
                $query->whereBetween('scheduled_at', [$scheduledAt, $endedAt])
                    ->orWhereBetween('ended_at', [$scheduledAt, $endedAt])
                    ->orWhere(function ($q) use ($scheduledAt, $endedAt) {
                        $q->where('scheduled_at', '<=', $scheduledAt)
                            ->where('ended_at', '>=', $endedAt);
                    });
            });

        if ($excludeAppointmentId) {
            $query->where('id', '!=', $excludeAppointmentId);
        }

        return $query->exists();
    }

    /**
     * Get appointments for a date range
     */
    public function getAppointmentsForDateRange(int $clinicId, string $startDate, string $endDate, array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        $query = Appointment::where('clinic_id', $clinicId)
            ->whereBetween('scheduled_at', [$startDate, $endDate])
            ->with(['patient', 'assignedDentist', 'type', 'status']);

        // Apply filters
        if (!empty($filters['status'])) {
            $query->whereHas('status', function ($q) use ($filters) {
                $q->where('name', $filters['status']);
            });
        }

        if (!empty($filters['type'])) {
            $query->whereHas('type', function ($q) use ($filters) {
                $q->where('name', $filters['type']);
            });
        }

        if (!empty($filters['dentist_id'])) {
            $query->where('assigned_to', $filters['dentist_id']);
        }

        if (!empty($filters['patient_id'])) {
            $query->where('patient_id', $filters['patient_id']);
        }

        return $query->orderBy('scheduled_at')->get();
    }

    /**
     * Get appointment statistics
     */
    public function getAppointmentStats(int $clinicId, string $startDate, string $endDate): array
    {
        $appointments = Appointment::where('clinic_id', $clinicId)
            ->whereBetween('scheduled_at', [$startDate, $endDate])
            ->with(['status', 'type'])
            ->get();

        $stats = [
            'total' => $appointments->count(),
            'confirmed' => $appointments->where('status.name', 'Confirmed')->count(),
            'pending' => $appointments->where('status.name', 'Pending')->count(),
            'cancelled' => $appointments->where('status.name', 'Cancelled')->count(),
            'completed' => $appointments->where('status.name', 'Completed')->count(),
            'walk_in' => $appointments->where('type.name', 'Walk-in')->count(),
            'online_booking' => $appointments->where('type.name', 'Online Booking')->count(),
        ];

        // Calculate average duration
        $totalDuration = $appointments->sum('duration');
        $stats['average_duration'] = $appointments->count() > 0 ? round($totalDuration / $appointments->count(), 2) : 0;

        return $stats;
    }

    /**
     * Validate appointment data
     */
    public function validateAppointmentData(array $data, int $excludeAppointmentId = null): array
    {
        $errors = [];

        // Required fields
        $requiredFields = ['patient_id', 'assigned_to', 'scheduled_at', 'appointment_type_id'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $errors[] = ucfirst(str_replace('_', ' ', $field)) . ' is required';
            }
        }

        // Validate scheduled_at is in the future
        if (!empty($data['scheduled_at'])) {
            $scheduledAt = Carbon::parse($data['scheduled_at']);
            if ($scheduledAt->isPast()) {
                $errors[] = 'Appointment must be scheduled in the future';
            }
        }

        // Validate duration
        if (isset($data['duration'])) {
            if ($data['duration'] < 15 || $data['duration'] > 240) {
                $errors[] = 'Duration must be between 15 and 240 minutes';
            }
        }

        // Validate payment status
        if (isset($data['payment_status'])) {
            $validPaymentStatuses = ['pending', 'paid', 'partial', 'insurance'];
            if (!in_array($data['payment_status'], $validPaymentStatuses)) {
                $errors[] = 'Invalid payment status';
            }
        }

        return $errors;
    }

    /**
     * Validate appointment against clinic business hours
     */
    public function validateBusinessHours(array $data, int $clinicId): array
    {
        $errors = [];

        if (empty($data['scheduled_at'])) {
            return $errors;
        }

        $clinic = Clinic::find($clinicId);
        if (!$clinic || !$clinic->operating_hours) {
            return $errors; // No business hours set, skip validation
        }

        $scheduledAt = Carbon::parse($data['scheduled_at']);
        $dayOfWeek = strtolower($scheduledAt->format('l'));
        $time = $scheduledAt->format('H:i');

        // Check if it's a holiday
        if (\App\Models\ClinicHoliday::isHoliday($clinicId, $scheduledAt->format('Y-m-d'))) {
            $errors[] = 'Clinic is closed on ' . $scheduledAt->format('M j, Y') . ' (Holiday)';
            return $errors;
        }

        // Check if clinic is open on this day
        $dayHours = $clinic->operating_hours[$dayOfWeek] ?? null;

        // Handle different operating hours formats
        if (!$dayHours) {
            $errors[] = 'Clinic is closed on ' . $scheduledAt->format('l');
            return $errors;
        }

        // Handle array format [open, close] or object format {open, close, is_closed}
        if (is_array($dayHours) && count($dayHours) === 2) {
            // Format: ['09:00', '17:00']
            $openTime = $dayHours[0];
            $closeTime = $dayHours[1];
        } elseif (is_array($dayHours) && isset($dayHours['open'])) {
            // Format: {open: '09:00', close: '17:00', is_closed: false}
            if ($dayHours['is_closed'] ?? false) {
                $errors[] = 'Clinic is closed on ' . $scheduledAt->format('l');
                return $errors;
            }
            $openTime = $dayHours['open'] ?? '09:00';
            $closeTime = $dayHours['close'] ?? '17:00';
        } else {
            // Invalid format, assume closed
            $errors[] = 'Clinic is closed on ' . $scheduledAt->format('l');
            return $errors;
        }

        if ($time < $openTime || $time >= $closeTime) {
            $errors[] = "Appointment time must be between {$openTime} and {$closeTime} on {$scheduledAt->format('l')}";
        }

        // Check if appointment duration fits within business hours
        if (isset($data['duration'])) {
            $appointmentEnd = $scheduledAt->copy()->addMinutes($data['duration']);
            $appointmentEndTime = $appointmentEnd->format('H:i');

            if ($appointmentEndTime > $closeTime) {
                $errors[] = "Appointment duration extends beyond clinic closing time ({$closeTime})";
            }
        }

        return $errors;
    }

    /**
     * Determine appointment status based on type
     */
    private function determineAppointmentStatus(int $appointmentTypeId): int
    {
        $type = AppointmentType::find($appointmentTypeId);

        if (!$type) {
            throw new \InvalidArgumentException('Invalid appointment type');
        }

        $typeName = strtolower($type->name);

        if ($typeName === 'walk-in') {
            $status = AppointmentStatus::where('name', 'Confirmed')->first();
        } elseif ($typeName === 'online booking') {
            $status = AppointmentStatus::where('name', 'Pending')->first();
        } else {
            $status = AppointmentStatus::where('name', 'Pending')->first();
        }

        return $status ? $status->id : 1; // Default to first status if not found
    }

    /**
     * Bulk create appointments
     */
    public function bulkCreateAppointments(array $appointmentsData, int $clinicId, int $createdBy): array
    {
        $results = [];

        foreach ($appointmentsData as $index => $data) {
            try {
                $appointment = $this->createAppointment($data, $clinicId, $createdBy);
                $results[$index] = [
                    'success' => true,
                    'appointment_id' => $appointment->id,
                    'appointment' => $appointment
                ];
            } catch (\Exception $e) {
                $results[$index] = [
                    'success' => false,
                    'error' => $e->getMessage(),
                    'data' => $data
                ];
            }
        }

        return $results;
    }
}
