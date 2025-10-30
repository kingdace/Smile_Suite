<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

echo "=== LARAVEL DATABASE CONNECTION INFO ===\n\n";

echo "Config Database:\n";
echo "  DB_CONNECTION: " . Config::get('database.default') . "\n";
echo "  DB_HOST: " . Config::get('database.connections.mysql.host') . "\n";
echo "  DB_DATABASE: " . Config::get('database.connections.mysql.database') . "\n";
echo "  DB_USERNAME: " . Config::get('database.connections.mysql.username') . "\n\n";

echo "Testing connection...\n";
try {
    $result = DB::select('SELECT DATABASE() as db, COUNT(*) as user_count FROM users');
    echo "✅ Connected to database: " . $result[0]->db . "\n";
    echo "   Total users: " . $result[0]->user_count . "\n\n";
    
    // Check for Clinic 27
    $clinic27Users = DB::table('users')->where('clinic_id', 27)->count();
    echo "Users in Clinic 27: $clinic27Users\n\n";
    
    // Check for the specific user
    $user = DB::table('users')->where('email', 'enhaynesdental@gmail.com')->first();
    if ($user) {
        echo "✅ User 'enhaynesdental@gmail.com' found!\n";
        echo "   ID: {$user->id}\n";
        echo "   Clinic ID: {$user->clinic_id}\n";
    } else {
        echo "❌ User 'enhaynesdental@gmail.com' NOT found!\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Connection failed: " . $e->getMessage() . "\n";
}

