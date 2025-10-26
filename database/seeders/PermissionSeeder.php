<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Patient Management
            ['name' => 'view_patients', 'display_name' => 'View Patients', 'description' => 'Access patient records and information', 'category' => 'patient_management'],
            ['name' => 'add_patients', 'display_name' => 'Add Patients', 'description' => 'Create new patient records', 'category' => 'patient_management'],
            ['name' => 'edit_patients', 'display_name' => 'Edit Patients', 'description' => 'Modify patient information', 'category' => 'patient_management'],
            ['name' => 'delete_patients', 'display_name' => 'Delete Patients', 'description' => 'Remove patient records', 'category' => 'patient_management'],

            // Appointment Management
            ['name' => 'view_appointments', 'display_name' => 'View Appointments', 'description' => 'Access appointment schedules and information', 'category' => 'appointment_management'],
            ['name' => 'create_appointments', 'display_name' => 'Create Appointments', 'description' => 'Schedule new appointments', 'category' => 'appointment_management'],
            ['name' => 'edit_appointments', 'display_name' => 'Edit Appointments', 'description' => 'Modify appointment details', 'category' => 'appointment_management'],
            ['name' => 'delete_appointments', 'display_name' => 'Delete Appointments', 'description' => 'Cancel or remove appointments', 'category' => 'appointment_management'],
            ['name' => 'assign_dentists', 'display_name' => 'Assign Dentists', 'description' => 'Assign dentists to appointments', 'category' => 'appointment_management'],

            // Treatment Management
            ['name' => 'view_treatments', 'display_name' => 'View Treatments', 'description' => 'Access treatment records and history', 'category' => 'treatment_management'],
            ['name' => 'create_treatments', 'display_name' => 'Create Treatments', 'description' => 'Create new treatment plans', 'category' => 'treatment_management'],
            ['name' => 'edit_treatments', 'display_name' => 'Edit Treatments', 'description' => 'Modify treatment records', 'category' => 'treatment_management'],
            ['name' => 'delete_treatments', 'display_name' => 'Delete Treatments', 'description' => 'Remove treatment records', 'category' => 'treatment_management'],

            // Inventory Management
            ['name' => 'view_inventory', 'display_name' => 'View Inventory', 'description' => 'Access inventory and stock information', 'category' => 'inventory_management'],
            ['name' => 'add_inventory', 'display_name' => 'Add Inventory', 'description' => 'Add new inventory items', 'category' => 'inventory_management'],
            ['name' => 'edit_inventory', 'display_name' => 'Edit Inventory', 'description' => 'Modify inventory information', 'category' => 'inventory_management'],
            ['name' => 'delete_inventory', 'display_name' => 'Delete Inventory', 'description' => 'Remove inventory items', 'category' => 'inventory_management'],
            ['name' => 'manage_suppliers', 'display_name' => 'Manage Suppliers', 'description' => 'Create, edit, and delete supplier information', 'category' => 'inventory_management'],

            // Payment Management
            ['name' => 'view_payments', 'display_name' => 'View Payments', 'description' => 'Access payment records and financial information', 'category' => 'payment_management'],
            ['name' => 'process_payments', 'display_name' => 'Process Payments', 'description' => 'Process and manage payments', 'category' => 'payment_management'],
            ['name' => 'refund_payments', 'display_name' => 'Refund Payments', 'description' => 'Process payment refunds', 'category' => 'payment_management'],

            // Service Management
            ['name' => 'view_services', 'display_name' => 'View Services', 'description' => 'Access service catalog', 'category' => 'service_management'],
            ['name' => 'manage_services', 'display_name' => 'Manage Services', 'description' => 'Create, edit, and delete services', 'category' => 'service_management'],

            // Staff Management
            ['name' => 'view_staff', 'display_name' => 'View Staff', 'description' => 'Access staff information', 'category' => 'staff_management'],
            ['name' => 'add_staff', 'display_name' => 'Add Staff', 'description' => 'Create new staff members', 'category' => 'staff_management'],
            ['name' => 'edit_staff', 'display_name' => 'Edit Staff', 'description' => 'Modify staff information', 'category' => 'staff_management'],
            ['name' => 'delete_staff', 'display_name' => 'Delete Staff', 'description' => 'Remove staff members', 'category' => 'staff_management'],

            // Schedule Management
            ['name' => 'view_schedules', 'display_name' => 'View Schedules', 'description' => 'Access dentist schedules', 'category' => 'schedule_management'],
            ['name' => 'manage_dentist_schedules', 'display_name' => 'Manage Dentist Schedules', 'description' => 'Create, edit, and delete dentist schedules', 'category' => 'schedule_management'],

            // Clinic Management
            ['name' => 'manage_clinic', 'display_name' => 'Manage Clinic', 'description' => 'Manage clinic settings and profile', 'category' => 'clinic_management'],

            // Support Management
            ['name' => 'create_support_tickets', 'display_name' => 'Create Support Tickets', 'description' => 'Create new support tickets', 'category' => 'support_management'],
            ['name' => 'view_own_support_tickets', 'display_name' => 'View Own Support Tickets', 'description' => 'View own support tickets', 'category' => 'support_management'],
            ['name' => 'view_clinic_support_tickets', 'display_name' => 'View Clinic Support Tickets', 'description' => 'View all clinic support tickets', 'category' => 'support_management'],
            ['name' => 'manage_support_tickets', 'display_name' => 'Manage Support Tickets', 'description' => 'Manage all support tickets', 'category' => 'support_management'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                $permission
            );
        }
    }
}
