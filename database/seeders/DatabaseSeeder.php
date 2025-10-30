<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Step 1: Initial Data (Admin, demo clinic, suppliers, inventory)
            InitialDataSeeder::class,

            // Step 2: Global data (appointment statuses and types)
            AppointmentStatusSeeder::class,
            AppointmentTypeSeeder::class,

            // Step 3: Permissions and Roles
            PermissionSeeder::class,
            RoleSeeder::class,
            RolePermissionSeeder::class,

            // Step 4: Users
            UserSeeder::class,

            // Step 5: Clinics (Original 12 + Surigao 20)
            ClinicSeeder::class,
            ClinicSeeder2025::class,

            // Step 6: Clinic Related Data
            ClinicGallerySeeder::class,
            ReviewSeeder::class,

        // Step 7: Business Data for Clinic 27 (Enhaynes Dental Clinic)
        // Note: These only run if clinic 27 doesn't have this data yet
        AppointmentSeeder::class,  // Creates 39 appointments for months Jan, May, Jul, Aug, Sep
        TreatmentSeeder::class,     // Creates treatments from those appointments
        PaymentSeeder::class,       // Creates payments for those treatments

        // Step 8: Notifications (Generate from existing appointments)
        NotificationSeeder::class,  // Creates notifications for existing appointments
    ]);
}
}
