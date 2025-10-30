<?php

require __DIR__.'/vendor/autoload.php';

// Load environment
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$pdo = new PDO(
    "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_DATABASE']}", 
    $_ENV['DB_USERNAME'], 
    $_ENV['DB_PASSWORD']
);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

echo "=== TESTING NOTIFICATION FILTERING ===\n\n";

// 1. Get the user
$stmt = $pdo->query("SELECT id, email, role, clinic_id FROM users WHERE email = 'enhaynesdental@gmail.com'");
$user = $stmt->fetch(PDO::FETCH_ASSOC);

echo "User Details:\n";
echo "  ID: {$user['id']}\n";
echo "  Email: {$user['email']}\n";
echo "  Role: '{$user['role']}'\n";
echo "  Clinic ID: {$user['clinic_id']}\n\n";

// 2. Test direct query WITHOUT role filtering
echo "=== TEST 1: Notifications for Clinic 27 (no role filter) ===\n";
$stmt = $pdo->query("
    SELECT id, title, target_roles 
    FROM notifications 
    WHERE clinic_id = 27 
    ORDER BY created_at DESC 
    LIMIT 5
");
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "Results: " . count($results) . "\n";
foreach ($results as $r) {
    echo "  ID:{$r['id']} | Roles:{$r['target_roles']}\n";
}
echo "\n";

// 3. Test JSON_CONTAINS with exact role value
echo "=== TEST 2: Using JSON_CONTAINS with role '{$user['role']}' ===\n";
$stmt = $pdo->prepare("
    SELECT id, title, target_roles 
    FROM notifications 
    WHERE clinic_id = 27 
    AND JSON_CONTAINS(target_roles, ?)
    ORDER BY created_at DESC 
    LIMIT 5
");
$stmt->execute([json_encode($user['role'])]);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "Results: " . count($results) . "\n";
foreach ($results as $r) {
    echo "  ID:{$r['id']} | Roles:{$r['target_roles']}\n";
}
echo "\n";

// 4. Test with MySQL 5.7 compatible syntax (JSON_SEARCH)
echo "=== TEST 3: Using JSON_SEARCH (MySQL 5.7) ===\n";
$stmt = $pdo->prepare("
    SELECT id, title, target_roles 
    FROM notifications 
    WHERE clinic_id = 27 
    AND JSON_SEARCH(target_roles, 'one', ?) IS NOT NULL
    ORDER BY created_at DESC 
    LIMIT 5
");
$stmt->execute([$user['role']]);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "Results: " . count($results) . "\n";
foreach ($results as $r) {
    echo "  ID:{$r['id']} | Roles:{$r['target_roles']}\n";
}
echo "\n";

// 5. Check MySQL version
echo "=== MYSQL VERSION ===\n";
$stmt = $pdo->query("SELECT VERSION()");
$version = $stmt->fetchColumn();
echo "Version: $version\n\n";

// 6. Test the EXACT Laravel query pattern
echo "=== TEST 4: Exact Laravel whereJsonContains pattern ===\n";
$stmt = $pdo->prepare("
    SELECT id, title, target_roles 
    FROM notifications 
    WHERE clinic_id = 27 
    AND (
        JSON_CONTAINS(target_roles, ?)
        OR user_id = ?
    )
    ORDER BY created_at DESC 
    LIMIT 5
");
$stmt->execute([json_encode($user['role']), $user['id']]);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "Results: " . count($results) . "\n";
foreach ($results as $r) {
    echo "  ID:{$r['id']} | Roles:{$r['target_roles']}\n";
}
echo "\n";

echo "✅ Testing complete!\n";
