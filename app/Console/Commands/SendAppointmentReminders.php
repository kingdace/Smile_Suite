<?php

namespace App\Console\Commands;

use App\Jobs\SendUpcomingAppointmentReminders;
use App\Services\NotificationService;
use Illuminate\Console\Command;

class SendAppointmentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'appointments:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send upcoming appointment reminder notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Sending upcoming appointment reminders...');

        $notificationService = app(NotificationService::class);

        // Dispatch the job
        SendUpcomingAppointmentReminders::dispatch($notificationService);

        $this->info('Appointment reminder job dispatched successfully!');

        return Command::SUCCESS;
    }
}
