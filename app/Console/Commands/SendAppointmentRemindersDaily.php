<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Appointment;
use App\Services\SemaphoreSmsService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendAppointmentRemindersDaily extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'appointments:send-daily-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send SMS and Email reminders to patients with appointments scheduled for today';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🕐 Starting daily appointment reminders...');

        try {
            // Get appointments scheduled for today (8:00 AM onwards)
            $todayStart = now()->startOfDay();
            $todayEnd = now()->endOfDay();

            $todayAppointments = Appointment::with(['patient', 'assignedDentist', 'status', 'clinic', 'service'])
                ->whereBetween('scheduled_at', [$todayStart, $todayEnd])
                ->whereHas('status', function($query) {
                    $query->whereIn('name', ['Pending', 'Confirmed']);
                })
                // Safety: Only get appointments that haven't been reminded today
                // Check if notes field doesn't contain today's reminder marker
                ->where(function($query) use ($todayStart) {
                    $todayMarker = 'sms_reminder_' . $todayStart->format('Y-m-d');
                    $query->whereNull('notes')
                          ->orWhere('notes', 'NOT LIKE', "%{$todayMarker}%");
                })
                ->get();

            $this->info("📋 Found {$todayAppointments->count()} appointments scheduled for today");

            if ($todayAppointments->isEmpty()) {
                $this->info('✅ No appointments scheduled for today. Skipping reminders.');
                return Command::SUCCESS;
            }

            $smsService = app(SemaphoreSmsService::class);

            $stats = [
                'total' => $todayAppointments->count(),
                'sms_sent' => 0,
                'sms_failed' => 0,
                'email_sent' => 0,
                'email_failed' => 0,
                'no_phone' => 0,
                'no_email' => 0,
            ];

            $progressBar = $this->output->createProgressBar($todayAppointments->count());
            $progressBar->start();

            foreach ($todayAppointments as $appointment) {
                try {
                    $patient = $appointment->patient;
                    $dentist = $appointment->assignedDentist;

                    if (!$patient) {
                        $progressBar->advance();
                        continue;
                    }

                    // Send SMS reminder
                    if ($patient->phone_number) {
                        try {
                            $smsResult = $smsService->sendAppointmentReminder($appointment, $patient, $dentist);

                            if ($smsResult['success']) {
                                $stats['sms_sent']++;

                                // Safety: Mark this appointment as reminded today to prevent duplicates
                                $todayMarker = 'sms_reminder_' . now()->format('Y-m-d');
                                $currentNotes = $appointment->notes ?? '';
                                $appointment->update([
                                    'notes' => $currentNotes . "\n[{$todayMarker}]"
                                ]);

                                $this->line("\n📱 SMS sent to {$patient->first_name} {$patient->last_name}");
                            } else {
                                $stats['sms_failed']++;
                                $this->line("\n⚠️ SMS failed for {$patient->first_name} {$patient->last_name}: " . ($smsResult['error'] ?? 'Unknown error'));
                            }
                        } catch (\Exception $e) {
                            $stats['sms_failed']++;
                            Log::error('Failed to send SMS reminder', [
                                'appointment_id' => $appointment->id,
                                'patient_id' => $patient->id,
                                'error' => $e->getMessage()
                            ]);
                        }
                    } else {
                        $stats['no_phone']++;
                    }

                    // Send Email reminder (if we have email templates for same-day reminders)
                    // For now, we'll just log that we could send an email reminder here
                    // You can add email sending logic if you create an AppointmentReminderMail template

                    $progressBar->advance();

                } catch (\Exception $e) {
                    Log::error('Error processing appointment reminder', [
                        'appointment_id' => $appointment->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            $progressBar->finish();
            $this->newLine(2);

            // Display statistics
            $this->info('📊 Reminder Statistics:');
            $this->table(
                ['Metric', 'Count'],
                [
                    ['Total Appointments', $stats['total']],
                    ['SMS Sent', $stats['sms_sent']],
                    ['SMS Failed', $stats['sms_failed']],
                    ['No Phone Number', $stats['no_phone']],
                ]
            );

            $this->info('✅ Daily reminders completed successfully!');

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error('❌ Failed to send daily reminders: ' . $e->getMessage());
            Log::error('Daily reminder command failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Command::FAILURE;
        }
    }
}

