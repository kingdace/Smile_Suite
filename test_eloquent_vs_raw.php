<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== TESTING ELOQUENT VS RAW SQL ===\n\n";

$user = App\Models\User::find(91);

echo "User: {$user->email} (ID: {$user->id}, Clinic: {$user->clinic_id}, Role: {$user->role})\n\n";

// Test 1: Raw SQL (what we've been testing)
echo "TEST 1: Raw SQL\n";
$sql = "select * from `notifications` where (`clinic_id` is null or `clinic_id` = ?) and (json_contains(`target_roles`, ?) or `user_id` = ?) and (`expires_at` is null or `expires_at` > ?) order by `created_at` desc limit 10";
$bindings = [27, '"clinic_admin"', 91, now()->toDateTimeString()];
$rawResults = \DB::select($sql, $bindings);
echo "  Count: " . count($rawResults) . "\n\n";

// Test 2: Eloquent Query Builder (what the app uses)
echo "TEST 2: Eloquent Query Builder\n";
$eloquentResults = App\Models\Notification::forClinic(27)
    ->forUser($user)
    ->notExpired()
    ->orderBy('created_at', 'desc')
    ->limit(10)
    ->get();
echo "  Count: " . $eloquentResults->count() . "\n\n";

// Test 3: Direct Eloquent without scopes
echo "TEST 3: Direct Eloquent (no scopes)\n";
$directResults = App\Models\Notification::where(function($q) {
    $q->whereNull('clinic_id')->orWhere('clinic_id', 27);
})
->where(function($q) use ($user) {
    $q->whereJsonContains('target_roles', 'clinic_admin')->orWhere('user_id', 91);
})
->where(function($q) {
    $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
})
->limit(10)
->get();
echo "  Count: " . $directResults->count() . "\n\n";

// Test 4: Check if there are global scopes
echo "TEST 4: Checking for global scopes\n";
$model = new App\Models\Notification();
$globalScopes = $model->getGlobalScopes();
echo "  Global scopes count: " . count($globalScopes) . "\n";
if (count($globalScopes) > 0) {
    echo "  Global scopes:\n";
    foreach ($globalScopes as $key => $scope) {
        echo "    - " . get_class($scope) . "\n";
    }
}

echo "\n=== SUMMARY ===\n";
echo "Raw SQL: " . count($rawResults) . " results\n";
echo "Eloquent with scopes: " . $eloquentResults->count() . " results\n";
echo "Eloquent without scopes: " . $directResults->count() . " results\n";

