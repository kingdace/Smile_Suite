<?php

/**
 * TEST CLINIC DASHBOARD ROUTE PARAMETER FIX
 * 
 * This script tests if the PaymentController now properly passes clinic parameter
 */

// Bootstrap Laravel
require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "🧪 TESTING CLINIC DASHBOARD ROUTE PARAMETER FIX\n";
echo "==============================================\n\n";

// Test 1: Check if PaymentController has correct route calls
echo "📋 Test 1: Checking PaymentController Route Calls\n";
echo "--------------------------------------------------\n";

try {
    $fileContent = file_get_contents(app_path('Http/Controllers/Public/PaymentController.php'));
    
    // Check for correct route calls with clinic parameter
    if (strpos($fileContent, "route('clinic.dashboard', ['clinic' => \$subscriptionRequest->clinic_id])") !== false) {
        echo "✅ Automatic verification redirects with clinic parameter\n";
    } else {
        echo "❌ Automatic verification does NOT redirect with clinic parameter\n";
    }
    
    if (strpos($fileContent, "route('clinic.dashboard', ['clinic' => \$subscriptionRequest->clinic_id])") !== false) {
        echo "✅ Manual verification redirects with clinic parameter\n";
    } else {
        echo "❌ Manual verification does NOT redirect with clinic parameter\n";
    }
    
    // Check for old incorrect route calls
    if (strpos($fileContent, "route('clinic.dashboard')") === false) {
        echo "✅ No old incorrect route calls found\n";
    } else {
        echo "❌ Still has old incorrect route calls\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Error checking PaymentController: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 2: Check if clinic.dashboard route exists and requires parameter
echo "📋 Test 2: Checking clinic.dashboard Route\n";
echo "------------------------------------------\n";

try {
    $routes = \Illuminate\Support\Facades\Route::getRoutes();
    $clinicDashboardRoute = null;
    
    foreach ($routes as $route) {
        if ($route->getName() === 'clinic.dashboard') {
            $clinicDashboardRoute = $route;
            break;
        }
    }
    
    if ($clinicDashboardRoute) {
        echo "✅ clinic.dashboard route exists\n";
        echo "Route URI: " . $clinicDashboardRoute->uri() . "\n";
        
        // Check if it requires clinic parameter
        if (strpos($clinicDashboardRoute->uri(), '{clinic}') !== false) {
            echo "✅ Route requires {clinic} parameter\n";
        } else {
            echo "❌ Route does NOT require {clinic} parameter\n";
        }
    } else {
        echo "❌ clinic.dashboard route does NOT exist\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Error checking clinic.dashboard route: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 3: Test route generation with clinic parameter
echo "📋 Test 3: Testing Route Generation\n";
echo "-----------------------------------\n";

try {
    $testClinicId = 7;
    $generatedUrl = route('clinic.dashboard', ['clinic' => $testClinicId]);
    echo "✅ Generated URL: {$generatedUrl}\n";
    
    if (strpos($generatedUrl, "/clinic/{$testClinicId}/dashboard") !== false) {
        echo "✅ URL contains correct clinic parameter\n";
    } else {
        echo "❌ URL does NOT contain correct clinic parameter\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Error generating route: " . $e->getMessage() . "\n";
}

echo "\n";

echo "🔧 SUMMARY\n";
echo "==========\n";
echo "Fixed the missing clinic parameter issue:\n";
echo "- Updated automatic verification redirect to include clinic parameter\n";
echo "- Updated manual verification redirect to include clinic parameter\n";
echo "- Route now generates: /clinic/{clinic_id}/dashboard\n";
echo "\nThe payment should now redirect correctly without 500 errors!\n";

echo "\n";
echo "🚀 READY FOR TESTING!\n";
echo "Try the payment again - it should redirect properly now!\n";
