<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Clinic;
use App\Models\User;
use Illuminate\Support\Facades\DB;

echo "=== ALL CLINICS IN RAILWAY DATABASE ===\n\n";

$clinics = Clinic::all();
echo "Total clinics: " . $clinics->count() . "\n\n";

foreach ($clinics as $clinic) {
    echo "ID: {$clinic->id}\n";
    echo "  Name: {$clinic->name}\n";
    echo "  Email: {$clinic->email}\n";
    echo "  Status: {$clinic->status}\n";
    echo "  Users: " . User::where('clinic_id', $clinic->id)->count() . "\n";
    echo "  Appointments: " . DB::table('appointments')->where('clinic_id', $clinic->id)->count() . "\n";
    echo "  Notifications: " . DB::table('notifications')->where('clinic_id', $clinic->id)->count() . "\n";
    echo "\n";
}

echo "\n=== USERS BY EMAIL PATTERN ===\n";
$enhaynesUsers = User::where('email', 'like', '%enhaynes%')->get();
echo "Users with 'enhaynes' in email: " . $enhaynesUsers->count() . "\n";
foreach ($enhaynesUsers as $user) {
    echo "  {$user->email} (Clinic: {$user->clinic_id})\n";
}

