<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProductionSeeder extends Seeder
{
    /**
     * Seed the application's database for production.
     * Only seeds essential data, no demo/test data.
     */
    public function run(): void
    {
        $this->call([
            // Step 1: Global data (appointment statuses and types)
            AppointmentStatusSeeder::class,
            AppointmentTypeSeeder::class,

            // Step 2: Permissions and Roles
            PermissionSeeder::class,
            RoleSeeder::class,
            RolePermissionSeeder::class,

            // DO NOT SEED:
            // - InitialDataSeeder (contains demo clinic - Enhaynes Dental Clinic)
            // - ClinicSeeder (contains 12 demo clinics)
            // - ClinicSeeder2025 (contains 20 more demo clinics)
            // - UserSeeder (contains demo users)
            // - AppointmentSeeder (hardcoded for clinic ID 27)
            // - TreatmentSeeder (hardcoded for clinic ID 27)
            // - PaymentSeeder (hardcoded for clinic ID 27)
            // - NotificationSeeder (depends on appointments)
            // - ReviewSeeder (demo reviews)
            // - ClinicGallerySeeder (demo gallery)
        ]);

        // Step 3: Create Super Admin Account
        $this->createSuperAdmin();

        $this->command->info('✅ Production database seeded successfully!');
        $this->command->info('✅ Super admin account created: dy_admin@gmail.com');
        $this->command->warn('⚠️  No demo data created.');
        $this->command->info('');
        $this->command->info('Next steps:');
        $this->command->info('1. Login as super admin: dy_admin@gmail.com');
        $this->command->info('2. Use admin panel to approve clinic registrations');
        $this->command->info('3. Clinics register via public registration form');
    }

    /**
     * Create super admin account for production
     */
    private function createSuperAdmin(): void
    {
        // Check if super admin already exists
        if (\App\Models\User::where('email', 'dy_admin@gmail.com')->exists()) {
            $this->command->warn('⚠️  Super admin account already exists, skipping...');
            return;
        }

        \App\Models\User::create([
            'name' => 'Super Administrator',
            'email' => 'dy_admin@gmail.com',
            'password' => \Illuminate\Support\Facades\Hash::make('Gales123'),
            'user_type' => 'system_admin',
            'role' => 'admin',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->command->info('✅ Super admin account created successfully!');
    }
}
