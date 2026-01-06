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

            // Step 3: Initial Demo Data (Enhaynes Dental Clinic + users + suppliers + inventory)
            // Safe: Uses dynamic clinic_id = 1 (first clinic created)
            InitialDataSeeder::class,

            // Step 4: Demo Users (if any)
            UserSeeder::class,

            // Step 5: Demo Clinics (12 clinics across Philippines)
            // Safe: Creates clinics dynamically with unique slugs and emails
            ClinicSeeder::class,

            // Step 6: More Demo Clinics (20 Surigao clinics)
            // Safe: Creates clinics dynamically
            ClinicSeeder2025::class,

            // Step 7: Clinic Gallery Images
            // Safe: Uses dynamic clinic IDs
            ClinicGallerySeeder::class,

            // Step 8: Demo Reviews
            // Safe: Uses dynamic clinic and patient IDs
            ReviewSeeder::class,

            // EXCLUDED SEEDERS (Hardcoded for Clinic ID 27):
            // ❌ AppointmentSeeder - Hardcoded: $clinicId = 27
            // ❌ TreatmentSeeder - Hardcoded: $clinicId = 27
            // ❌ PaymentSeeder - Hardcoded: $clinicId = 27
            // ❌ NotificationSeeder - Depends on appointments (which are clinic 27 specific)
        ]);

        // Step 9: Create Super Admin Account
        $this->createSuperAdmin();

        $this->command->info('');
        $this->command->info('✅ Production database seeded successfully!');
        $this->command->info('✅ Super admin account: dy_admin@gmail.com');
        $this->command->info('✅ Demo data created:');
        $this->command->info('   - 1 Initial clinic (Enhaynes Dental Clinic)');
        $this->command->info('   - 12 Demo clinics (ClinicSeeder)');
        $this->command->info('   - 20 Surigao clinics (ClinicSeeder2025)');
        $this->command->info('   - Demo users, suppliers, inventory');
        $this->command->info('   - Clinic galleries and reviews');
        $this->command->warn('');
        $this->command->warn('⚠️  Excluded seeders (hardcoded for clinic ID 27):');
        $this->command->warn('   - AppointmentSeeder');
        $this->command->warn('   - TreatmentSeeder');
        $this->command->warn('   - PaymentSeeder');
        $this->command->warn('   - NotificationSeeder');
        $this->command->info('');
        $this->command->info('Next steps:');
        $this->command->info('1. Login as super admin: dy_admin@gmail.com');
        $this->command->info('2. Explore 33 demo clinics in the system');
        $this->command->info('3. Approve new clinic registrations via admin panel');
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
