<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Clinic;
use Illuminate\Support\Facades\DB;

echo "=== CLINIC 1 (ENHAYNES) USERS ===\n\n";

$clinic = Clinic::find(1);
echo "Clinic: {$clinic->name}\n";
echo "Email: {$clinic->email}\n\n";

$users = User::where('clinic_id', 1)->get();
echo "Total Users: " . $users->count() . "\n\n";

foreach ($users as $user) {
    echo "ID: {$user->id}\n";
    echo "  Email: {$user->email}\n";
    echo "  Name: {$user->name}\n";
    echo "  Role: {$user->role}\n";
    echo "  Clinic ID: {$user->clinic_id}\n";
    echo "\n";
}

// Check if enhaynesdental@gmail.com exists anywhere
echo "=== CHECKING FOR enhaynesdental@gmail.com ===\n";
$targetUser = User::where('email', 'enhaynesdental@gmail.com')->first();
if ($targetUser) {
    echo "✅ User EXISTS!\n";
    echo "   Clinic ID: {$targetUser->clinic_id}\n";
    echo "   Role: {$targetUser->role}\n";
} else {
    echo "❌ User DOES NOT EXIST in Railway!\n";
}

echo "\n=== RECOMMENDATION ===\n";
echo "If you're logged in as 'enhaynesdental@gmail.com' but it doesn't exist\n";
echo "in Railway, then you're either:\n";
echo "1. Testing on local database (not Railway)\n";
echo "2. Your session has wrong clinic_id cached\n";
echo "3. The user data wasn't imported to Railway\n";

