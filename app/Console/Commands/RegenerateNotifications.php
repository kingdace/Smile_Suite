<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Notification;
use App\Models\Appointment;
use App\Models\Clinic;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RegenerateNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:regenerate 
                            {--clinic= : Specific clinic ID to regenerate notifications for}
                            {--clear : Clear existing notifications before regenerating}
                            {--dry-run : Show what would be created without actually creating}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Regenerate notifications for existing appointments (useful after HeidiSQL imports)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('╔════════════════════════════════════════════════════════════╗');
        $this->info('║   🔔 NOTIFICATION REGENERATION COMMAND                     ║');
        $this->info('╚════════════════════════════════════════════════════════════╝');
        $this->newLine();

        // Check if notifications table exists
        if (!DB::getSchemaBuilder()->hasTable('notifications')) {
            $this->error('❌ Notifications table does not exist. Run migrations first.');
            return Command::FAILURE;
        }

        $dryRun = $this->option('dry-run');
        $clearExisting = $this->option('clear');
        $specificClinicId = $this->option('clinic');

        if ($dryRun) {
            $this->warn('🔍 DRY RUN MODE - No changes will be made');
            $this->newLine();
        }

        // Clear existing notifications if requested
        if ($clearExisting && !$dryRun) {
            if ($this->confirm('⚠️  This will DELETE all existing notifications. Are you sure?', false)) {
                $deletedCount = Notification::query()->delete();
                $this->info("🗑️  Deleted {$deletedCount} existing notifications");
                $this->newLine();
            } else {
                $this->info('Skipping deletion of existing notifications');
            }
        }

        // Get clinics to process
        $clinicsQuery = Clinic::query();
        if ($specificClinicId) {
            $clinicsQuery->where('id', $specificClinicId);
        }
        $clinics = $clinicsQuery->get();

        if ($clinics->isEmpty()) {
            $this->error('❌ No clinics found to process');
            return Command::FAILURE;
        }

        $this->info("📋 Processing {$clinics->count()} clinic(s)...");
        $this->newLine();

        $totalNotifications = 0;
        $totalSkipped = 0;

        foreach ($clinics as $clinic) {
            $this->info("┌─ Clinic: {$clinic->name} (ID: {$clinic->id})");

            // Get appointments for this clinic
            $appointments = Appointment::where('clinic_id', $clinic->id)
                ->with(['patient', 'assignedDentist', 'status'])
                ->orderBy('created_at', 'asc')
                ->get();

            if ($appointments->isEmpty()) {
                $this->warn("│  ⚠️  No appointments found");
                $this->info("└─────────────────────────────────────────");
                $this->newLine();
                continue;
            }

            $clinicNotificationCount = 0;
            $clinicSkippedCount = 0;

            foreach ($appointments as $appointment) {
                try {
                    // Check if notification already exists for this appointment
                    $existingNotification = Notification::where('clinic_id', $clinic->id)
                        ->where('data->appointment_id', $appointment->id)
                        ->exists();

                    if ($existingNotification && !$clearExisting) {
                        $clinicSkippedCount++;
                        continue;
                    }

                    // Generate notification data
                    $notificationData = $this->prepareNotificationData($appointment);

                    if (!$notificationData) {
                        $clinicSkippedCount++;
                        continue;
                    }

                    if (!$dryRun) {
                        Notification::create($notificationData);
                        $clinicNotificationCount++;
                    } else {
                        $this->line("│  [DRY RUN] Would create: {$notificationData['title']}");
                        $clinicNotificationCount++;
                    }

                } catch (\Exception $e) {
                    $this->error("│  ❌ Error for Appointment #{$appointment->id}: {$e->getMessage()}");
                    $clinicSkippedCount++;
                }
            }

            $totalNotifications += $clinicNotificationCount;
            $totalSkipped += $clinicSkippedCount;

            $this->info("│  ✅ Created: {$clinicNotificationCount} | ⏭️  Skipped: {$clinicSkippedCount}");
            $this->info("└─────────────────────────────────────────");
            $this->newLine();
        }

        // Summary
        $this->info('╔════════════════════════════════════════════════════════════╗');
        $this->info('║   📊 SUMMARY                                                ║');
        $this->info('╚════════════════════════════════════════════════════════════╝');
        $this->info("  ✅ Total Notifications Created: {$totalNotifications}");
        $this->info("  ⏭️  Total Skipped: {$totalSkipped}");
        $this->newLine();

        if ($dryRun) {
            $this->warn('🔍 This was a DRY RUN - no changes were made');
            $this->info('Run without --dry-run to actually create notifications');
        } else {
            $this->info('✅ Notification regeneration complete!');
        }

        return Command::SUCCESS;
    }

    /**
     * Prepare notification data for an appointment
     */
    private function prepareNotificationData(Appointment $appointment): ?array
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

        $notificationContent = $this->getNotificationContent($status->name, $patientName, $appointmentDate);
        $targetRoles = $this->getTargetRoles($status->name);

        return [
            'clinic_id' => $appointment->clinic_id,
            'user_id' => null,
            'target_roles' => $targetRoles,
            'type' => 'appointment',
            'title' => $notificationContent['title'],
            'message' => $notificationContent['message'],
            'priority' => $notificationContent['priority'],
            'data' => [
                'appointment_id' => $appointment->id,
                'patient_id' => $appointment->patient_id,
                'patient_name' => $patientName,
                'dentist_id' => $appointment->assigned_to,
                'dentist_name' => $dentistName,
                'appointment_date' => $appointmentDate,
                'status' => $status->name,
                'event_type' => 'regenerated',
                'action_url' => "/clinic/{$appointment->clinic_id}/appointments"
            ],
            'is_read' => false,
            'created_at' => $appointment->created_at ?? Carbon::now(),
            'updated_at' => $appointment->updated_at ?? Carbon::now(),
        ];
    }

    /**
     * Get notification content based on status
     */
    private function getNotificationContent(string $statusName, string $patientName, string $appointmentDate): array
    {
        return match ($statusName) {
            'Pending' => [
                'title' => 'New Appointment Request',
                'message' => "New appointment request from {$patientName} for {$appointmentDate}",
                'priority' => 'medium'
            ],
            'Confirmed' => [
                'title' => 'Appointment Confirmed',
                'message' => "Appointment for {$patientName} has been confirmed for {$appointmentDate}",
                'priority' => 'high'
            ],
            'Completed' => [
                'title' => 'Appointment Completed',
                'message' => "Appointment for {$patientName} has been completed",
                'priority' => 'medium'
            ],
            'Cancelled' => [
                'title' => 'Appointment Cancelled',
                'message' => "Appointment for {$patientName} on {$appointmentDate} has been cancelled",
                'priority' => 'high'
            ],
            'No Show' => [
                'title' => 'Patient No Show',
                'message' => "Patient {$patientName} did not show up for their appointment",
                'priority' => 'high'
            ],
            default => [
                'title' => 'Appointment Update',
                'message' => "Appointment for {$patientName} - Status: {$statusName}",
                'priority' => 'medium'
            ]
        };
    }

    /**
     * Get target roles based on status
     */
    private function getTargetRoles(string $statusName): array
    {
        return match ($statusName) {
            'Pending' => ['clinic_admin', 'staff'],
            'Confirmed', 'Completed', 'Cancelled', 'No Show' => ['clinic_admin', 'dentist', 'staff'],
            default => ['clinic_admin', 'staff']
        };
    }
}

