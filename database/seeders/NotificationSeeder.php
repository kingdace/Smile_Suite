<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    /**
     * Seed notifications for existing appointments.
     * This seeder generates notifications from existing appointments
     * that were created via direct SQL inserts (HeidiSQL) and missed
     * the AppointmentObserver triggering.
     */
    public function run(): void
    {
        $this->command->info('🔔 Starting Notification Seeder...');
        $this->command->newLine();

        // Check if notifications table exists
        if (!DB::getSchemaBuilder()->hasTable('notifications')) {
            $this->command->error('❌ Notifications table does not exist. Run migrations first.');
            return;
        }

        // Get all clinics
        $clinics = Clinic::all();
        $totalNotifications = 0;

        foreach ($clinics as $clinic) {
            $this->command->info("Processing Clinic: {$clinic->name} (ID: {$clinic->id})");

            // Get appointments for this clinic that don't have notifications yet
            $appointments = Appointment::where('clinic_id', $clinic->id)
                ->with(['patient', 'assignedDentist', 'status'])
                ->get();

            if ($appointments->isEmpty()) {
                $this->command->info("  ⚠️  No appointments found for this clinic");
                continue;
            }

            $clinicNotificationCount = 0;

            foreach ($appointments as $appointment) {
                try {
                    // Skip if appointment doesn't have required relationships
                    if (!$appointment->patient || !$appointment->status) {
                        continue;
                    }

                    // Check if notification already exists for this appointment
                    $existingNotification = Notification::where('clinic_id', $clinic->id)
                        ->whereRaw("JSON_EXTRACT(data, '$.appointment_id') = ?", [$appointment->id])
                        ->first();

                    if ($existingNotification) {
                        continue; // Skip if notification already exists
                    }

                    // Generate notification based on appointment status
                    $notification = $this->generateNotificationForAppointment($appointment);

                    if ($notification) {
                        $clinicNotificationCount++;
                        $totalNotifications++;
                    }

                } catch (\Exception $e) {
                    $this->command->error("  ❌ Error creating notification for Appointment #{$appointment->id}: {$e->getMessage()}");
                }
            }

            $this->command->info("  ✅ Created {$clinicNotificationCount} notifications for this clinic");
        }

        $this->command->newLine();
        $this->command->info("✅ Total Notifications Created: {$totalNotifications}");
    }

    /**
     * Generate a notification for an appointment based on its current status
     */
    private function generateNotificationForAppointment(Appointment $appointment): ?Notification
    {
        $patient = $appointment->patient;
        $dentist = $appointment->assignedDentist;
        $status = $appointment->status;

        if (!$patient || !$status) {
            return null;
        }

        $patientName = $patient->first_name . ' ' . $patient->last_name;
        $dentistName = $dentist ? $dentist->name : 'Unassigned';
        $appointmentDate = $appointment->scheduled_at ? 
            $appointment->scheduled_at->format('M j, Y \a\t g:i A') : 
            'Not scheduled';

        // Determine notification content based on current status
        $notificationData = $this->getNotificationDataForStatus($status->name, $patientName, $appointmentDate);

        // Determine target roles
        $targetRoles = $this->getTargetRolesForStatus($status->name);

        // Create the notification
        return Notification::create([
            'clinic_id' => $appointment->clinic_id,
            'user_id' => null, // Broadcast to all users with target roles
            'target_roles' => $targetRoles,
            'type' => 'appointment',
            'title' => $notificationData['title'],
            'message' => $notificationData['message'],
            'priority' => $notificationData['priority'],
            'data' => [
                'appointment_id' => $appointment->id,
                'patient_id' => $appointment->patient_id,
                'patient_name' => $patientName,
                'dentist_id' => $appointment->assigned_to,
                'dentist_name' => $dentistName,
                'appointment_date' => $appointmentDate,
                'status' => $status->name,
                'event_type' => 'seeded_notification',
                'action_url' => "/clinic/{$appointment->clinic_id}/appointments"
            ],
            'is_read' => false,
            'created_at' => $appointment->created_at ?? Carbon::now(),
            'updated_at' => $appointment->updated_at ?? Carbon::now(),
        ]);
    }

    /**
     * Get notification data based on appointment status
     */
    private function getNotificationDataForStatus(string $statusName, string $patientName, string $appointmentDate): array
    {
        switch ($statusName) {
            case 'Pending':
                return [
                    'title' => 'New Appointment Request',
                    'message' => "New appointment request from {$patientName} for {$appointmentDate}",
                    'priority' => 'medium'
                ];

            case 'Confirmed':
                return [
                    'title' => 'Appointment Confirmed',
                    'message' => "Appointment for {$patientName} has been confirmed for {$appointmentDate}",
                    'priority' => 'high'
                ];

            case 'Completed':
                return [
                    'title' => 'Appointment Completed',
                    'message' => "Appointment for {$patientName} has been completed",
                    'priority' => 'medium'
                ];

            case 'Cancelled':
                return [
                    'title' => 'Appointment Cancelled',
                    'message' => "Appointment for {$patientName} on {$appointmentDate} has been cancelled",
                    'priority' => 'high'
                ];

            case 'No Show':
                return [
                    'title' => 'Patient No Show',
                    'message' => "Patient {$patientName} did not show up for their appointment",
                    'priority' => 'high'
                ];

            default:
                return [
                    'title' => 'Appointment Update',
                    'message' => "Appointment for {$patientName} - Status: {$statusName}",
                    'priority' => 'medium'
                ];
        }
    }

    /**
     * Get target roles based on appointment status
     */
    private function getTargetRolesForStatus(string $statusName): array
    {
        switch ($statusName) {
            case 'Pending':
                return ['clinic_admin', 'staff'];

            case 'Confirmed':
            case 'Completed':
            case 'Cancelled':
            case 'No Show':
                return ['clinic_admin', 'dentist', 'staff'];

            default:
                return ['clinic_admin', 'staff'];
        }
    }
}


