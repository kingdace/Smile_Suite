<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Daily subscription status checks at 2 AM
        $schedule->command('subscriptions:check-status')
                ->dailyAt('02:00')
                ->withoutOverlapping()
                ->runInBackground();

        // Weekly subscription expiration notifications
        $schedule->command('subscriptions:check-expirations')
                ->weekly()
                ->sundays()
                ->at('09:00')
                ->withoutOverlapping()
                ->runInBackground();

        // Daily payment expiration checks
        $schedule->command('payments:check-expirations')
                ->dailyAt('03:00')
                ->withoutOverlapping()
                ->runInBackground();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
