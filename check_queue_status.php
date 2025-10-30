<?php

/**
 * Quick script to check queue status on Railway
 *
 * Run with: railway run php check_queue_status.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "\n";
echo "================================\n";
echo "  QUEUE STATUS CHECK - RAILWAY\n";
echo "================================\n\n";

try {
    // Check jobs table
    echo "📋 Checking jobs table...\n";
    $pendingJobs = DB::table('jobs')->count();
    $oldestJob = DB::table('jobs')->orderBy('created_at', 'asc')->first();

    echo "   Pending jobs: {$pendingJobs}\n";

    if ($pendingJobs > 0) {
        echo "   ⚠️  WARNING: Jobs are pending in queue!\n";
        if ($oldestJob) {
            $age = now()->diffInMinutes($oldestJob->created_at);
            echo "   Oldest job: {$age} minutes old\n";

            if ($age > 5) {
                echo "   ❌ CRITICAL: Queue worker might not be running!\n";
                echo "      Jobs older than 5 minutes indicate worker issue.\n";
            }
        }
    } else {
        echo "   ✅ No pending jobs (queue is being processed!)\n";
    }

    echo "\n";

    // Check failed jobs
    echo "📋 Checking failed_jobs table...\n";
    $failedJobs = DB::table('failed_jobs')->count();
    $recentFailed = DB::table('failed_jobs')
        ->where('failed_at', '>=', now()->subHour())
        ->count();

    echo "   Total failed jobs: {$failedJobs}\n";
    echo "   Failed in last hour: {$recentFailed}\n";

    if ($recentFailed > 0) {
        echo "   ⚠️  WARNING: Jobs are failing!\n";
        echo "\n   Recent failures:\n";
        $failures = DB::table('failed_jobs')
            ->where('failed_at', '>=', now()->subHour())
            ->orderBy('failed_at', 'desc')
            ->limit(3)
            ->get();

        foreach ($failures as $failure) {
            $payload = json_decode($failure->payload, true);
            $displayName = $payload['displayName'] ?? 'Unknown Job';
            echo "   - {$displayName} failed at " . $failure->failed_at . "\n";
        }
    } else if ($failedJobs == 0) {
        echo "   ✅ No failed jobs!\n";
    } else {
        echo "   ℹ️  Some old failed jobs exist, but none in the last hour.\n";
    }

    echo "\n";

    // Check notifications
    echo "📋 Checking notifications for Clinic 27...\n";
    $notificationCount = DB::table('notifications')
        ->where('clinic_id', 27)
        ->count();
    $recentNotifications = DB::table('notifications')
        ->where('clinic_id', 27)
        ->where('created_at', '>=', now()->subHour())
        ->count();

    echo "   Total notifications: {$notificationCount}\n";
    echo "   Created in last hour: {$recentNotifications}\n";

    if ($notificationCount >= 39) {
        echo "   ✅ Notifications exist!\n";
    } else {
        echo "   ⚠️  Low notification count (target: 39+)\n";
    }

    echo "\n";

    // Check appointments
    echo "📋 Checking recent appointments for Clinic 27...\n";
    $recentAppointments = DB::table('appointments')
        ->where('clinic_id', 27)
        ->where('created_at', '>=', now()->subHour())
        ->count();

    echo "   Appointments created in last hour: {$recentAppointments}\n";

    if ($recentAppointments > 0 && $recentNotifications == 0) {
        echo "   ❌ CRITICAL: Appointments created but no notifications!\n";
        echo "      This confirms the notification system is broken.\n";
    } else if ($recentAppointments > 0 && $recentNotifications > 0) {
        echo "   ✅ Appointments are generating notifications!\n";
    } else {
        echo "   ℹ️  No recent appointments to test with.\n";
    }

    echo "\n";
    echo "================================\n";
    echo "  QUEUE STATUS SUMMARY\n";
    echo "================================\n";

    $issues = [];

    if ($pendingJobs > 10) {
        $issues[] = "High number of pending jobs ({$pendingJobs})";
    }

    if ($oldestJob && now()->diffInMinutes($oldestJob->created_at) > 5) {
        $issues[] = "Old jobs not being processed";
    }

    if ($recentFailed > 3) {
        $issues[] = "Multiple jobs failing in last hour ({$recentFailed})";
    }

    if ($recentAppointments > 0 && $recentNotifications == 0) {
        $issues[] = "Appointments not generating notifications";
    }

    if (empty($issues)) {
        echo "\n✅ EVERYTHING LOOKS GOOD!\n";
        echo "   Queue worker is processing jobs normally.\n";
        echo "   Notifications are being created.\n";
    } else {
        echo "\n❌ ISSUES DETECTED:\n";
        foreach ($issues as $issue) {
            echo "   - {$issue}\n";
        }
        echo "\n💡 RECOMMENDED ACTIONS:\n";
        echo "   1. Check Railway logs for queue worker status\n";
        echo "   2. Verify start.sh includes 'php artisan queue:work'\n";
        echo "   3. Restart Railway service if needed\n";
        echo "   4. Check failed_jobs table for error details\n";
    }

    echo "\n";

} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "\nStack trace:\n";
    echo $e->getTraceAsString() . "\n";
}

echo "\n";

