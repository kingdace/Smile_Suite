<?php

// Quick SMS Test Script
// Run with: php test_sms.php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$smsService = app('App\Services\SemaphoreSmsService');

// Test phone number
$testPhone = '09457766068';
$testMessage = 'Test SMS from Smile Suite - SMS functionality is working!';

echo "🧪 Testing SMS Service...\n";
echo "Phone: {$testPhone}\n";
echo "Config: " . json_encode($smsService->getConfig()) . "\n\n";

// Validate phone
echo "📞 Validating phone number...\n";
$isValid = $smsService->validatePhoneNumber($testPhone);
echo "Valid: " . ($isValid ? "✅ YES" : "❌ NO") . "\n\n";

if ($isValid) {
    echo "📤 Sending test SMS...\n";
    $result = $smsService->send($testPhone, $testMessage);

    echo "\n📊 Result:\n";
    print_r($result);

    if ($result['success']) {
        echo "\n✅ SMS TEST SUCCESSFUL!\n";
        if (isset($result['test_mode']) && $result['test_mode']) {
            echo "ℹ️  Test mode is ON - No actual SMS sent, no credits used\n";
        } else {
            echo "📱 SMS sent successfully!\n";
        }
    } else {
        echo "\n❌ SMS TEST FAILED\n";
        echo "Error: " . ($result['error'] ?? 'Unknown error') . "\n";
    }
} else {
    echo "\n❌ Invalid phone number format\n";
}

echo "\n✅ Test complete. Check storage/logs/laravel.log for detailed logs.\n";

