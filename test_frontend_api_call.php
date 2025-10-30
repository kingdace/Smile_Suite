<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== SIMULATING FRONTEND API CALL ===\n\n";

// Get the clinic admin user for Clinic 27
$user = App\Models\User::where('clinic_id', 27)
    ->where('role', 'clinic_admin')
    ->first();

if (!$user) {
    echo "❌ No clinic_admin found!\n";
    exit(1);
}

echo "User: {$user->email} (Role: {$user->role}, Clinic: {$user->clinic_id})\n\n";

// Simulate the NotificationController->index() method
Auth::login($user);

$controller = new \App\Http\Controllers\Clinic\NotificationController(
    new \App\Services\NotificationService()
);

// Create a fake request
$request = \Illuminate\Http\Request::create('/clinic/27/notifications/api', 'GET');
$request->setUserResolver(function () use ($user) {
    return $user;
});

try {
    $response = $controller->index($request);
    $data = $response->getData(true);
    
    echo "API Response:\n";
    echo "  Notifications count: " . count($data['notifications'] ?? []) . "\n";
    echo "  Unread count: " . ($data['unread_count'] ?? 0) . "\n";
    
    if (!empty($data['notifications'])) {
        echo "\n  First notification:\n";
        $first = $data['notifications'][0];
        echo "    ID: " . ($first['id'] ?? 'N/A') . "\n";
        echo "    Title: " . ($first['title'] ?? 'N/A') . "\n";
        echo "    Type: " . ($first['type'] ?? 'N/A') . "\n";
    }
    
    if (isset($data['debug'])) {
        echo "\n  Debug info: " . $data['debug'] . "\n";
    }
    
} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "  File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

