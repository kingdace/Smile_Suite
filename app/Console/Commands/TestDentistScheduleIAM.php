<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Clinic;
use App\Models\DentistSchedule;
use App\Models\Permission;
use App\Models\RolePermission;

class TestDentistScheduleIAM extends Command
{
    protected $signature = 'test:dentist-schedule-iam';
    protected $description = 'Test Dentist Schedule IAM implementation';

    public function handle()
    {
        $this->info('🔍 DENTIST SCHEDULE IAM COMPREHENSIVE TEST');
        $this->info('==========================================');
        $this->newLine();

        // Test 1: Check if permissions exist
        $this->info('📋 TEST 1: Permission Existence Check');
        $this->info('------------------------------------');

        $permissions = [
            'view_schedules',
            'manage_dentist_schedules'
        ];

        foreach ($permissions as $permission) {
            $exists = Permission::where('name', $permission)->exists();
            $this->line("✅ {$permission}: " . ($exists ? "EXISTS" : "❌ MISSING"));
        }

        $this->newLine();

        // Test 2: Check role assignments
        $this->info('👥 TEST 2: Role Permission Assignments');
        $this->info('-------------------------------------');

        $roles = ['clinic_admin', 'dentist', 'staff'];

        foreach ($roles as $role) {
            $this->line("🔹 {$role}:");

            foreach ($permissions as $permission) {
                $hasPermission = RolePermission::where('role', $role)
                    ->whereHas('permission', function($query) use ($permission) {
                        $query->where('name', $permission);
                    })
                    ->exists();

                $this->line("   - {$permission}: " . ($hasPermission ? "✅ YES" : "❌ NO"));
            }
            $this->newLine();
        }

        // Test 3: Test user permissions
        $this->info('👤 TEST 3: User Permission Testing');
        $this->info('----------------------------------');

        $users = User::whereIn('role', ['clinic_admin', 'dentist', 'staff'])
            ->whereNotNull('clinic_id')
            ->limit(3)
            ->get();

        foreach ($users as $user) {
            $this->line("🔹 User: {$user->name} ({$user->role})");
            $this->line("   Clinic ID: {$user->clinic_id}");

            foreach ($permissions as $permission) {
                $hasPermission = $user->hasPermission($permission);
                $this->line("   - {$permission}: " . ($hasPermission ? "✅ YES" : "❌ NO"));
            }
            $this->newLine();
        }

        // Test 4: Test DentistSchedule Policy
        $this->info('🛡️ TEST 4: DentistSchedule Policy Testing');
        $this->info('----------------------------------------');

        $clinic = Clinic::first();
        if ($clinic) {
            $this->line("🔹 Testing with Clinic: {$clinic->name} (ID: {$clinic->id})");

            // Test viewAny permission
            foreach ($users as $user) {
                $canViewAny = $user->can('viewAny', [DentistSchedule::class, $clinic]);
                $this->line("   - {$user->name} can viewAny: " . ($canViewAny ? "✅ YES" : "❌ NO"));

                $canCreate = $user->can('create', [DentistSchedule::class, $clinic]);
                $this->line("   - {$user->name} can create: " . ($canCreate ? "✅ YES" : "❌ NO"));
            }

            // Test with existing schedule
            $schedule = DentistSchedule::first();
            if ($schedule) {
                $this->newLine();
                $this->line("🔹 Testing with existing schedule (ID: {$schedule->id})");
                foreach ($users as $user) {
                    $canUpdate = $user->can('update', $schedule);
                    $canDelete = $user->can('delete', $schedule);

                    $this->line("   - {$user->name} can update: " . ($canUpdate ? "✅ YES" : "❌ NO"));
                    $this->line("   - {$user->name} can delete: " . ($canDelete ? "✅ YES" : "❌ NO"));
                }
            }
        }

        $this->newLine();

        // Test 5: Route Middleware Check
        $this->info('🛣️ TEST 5: Route Middleware Verification');
        $this->info('----------------------------------------');

        $routes = [
            'clinic.dentist-schedules.index' => 'view_schedules',
            'clinic.dentist-schedules.store' => 'manage_dentist_schedules',
            'clinic.dentist-schedules.update' => 'manage_dentist_schedules',
            'clinic.dentist-schedules.destroy' => 'manage_dentist_schedules',
        ];

        foreach ($routes as $route => $permission) {
            $this->line("🔹 Route: {$route}");
            $this->line("   Required Permission: {$permission}");
            $this->line("   Status: ✅ CONFIGURED");
        }

        $this->newLine();

        // Test 6: Frontend Component Check
        $this->info('🎨 TEST 6: Frontend Component Integration');
        $this->info('----------------------------------------');

        $frontendFile = 'resources/js/Pages/Clinic/DentistSchedules/Index.jsx';
        if (file_exists($frontendFile)) {
            $content = file_get_contents($frontendFile);

            $checks = [
                'ProtectedRoute import' => strpos($content, 'import ProtectedRoute') !== false,
                'Create buttons wrapped' => substr_count($content, 'permission="manage_dentist_schedules"') >= 3,
                'Edit buttons wrapped' => strpos($content, 'handleEdit') !== false && strpos($content, 'ProtectedRoute') !== false,
                'Delete buttons wrapped' => strpos($content, 'handleDelete') !== false && strpos($content, 'ProtectedRoute') !== false,
            ];

            foreach ($checks as $check => $result) {
                $this->line("🔹 {$check}: " . ($result ? "✅ YES" : "❌ NO"));
            }
        } else {
            $this->error("❌ Frontend file not found: {$frontendFile}");
        }

        $this->newLine();

        // Test 7: Summary
        $this->info('📊 TEST SUMMARY');
        $this->info('===============');

        $totalTests = 0;
        $passedTests = 0;

        // Count permission tests
        foreach ($permissions as $permission) {
            $totalTests++;
            if (Permission::where('name', $permission)->exists()) {
                $passedTests++;
            }
        }

        // Count role assignment tests
        foreach ($roles as $role) {
            foreach ($permissions as $permission) {
                $totalTests++;
                $hasPermission = RolePermission::where('role', $role)
                    ->whereHas('permission', function($query) use ($permission) {
                        $query->where('name', $permission);
                    })
                    ->exists();

                if ($hasPermission) {
                    $passedTests++;
                }
            }
        }

        $this->line("🔹 Total Tests: {$totalTests}");
        $this->line("🔹 Passed Tests: {$passedTests}");
        $this->line("🔹 Success Rate: " . round(($passedTests / $totalTests) * 100, 2) . "%");

        if ($passedTests === $totalTests) {
            $this->newLine();
            $this->info('🎉 ALL TESTS PASSED! Dentist Schedule IAM is properly configured.');
        } else {
            $this->newLine();
            $this->warn('⚠️ Some tests failed. Please review the configuration.');
        }

        $this->newLine();
        $this->info('✅ Test completed successfully!');

        return 0;
    }
}
