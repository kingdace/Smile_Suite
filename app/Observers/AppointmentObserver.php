<?php

namespace App\Observers;

use App\Models\Appointment;
use App\Events\AppointmentUpdated;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;

class AppointmentObserver
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the Appointment "created" event.
     */
    public function created(Appointment $appointment): void
    {
        Log::info('👁️ [APPOINTMENT OBSERVER] Appointment created event fired', [
            'appointment_id' => $appointment->id,
            'clinic_id' => $appointment->clinic_id,
            'patient_id' => $appointment->patient_id,
        ]);

        try {
            // Broadcast appointment creation for real-time dashboard updates
            Log::info('📡 [APPOINTMENT OBSERVER] Broadcasting AppointmentUpdated event', [
                'appointment_id' => $appointment->id,
            ]);
            broadcast(new AppointmentUpdated($appointment, 'created'));

            // Create notification for new appointment request
            Log::info('🔔 [APPOINTMENT OBSERVER] Creating notification for appointment created', [
                'appointment_id' => $appointment->id,
            ]);
            $this->createAppointmentNotification($appointment, 'created');
        } catch (\Exception $e) {
            Log::error('❌ [APPOINTMENT OBSERVER] Error in created() method', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    /**
     * Handle the Appointment "updated" event.
     */
    public function updated(Appointment $appointment): void
    {
        // Only broadcast if significant changes occurred
        if ($this->hasSignificantChanges($appointment)) {
            broadcast(new AppointmentUpdated($appointment, 'updated'));
        }

        // Create notification for status changes
        if ($appointment->wasChanged('appointment_status_id')) {
            $this->createAppointmentNotification($appointment, 'status_changed');
        }

        // Create notification for schedule changes
        if ($appointment->wasChanged('scheduled_at')) {
            $this->createAppointmentNotification($appointment, 'rescheduled');
        }

        // Create notification for dentist assignment changes
        if ($appointment->wasChanged('assigned_to')) {
            $this->createAppointmentNotification($appointment, 'assigned');
        }
    }

    /**
     * Handle the Appointment "deleted" event.
     */
    public function deleted(Appointment $appointment): void
    {
        // Broadcast appointment deletion
        broadcast(new AppointmentUpdated($appointment, 'deleted'));

        // Create notification for appointment cancellation
        $this->createAppointmentNotification($appointment, 'cancelled');
    }

    /**
     * Handle the Appointment "restored" event.
     */
    public function restored(Appointment $appointment): void
    {
        // Broadcast appointment restoration
        broadcast(new AppointmentUpdated($appointment, 'restored'));
    }

    /**
     * Handle the Appointment "force deleted" event.
     */
    public function forceDeleted(Appointment $appointment): void
    {
        // Broadcast appointment force deletion
        broadcast(new AppointmentUpdated($appointment, 'force_deleted'));
    }

    /**
     * Determine if the appointment has significant changes that warrant broadcasting
     */
    private function hasSignificantChanges(Appointment $appointment): bool
    {
        // Check for changes in important fields
        $significantFields = [
            'appointment_status_id',
            'appointment_date',
            'appointment_time',
            'patient_id',
            'dentist_id',
            'appointment_type_id',
        ];

        foreach ($significantFields as $field) {
            if ($appointment->wasChanged($field)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Create notification for appointment events
     */
    private function createAppointmentNotification(Appointment $appointment, string $eventType): void
    {
        Log::info('🔔 [APPOINTMENT OBSERVER] createAppointmentNotification called', [
            'appointment_id' => $appointment->id,
            'event_type' => $eventType,
        ]);

        try {
            $patient = $appointment->patient;
            $dentist = $appointment->assignedDentist;
            $status = $appointment->status;

            if (!$patient) {
                Log::warning('⚠️ [APPOINTMENT OBSERVER] Appointment has no patient, skipping notification', [
                    'appointment_id' => $appointment->id,
                ]);
                return;
            }

            if (!$status) {
                Log::warning('⚠️ [APPOINTMENT OBSERVER] Appointment has no status, skipping notification', [
                    'appointment_id' => $appointment->id,
                ]);
                return;
            }

            $appointmentDate = $appointment->scheduled_at ?
                $appointment->scheduled_at->format('M j, Y \a\t g:i A') :
                'Not scheduled';

            // Determine notification content based on event type
            $notificationData = $this->getNotificationContent($appointment, $eventType, $patient, $dentist, $status, $appointmentDate);

            // Determine target roles based on event type
            $targetRoles = $this->getTargetRoles($eventType, $appointment);

            Log::info('📝 [APPOINTMENT OBSERVER] Prepared notification data', [
                'appointment_id' => $appointment->id,
                'event_type' => $eventType,
                'title' => $notificationData['title'],
                'target_roles' => $targetRoles,
            ]);

            // Create the notification
            $notification = $this->notificationService->createAppointmentNotification([
                'clinic_id' => $appointment->clinic_id,
                'title' => $notificationData['title'],
                'message' => $notificationData['message'],
                'priority' => $notificationData['priority'],
                'target_roles' => $targetRoles,
                'data' => [
                    'appointment_id' => $appointment->id,
                    'patient_id' => $appointment->patient_id,
                    'patient_name' => $patient->first_name . ' ' . $patient->last_name,
                    'dentist_id' => $appointment->assigned_to,
                    'dentist_name' => $dentist ? $dentist->name : 'Unassigned',
                    'appointment_date' => $appointmentDate,
                    'status' => $status->name,
                    'event_type' => $eventType,
                    'action_url' => $this->getAppropriateActionUrl($appointment, $eventType)
                ]
            ]);

            Log::info('✅ [APPOINTMENT OBSERVER] Notification created successfully', [
                'appointment_id' => $appointment->id,
                'notification_id' => $notification->id ?? 'unknown',
                'event_type' => $eventType,
            ]);

        } catch (\Exception $e) {
            // Log error but don't break the appointment flow
            Log::error('❌ [APPOINTMENT OBSERVER] Failed to create appointment notification', [
                'appointment_id' => $appointment->id,
                'event_type' => $eventType,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    /**
     * Get notification content based on event type
     */
    private function getNotificationContent(Appointment $appointment, string $eventType, $patient, $dentist, $status, string $appointmentDate): array
    {
        $patientName = $patient->first_name . ' ' . $patient->last_name;
        $dentistName = $dentist ? $dentist->name : 'Unassigned';

        switch ($eventType) {
            case 'created':
                return [
                    'title' => 'New Appointment Request',
                    'message' => "New appointment request from {$patientName} for {$appointmentDate}",
                    'priority' => 'medium'
                ];

            case 'status_changed':
                $statusMessages = [
                    'Pending' => "Appointment for {$patientName} is pending confirmation",
                    'Confirmed' => "Appointment for {$patientName} has been confirmed for {$appointmentDate}",
                    'Completed' => "Appointment for {$patientName} has been completed",
                    'Cancelled' => "Appointment for {$patientName} has been cancelled",
                    'No Show' => "Patient {$patientName} did not show up for their appointment"
                ];

                return [
                    'title' => 'Appointment Status Updated',
                    'message' => $statusMessages[$status->name] ?? "Appointment status changed to {$status->name}",
                    'priority' => $status->name === 'Confirmed' ? 'high' : 'medium'
                ];

            case 'rescheduled':
                return [
                    'title' => 'Appointment Rescheduled',
                    'message' => "Appointment for {$patientName} has been rescheduled to {$appointmentDate}",
                    'priority' => 'high'
                ];

            case 'assigned':
                return [
                    'title' => 'Dentist Assigned',
                    'message' => "Dr. {$dentistName} has been assigned to {$patientName}'s appointment on {$appointmentDate}",
                    'priority' => 'medium'
                ];

            case 'cancelled':
                return [
                    'title' => 'Appointment Cancelled',
                    'message' => "Appointment for {$patientName} on {$appointmentDate} has been cancelled",
                    'priority' => 'high'
                ];

            default:
                return [
                    'title' => 'Appointment Update',
                    'message' => "Appointment for {$patientName} has been updated",
                    'priority' => 'medium'
                ];
        }
    }

    /**
     * Get target roles for notification based on event type
     */
    private function getTargetRoles(string $eventType, Appointment $appointment): array
    {
        switch ($eventType) {
            case 'created':
                // New appointments should notify admin and staff
                return ['clinic_admin', 'staff'];

            case 'status_changed':
                // Status changes notify all relevant staff
                return ['clinic_admin', 'dentist', 'staff'];

            case 'rescheduled':
                // Reschedules are important for all staff
                return ['clinic_admin', 'dentist', 'staff'];

            case 'assigned':
                // Dentist assignment primarily notifies the assigned dentist and admin
                $roles = ['clinic_admin'];
                if ($appointment->assigned_to) {
                    $roles[] = 'dentist';
                }
                return $roles;

            case 'cancelled':
                // Cancellations notify all staff
                return ['clinic_admin', 'dentist', 'staff'];

            default:
                return ['clinic_admin', 'staff'];
        }
    }

    /**
     * Get appropriate action URL based on appointment event type
     */
    private function getAppropriateActionUrl(Appointment $appointment, string $eventType): string
    {
        switch ($eventType) {
            case 'created':
                // New appointments - navigate to appointments index to see all pending
                return "/clinic/{$appointment->clinic_id}/appointments";

            case 'status_changed':
                // Status changes - navigate to appointments index to see updated status
                return "/clinic/{$appointment->clinic_id}/appointments";

            case 'rescheduled':
                // Rescheduled appointments - navigate to appointments index
                return "/clinic/{$appointment->clinic_id}/appointments";

            case 'assigned':
                // Dentist assignment - navigate to appointments index
                return "/clinic/{$appointment->clinic_id}/appointments";

            case 'cancelled':
                // Cancelled appointments - navigate to appointments index
                return "/clinic/{$appointment->clinic_id}/appointments";

            default:
                // Default fallback - always safe to go to appointments index
                return "/clinic/{$appointment->clinic_id}/appointments";
        }
    }
}
