<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Patient;
use App\Models\ActivityLog;
use App\Services\ActivityLogService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ActivityLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_activity_logs_are_created_when_models_change()
    {
        // Create a clinic and clinic admin user
        $clinic = Clinic::factory()->create();
        $user = User::factory()->create([
            'clinic_id' => $clinic->id,
            'role' => 'clinic_admin',
            'user_type' => 'clinic_staff'
        ]);

        // Create a patient
        $patient = Patient::factory()->create([
            'clinic_id' => $clinic->id
        ]);

        // Update the patient
        $patient->update(['name' => 'Updated Patient Name']);

        // Check if activity log was created
        $this->assertDatabaseHas('activity_logs', [
            'clinic_id' => $clinic->id,
            'user_id' => $user->id,
            'action' => 'updated',
            'model_type' => Patient::class,
            'model_id' => $patient->id,
        ]);
    }

    public function test_clinic_admin_can_access_activity_logs()
    {
        // Create a clinic and clinic admin user
        $clinic = Clinic::factory()->create();
        $user = User::factory()->create([
            'clinic_id' => $clinic->id,
            'role' => 'clinic_admin',
            'user_type' => 'clinic_staff'
        ]);

        // Test the isClinicAdmin method
        $this->assertTrue($user->isClinicAdmin());

        // Test accessing activity logs route
        $response = $this->actingAs($user)
            ->get(route('clinic.activity-logs.index', $clinic->id));

        $response->assertStatus(200);
    }

    public function test_non_clinic_admin_cannot_access_activity_logs()
    {
        // Create a clinic and regular user
        $clinic = Clinic::factory()->create();
        $user = User::factory()->create([
            'clinic_id' => $clinic->id,
            'role' => 'dentist',
            'user_type' => 'clinic_staff'
        ]);

        // Test the isClinicAdmin method
        $this->assertFalse($user->isClinicAdmin());

        // Test accessing activity logs route
        $response = $this->actingAs($user)
            ->get(route('clinic.activity-logs.index', $clinic->id));

        $response->assertStatus(403);
    }

    public function test_activity_log_service_works()
    {
        // Create a clinic and clinic admin user
        $clinic = Clinic::factory()->create();
        $user = User::factory()->create([
            'clinic_id' => $clinic->id,
            'role' => 'clinic_admin',
            'user_type' => 'clinic_staff'
        ]);

        // Create a patient
        $patient = Patient::factory()->create([
            'clinic_id' => $clinic->id
        ]);

        // Test ActivityLogService
        $service = app(ActivityLogService::class);

        $this->actingAs($user);

        $log = $service->logCustom(
            action: 'test_action',
            description: 'Test activity log',
            model: $patient,
            category: ActivityLog::CATEGORY_PATIENT_MANAGEMENT,
            severity: ActivityLog::SEVERITY_LOW
        );

        $this->assertInstanceOf(ActivityLog::class, $log);
        $this->assertEquals($clinic->id, $log->clinic_id);
        $this->assertEquals($user->id, $log->user_id);
        $this->assertEquals('test_action', $log->action);
    }
}
