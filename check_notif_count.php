<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Notification;
use App\Models\Appointment;

echo "=== CHECKING NOTIFICATION STATUS ===\n\n";

// Check notification count for Clinic 27
$notifCount = Notification::where('clinic_id', 27)->count();
echo "Clinic 27 notifications: $notifCount\n\n";

// Check appointment count for Clinic 27
$aptCount = Appointment::where('clinic_id', 27)->count();
echo "Clinic 27 appointments: $aptCount\n\n";

if ($notifCount === 0) {
    echo "❌ NO NOTIFICATIONS FOUND!\n";
    echo "Let me try to run NotificationSeeder manually...\n\n";
    
    // Try to seed notifications
    \Artisan::call('db:seed', [
        '--class' => 'NotificationSeeder',
        '--force' => true
    ]);
    
    echo "Seeder output:\n";
    echo \Artisan::output();
    echo "\n";
    
    // Check again
    $newCount = Notification::where('clinic_id', 27)->count();
    echo "Notifications after seeding: $newCount\n";
    
    if ($newCount > 0) {
        echo "✅ SEEDING WORKED! Notifications created!\n";
    } else {
        echo "❌ SEEDING FAILED! No notifications created!\n";
    }
} else {
    echo "✅ Notifications exist!\n";
    
    // Show a sample notification
    $sample = Notification::where('clinic_id', 27)->first();
    if ($sample) {
        echo "\nSample notification:\n";
        echo "  ID: {$sample->id}\n";
        echo "  Title: {$sample->title}\n";
        echo "  Target Roles: " . json_encode($sample->target_roles) . "\n";
        echo "  Created: {$sample->created_at}\n";
    }
}

