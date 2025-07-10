<?php

/**
 * Test Approval Script for Smile Suite
 *
 * This script tests the approval process for clinic registration request #2
 */

require_once 'vendor/autoload.php';

// Load Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\ClinicRegistrationRequest;
use App\Mail\ClinicRegistrationApproved;
use Illuminate\Support\Facades\Mail;

echo "🧪 Testing Approval Process for Request #2\n";
echo "==========================================\n\n";

// Find request #2
$request = ClinicRegistrationRequest::find(2);

if (!$request) {
    echo "❌ Request #2 not found!\n";
    exit(1);
}

echo "📋 Request Details:\n";
echo "ID: " . $request->id . "\n";
echo "Clinic: " . $request->clinic_name . "\n";
echo "Email: " . $request->email . "\n";
echo "Status: " . $request->status . "\n";
echo "Payment Status: " . $request->payment_status . "\n";
echo "Can be approved: " . ($request->canBeApproved() ? 'Yes' : 'No') . "\n\n";

if (!$request->canBeApproved()) {
    echo "❌ Request cannot be approved!\n";
    echo "Reason: ";
    if ($request->status !== 'pending') {
        echo "Status is not pending\n";
    }
    if ($request->isExpired()) {
        echo "Request has expired\n";
    }
    exit(1);
}

echo "✅ Request can be approved!\n\n";

// Test approval process
echo "🔄 Testing approval process...\n";

try {
    // Update the request
    $request->update([
        'status' => 'approved',
        'approved_at' => now(),
        'admin_notes' => 'Test approval via script',
    ]);

    echo "✅ Request status updated to approved\n";

    // Test email sending
    echo "📧 Testing email sending...\n";

    Mail::to($request->email)->send(new ClinicRegistrationApproved($request));

    echo "✅ Approval email sent successfully!\n";
    echo "📧 Email sent to: " . $request->email . "\n\n";

    echo "🎉 Approval process completed successfully!\n";
    echo "Check your Gmail inbox for the approval email.\n";

} catch (Exception $e) {
    echo "❌ Error during approval process:\n";
    echo "Error: " . $e->getMessage() . "\n";
}
