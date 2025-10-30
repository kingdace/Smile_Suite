<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🔍 CHECKING REAL WEB REQUEST SIMULATION\n";
echo "========================================\n\n";

// Simulate what happens in a real web request
$user = App\Models\User::where('email', 'enhaynesdental@gmail.com')->first();

echo "1️⃣ User Details:\n";
echo "   ID: {$user->id}\n";
echo "   Email: {$user->email}\n";
echo "   Role: {$user->role}\n";
echo "   Clinic ID: {$user->clinic_id}\n";
echo "   Clinic ID Type: " . gettype($user->clinic_id) . "\n";
echo "   Clinic ID is NULL? " . ($user->clinic_id === null ? 'YES' : 'NO') . "\n\n";

// Check the exact condition from NotificationController
echo "2️⃣ NotificationController Condition Check:\n";
echo "   (!user): " . (!$user ? 'TRUE (would return empty)' : 'FALSE (passes)') . "\n";
echo "   (!user->clinic_id): " . (!$user->clinic_id ? 'TRUE (would return empty)' : 'FALSE (passes)') . "\n\n";

if (!$user || !$user->clinic_id) {
    echo "   ❌ CONDITION FAILS! Would return empty array!\n\n";
} else {
    echo "   ✅ CONDITION PASSES! Should get notifications\n\n";
}

// Simulate the exact code from NotificationController
echo "3️⃣ Simulating NotificationController->index():\n";
$service = app(App\Services\NotificationService::class);
$limit = 10;
$unreadOnly = false;

try {
    $notifications = $service->getNotificationsForUser($user, $limit, $unreadOnly);
    $unreadCount = $service->getUnreadCountForUser($user);
    
    echo "   Notifications Count: " . count($notifications) . "\n";
    echo "   Unread Count: $unreadCount\n";
    echo "   Would Return: " . json_encode([
        'notifications' => count($notifications) . ' items',
        'unread_count' => $unreadCount
    ]) . "\n\n";
    
    if (count($notifications) > 0) {
        echo "   ✅ SUCCESS! API should return data\n";
    } else {
        echo "   ❌ PROBLEM! Returns empty even though user is valid\n";
    }
} catch (\Exception $e) {
    echo "   ❌ ERROR: {$e->getMessage()}\n";
}

echo "\n4️⃣ Check Notification Structure:\n";
$sampleNotif = App\Models\Notification::where('clinic_id', 27)->first();
if ($sampleNotif) {
    echo "   Notification ID: {$sampleNotif->id}\n";
    echo "   Clinic ID: {$sampleNotif->clinic_id}\n";
    echo "   Clinic ID Type: " . gettype($sampleNotif->clinic_id) . "\n";
    echo "   Target Roles: " . json_encode($sampleNotif->target_roles) . "\n";
    echo "   Target Roles Type: " . gettype($sampleNotif->target_roles) . "\n";
    echo "   Is Array: " . (is_array($sampleNotif->target_roles) ? 'YES' : 'NO') . "\n";
}

echo "\n✅ Complete!\n";

