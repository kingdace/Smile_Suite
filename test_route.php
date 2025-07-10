<?php

require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\ClinicRegistrationRequest;

echo "Testing payment status route for request #3...\n";

$request = ClinicRegistrationRequest::find(3);

if ($request) {
    echo "Request #3 found:\n";
    echo "Status: " . $request->status . "\n";
    echo "Payment Status: " . $request->payment_status . "\n";
    echo "Route: " . route('admin.clinic-requests.payment-status', 3) . "\n";
} else {
    echo "Request #3 not found!\n";
}
