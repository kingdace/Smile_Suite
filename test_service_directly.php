<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== TESTING NOTIFICATION SERVICE DIRECTLY ===\n\n";

// Get the exact user from the debug output
$user = App\Models\User::find(91);

if (!$user) {
    echo "❌ User 91 not found!\n";
    exit(1);
}

echo "Testing with user:\n";
echo "  ID: {$user->id}\n";
echo "  Email: {$user->email}\n";
echo "  Role: {$user->role}\n";
echo "  Clinic ID: {$user->clinic_id}\n\n";

// Test the service
$service = new App\Services\NotificationService();

echo "TESTING NotificationService:\n";

$notifications = $service->getNotificationsForUser($user, 10, false);
$unreadCount = $service->getUnreadCountForUser($user);

echo "  Notifications returned: {$notifications->count()}\n";
echo "  Unread count: {$unreadCount}\n\n";

if ($notifications->count() > 0) {
    echo "First notification:\n";
    $first = $notifications->first();
    echo "  ID: {$first->id}\n";
    echo "  Title: {$first->title}\n";
    echo "  Type: {$first->type}\n";
    echo "  Target Roles: " . json_encode($first->target_roles) . "\n";
    echo "  Clinic ID: " . ($first->clinic_id ?? 'NULL') . "\n";
} else {
    echo "❌ NO NOTIFICATIONS RETURNED!\n\n";
    
    echo "Let's test the query step by step:\n";
    
    $step1 = App\Models\Notification::count();
    echo "1. Total notifications: {$step1}\n";
    
    $step2 = App\Models\Notification::forClinic($user->clinic_id)->count();
    echo "2. After forClinic({$user->clinic_id}): {$step2}\n";
    
    $step3 = App\Models\Notification::forClinic($user->clinic_id)
        ->forUser($user)
        ->count();
    echo "3. After forClinic + forUser: {$step3}\n";
    
    $step4 = App\Models\Notification::forClinic($user->clinic_id)
        ->forUser($user)
        ->notExpired()
        ->count();
    echo "4. After forClinic + forUser + notExpired: {$step4}\n";
    
    // Check if all notifications are marked as read
    $allRead = App\Models\Notification::forClinic($user->clinic_id)
        ->forUser($user)
        ->notExpired()
        ->where('is_read', true)
        ->count();
    echo "\n5. How many are marked as read? {$allRead}\n";
    
    // Check for specific user
    $forSpecificUser = App\Models\Notification::where('user_id', $user->id)->count();
    echo "6. Notifications specifically for user_id {$user->id}: {$forSpecificUser}\n";
    
    // Check with role
    $withRole = App\Models\Notification::whereJsonContains('target_roles', $user->role)->count();
    echo "7. Notifications with role '{$user->role}': {$withRole}\n";
}

