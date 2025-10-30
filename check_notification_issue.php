<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🔍 NOTIFICATION DEBUGGING\n";
echo "========================\n\n";

// 1. Check total notifications
echo "1️⃣ Database Check:\n";
$total = App\Models\Notification::count();
$clinic27 = App\Models\Notification::where('clinic_id', 27)->count();
echo "   Total notifications: $total\n";
echo "   Clinic 27 notifications: $clinic27\n\n";

// 2. List Clinic 27 users
echo "2️⃣ Users in Clinic 27:\n";
$users = App\Models\User::where('clinic_id', 27)->get(['id', 'name', 'email', 'role']);
foreach ($users as $user) {
    echo "   - {$user->email} (Role: {$user->role}, ID: {$user->id})\n";
}
echo "\n";

// 3. Test NotificationService for each user
echo "3️⃣ Testing NotificationService:\n";
$service = app(App\Services\NotificationService::class);

foreach ($users as $user) {
    echo "\n   Testing user: {$user->email} (Role: {$user->role})\n";
    
    try {
        $notifications = $service->getNotificationsForUser($user, 5);
        $unreadCount = $service->getUnreadCountForUser($user);
        
        echo "   ✅ Retrieved: " . count($notifications) . " notifications\n";
        echo "   ✅ Unread count: $unreadCount\n";
        
        if (count($notifications) > 0) {
            echo "   📋 Sample notification:\n";
            $sample = $notifications->first();
            echo "      Title: {$sample->title}\n";
            echo "      Target Roles: " . json_encode($sample->target_roles) . "\n";
            echo "      User role matches? " . (in_array($user->role, $sample->target_roles) ? 'YES' : 'NO') . "\n";
        } else {
            echo "   ⚠️  No notifications retrieved\n";
            
            // Debug why
            $rawCount = App\Models\Notification::where('clinic_id', 27)
                ->where(function($query) use ($user) {
                    $query->whereJsonContains('target_roles', $user->role)
                          ->orWhere('user_id', $user->id);
                })
                ->count();
            echo "   🔍 Raw query count: $rawCount\n";
            
            if ($rawCount > 0) {
                $sample = App\Models\Notification::where('clinic_id', 27)
                    ->where(function($query) use ($user) {
                        $query->whereJsonContains('target_roles', $user->role)
                              ->orWhere('user_id', $user->id);
                    })
                    ->first();
                echo "   🔍 Sample target_roles: " . json_encode($sample->target_roles) . "\n";
                echo "   🔍 User role: {$user->role}\n";
            }
        }
    } catch (\Exception $e) {
        echo "   ❌ Error: {$e->getMessage()}\n";
    }
}

echo "\n";
echo "4️⃣ Sample Notifications:\n";
$samples = App\Models\Notification::where('clinic_id', 27)->take(3)->get();
foreach ($samples as $n) {
    echo "   - [{$n->priority}] {$n->title}\n";
    echo "     Target: " . json_encode($n->target_roles) . "\n";
    echo "     Created: {$n->created_at}\n\n";
}

echo "✅ Debug Complete!\n";

