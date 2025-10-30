<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing NotificationService Directly\n";
echo "====================================\n\n";

$user = App\Models\User::where('email', 'enhaynesdental@gmail.com')->first();
echo "User: {$user->email} (Role: {$user->role}, Clinic: {$user->clinic_id})\n\n";

// Test direct query (what SHOULD work)
echo "1. Direct Query (without service):\n";
$directQuery = App\Models\Notification::forClinic($user->clinic_id)
    ->forUser($user)
    ->notExpired()
    ->orderBy('created_at', 'desc');

echo "   SQL: " . $directQuery->toSql() . "\n";
echo "   Count: " . $directQuery->count() . "\n";
echo "   With limit(10): " . $directQuery->limit(10)->count() . "\n";
$results = $directQuery->limit(10)->get();
echo "   Results->count(): " . $results->count() . "\n\n";

// Test via Service
echo "2. Via NotificationService:\n";
$service = app(App\Services\NotificationService::class);
$notifications = $service->getNotificationsForUser($user, 10);
echo "   Count: " . count($notifications) . "\n";
echo "   Is Collection: " . ($notifications instanceof \Illuminate\Support\Collection ? 'YES' : 'NO') . "\n";
echo "   Type: " . get_class($notifications) . "\n\n";

// Test getUnreadCountForUser
echo "3. getUnreadCountForUser:\n";
$unreadCount = $service->getUnreadCountForUser($user);
echo "   Unread Count: $unreadCount\n\n";

// Direct unread count
echo "4. Direct Unread Count:\n";
$directUnread = App\Models\Notification::forClinic($user->clinic_id)
    ->forUser($user)
    ->unread()
    ->notExpired()
    ->count();
echo "   Direct Count: $directUnread\n\n";

// Check if there's an error being swallowed
echo "5. Test with error catching:\n";
try {
    $testQuery = App\Models\Notification::forClinic($user->clinic_id)
        ->forUser($user)
        ->notExpired()
        ->orderBy('created_at', 'desc')
        ->limit(10)
        ->get();
    echo "   Success! Got " . $testQuery->count() . " results\n";
    if ($testQuery->count() > 0) {
        $first = $testQuery->first();
        echo "   First notification: {$first->title}\n";
    }
} catch (\Exception $e) {
    echo "   ERROR: {$e->getMessage()}\n";
}

echo "\n✅ Test Complete!\n";

