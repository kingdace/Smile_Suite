<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class RailwayCompleteSeeder extends Seeder
{
    /**
     * Railway Complete Seeder
     *
     * This seeder runs ALL seeders needed for Railway deployment
     * in the correct order to avoid foreign key constraints
     */

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Starting Railway Complete Seeding Process...');
        $this->command->newLine();

        // Step 1: Initial Data (Admin user, demo clinic, demo users, suppliers, inventory)
        $this->command->info('📦 Step 1: Seeding Initial Data...');
        $this->call(InitialDataSeeder::class);

        // Step 2: Appointment Statuses (global)
        $this->command->info('📅 Step 2: Seeding Appointment Statuses...');
        $this->call(AppointmentStatusSeeder::class);

        // Step 3: Appointment Types (global)
        $this->command->info('📝 Step 3: Seeding Appointment Types...');
        $this->call(AppointmentTypeSeeder::class);

        // Step 4: Permissions
        $this->command->info('🔐 Step 4: Seeding Permissions...');
        $this->call(PermissionSeeder::class);

        // Step 5: Roles and Role Permissions
        $this->command->info('👥 Step 5: Seeding Roles...');
        $this->call(RoleSeeder::class);

        $this->command->info('🔗 Step 6: Assigning Role Permissions...');
        $this->call(RolePermissionSeeder::class);

        // Step 6: Users
        $this->command->info('👤 Step 7: Seeding Users...');
        $this->call(UserSeeder::class);

        // Step 7: Clinics
        $this->command->info('🏥 Step 8: Seeding Clinics (Original 12 clinics)...');
        $this->call(ClinicSeeder::class);

        // Step 8: Surigao Clinics (2025)
        $this->command->info('🏥 Step 9: Seeding Surigao Clinics (20 clinics)...');
        $this->call(ClinicSeeder2025::class);

        // Step 9: Clinic Galleries
        $this->command->info('🖼️ Step 10: Seeding Clinic Galleries...');
        $this->call(ClinicGallerySeeder::class);

        // Step 10: Reviews
        $this->command->info('⭐ Step 10: Seeding Reviews...');
        $this->call(ReviewSeeder::class);

        // Step 11: Appointments (for clinic 27)
        $this->command->info('📅 Step 11: Seeding Appointments for Clinic 27...');
        $this->command->info('   Creating appointments for Jan, May, Jul, Aug, Sep...');
        $this->call(AppointmentSeeder::class);

        // Step 12: Treatments (for clinic 27)
        $this->command->info('🦷 Step 12: Seeding Treatments for Clinic 27...');
        $this->command->info('   Creating treatments from appointments...');
        $this->call(TreatmentSeeder::class);

        // Step 13: Payments (for clinic 27)
        $this->command->info('💳 Step 13: Seeding Payments for Clinic 27...');
        $this->command->info('   Creating payments for treatments...');
        $this->call(PaymentSeeder::class);

        $this->command->newLine();
        $this->command->info('✅ Railway Complete Seeding Process Finished!');
        $this->command->newLine();

        // Display summary
        $clinicCount = \App\Models\Clinic::count();
        $userCount = \App\Models\User::count();
        $reviewCount = \App\Models\Review::count();
        $galleryCount = \App\Models\ClinicGalleryImage::count();
        $appointmentCount = \App\Models\Appointment::count();
        $treatmentCount = \App\Models\Treatment::count();
        $paymentCount = \App\Models\Payment::count();

        $this->command->info('📊 Database Summary:');
        $this->command->info("   - Clinics: {$clinicCount}");
        $this->command->info("   - Users: {$userCount}");
        $this->command->info("   - Reviews: {$reviewCount}");
        $this->command->info("   - Gallery Images: {$galleryCount}");
        $this->command->info("   - Appointments: {$appointmentCount}");
        $this->command->info("   - Treatments: {$treatmentCount}");
        $this->command->info("   - Payments: {$paymentCount}");
    }
}

