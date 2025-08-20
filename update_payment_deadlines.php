<?php

/**
 * Update Payment Deadlines for Existing Requests
 * This script adds payment deadlines to existing approved requests
 */

require_once 'vendor/autoload.php';

// Load Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\ClinicRegistrationRequest;

echo "🔄 Updating Payment Deadlines for Existing Requests\n";
echo "==================================================\n\n";

// Find approved requests without payment deadlines
$requests = ClinicRegistrationRequest::where('status', 'approved')
    ->where('payment_status', 'pending')
    ->whereNull('payment_deadline')
    ->get();

if ($requests->isEmpty()) {
    echo "✅ No requests need payment deadline updates.\n";
    exit(0);
}

echo "Found {$requests->count()} approved request(s) without payment deadlines.\n\n";

foreach ($requests as $request) {
    echo "Processing: {$request->clinic_name} (ID: {$request->id})\n";

    // Set payment deadline to 7 days from approval date, or 7 days from now if no approval date
    $approvalDate = $request->approved_at ?? $request->created_at;
    $paymentDeadline = $approvalDate->addDays(7);

    // If the calculated deadline is in the past, set it to 7 days from now
    if ($paymentDeadline->isPast()) {
        $paymentDeadline = now()->addDays(7);
    }

    $request->update([
        'payment_deadline' => $paymentDeadline,
        'payment_duration_days' => 7,
    ]);

    echo "  ✅ Set payment deadline to: " . $paymentDeadline->format('Y-m-d H:i:s') . "\n";
}

echo "\n🎉 Payment deadline update completed!\n";
echo "Now check the admin interface to see the countdown timers.\n";
