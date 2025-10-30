<?php

// Direct database connection to check Railway data
// This uses the same env that Railway web service uses

require __DIR__.'/vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Get database credentials from environment
$host = $_ENV['DB_HOST'] ?? 'localhost';
$database = $_ENV['DB_DATABASE'] ?? 'smile_suite';
$username = $_ENV['DB_USERNAME'] ?? 'root';
$password = $_ENV['DB_PASSWORD'] ?? '';

echo "=== DIRECT RAILWAY DATABASE CHECK ===\n\n";
echo "Connecting to: $host / $database\n\n";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Connected successfully!\n\n";
    
    // 1. Check Clinic 27
    echo "=== CLINIC 27 ===\n";
    $stmt = $pdo->query("SELECT id, name, email FROM clinics WHERE id = 27");
    $clinic = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($clinic) {
        echo "✅ Clinic 27 EXISTS:\n";
        echo "   Name: {$clinic['name']}\n";
        echo "   Email: {$clinic['email']}\n\n";
    } else {
        echo "❌ Clinic 27 NOT FOUND\n\n";
    }
    
    // 2. Check users for Clinic 27
    echo "=== USERS FOR CLINIC 27 ===\n";
    $stmt = $pdo->query("SELECT id, email, name, role FROM users WHERE clinic_id = 27 LIMIT 5");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Total users: " . count($users) . "\n";
    foreach ($users as $user) {
        echo "  ID:{$user['id']} | {$user['email']} | Role:{$user['role']}\n";
    }
    echo "\n";
    
    // 3. Check recent appointments for Clinic 27
    echo "=== RECENT APPOINTMENTS FOR CLINIC 27 ===\n";
    $stmt = $pdo->query("
        SELECT id, patient_id, appointment_status_id, scheduled_at, created_at 
        FROM appointments 
        WHERE clinic_id = 27 
        ORDER BY created_at DESC 
        LIMIT 5
    ");
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Total appointments: " . count($appointments) . "\n";
    foreach ($appointments as $apt) {
        echo "  ID:{$apt['id']} | Patient:{$apt['patient_id']} | Status:{$apt['appointment_status_id']} | Created:{$apt['created_at']}\n";
    }
    echo "\n";
    
    // 4. Check notifications for Clinic 27
    echo "=== NOTIFICATIONS FOR CLINIC 27 ===\n";
    $stmt = $pdo->query("
        SELECT id, type, title, target_roles, created_at 
        FROM notifications 
        WHERE clinic_id = 27 
        ORDER BY created_at DESC 
        LIMIT 10
    ");
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Total notifications: " . count($notifications) . "\n";
    foreach ($notifications as $notif) {
        echo "  ID:{$notif['id']} | Type:{$notif['type']} | Roles:{$notif['target_roles']}\n";
        echo "    Title: {$notif['title']}\n";
        echo "    Created: {$notif['created_at']}\n";
    }
    echo "\n";
    
    // 5. Check if target_roles format is correct
    if (!empty($notifications)) {
        echo "=== CHECKING target_roles FORMAT ===\n";
        $firstNotif = $notifications[0];
        echo "Raw target_roles value: {$firstNotif['target_roles']}\n";
        $decoded = json_decode($firstNotif['target_roles'], true);
        echo "Decoded: " . print_r($decoded, true) . "\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Database Error: " . $e->getMessage() . "\n";
}

