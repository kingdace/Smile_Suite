<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== TESTING EXACT SQL FROM HTTP REQUEST ===\n\n";

$sql = "select * from `notifications` where (`clinic_id` is null or `clinic_id` = ?) and (json_contains(`target_roles`, ?) or `user_id` = ?) and (`expires_at` is null or `expires_at` > ?) order by `created_at` desc limit 10";
$bindings = [27, '"clinic_admin"', 91, '2025-10-30T11:54:26.480184Z'];

echo "SQL: {$sql}\n";
echo "Bindings: " . json_encode($bindings) . "\n\n";

$results = DB::select($sql, $bindings);

echo "Results count: " . count($results) . "\n\n";

if (count($results) > 0) {
    echo "First result:\n";
    print_r($results[0]);
} else {
    echo "❌ NO RESULTS!\n\n";
    
    echo "Let's check what's in the database:\n";
    $total = DB::selectOne("select count(*) as count from notifications");
    echo "  Total notifications: {$total->count}\n";
    
    $forClinic27 = DB::selectOne("select count(*) as count from notifications where clinic_id = 27");
    echo "  For clinic 27: {$forClinic27->count}\n";
    
    $withRole = DB::selectOne("select count(*) as count from notifications where json_contains(target_roles, '\"clinic_admin\"')");
    echo "  With clinic_admin role: {$withRole->count}\n";
    
    $both = DB::selectOne("select count(*) as count from notifications where (clinic_id is null or clinic_id = 27) and json_contains(target_roles, '\"clinic_admin\"')");
    echo "  Both conditions: {$both->count}\n";
}

