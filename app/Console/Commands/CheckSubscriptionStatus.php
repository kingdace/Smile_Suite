<?php

namespace App\Console\Commands;

use App\Models\Clinic;
use App\Services\SubscriptionService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckSubscriptionStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:check-status {--clinic-id= : Check specific clinic by ID} {--force : Force status update}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and update subscription statuses for all clinics or a specific clinic';

    protected $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        parent::__construct();
        $this->subscriptionService = $subscriptionService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $clinicId = $this->option('clinic-id');
        $force = $this->option('force');

        if ($clinicId) {
            $clinic = Clinic::find($clinicId);
            if (!$clinic) {
                $this->error("Clinic with ID {$clinicId} not found.");
                return 1;
            }
            $this->checkClinicStatus($clinic, $force);
        } else {
            $clinics = Clinic::all();
            $this->info("Checking subscription status for {$clinics->count()} clinics...");

            $bar = $this->output->createProgressBar($clinics->count());
            $bar->start();

            foreach ($clinics as $clinic) {
                $this->checkClinicStatus($clinic, $force, false);
                $bar->advance();
            }

            $bar->finish();
            $this->newLine();
            $this->info('Subscription status check completed!');
        }

        return 0;
    }

    private function checkClinicStatus(Clinic $clinic, bool $force = false, bool $showOutput = true)
    {
        $oldStatus = $clinic->subscription_status;
        $oldEndDate = $clinic->subscription_end_date;
        $oldTrialEnd = $clinic->trial_ends_at;

        // Check current status
        $newStatus = $this->subscriptionService->checkSubscriptionStatus($clinic);

        // Refresh clinic data
        $clinic->refresh();

        if ($showOutput) {
            $this->info("\nClinic: {$clinic->name} (ID: {$clinic->id})");
            $this->line("Email: {$clinic->email}");
            $this->line("Plan: {$clinic->subscription_plan}");
            $this->line("Old Status: {$oldStatus}");
            $this->line("New Status: {$newStatus}");

            if ($clinic->subscription_end_date) {
                $this->line("Subscription End: {$clinic->subscription_end_date}");
                $timeLeft = now()->diffForHumans($clinic->subscription_end_date, ['parts' => 2]);
                $this->line("Time Left: {$timeLeft}");
            }

            if ($clinic->trial_ends_at) {
                $this->line("Trial End: {$clinic->trial_ends_at}");
                $trialLeft = now()->diffForHumans($clinic->trial_ends_at, ['parts' => 2]);
                $this->line("Trial Left: {$trialLeft}");
            }

            if ($oldStatus !== $newStatus) {
                $this->warn("Status changed from {$oldStatus} to {$newStatus}");
            } else {
                $this->info("Status unchanged: {$newStatus}");
            }
        }

        // Log the check
        Log::info("Subscription status check", [
            'clinic_id' => $clinic->id,
            'clinic_name' => $clinic->name,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'subscription_end_date' => $clinic->subscription_end_date,
            'trial_ends_at' => $clinic->trial_ends_at,
            'force' => $force,
        ]);
    }
}
