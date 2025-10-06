<?php

/**
 * CSRF Token Fix Script for Smile Suite
 * This script helps diagnose and fix CSRF token issues
 */

echo "🔧 CSRF Token Diagnostic Script\n";
echo "================================\n\n";

// Test 1: Check if we can generate CSRF token
echo "1. Testing CSRF Token Generation:\n";
$token = csrf_token();
echo "   CSRF Token: " . ($token ? $token : 'EMPTY') . "\n";
echo "   Token Length: " . strlen($token) . "\n\n";

// Test 2: Check session configuration
echo "2. Testing Session Configuration:\n";
echo "   Session Driver: " . config('session.driver') . "\n";
echo "   Session Lifetime: " . config('session.lifetime') . "\n";
echo "   Session Encrypt: " . (config('session.encrypt') ? 'YES' : 'NO') . "\n\n";

// Test 3: Check if sessions table exists
echo "3. Testing Database Sessions:\n";
try {
    $sessionsCount = \DB::table('sessions')->count();
    echo "   Sessions Table: EXISTS\n";
    echo "   Sessions Count: $sessionsCount\n";
} catch (Exception $e) {
    echo "   Sessions Table: ERROR - " . $e->getMessage() . "\n";
}

echo "\n4. Recommendations:\n";
if (empty($token)) {
    echo "   ❌ CSRF token is empty - this is the main issue\n";
    echo "   🔧 Fix: Clear config cache and restart server\n";
    echo "   🔧 Commands:\n";
    echo "      php artisan config:clear\n";
    echo "      php artisan cache:clear\n";
    echo "      php artisan config:cache\n";
} else {
    echo "   ✅ CSRF token generation is working\n";
    echo "   🔍 Check frontend token retrieval\n";
}

echo "\n5. Frontend Token Check:\n";
echo "   Make sure this meta tag exists in app.blade.php:\n";
echo "   <meta name=\"csrf-token\" content=\"{{ csrf_token() }}\">\n";
echo "   And is accessible via JavaScript:\n";
echo "   document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content')\n";

echo "\n✅ Diagnostic complete!\n";
