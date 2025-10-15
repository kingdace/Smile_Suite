<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ClinicSeeder2025 extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinics = [
            [
                'clinic_name' => 'Smile Care Dental Studio',
                'email' => 'contact@smilecaredentalstudio.com',
                'contact_number' => '+639175501234',
                'license_number' => 'DENT-2025-001',
                'description' => 'Providing quality and compassionate dental care focused on creating confident smiles for families in Surigao.',
                'address' => 'P-2 Rizal Street, Taft, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'Bright Smiles Dental Clinic',
                'email' => 'info@brightsmilesclinic.com',
                'contact_number' => '+639567881234',
                'license_number' => 'DENT-2025-002',
                'description' => 'Specializing in cosmetic and restorative dentistry with modern technology and a gentle approach.',
                'address' => 'Borromeo Street, Washington, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'Surigao Dental Wellness Center',
                'email' => 'hello@surigaodentalwellness.com',
                'contact_number' => '+639772341111',
                'license_number' => 'DENT-2025-003',
                'description' => 'Your trusted partner in oral health, wellness, and preventive dental care.',
                'address' => 'P-5 Navarro St., San Juan, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'Pearl Dental Aesthetics',
                'email' => 'service@pearldentalaesthetics.com',
                'contact_number' => '+639234555789',
                'license_number' => 'DENT-2025-004',
                'description' => 'Combining advanced aesthetic dentistry with personalized patient care for a radiant smile.',
                'address' => 'Gaisano Capital Surigao, Rizal Street, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'Ocean View Dental Hub',
                'email' => 'appointments@oceanviewdentalhub.com',
                'contact_number' => '+639981120321',
                'license_number' => 'DENT-2025-005',
                'description' => 'Offering comprehensive dental services with a relaxing ocean view environment.',
                'address' => 'Boulevard, Sabang, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'Tandang Dental Clinic',
                'email' => 'tandangdental@gmail.com',
                'contact_number' => '+639456882210',
                'license_number' => 'DENT-2025-006',
                'description' => 'Serving the Surigao community for over 10 years with trusted dental care and patient dedication.',
                'address' => 'P-3 San Nicolas Street, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'City Center Dental',
                'email' => 'care@citycenterdental.com',
                'contact_number' => '+639227654321',
                'license_number' => 'DENT-2025-007',
                'description' => 'Your go-to modern dental clinic at the heart of Surigao City for all family dental needs.',
                'address' => '1st Floor, Centro Building, Borromeo Street, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'SpringDent Dental Care',
                'email' => 'smile@springdentcare.com',
                'contact_number' => '+639345221567',
                'license_number' => 'DENT-2025-008',
                'description' => 'Refreshing smiles with advanced restorative treatments and preventive care programs.',
                'address' => 'Luneta Street, Washington, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'Sunburst Dental',
                'email' => 'info@sunburstdental.com',
                'contact_number' => '+639672889900',
                'license_number' => 'DENT-2025-009',
                'description' => 'Delivering bright and healthy smiles with the latest in dental innovation.',
                'address' => 'Mabini Street, Taft, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'Surfside Dental',
                'email' => 'support@surfsidedental.com',
                'contact_number' => '+639923456987',
                'license_number' => 'DENT-2025-010',
                'description' => 'Relax and enjoy gentle, beachside-inspired dental care in a calm and friendly atmosphere.',
                'address' => 'Sabang Beach Road, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'St. Peter Dental Clinic',
                'email' => 'contact@stpeterdental.com',
                'contact_number' => '+639771112222',
                'license_number' => 'DENT-2025-011',
                'description' => 'Faith-driven dental professionals providing quality care with compassion and integrity.',
                'address' => 'P-4 San Pedro Street, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'LightHouse Dental',
                'email' => 'admin@lighthousedental.com',
                'contact_number' => '+639554441112',
                'license_number' => 'DENT-2025-012',
                'description' => 'Guiding you toward better oral health through precision, care, and education.',
                'address' => 'Lighthouse Building, Navarro Street, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'Parkview Dental',
                'email' => 'info@parkviewdental.com',
                'contact_number' => '+639884563320',
                'license_number' => 'DENT-2025-013',
                'description' => 'Experience world-class dental services in a comfortable and nature-inspired setting.',
                'address' => 'Parkway Avenue, Mabua, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'Diamond Dental',
                'email' => 'contact@diamonddental.com',
                'contact_number' => '+639333002111',
                'license_number' => 'DENT-2025-014',
                'description' => 'Shining bright smiles through expert care, precision, and comfort.',
                'address' => '2nd Floor, SM Surigao, Rizal Street, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'Seaview Dental',
                'email' => 'hello@seaviewdental.com',
                'contact_number' => '+639888111200',
                'license_number' => 'DENT-2025-015',
                'description' => 'Dedicated to providing patient-centered care with beautiful sea-inspired relaxation.',
                'address' => 'Seaside Road, Lipata, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'WhiteSmile Dental Clinic',
                'email' => 'service@whitesmiledental.com',
                'contact_number' => '+639445556789',
                'license_number' => 'DENT-2025-016',
                'description' => 'Creating lasting impressions with whitening, braces, and complete smile makeovers.',
                'address' => 'Taft Street, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'BrightDent Dental',
                'email' => 'brightdent@gmail.com',
                'contact_number' => '+639912341212',
                'license_number' => 'DENT-2025-017',
                'description' => 'Your partner in achieving brighter, healthier teeth through modern dentistry.',
                'address' => 'P-6 Roxas Street, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'Apex Dental Clinic',
                'email' => 'info@apexdentalph.com',
                'contact_number' => '+639556712345',
                'license_number' => 'DENT-2025-018',
                'description' => 'Providing top-tier dental care with cutting-edge technology and professional expertise.',
                'address' => 'Montilla Boulevard, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'BlueWave Dental',
                'email' => 'team@bluewavedental.com',
                'contact_number' => '+639321235678',
                'license_number' => 'DENT-2025-019',
                'description' => 'Modern dentistry with a wave of innovation, comfort, and patient satisfaction.',
                'address' => 'Boulevard Road, Sabang, Surigao City, Surigao del Norte'
            ],
            [
                'clinic_name' => 'Pearl Dental',
                'email' => 'pearldentalcare@gmail.com',
                'contact_number' => '+639668899000',
                'license_number' => 'DENT-2025-020',
                'description' => 'Delivering gentle, professional, and affordable dental care for every family.',
                'address' => 'San Nicolas Street, Surigao City, Surigao del Norte'
            ]
        ];

        // Subscription plan distribution (similar to original seeder)
        $subscriptionPlans = ['basic', 'premium', 'enterprise'];
        $planDistribution = [
            'basic' => 7,      // 35% of 20 clinics
            'premium' => 8,    // 40% of 20 clinics  
            'enterprise' => 5  // 25% of 20 clinics
        ];

        $planCounter = 0;
        $planIndex = 0;

        foreach ($clinics as $index => $clinicData) {
            // Check if clinic already exists
            if (DB::table('clinics')->where('email', $clinicData['email'])->exists()) {
                continue; // Skip if clinic already exists
            }

            // Generate unique slug
            $slug = Str::slug($clinicData['clinic_name']);
            $originalSlug = $slug;
            $counter = 1;

            while (DB::table('clinics')->where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            // Assign subscription plan based on distribution
            $currentPlan = $subscriptionPlans[$planIndex];
            $planCounter++;
            
            if ($planCounter >= $planDistribution[$currentPlan]) {
                $planIndex++;
                $planCounter = 0;
            }

            // Set subscription dates - 2 months from now (60 days)
            $subscriptionStartDate = Carbon::now()->subDays(rand(1, 30)); // Started 1-30 days ago
            $subscriptionEndDate = Carbon::now()->addDays(60); // Expires in 2 months

            // Create clinic
            $clinicId = DB::table('clinics')->insertGetId([
                'name' => $clinicData['clinic_name'],
                'slug' => $slug,
                'logo_url' => '/images/clinic-logo.png',
                'description' => $clinicData['description'],
                'street_address' => $clinicData['address'],
                'region_code' => 'CARAGA',
                'province_code' => 'SURIGAO_DEL_NORTE',
                'city_municipality_code' => 'SURIGAO_CITY',
                'barangay_code' => 'TAFT',
                'address_details' => null,
                'postal_code' => '8400',
                'contact_number' => $clinicData['contact_number'],
                'email' => $clinicData['email'],
                'license_number' => $clinicData['license_number'],
                'operating_hours' => json_encode([
                    'monday' => ['08:00', '17:00'],
                    'tuesday' => ['08:00', '17:00'],
                    'wednesday' => ['08:00', '17:00'],
                    'thursday' => ['08:00', '17:00'],
                    'friday' => ['08:00', '17:00'],
                    'saturday' => ['08:00', '12:00'],
                    'sunday' => null
                ]),
                'timezone' => 'Asia/Manila',
                'is_active' => true,
                'subscription_plan' => $currentPlan,
                'subscription_status' => 'active',
                'subscription_start_date' => $subscriptionStartDate,
                'subscription_end_date' => $subscriptionEndDate,
                'trial_ends_at' => $currentPlan === 'basic' ? $subscriptionStartDate->addDays(14) : null,
                'last_payment_at' => $subscriptionStartDate,
                'next_payment_at' => $subscriptionEndDate,
                'latitude' => 9.7859 + (rand(-100, 100) / 10000), // Surigao City coordinates with slight variation
                'longitude' => 125.4968 + (rand(-100, 100) / 10000),
                'created_at' => $subscriptionStartDate,
                'updated_at' => Carbon::now(),
            ]);

            // Create clinic admin user
            $adminName = 'Dr. ' . $this->generateRandomName();
            $adminEmail = 'admin@' . strtolower(str_replace([' ', '-'], '', $clinicData['clinic_name'])) . '.com';

            if (!DB::table('users')->where('email', $adminEmail)->exists()) {
                DB::table('users')->insert([
                    'name' => $adminName,
                    'email' => $adminEmail,
                    'password' => Hash::make('password123'),
                    'role' => 'clinic_admin',
                    'user_type' => 'clinic_staff',
                    'clinic_id' => $clinicId,
                    'email_verified_at' => $subscriptionStartDate,
                    'created_at' => $subscriptionStartDate,
                    'updated_at' => Carbon::now(),
                ]);
            }

            // Create dentist user
            $dentistName = $this->generateRandomName();
            $dentistEmail = 'dentist@' . strtolower(str_replace([' ', '-'], '', $clinicData['clinic_name'])) . '.com';

            if (!DB::table('users')->where('email', $dentistEmail)->exists()) {
                DB::table('users')->insert([
                    'name' => $dentistName,
                    'email' => $dentistEmail,
                    'password' => Hash::make('password123'),
                    'role' => 'dentist',
                    'user_type' => 'clinic_staff',
                    'clinic_id' => $clinicId,
                    'email_verified_at' => $subscriptionStartDate,
                    'created_at' => $subscriptionStartDate,
                    'updated_at' => Carbon::now(),
                ]);
            }

            // Create staff user for premium and enterprise plans
            if (in_array($currentPlan, ['premium', 'enterprise'])) {
                $staffName = $this->generateRandomName();
                $staffEmail = 'staff@' . strtolower(str_replace([' ', '-'], '', $clinicData['clinic_name'])) . '.com';

                if (!DB::table('users')->where('email', $staffEmail)->exists()) {
                    DB::table('users')->insert([
                        'name' => $staffName,
                        'email' => $staffEmail,
                        'password' => Hash::make('password123'),
                        'role' => 'staff',
                        'user_type' => 'clinic_staff',
                        'clinic_id' => $clinicId,
                        'email_verified_at' => $subscriptionStartDate,
                        'created_at' => $subscriptionStartDate,
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
        }

        $this->command->info('✅ Successfully seeded 20 Surigao dental clinics with 2-month active subscriptions!');
        $this->command->info('📊 Plan Distribution:');
        $this->command->info('   - Basic Plan: 7 clinics (35%)');
        $this->command->info('   - Premium Plan: 8 clinics (40%)');
        $this->command->info('   - Enterprise Plan: 5 clinics (25%)');
        $this->command->info('🔑 All users have password: password123');
        $this->command->info('📅 Subscriptions expire in 2 months from now');
    }

    /**
     * Generate a random Filipino name
     */
    private function generateRandomName()
    {
        $firstNames = [
            'Maria', 'Jose', 'Antonio', 'Francisco', 'Manuel', 'Juan', 'Pedro', 'Rafael',
            'Carlos', 'Miguel', 'Ana', 'Carmen', 'Isabel', 'Rosa', 'Teresa', 'Elena',
            'Patricia', 'Cristina', 'Monica', 'Sofia', 'Alejandro', 'Fernando', 'Ricardo',
            'Alberto', 'Eduardo', 'Roberto', 'Daniel', 'Luis', 'Jorge', 'Andres',
            'Gabriel', 'Diego', 'Santiago', 'Sebastian', 'Mateo', 'Leonardo', 'Nicolas',
            'Valentina', 'Isabella', 'Camila', 'Sofia', 'Valeria', 'Ximena', 'Regina'
        ];

        $lastNames = [
            'Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres',
            'Flores', 'Rivera', 'Gonzales', 'Diaz', 'Perez', 'Gomez', 'Martinez', 'Lopez',
            'Hernandez', 'Sanchez', 'Ramirez', 'Jimenez', 'Rodriguez', 'Gutierrez',
            'Morales', 'Ramos', 'Vargas', 'Castillo', 'Moreno', 'Herrera', 'Medina',
            'Aguilar', 'Vega', 'Castro', 'Romero', 'Alvarez', 'Ruiz', 'Blanco', 'Suarez'
        ];

        return $firstNames[array_rand($firstNames)] . ' ' . $lastNames[array_rand($lastNames)];
    }
}
