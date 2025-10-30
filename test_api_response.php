<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Simulate being logged in as clinic_admin for Clinic 27
$user = App\Models\User::where('clinic_id', 27)
    ->where('role', 'clinic_admin')
    ->first();

if (!$user) {
    echo "❌ No clinic_admin found for Clinic 27\n";
    exit(1);
}

echo "Testing API as: {$user->email} (Clinic {$user->clinic_id})\n\n";

// Simulate what the NotificationController->index() method does
$query = App\Models\Notification::query();

// Filter by role
$query->whereJsonContains('target_roles', $user->role);

// Filter by clinic - clinic-specific OR global
$query->where(function ($q) use ($user) {
    $q->whereNull('clinic_id')
      ->orWhere('clinic_id', $user->clinic_id);
});

// Only active notifications
$query->notExpired();

// Order by date
$query->orderBy('created_at', 'desc');

$notifications = $query->get();

echo "API would return {$notifications->count()} notifications\n\n";

echo "First 5 notifications:\n";
foreach ($notifications->take(5) as $notif) {
    echo "  ID: {$notif->id}, Type: {$notif->type}, Title: {$notif->title}, Read: " . ($notif->is_read ? 'Yes' : 'No') . "\n";
}

// Check unread count
$unreadCount = App\Models\Notification::whereJsonContains('target_roles', $user->role)
    ->where(function ($q) use ($user) {
        $q->whereNull('clinic_id')
          ->orWhere('clinic_id', $user->clinic_id);
    })
    ->unread()
    ->notExpired()
    ->count();

echo "\nUnread count: {$unreadCount}\n";

