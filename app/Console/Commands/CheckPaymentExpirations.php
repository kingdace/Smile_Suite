<?php

namespace App\Console\Commands;

use App\Models\ClinicRegistrationRequest;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckPaymentExpirations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payments:check-expirations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and mark expired payments as failed';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Checking for expired payments...');

        // Find approved requests with expired payment deadlines
        $expiredRequests = ClinicRegistrationRequest::where('status', 'approved')
            ->where('payment_status', 'pending')
            ->where('payment_deadline', '<', now())
            ->get();

        if ($expiredRequests->isEmpty()) {
            $this->info('✅ No expired payments found.');
            return 0;
        }

        $this->info("Found {$expiredRequests->count()} expired payment(s).");

        foreach ($expiredRequests as $request) {
            $this->info("Processing: {$request->clinic_name} ({$request->email})");

            // Mark as payment failed
            $request->update([
                'payment_status' => 'payment_failed',
            ]);

            // Log the expiration
            Log::info('Payment expired automatically', [
                'request_id' => $request->id,
                'clinic_name' => $request->clinic_name,
                'email' => $request->email,
                'payment_deadline' => $request->payment_deadline,
                'expired_at' => now(),
            ]);

            $this->info("  ✅ Marked as payment_failed");
        }

        $this->info('🎉 Payment expiration check completed!');
        return 0;
    }
}
