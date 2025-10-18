<?php

/**
 * DEBUG SUBSCRIPTION PAYMENT ISSUE
 * 
 * This script will help us debug why automatic verification is failing
 */

// Bootstrap Laravel
require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "🔍 DEBUGGING SUBSCRIPTION PAYMENT AUTOMATIC VERIFICATION\n";
echo "=======================================================\n\n";

// Test the validation logic with sample data from the image
$samplePaymentDetails = [
    'sender_name' => 'DY MARK GALES',
    'sender_phone' => '09457766068',
    'transaction_reference' => 'REF123421321',
    'payment_amount' => 2999
];

echo "📋 Testing Payment Validation Logic\n";
echo "-----------------------------------\n";

// Test phone number validation
$phone = $samplePaymentDetails['sender_phone'];
echo "Phone Number: {$phone}\n";
if (preg_match('/^(\+63|0)9\d{9}$/', $phone)) {
    echo "✅ Phone number format is VALID\n";
} else {
    echo "❌ Phone number format is INVALID\n";
    echo "Expected format: +639xxxxxxxxx or 09xxxxxxxxx\n";
}

// Test transaction reference validation
$reference = $samplePaymentDetails['transaction_reference'];
echo "\nTransaction Reference: {$reference}\n";
if (strlen($reference) >= 8 && preg_match('/^[A-Z0-9-]+$/', $reference)) {
    echo "✅ Transaction reference format is VALID\n";
} else {
    echo "❌ Transaction reference format is INVALID\n";
    echo "Expected: At least 8 characters, only A-Z, 0-9, and hyphens\n";
}

// Test payment amount validation
$amount = floatval($samplePaymentDetails['payment_amount']);
echo "\nPayment Amount: {$amount}\n";
if ($amount > 0) {
    echo "✅ Payment amount is VALID\n";
} else {
    echo "❌ Payment amount is INVALID\n";
}

echo "\n";

// Test the complete validation
echo "📋 Testing Complete Validation\n";
echo "------------------------------\n";

$requiredFields = ['sender_name', 'sender_phone', 'transaction_reference', 'payment_amount'];
$allFieldsPresent = true;

foreach ($requiredFields as $field) {
    if (empty($samplePaymentDetails[$field])) {
        echo "❌ Missing field: {$field}\n";
        $allFieldsPresent = false;
    } else {
        echo "✅ Field present: {$field}\n";
    }
}

if ($allFieldsPresent) {
    echo "\n✅ All required fields are present\n";
} else {
    echo "\n❌ Some required fields are missing\n";
}

echo "\n";

// Test gateway simulation
echo "📋 Testing Gateway Simulation\n";
echo "-----------------------------\n";

$paymentMethod = 'gcash';
$successRates = [
    'gcash' => 0.95,
    'paymaya' => 0.93,
    'bank_transfer' => 0.90,
    'credit_card' => 0.98,
    'simulation' => 1.0
];

$successRate = $successRates[$paymentMethod] ?? 0.95;
echo "Payment Method: {$paymentMethod}\n";
echo "Success Rate: " . ($successRate * 100) . "%\n";

// Simulate multiple attempts to see success rate
$successCount = 0;
$totalAttempts = 10;

for ($i = 0; $i < $totalAttempts; $i++) {
    $isSuccess = (mt_rand() / mt_getrandmax()) < $successRate;
    if ($isSuccess) {
        $successCount++;
    }
}

echo "Simulation Results ({$totalAttempts} attempts): {$successCount} successes\n";
echo "Actual Success Rate: " . (($successCount / $totalAttempts) * 100) . "%\n";

echo "\n";

// Check if there are any recent subscription requests
echo "📋 Checking Recent Subscription Requests\n";
echo "----------------------------------------\n";

try {
    $recentRequests = \App\Models\SubscriptionRequest::where('created_at', '>=', now()->subHours(24))
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get();
    
    if ($recentRequests->count() > 0) {
        echo "Found {$recentRequests->count()} recent subscription requests:\n";
        foreach ($recentRequests as $request) {
            echo "  - ID: {$request->id}, Type: {$request->request_type}, Status: {$request->status}, Payment Status: {$request->payment_status}\n";
        }
    } else {
        echo "No recent subscription requests found\n";
    }
} catch (\Exception $e) {
    echo "Error checking subscription requests: " . $e->getMessage() . "\n";
}

echo "\n";

echo "🔧 RECOMMENDATIONS\n";
echo "==================\n";
echo "1. Check Laravel logs for detailed error messages\n";
echo "2. Verify that payment details are being sent correctly from frontend\n";
echo "3. Test with different payment methods\n";
echo "4. Check if SubscriptionService methods are working correctly\n";

echo "\n";
echo "🚀 NEXT STEPS\n";
echo "=============\n";
echo "Run: tail -f storage/logs/laravel.log\n";
echo "Then test a subscription payment to see the actual error messages\n";
