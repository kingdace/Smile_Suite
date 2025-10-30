<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing Notification Scopes\n";
echo "===========================\n\n";

$user = App\Models\User::where('email', 'enhaynesdental@gmail.com')->first();

echo "User: {$user->email} (Role: {$user->role}, Clinic: {$user->clinic_id})\n\n";

// Test forClinic
echo "1. forClinic($user->clinic_id):\n";
$count1 = App\Models\Notification::forClinic($user->clinic_id)->count();
echo "   Count: $count1\n\n";

// Test forUser
echo "2. forUser(\$user):\n";
$count2 = App\Models\Notification::forClinic($user->clinic_id)
    ->forUser($user)
    ->count();
echo "   Count: $count2\n";
echo "   SQL: " . App\Models\Notification::forClinic($user->clinic_id)->forUser($user)->toSql() . "\n\n";

// Test notExpired
echo "3. notExpired():\n";
$count3 = App\Models\Notification::forClinic($user->clinic_id)
    ->notExpired()
    ->count();
echo "   Count: $count3\n\n";

// Test combined
echo "4. forClinic + forUser + notExpired:\n";
$count4 = App\Models\Notification::forClinic($user->clinic_id)
    ->forUser($user)
    ->notExpired()
    ->count();
echo "   Count: $count4\n\n";

// Check expires_at values
echo "5. Check expires_at values:\n";
$expired = App\Models\Notification::forClinic($user->clinic_id)
    ->whereNotNull('expires_at')
    ->count();
$notExpiredCount = App\Models\Notification::forClinic($user->clinic_id)
    ->where(function($q) {
        $q->whereNull('expires_at')
          ->orWhere('expires_at', '>', now());
    })
    ->count();
echo "   Total in clinic: {$count1}\n";
echo "   With expires_at set: $expired\n";
echo "   Not expired: $notExpiredCount\n\n";

// Sample notification
echo "6. Sample notification:\n";
$sample = App\Models\Notification::forClinic($user->clinic_id)->first();
if ($sample) {
    echo "   Title: {$sample->title}\n";
    echo "   Target Roles: " . json_encode($sample->target_roles) . "\n";
    echo "   Expires At: " . ($sample->expires_at ?? 'NULL') . "\n";
    echo "   Created At: {$sample->created_at}\n";
}

echo "\n✅ Test Complete!\n";

