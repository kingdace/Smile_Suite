<?php
// Simple test script to verify export functionality
require_once 'vendor/autoload.php';

echo "=== Smile Suite Export Functionality Test ===\n\n";

// Test 1: Check if maatwebsite/excel is installed
echo "1. Testing Excel package installation...\n";
try {
    if (class_exists('Maatwebsite\Excel\Facades\Excel')) {
        echo "✅ maatwebsite/excel package is installed\n";
    } else {
        echo "❌ maatwebsite/excel package not found\n";
    }
} catch (Exception $e) {
    echo "❌ Error checking Excel package: " . $e->getMessage() . "\n";
}

// Test 2: Check if ExportTrait exists
echo "\n2. Testing ExportTrait...\n";
$traitFile = 'app/Traits/ExportTrait.php';
if (file_exists($traitFile)) {
    echo "✅ ExportTrait file exists\n";
    
    // Check if trait has required methods
    $traitContent = file_get_contents($traitFile);
    $requiredMethods = [
        'exportData',
        'exportToCsv',
        'exportToExcel',
        'generateFilename',
        'detectFormat'
    ];
    
    foreach ($requiredMethods as $method) {
        if (strpos($traitContent, "function $method") !== false) {
            echo "✅ Method $method found\n";
        } else {
            echo "❌ Method $method missing\n";
        }
    }
} else {
    echo "❌ ExportTrait file not found\n";
}

// Test 3: Check ReportController
echo "\n3. Testing ReportController...\n";
$controllerFile = 'app/Http/Controllers/Clinic/ReportController.php';
if (file_exists($controllerFile)) {
    echo "✅ ReportController file exists\n";
    
    $controllerContent = file_get_contents($controllerFile);
    $exportMethods = [
        'exportPatients',
        'exportAppointments', 
        'exportRevenue',
        'exportTreatments',
        'exportInventory',
        'exportAnalytics'
    ];
    
    foreach ($exportMethods as $method) {
        if (strpos($controllerContent, "function $method") !== false) {
            echo "✅ Export method $method found\n";
        } else {
            echo "❌ Export method $method missing\n";
        }
    }
    
    // Check if ExportTrait is used
    if (strpos($controllerContent, 'use ExportTrait') !== false) {
        echo "✅ ExportTrait is used in ReportController\n";
    } else {
        echo "❌ ExportTrait not used in ReportController\n";
    }
} else {
    echo "❌ ReportController file not found\n";
}

// Test 4: Check routes
echo "\n4. Testing routes...\n";
$routesFile = 'routes/web.php';
if (file_exists($routesFile)) {
    echo "✅ Routes file exists\n";
    
    $routesContent = file_get_contents($routesFile);
    $exportRoutes = [
        'reports/export/patients',
        'reports/export/appointments',
        'reports/export/revenue', 
        'reports/export/treatments',
        'reports/export/inventory',
        'reports/export/analytics'
    ];
    
    foreach ($exportRoutes as $route) {
        if (strpos($routesContent, $route) !== false) {
            echo "✅ Export route $route found\n";
        } else {
            echo "❌ Export route $route missing\n";
        }
    }
} else {
    echo "❌ Routes file not found\n";
}

// Test 5: Check React components
echo "\n5. Testing React components...\n";
$exportButtonFile = 'resources/js/Components/Reports/ExportButton.jsx';
if (file_exists($exportButtonFile)) {
    echo "✅ ExportButton component exists\n";
} else {
    echo "❌ ExportButton component not found\n";
}

$reportPages = [
    'resources/js/Pages/Clinic/Reports/Index.jsx',
    'resources/js/Pages/Clinic/Reports/Revenue.jsx',
    'resources/js/Pages/Clinic/Reports/Patients.jsx',
    'resources/js/Pages/Clinic/Reports/Treatments.jsx',
    'resources/js/Pages/Clinic/Reports/Inventory.jsx',
    'resources/js/Pages/Clinic/Reports/Appointments.jsx'
];

foreach ($reportPages as $page) {
    if (file_exists($page)) {
        echo "✅ Report page " . basename($page) . " exists\n";
        
        // Check if ExportButton is imported
        $pageContent = file_get_contents($page);
        if (strpos($pageContent, 'ExportButton') !== false) {
            echo "✅ ExportButton is used in " . basename($page) . "\n";
        } else {
            echo "❌ ExportButton not used in " . basename($page) . "\n";
        }
    } else {
        echo "❌ Report page " . basename($page) . " not found\n";
    }
}

// Test 6: Check .env configuration
echo "\n6. Testing environment configuration...\n";
$envFile = '.env';
if (file_exists($envFile)) {
    echo "✅ .env file exists\n";
    
    $envContent = file_get_contents($envFile);
    
    // Check broadcast driver
    if (strpos($envContent, 'BROADCAST_DRIVER=log') !== false) {
        echo "✅ Broadcast driver set to log (WebSocket issues fixed)\n";
    } elseif (strpos($envContent, 'BROADCAST_DRIVER=pusher') !== false) {
        echo "⚠️  Broadcast driver still set to pusher (may cause WebSocket issues)\n";
    }
    
    // Check if maatwebsite/excel is in composer.json
    $composerFile = 'composer.json';
    if (file_exists($composerFile)) {
        $composerContent = file_get_contents($composerFile);
        if (strpos($composerContent, 'maatwebsite/excel') !== false) {
            echo "✅ maatwebsite/excel package is in composer.json\n";
        } else {
            echo "❌ maatwebsite/excel package not in composer.json\n";
        }
    }
} else {
    echo "❌ .env file not found\n";
}

echo "\n=== Test Summary ===\n";
echo "✅ = Working correctly\n";
echo "❌ = Needs attention\n";
echo "⚠️  = Warning/potential issue\n";

echo "\n=== Next Steps ===\n";
echo "1. Run: php artisan route:clear\n";
echo "2. Run: php artisan config:clear\n";
echo "3. Visit: http://localhost:8000/clinic/1/reports (replace 1 with actual clinic ID)\n";
echo "4. Test export buttons on each report page\n";
echo "5. Check downloaded files for correct data\n";

echo "\nTest completed at: " . date('Y-m-d H:i:s') . "\n";
?>
