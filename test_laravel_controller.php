<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Auth;

echo "=== TESTING LARAVEL NOTIFICATION CONTROLLER LOGIC ===\n\n";

// 1. Get the user
$user = User::where('email', 'enhaynesdental@gmail.com')->first();

if (!$user) {
    echo "❌ User not found!\n";
    exit(1);
}

echo "✅ User Found:\n";
echo "   ID: {$user->id}\n";
echo "   Email: {$user->email}\n";
echo "   Role: '{$user->role}'\n";
echo "   Clinic ID: {$user->clinic_id}\n\n";

// 2. Test NotificationService directly
echo "=== TEST 1: NotificationService->getNotificationsForUser ===\n";
$notificationService = new NotificationService();
$notifications = $notificationService->getNotificationsForUser($user, 10);
echo "Results: " . $notifications->count() . "\n";
foreach ($notifications->take(5) as $notif) {
    echo "  ID:{$notif->id} | Title: {$notif->title}\n";
}
echo "\n";

// 3. Test Eloquent scopes directly
echo "=== TEST 2: Eloquent Scopes (forClinic + forUser) ===\n";
$scopedNotifications = Notification::forClinic($user->clinic_id)
    ->forUser($user)
    ->notExpired()
    ->orderBy('created_at', 'desc')
    ->limit(10)
    ->get();
echo "Results: " . $scopedNotifications->count() . "\n";
foreach ($scopedNotifications->take(5) as $notif) {
    echo "  ID:{$notif->id} | Title: {$notif->title}\n";
}
echo "\n";

// 4. Test forUser scope in detail
echo "=== TEST 3: Debugging forUser scope ===\n";
$query = Notification::forClinic($user->clinic_id)
    ->forUser($user)
    ->notExpired();

echo "Generated SQL:\n";
echo $query->toSql() . "\n\n";
echo "Bindings:\n";
print_r($query->getBindings());
echo "\n";

$results = $query->limit(10)->get();
echo "Results: " . $results->count() . "\n\n";

// 5. Check if Auth::user() would work
echo "=== TEST 4: Simulating Controller Logic ===\n";
Auth::login($user);
$authenticatedUser = Auth::user();

if ($authenticatedUser) {
    echo "✅ Auth::user() works!\n";
    echo "   User ID: {$authenticatedUser->id}\n";
    echo "   Clinic ID: {$authenticatedUser->clinic_id}\n\n";
    
    // Simulate controller logic
    $controllerNotifications = $notificationService->getNotificationsForUser($authenticatedUser, 10);
    $unreadCount = $notificationService->getUnreadCountForUser($authenticatedUser);
    
    echo "Controller simulation results:\n";
    echo "  Notifications: " . $controllerNotifications->count() . "\n";
    echo "  Unread count: $unreadCount\n\n";
} else {
    echo "❌ Auth::user() failed!\n\n";
}

echo "✅ All tests complete!\n";

