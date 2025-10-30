<?php

// Simple debug script to check notification filtering on Railway
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\DB;

echo "=== RAILWAY NOTIFICATION DEBUG ===\n\n";

// 0. Check if Clinic 27 exists
use App\Models\Clinic;
$clinic = Clinic::find(27);
if (!$clinic) {
    echo "❌ Clinic 27 DOES NOT EXIST in Railway database!\n\n";
} else {
    echo "✅ Clinic 27 EXISTS:\n";
    echo "   Name: {$clinic->name}\n";
    echo "   Email: {$clinic->email}\n\n";
}

// 1. Check ALL users in the database
echo "=== ALL USERS IN DATABASE ===\n";
$totalUsers = User::count();
echo "Total users in database: {$totalUsers}\n\n";
if ($totalUsers > 0) {
    $sampleUsers = User::limit(10)->get(['id', 'email', 'role', 'clinic_id']);
    foreach ($sampleUsers as $u) {
        echo "ID: {$u->id} | Email: {$u->email} | Role: '{$u->role}' | Clinic: {$u->clinic_id}\n";
    }
    echo "\n";
}

// 2. Check all users for Clinic 27
echo "=== USERS FOR CLINIC 27 ===\n";
$allUsers = User::where('clinic_id', 27)->get();
echo "Total users for Clinic 27: " . $allUsers->count() . "\n\n";
foreach ($allUsers as $u) {
    echo "ID: {$u->id} | Email: {$u->email} | Role: '{$u->role}'\n";
}

// 3. Check notifications for Clinic 27
echo "\n=== NOTIFICATIONS FOR CLINIC 27 ===\n";
$notifCount = DB::table('notifications')->where('clinic_id', 27)->count();
echo "Total notifications for Clinic 27: {$notifCount}\n\n";

echo "❌ PROBLEM IDENTIFIED:\n";
echo "   Clinic 27 has {$notifCount} notifications but " . $allUsers->count() . " users!\n";
echo "   This is a DATA SEEDING issue - users weren't seeded properly!\n\n";

// 2. Check raw notifications for clinic 27
echo "=== RAW NOTIFICATIONS FOR CLINIC 27 ===\n";
$rawNotifications = DB::table('notifications')
    ->where('clinic_id', 27)
    ->select('id', 'type', 'title', 'target_roles', 'created_at')
    ->limit(5)
    ->get();

echo "Total raw notifications: " . $rawNotifications->count() . "\n\n";
foreach ($rawNotifications as $notif) {
    echo "ID: {$notif->id}\n";
    echo "  Type: {$notif->type}\n";
    echo "  Title: {$notif->title}\n";
    echo "  Target Roles (raw): {$notif->target_roles}\n";
    echo "  Created: {$notif->created_at}\n\n";
}

// 3. Check with Eloquent scopes
echo "=== ELOQUENT SCOPED QUERY ===\n";
$scopedNotifications = Notification::forClinic(27)
    ->forUser($user)
    ->notExpired()
    ->limit(5)
    ->get();

echo "Scoped notifications count: " . $scopedNotifications->count() . "\n\n";

// 4. Test manual JSON contains
echo "=== MANUAL JSON CONTAINS TEST ===\n";
$manualQuery = DB::table('notifications')
    ->where('clinic_id', 27)
    ->whereJsonContains('target_roles', $user->role)
    ->count();

echo "Manual whereJsonContains('{$user->role}'): {$manualQuery} results\n\n";

// 5. Check different role variations
echo "=== TESTING ROLE VARIATIONS ===\n";
$roleVariations = ['clinic_admin', 'admin', 'staff', 'dentist'];
foreach ($roleVariations as $testRole) {
    $count = DB::table('notifications')
        ->where('clinic_id', 27)
        ->whereJsonContains('target_roles', $testRole)
        ->count();
    echo "  '{$testRole}': {$count} notifications\n";
}

echo "\n✅ Debug complete!\n";

