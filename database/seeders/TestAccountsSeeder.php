<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Clinic;
use Illuminate\Support\Facades\Hash;

class TestAccountsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or get Enhaynes Dental Clinic
        $clinic = Clinic::where('slug', 'enhaynes-dental-clinic')->first();
        
        if (!$clinic) {
            $clinic = Clinic::create([
                'name' => 'Enhaynes Dental Clinic',
                'slug' => 'enhaynes-dental-clinic',
                'street_address' => '123 Main Street',
                'city_municipality_code' => 'surigao-city',
                'province_code' => 'surigao-del-norte',
                'region_code' => 'caraga',
                'contact_number' => '09171234567',
                'email' => 'enhaynesdental@gmail.com',
                'license_number' => 'EDC-2024-001',
                'operating_hours' => [
                    'monday' => ['open' => '08:00', 'close' => '17:00'],
                    'tuesday' => ['open' => '08:00', 'close' => '17:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '17:00'],
                    'thursday' => ['open' => '08:00', 'close' => '17:00'],
                    'friday' => ['open' => '08:00', 'close' => '17:00'],
                    'saturday' => ['open' => '08:00', 'close' => '12:00'],
                    'sunday' => ['open' => null, 'close' => null],
                ],
                'is_active' => true,
            ]);
        }

        // Create or update Clinic Admin for Enhaynes Dental
        User::updateOrCreate(
            ['email' => 'enhaynesdental@gmail.com'],
            [
                'name' => 'Dr. Enhaynes',
                'password' => Hash::make('Enhaynes123'),
                'phone_number' => '09171234567',
                'role' => 'clinic_admin',
                'user_type' => User::TYPE_CLINIC_STAFF,
                'clinic_id' => $clinic->id,
                'email_verified_at' => now(),
                'registration_verified' => true,
                'is_active' => true,
            ]
        );

        // Create or update Patient Account - DY MARK GALES
        User::updateOrCreate(
            ['email' => 'dypatient@gmail.com'],
            [
                'name' => 'DY MARK GALES',
                'password' => Hash::make('Gales123'),
                'phone_number' => '09457766068',
                'role' => 'patient',
                'user_type' => User::TYPE_PATIENT,
                'clinic_id' => null,
                'email_verified_at' => now(),
                'registration_verified' => true,
                'is_active' => true,
            ]
        );

        $this->command->info('✅ Test accounts created successfully!');
        $this->command->info('');
        $this->command->info('Clinic Admin:');
        $this->command->info('  Email: enhaynesdental@gmail.com');
        $this->command->info('  Password: Enhaynes123');
        $this->command->info('');
        $this->command->info('Patient:');
        $this->command->info('  Email: dypatient@gmail.com');
        $this->command->info('  Password: Gales123');
    }
}
