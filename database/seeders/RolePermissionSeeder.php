<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\RolePermission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clinic Admin - All permissions
        $clinicAdminPermissions = [
            'view_patients', 'add_patients', 'edit_patients', 'delete_patients',
            'view_appointments', 'create_appointments', 'edit_appointments', 'delete_appointments', 'assign_dentists',
            'view_treatments', 'create_treatments', 'edit_treatments', 'delete_treatments',
            'view_inventory', 'add_inventory', 'edit_inventory', 'delete_inventory', 'manage_suppliers',
            'view_payments', 'process_payments', 'refund_payments',
            'view_services', 'manage_services',
            'view_staff_users', 'add_staff_users', 'edit_staff_users', 'delete_staff_users',
            'manage_dentist_schedules', 'manage_clinic_profile',
            // Support permissions
            'create_support_tickets', 'view_own_support_tickets', 'view_clinic_support_tickets'
        ];

        // Dentist - Clinical permissions
        $dentistPermissions = [
            'view_patients', 'add_patients', 'edit_patients',
            'view_appointments', 'create_appointments', 'edit_appointments', 'assign_dentists',
            'view_treatments', 'create_treatments', 'edit_treatments',
            'view_inventory',
            'view_payments',
            'view_services',
            'view_schedules', 'manage_dentist_schedules',
            // Support permissions
            'create_support_tickets', 'view_own_support_tickets'
        ];

        // Staff - Operational permissions
        $staffPermissions = [
            'view_patients', 'add_patients', 'edit_patients',
            'view_appointments', 'create_appointments', 'edit_appointments', 'assign_dentists',
            'view_treatments', // Added for view-only access to treatments
            'view_inventory', 'add_inventory', 'edit_inventory', 'manage_suppliers',
            'view_payments', 'process_payments',
            'view_services',
            'view_schedules',
            // Support permissions
            'create_support_tickets', 'view_own_support_tickets'
        ];

        $this->assignPermissions('clinic_admin', $clinicAdminPermissions);
        $this->assignPermissions('dentist', $dentistPermissions);
        $this->assignPermissions('staff', $staffPermissions);
    }

    private function assignPermissions(string $role, array $permissions): void
    {
        foreach ($permissions as $permissionName) {
            $permission = Permission::where('name', $permissionName)->first();
            if ($permission) {
                RolePermission::firstOrCreate([
                    'role' => $role,
                    'permission_id' => $permission->id
                ]);
            }
        }
    }
}
