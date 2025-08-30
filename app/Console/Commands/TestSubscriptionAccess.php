<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Clinic;
use App\Services\SubscriptionService;

class TestSubscriptionAccess extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:test-access {--clinic-id= : Test specific clinic by ID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test subscription access control for clinics';

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
        $this->info('🧪 Testing Subscription Access Control...');
        $this->newLine();

        $clinicId = $this->option('clinic-id');

        if ($clinicId) {
            $clinic = Clinic::find($clinicId);
            if (!$clinic) {
                $this->error("Clinic with ID {$clinicId} not found!");
                return 1;
            }
            $clinics = collect([$clinic]);
        } else {
            $clinics = Clinic::all();
        }

        $this->info("Testing {$clinics->count()} clinic(s)...");
        $this->newLine();

        $table = [];
        $headers = ['ID', 'Name', 'Status', 'Plan', 'End Date', 'Access Control'];

        foreach ($clinics as $clinic) {
            $status = $clinic->subscription_status;
            $endDate = $clinic->subscription_end_date ? $clinic->subscription_end_date->format('Y-m-d H:i') : 'N/A';

            // Test access control logic
            $accessControl = $this->testAccessControl($clinic);

            $table[] = [
                $clinic->id,
                $clinic->name,
                $status,
                $clinic->subscription_plan,
                $endDate,
                $accessControl
            ];
        }

        $this->table($headers, $table);

        $this->newLine();
        $this->info('✅ Subscription access control test completed!');

        return 0;
    }

    private function testAccessControl(Clinic $clinic)
    {
        $status = $clinic->subscription_status;

        switch ($status) {
            case 'suspended':
                return '❌ BLOCKED - Account suspended';
            case 'grace_period':
                return '⚠️ WARNING - Grace period (limited access)';
            case 'trial':
                return '✅ ALLOWED - Trial period';
            case 'active':
                return '✅ ALLOWED - Active subscription';
            case 'inactive':
                return '❌ BLOCKED - Inactive account';
            default:
                return '❓ UNKNOWN - Status not recognized';
        }
    }
}
