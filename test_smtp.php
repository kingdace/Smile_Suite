<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Mail;
use App\Mail\TrialSetupEmail;
use App\Models\ClinicRegistrationRequest;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🧪 Testing SMTP Connection...\n\n";

try {
    // Create a test email
    $testEmail = 'test@example.com';

    echo "📧 Sending test email to: $testEmail\n";

    // Send a simple test email
    Mail::raw('This is a test email from Smile Suite to verify SMTP is working.', function ($message) use ($testEmail) {
        $message->to($testEmail)
                ->subject('Smile Suite SMTP Test');
    });

    echo "✅ SMTP test successful! Email sent without SSL errors.\n";

} catch (Exception $e) {
    echo "❌ SMTP test failed: " . $e->getMessage() . "\n";
    echo "🔍 Error details: " . $e->getTraceAsString() . "\n";
}
