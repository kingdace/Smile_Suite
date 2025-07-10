<?php

/**
 * Quick Email Test Script for Smile Suite
 *
 * Run this script to test if your email configuration is working:
 * php setup_email_test.php
 */

require_once 'vendor/autoload.php';

// Load Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Mail;

echo "🧪 Testing Email Configuration for Smile Suite\n";
echo "==============================================\n\n";

// Check current mail configuration
echo "📧 Current Mail Configuration:\n";
echo "MAIL_MAILER: " . config('mail.default') . "\n";
echo "MAIL_HOST: " . config('mail.mailers.smtp.host') . "\n";
echo "MAIL_PORT: " . config('mail.mailers.smtp.port') . "\n";
echo "MAIL_USERNAME: " . config('mail.mailers.smtp.username') . "\n";
echo "MAIL_FROM_ADDRESS: " . config('mail.from.address') . "\n";
echo "MAIL_FROM_NAME: " . config('mail.from.name') . "\n\n";

// Test email sending
echo "📤 Testing Email Sending...\n";

try {
    Mail::raw('This is a test email from Smile Suite. If you receive this, your email configuration is working correctly!', function($message) {
        $message->to('test@example.com')
                ->subject('Smile Suite - Email Test')
                ->from(config('mail.from.address'), config('mail.from.name'));
    });

    echo "✅ Email test completed successfully!\n";
    echo "📝 Check your email logs or inbox for the test message.\n\n";

} catch (Exception $e) {
    echo "❌ Email test failed!\n";
    echo "Error: " . $e->getMessage() . "\n\n";
    echo "🔧 Troubleshooting Tips:\n";
    echo "1. Check your .env file configuration\n";
    echo "2. Verify your email credentials\n";
    echo "3. For Gmail, make sure you're using an App Password\n";
    echo "4. Check if your email provider allows SMTP access\n\n";
}

echo "📋 Next Steps:\n";
echo "1. Update your .env file with correct email settings\n";
echo "2. Run: php artisan config:clear\n";
echo "3. Test the clinic registration flow\n";
echo "4. Check Laravel logs: tail -f storage/logs/laravel.log\n\n";

echo "🎉 Your clinic registration system is ready!\n";
echo "Visit: http://127.0.0.1:8000/register/clinic\n";
