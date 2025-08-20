<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Clinic;
use App\Services\SubscriptionService;
use Illuminate\Support\Facades\Log;

class CheckSubscriptionExpirations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:check-expirations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and update subscription statuses for all clinics';

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
        $this->info('🔍 Checking subscription expirations...');

        $clinics = Clinic::where('is_active', true)->get();
        $total = $clinics->count();
        $updated = 0;
        $expired = 0;
        $gracePeriod = 0;
        $suspended = 0;
        $trialExpired = 0;
        $notificationsSent = 0;

        $progressBar = $this->output->createProgressBar($total);
        $progressBar->start();

        foreach ($clinics as $clinic) {
            $oldStatus = $clinic->subscription_status;
            $newStatus = $this->subscriptionService->checkSubscriptionStatus($clinic);

            // Send expiration notifications
            $this->subscriptionService->sendExpirationNotifications($clinic);
            $notificationsSent++;

            if ($oldStatus !== $newStatus) {
                $updated++;

                switch ($newStatus) {
                    case 'grace_period':
                        if ($oldStatus === 'trial') {
                            $trialExpired++;
                            $this->line("\n🎉 Trial expired for clinic {$clinic->name}, moved to grace period");
                        } else {
                            $gracePeriod++;
                            $this->line("\n⚠️  Clinic {$clinic->name} entered grace period");
                        }
                        break;
                    case 'suspended':
                        $suspended++;
                        $this->line("\n🔴 Clinic {$clinic->name} suspended due to expired subscription");
                        break;
                    case 'expired':
                        $expired++;
                        $this->line("\n⏰ Clinic {$clinic->name} subscription expired");
                        break;
                }

                Log::info("Subscription status updated", [
                    'clinic_id' => $clinic->id,
                    'clinic_name' => $clinic->name,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                ]);
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->info("✅ Subscription check completed!");
        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Clinics Checked', $total],
                ['Status Updates', $updated],
                ['Trial Expired', $trialExpired],
                ['Entered Grace Period', $gracePeriod],
                ['Suspended', $suspended],
                ['Expired', $expired],
                ['Notifications Sent', $notificationsSent],
            ]
        );

        if ($updated > 0) {
            $this->warn("📧 Consider sending notification emails for {$updated} clinics with status changes.");
        }

        // Show detailed duration information for clinics
        $this->showDurationDetails($clinics);

        return Command::SUCCESS;
    }

    /**
     * Show detailed duration information for clinics
     */
    private function showDurationDetails($clinics)
    {
        $this->newLine();
        $this->info("📊 Detailed Duration Information:");
        $this->newLine();

        $durationData = [];
        foreach ($clinics as $clinic) {
            $duration = $this->subscriptionService->getSubscriptionDuration($clinic);

            $trialInfo = isset($duration['trial']) ? "{$duration['trial']['days_left']} days" : 'N/A';
            $subscriptionInfo = isset($duration['subscription']) ? "{$duration['subscription']['days_left']} days" : 'N/A';

            $durationData[] = [
                $clinic->name,
                $clinic->subscription_status,
                $clinic->subscription_plan,
                $trialInfo,
                $subscriptionInfo,
            ];
        }

        $this->table(
            ['Clinic', 'Status', 'Plan', 'Trial Left', 'Subscription Left'],
            $durationData
        );
    }
}
