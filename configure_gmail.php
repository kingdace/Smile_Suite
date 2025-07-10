<?php

/**
 * Gmail SMTP Configuration Script for Smile Suite
 *
 * This script will help you configure your Gmail SMTP settings.
 * Run: php configure_gmail.php
 */

echo "🔧 Gmail SMTP Configuration for Smile Suite\n";
echo "===========================================\n\n";

echo "📋 Before we start, you need to:\n";
echo "1. Enable 2-Factor Authentication on your Gmail account\n";
echo "2. Generate an App Password for 'Mail'\n";
echo "3. Have your Gmail address and App Password ready\n\n";

echo "🔗 Quick Links:\n";
echo "- Google Account Settings: https://myaccount.google.com/\n";
echo "- App Passwords: https://myaccount.google.com/apppasswords\n\n";

// Get user input
echo "Enter your Gmail address: ";
$gmail = trim(fgets(STDIN));

echo "Enter your Gmail App Password (16 characters): ";
$password = trim(fgets(STDIN));

if (empty($gmail) || empty($password)) {
    echo "❌ Please provide both Gmail address and App Password.\n";
    exit(1);
}

// Validate Gmail format
if (!filter_var($gmail, FILTER_VALIDATE_EMAIL) || !str_contains($gmail, '@gmail.com')) {
    echo "❌ Please enter a valid Gmail address.\n";
    exit(1);
}

// Validate App Password format (should be 16 characters)
if (strlen($password) !== 16) {
    echo "❌ App Password should be 16 characters long.\n";
    exit(1);
}

// Read current .env file
$envContent = file_get_contents('.env');

// Update email settings
$envContent = preg_replace('/MAIL_USERNAME=.*/', 'MAIL_USERNAME=' . $gmail, $envContent);
$envContent = preg_replace('/MAIL_PASSWORD=.*/', 'MAIL_PASSWORD=' . $password, $envContent);
$envContent = preg_replace('/MAIL_FROM_ADDRESS=.*/', 'MAIL_FROM_ADDRESS=' . $gmail, $envContent);

// Write back to .env file
file_put_contents('.env', $envContent);

echo "\n✅ Gmail SMTP configuration updated successfully!\n\n";

echo "📧 Updated Settings:\n";
echo "MAIL_USERNAME: " . $gmail . "\n";
echo "MAIL_PASSWORD: " . str_repeat('*', 16) . "\n";
echo "MAIL_FROM_ADDRESS: " . $gmail . "\n\n";

echo "🔄 Clearing configuration cache...\n";
system('php artisan config:clear');

echo "\n🧪 Testing email configuration...\n";

// Test email sending
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Mail;

try {
    Mail::raw('This is a test email from Smile Suite. Your Gmail SMTP configuration is working correctly!', function($message) use ($gmail) {
        $message->to($gmail)
                ->subject('Smile Suite - Gmail SMTP Test')
                ->from($gmail, 'Smile Suite');
    });

    echo "✅ Email test completed successfully!\n";
    echo "📧 Check your Gmail inbox for the test message.\n\n";

} catch (Exception $e) {
    echo "❌ Email test failed!\n";
    echo "Error: " . $e->getMessage() . "\n\n";
    echo "🔧 Troubleshooting:\n";
    echo "1. Make sure 2-Factor Authentication is enabled\n";
    echo "2. Verify your App Password is correct\n";
    echo "3. Check if 'Less secure app access' is disabled\n";
    echo "4. Try generating a new App Password\n\n";
}

echo "🎉 Configuration complete!\n";
echo "Your clinic registration system is now ready to send emails.\n";
echo "Visit: http://127.0.0.1:8000/register/clinic\n";
