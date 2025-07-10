<?php

require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\ClinicRegistrationRequest;

$request = ClinicRegistrationRequest::find(3);

if ($request) {
    echo "Request #3 Status:\n";
    echo "Status: " . $request->status . "\n";
    echo "Payment Status: " . $request->payment_status . "\n";
    echo "Approved At: " . ($request->approved_at ? $request->approved_at : 'Not approved') . "\n";
    echo "Email: " . $request->email . "\n";
    echo "Approval Token: " . ($request->approval_token ? substr($request->approval_token, 0, 20) . '...' : 'No token') . "\n";
} else {
    echo "Request #3 not found!\n";
}
