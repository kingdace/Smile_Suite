<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== PRODUCTION DATA CHECK ===\n\n";

// Check Clinic 27
$clinic = App\Models\Clinic::find(27);
if (!$clinic) {
    echo "❌ CLINIC 27 DOES NOT EXIST!\n";
    exit(1);
}

echo "✅ Clinic 27: {$clinic->name}\n\n";

// Check notifications
$totalNotifications = App\Models\Notification::count();
$clinic27Notifications = App\Models\Notification::where('clinic_id', 27)->count();
$adminNotifications = App\Models\Notification::whereJsonContains('target_roles', 'admin')->count();
$clinicAdminNotifications = App\Models\Notification::whereJsonContains('target_roles', 'clinic_admin')
    ->where(function($q) {
        $q->whereNull('clinic_id')->orWhere('clinic_id', 27);
    })
    ->count();

echo "NOTIFICATIONS:\n";
echo "  Total in DB: {$totalNotifications}\n";
echo "  Clinic 27 specific: {$clinic27Notifications}\n";
echo "  For admin role: {$adminNotifications}\n";
echo "  For clinic_admin (27 or global): {$clinicAdminNotifications}\n\n";

// Check recent appointments
$recentAppointments = App\Models\Appointment::where('clinic_id', 27)
    ->orderBy('created_at', 'desc')
    ->limit(5)
    ->get(['id', 'patient_id', 'created_at', 'updated_at']);

echo "RECENT APPOINTMENTS (last 5):\n";
foreach ($recentAppointments as $apt) {
    echo "  ID: {$apt->id}, Patient: {$apt->patient_id}, Created: {$apt->created_at}, Updated: {$apt->updated_at}\n";
}
echo "\n";

// Check if observer is registered
$observers = \Illuminate\Support\Facades\Event::getListeners('eloquent.created: App\Models\Appointment');
echo "OBSERVERS FOR APPOINTMENT:\n";
if (empty($observers)) {
    echo "  ❌ NO OBSERVERS REGISTERED!\n";
} else {
    echo "  ✅ Observers registered: " . count($observers) . "\n";
}
echo "\n";

// Check queue
$jobsCount = \Illuminate\Support\Facades\DB::table('jobs')->count();
$failedJobsCount = \Illuminate\Support\Facades\DB::table('failed_jobs')->count();

echo "QUEUE STATUS:\n";
echo "  Pending jobs: {$jobsCount}\n";
echo "  Failed jobs: {$failedJobsCount}\n";

echo "\n=== CHECK COMPLETE ===\n";

