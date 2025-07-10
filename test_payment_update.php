<?php

/**
 * Test Payment Status Update Script for Smile Suite
 *
 * This script tests the payment status update process for clinic registration request #2
 */

require_once 'vendor/autoload.php';

// Load Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\ClinicRegistrationRequest;
use App\Mail\PaymentConfirmed;
use Illuminate\Support\Facades\Mail;

echo "🧪 Testing Payment Status Update for Request #2\n";
echo "===============================================\n\n";

// Find request #2
$request = ClinicRegistrationRequest::find(2);

if (!$request) {
    echo "❌ Request #2 not found!\n";
    exit(1);
}

echo "📋 Current Request Details:\n";
echo "ID: " . $request->id . "\n";
echo "Clinic: " . $request->clinic_name . "\n";
echo "Email: " . $request->email . "\n";
echo "Status: " . $request->status . "\n";
echo "Payment Status: " . $request->payment_status . "\n";
echo "Approval Token: " . $request->approval_token . "\n\n";

// Test payment status update
echo "🔄 Testing payment status update to 'paid'...\n";

try {
    $oldPaymentStatus = $request->payment_status;

    // Update payment status
    $request->update([
        'payment_status' => 'paid',
    ]);

    echo "✅ Payment status updated from '{$oldPaymentStatus}' to 'paid'\n";

    // Test email sending
    echo "📧 Testing setup email sending...\n";

    Mail::to($request->email)->send(new PaymentConfirmed($request));

    echo "✅ Setup email sent successfully!\n";
    echo "📧 Email sent to: " . $request->email . "\n";
    echo "🔗 Setup link: " . route('clinic.setup', ['token' => $request->approval_token]) . "\n\n";

    echo "🎉 Payment confirmation process completed successfully!\n";
    echo "Check your Gmail inbox for the setup email.\n";

} catch (Exception $e) {
    echo "❌ Error during payment status update:\n";
    echo "Error: " . $e->getMessage() . "\n";
}
