<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== SIMULATING HTTP API REQUEST ===\n\n";

// Get User 91
$user = App\Models\User::find(91);

if (!$user) {
    echo "❌ User 91 not found!\n";
    exit(1);
}

echo "User: {$user->email} (Role: {$user->role}, Clinic: {$user->clinic_id})\n\n";

// Simulate what the controller does
Auth::login($user);

echo "Creating NotificationController instance...\n";
$service = new App\Services\NotificationService();
$controller = new App\Http\Controllers\Clinic\NotificationController($service);

echo "Creating fake request...\n";
$request = Illuminate\Http\Request::create('/clinic/27/notifications/api', 'GET');
$request->setUserResolver(function () use ($user) {
    return $user;
});

echo "\nCalling controller->index()...\n\n";
$response = $controller->index($request);

echo "Response Status: " . $response->getStatusCode() . "\n";
echo "Response Content:\n";
$content = json_decode($response->getContent(), true);
print_r($content);

echo "\n=== CHECK LOGS ABOVE FOR DEBUG INFO ===\n";

