<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "Starting database restoration...\n";
    
    // Read the SQL file
    $sql = file_get_contents('database/smilesuite.sql');
    
    if (!$sql) {
        throw new Exception("Could not read SQL file");
    }
    
    // Split SQL into individual statements
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt) && !preg_match('/^--/', $stmt);
        }
    );
    
    echo "Found " . count($statements) . " SQL statements to execute\n";
    
    // Execute each statement
    foreach ($statements as $i => $statement) {
        if (empty(trim($statement))) continue;
        
        try {
            DB::unprepared($statement);
            echo "Executed statement " . ($i + 1) . "\n";
        } catch (Exception $e) {
            echo "Error in statement " . ($i + 1) . ": " . $e->getMessage() . "\n";
            // Continue with other statements
        }
    }
    
    echo "Database restoration completed!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
