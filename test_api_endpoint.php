<?php

// Simulate an API request
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);

use Illuminate\Http\Request;
use App\Models\User;

echo "\n================================\n";
echo "  API ENDPOINT TEST\n";
echo "================================\n\n";

try {
    // Create a mock authenticated request
    $user = User::where('email', 'enhaynesdental@gmail.com')->first();
    
    echo "Testing as user: {$user->email} (Clinic {$user->clinic_id})\n\n";
    
    // Test the notification API endpoint
    $request = Request::create('/clinic/27/notifications/api', 'GET');
    $request->setUserResolver(function () use ($user) {
        return $user;
    });
    
    echo "Calling: GET /clinic/27/notifications/api\n\n";
    
    $response = $kernel->handle($request);
    
    echo "Status Code: " . $response->getStatusCode() . "\n";
    echo "Content Type: " . $response->headers->get('Content-Type') . "\n\n";
    
    $content = $response->getContent();
    
    if ($response->getStatusCode() === 200) {
        $data = json_decode($content, true);
        
        if (json_last_error() === JSON_ERROR_NONE) {
            echo "✅ API Response (JSON):\n";
            echo "   Notifications count: " . count($data['notifications'] ?? []) . "\n";
            echo "   Unread count: " . ($data['unread_count'] ?? 'N/A') . "\n\n";
            
            if (isset($data['notifications']) && count($data['notifications']) > 0) {
                echo "   First 3 notifications:\n";
                foreach (array_slice($data['notifications'], 0, 3) as $notif) {
                    echo "   - {$notif['title']} (Read: " . ($notif['is_read'] ? 'Yes' : 'No') . ")\n";
                }
            } else {
                echo "   ⚠️  Empty notifications array!\n";
            }
        } else {
            echo "❌ Response is not JSON!\n";
            echo "First 500 chars:\n";
            echo substr($content, 0, 500) . "\n";
        }
    } else {
        echo "❌ API returned error!\n";
        echo "First 500 chars of response:\n";
        echo substr($content, 0, 500) . "\n";
    }
    
    echo "\n";
    
} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "\nStack trace:\n";
    echo $e->getTraceAsString() . "\n";
}

