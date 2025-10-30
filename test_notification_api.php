<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Notification;

echo "\n================================\n";
echo "  NOTIFICATION API TEST\n";
echo "================================\n\n";

try {
    // Test user
    $user = User::where('email', 'enhaynesdental@gmail.com')->first();
    
    if (!$user) {
        echo "❌ ERROR: User not found!\n";
        exit(1);
    }
    
    echo "✅ User found:\n";
    echo "   Email: {$user->email}\n";
    echo "   ID: {$user->id}\n";
    echo "   Clinic ID: {$user->clinic_id}\n";
    echo "   Role: {$user->role}\n\n";
    
    // Test notifications for this clinic
    echo "📋 Notifications for Clinic {$user->clinic_id}:\n";
    $allNotifications = Notification::where('clinic_id', $user->clinic_id)->get();
    echo "   Total: {$allNotifications->count()}\n";
    
    // Test filtered by role
    echo "\n📋 Notifications filtered by role '{$user->role}':\n";
    $roleNotifications = Notification::where('clinic_id', $user->clinic_id)
        ->whereJsonContains('target_roles', $user->role)
        ->get();
    echo "   Count: {$roleNotifications->count()}\n";
    
    if ($roleNotifications->count() > 0) {
        echo "\n   Sample notifications:\n";
        foreach ($roleNotifications->take(5) as $notif) {
            echo "   - [{$notif->id}] {$notif->title} (Priority: {$notif->priority}, Read: " . ($notif->is_read ? 'Yes' : 'No') . ")\n";
        }
    }
    
    // Test what the API controller would return
    echo "\n📋 API Response Simulation:\n";
    $apiNotifications = Notification::where('clinic_id', $user->clinic_id)
        ->whereJsonContains('target_roles', $user->role)
        ->unread()
        ->notExpired()
        ->orderBy('created_at', 'desc')
        ->limit(10)
        ->get();
    
    echo "   Unread notifications (last 10): {$apiNotifications->count()}\n";
    
    if ($apiNotifications->count() > 0) {
        echo "\n   Recent unread:\n";
        foreach ($apiNotifications as $notif) {
            echo "   - [{$notif->id}] {$notif->title}\n";
        }
    } else {
        echo "   ⚠️  NO UNREAD NOTIFICATIONS!\n";
        
        // Check if they're all read
        $readCount = Notification::where('clinic_id', $user->clinic_id)
            ->whereJsonContains('target_roles', $user->role)
            ->where('is_read', true)
            ->count();
        
        echo "   Read notifications: {$readCount}\n";
        
        // Check if they're expired
        $expiredCount = Notification::where('clinic_id', $user->clinic_id)
            ->whereJsonContains('target_roles', $user->role)
            ->where('expires_at', '<', now())
            ->count();
        
        echo "   Expired notifications: {$expiredCount}\n";
    }
    
    echo "\n================================\n";
    echo "  DIAGNOSIS\n";
    echo "================================\n";
    
    if ($allNotifications->count() == 0) {
        echo "❌ PROBLEM: No notifications exist for Clinic {$user->clinic_id}!\n";
        echo "   Solution: Run NotificationSeeder\n";
    } elseif ($roleNotifications->count() == 0) {
        echo "❌ PROBLEM: Notifications exist but none target role '{$user->role}'!\n";
        echo "   Solution: Check target_roles in notifications table\n";
    } elseif ($apiNotifications->count() == 0) {
        echo "⚠️  ISSUE: All notifications are either read or expired!\n";
        echo "   - Try marking some as unread\n";
        echo "   - Or create a new appointment to trigger new notifications\n";
    } else {
        echo "✅ EVERYTHING LOOKS GOOD!\n";
        echo "   Notifications should be visible in the UI.\n";
        echo "   If they're still not showing, it's a frontend/route issue.\n";
    }
    
    echo "\n";
    
} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "\nStack trace:\n";
    echo $e->getTraceAsString() . "\n";
}

