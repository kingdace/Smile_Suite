<?php

namespace App\Jobs;

use App\Models\Appointment;
use App\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendUpcomingAppointmentReminders implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $notificationService;

    /**
     * Create a new job instance.
     */
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Get appointments scheduled for tomorrow (24 hours from now)
            $tomorrowStart = now()->addDay()->startOfDay();
            $tomorrowEnd = now()->addDay()->endOfDay();

            $upcomingAppointments = Appointment::with(['patient', 'assignedDentist', 'status', 'clinic'])
                ->whereBetween('scheduled_at', [$tomorrowStart, $tomorrowEnd])
                ->whereHas('status', function($query) {
                    $query->whereIn('name', ['Pending', 'Confirmed']);
                })
                ->get();

            Log::info("Found {$upcomingAppointments->count()} upcoming appointments for tomorrow");

            foreach ($upcomingAppointments as $appointment) {
                $this->createUpcomingReminderNotification($appointment);
            }

            // Get appointments scheduled for next week (7 days from now)
            $nextWeekStart = now()->addWeek()->startOfDay();
            $nextWeekEnd = now()->addWeek()->endOfDay();

            $weekAppointments = Appointment::with(['patient', 'assignedDentist', 'status', 'clinic'])
                ->whereBetween('scheduled_at', [$nextWeekStart, $nextWeekEnd])
                ->whereHas('status', function($query) {
                    $query->whereIn('name', ['Pending', 'Confirmed']);
                })
                ->get();

            Log::info("Found {$weekAppointments->count()} upcoming appointments for next week");

            foreach ($weekAppointments as $appointment) {
                $this->createWeeklyReminderNotification($appointment);
            }

        } catch (\Exception $e) {
            Log::error('Failed to send upcoming appointment reminders: ' . $e->getMessage());
        }
    }

    /**
     * Create notification for appointments tomorrow
     */
    private function createUpcomingReminderNotification(Appointment $appointment): void
    {
        try {
            $patient = $appointment->patient;
            $dentist = $appointment->assignedDentist;
            $appointmentDate = $appointment->scheduled_at->format('M j, Y \a\t g:i A');
            $patientName = $patient->first_name . ' ' . $patient->last_name;
            $dentistName = $dentist ? $dentist->name : 'Unassigned';

            $this->notificationService->createAppointmentNotification([
                'clinic_id' => $appointment->clinic_id,
                'title' => 'Upcoming Appointment Tomorrow',
                'message' => "Reminder: {$patientName} has an appointment tomorrow ({$appointmentDate}) with Dr. {$dentistName}",
                'priority' => 'high',
                'target_roles' => ['clinic_admin', 'dentist', 'staff'],
                'data' => [
                    'appointment_id' => $appointment->id,
                    'patient_id' => $appointment->patient_id,
                    'patient_name' => $patientName,
                    'dentist_id' => $appointment->assigned_to,
                    'dentist_name' => $dentistName,
                    'appointment_date' => $appointmentDate,
                    'reminder_type' => 'tomorrow',
                    'action_url' => "/clinic/{$appointment->clinic_id}/appointments"
                ]
            ]);

        } catch (\Exception $e) {
            Log::error("Failed to create tomorrow reminder for appointment {$appointment->id}: " . $e->getMessage());
        }
    }

    /**
     * Create notification for appointments next week
     */
    private function createWeeklyReminderNotification(Appointment $appointment): void
    {
        try {
            $patient = $appointment->patient;
            $dentist = $appointment->assignedDentist;
            $appointmentDate = $appointment->scheduled_at->format('M j, Y \a\t g:i A');
            $patientName = $patient->first_name . ' ' . $patient->last_name;
            $dentistName = $dentist ? $dentist->name : 'Unassigned';

            $this->notificationService->createAppointmentNotification([
                'clinic_id' => $appointment->clinic_id,
                'title' => 'Upcoming Appointment Next Week',
                'message' => "Reminder: {$patientName} has an appointment next week ({$appointmentDate}) with Dr. {$dentistName}",
                'priority' => 'medium',
                'target_roles' => ['clinic_admin', 'dentist', 'staff'],
                'data' => [
                    'appointment_id' => $appointment->id,
                    'patient_id' => $appointment->patient_id,
                    'patient_name' => $patientName,
                    'dentist_id' => $appointment->assigned_to,
                    'dentist_name' => $dentistName,
                    'appointment_date' => $appointmentDate,
                    'reminder_type' => 'next_week',
                    'action_url' => "/clinic/{$appointment->clinic_id}/appointments"
                ]
            ]);

        } catch (\Exception $e) {
            Log::error("Failed to create weekly reminder for appointment {$appointment->id}: " . $e->getMessage());
        }
    }
}
