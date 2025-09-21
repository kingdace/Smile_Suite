<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ClinicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinics = [
            [
                'name' => 'Metro Manila Dental Center',
                'description' => 'A premier dental clinic in the heart of Metro Manila, offering comprehensive dental care with state-of-the-art equipment and experienced professionals.',
                'street_address' => '123 Ayala Avenue, Makati City',
                'region_code' => 'NCR',
                'province_code' => 'NCR',
                'city_municipality_code' => 'MAKATI',
                'barangay_code' => 'AYALA',
                'address_details' => 'Ground Floor, Ayala Tower One',
                'postal_code' => '1226',
                'contact_number' => '+632-8888-1234',
                'email' => 'info@metromaniladental.com',
                'license_number' => 'DENT-NCR-2024-001',
                'operating_hours' => [
                    'monday' => ['08:00', '18:00'],
                    'tuesday' => ['08:00', '18:00'],
                    'wednesday' => ['08:00', '18:00'],
                    'thursday' => ['08:00', '18:00'],
                    'friday' => ['08:00', '18:00'],
                    'saturday' => ['09:00', '15:00'],
                    'sunday' => null
                ],
                'subscription_plan' => 'premium',
                'subscription_status' => 'active',
                'latitude' => 14.5547,
                'longitude' => 121.0244,
            ],
            [
                'name' => 'Quezon City Family Dental Clinic',
                'description' => 'Family-oriented dental practice providing gentle care for patients of all ages, specializing in preventive dentistry and orthodontics.',
                'street_address' => '456 Tomas Morato Avenue, Quezon City',
                'region_code' => 'NCR',
                'province_code' => 'NCR',
                'city_municipality_code' => 'QUEZON_CITY',
                'barangay_code' => 'DILIMAN',
                'address_details' => '2nd Floor, Tomas Morato Building',
                'postal_code' => '1103',
                'contact_number' => '+632-8888-2345',
                'email' => 'contact@qcfamilydental.com',
                'license_number' => 'DENT-NCR-2024-002',
                'operating_hours' => [
                    'monday' => ['09:00', '17:00'],
                    'tuesday' => ['09:00', '17:00'],
                    'wednesday' => ['09:00', '17:00'],
                    'thursday' => ['09:00', '17:00'],
                    'friday' => ['09:00', '17:00'],
                    'saturday' => ['08:00', '12:00'],
                    'sunday' => null
                ],
                'subscription_plan' => 'basic',
                'subscription_status' => 'active',
                'latitude' => 14.6760,
                'longitude' => 121.0437,
            ],
            [
                'name' => 'Cebu City Dental Excellence',
                'description' => 'Leading dental clinic in Cebu offering advanced cosmetic and restorative dentistry services with modern technology and skilled practitioners.',
                'street_address' => '789 Fuente Osmeña Circle, Cebu City',
                'region_code' => 'CENTRAL_VISAYAS',
                'province_code' => 'CEBU',
                'city_municipality_code' => 'CEBU_CITY',
                'barangay_code' => 'FUENTE_OSMENA',
                'address_details' => '3rd Floor, Fuente Medical Center',
                'postal_code' => '6000',
                'contact_number' => '+6332-8888-3456',
                'email' => 'info@cebudentalexcellence.com',
                'license_number' => 'DENT-CV-2024-003',
                'operating_hours' => [
                    'monday' => ['08:30', '17:30'],
                    'tuesday' => ['08:30', '17:30'],
                    'wednesday' => ['08:30', '17:30'],
                    'thursday' => ['08:30', '17:30'],
                    'friday' => ['08:30', '17:30'],
                    'saturday' => ['09:00', '14:00'],
                    'sunday' => null
                ],
                'subscription_plan' => 'enterprise',
                'subscription_status' => 'active',
                'latitude' => 10.3157,
                'longitude' => 123.8854,
            ],
            [
                'name' => 'Davao City Smile Center',
                'description' => 'Comprehensive dental care facility in Davao City, known for excellent patient care and advanced dental treatments including implants and cosmetic procedures.',
                'street_address' => '321 Davao City Boulevard, Davao City',
                'region_code' => 'DAVAO_REGION',
                'province_code' => 'DAVAO_DEL_SUR',
                'city_municipality_code' => 'DAVAO_CITY',
                'barangay_code' => 'CENTRO',
                'address_details' => 'Ground Floor, Davao Medical Plaza',
                'postal_code' => '8000',
                'contact_number' => '+6382-8888-4567',
                'email' => 'hello@davaosmilecenter.com',
                'license_number' => 'DENT-DAV-2024-004',
                'operating_hours' => [
                    'monday' => ['08:00', '18:00'],
                    'tuesday' => ['08:00', '18:00'],
                    'wednesday' => ['08:00', '18:00'],
                    'thursday' => ['08:00', '18:00'],
                    'friday' => ['08:00', '18:00'],
                    'saturday' => ['09:00', '15:00'],
                    'sunday' => null
                ],
                'subscription_plan' => 'premium',
                'subscription_status' => 'active',
                'latitude' => 7.1907,
                'longitude' => 125.4553,
            ],
            [
                'name' => 'Iloilo City Dental Care',
                'description' => 'Trusted dental practice in Iloilo City providing quality dental services with a focus on patient comfort and satisfaction.',
                'street_address' => '654 Jaro Plaza, Iloilo City',
                'region_code' => 'WESTERN_VISAYAS',
                'province_code' => 'ILOILO',
                'city_municipality_code' => 'ILOILO_CITY',
                'barangay_code' => 'JARO',
                'address_details' => '2nd Floor, Jaro Commercial Center',
                'postal_code' => '5000',
                'contact_number' => '+6333-8888-5678',
                'email' => 'contact@iloilodentalcare.com',
                'license_number' => 'DENT-WV-2024-005',
                'operating_hours' => [
                    'monday' => ['09:00', '17:00'],
                    'tuesday' => ['09:00', '17:00'],
                    'wednesday' => ['09:00', '17:00'],
                    'thursday' => ['09:00', '17:00'],
                    'friday' => ['09:00', '17:00'],
                    'saturday' => ['08:00', '12:00'],
                    'sunday' => null
                ],
                'subscription_plan' => 'basic',
                'subscription_status' => 'active',
                'latitude' => 10.7202,
                'longitude' => 122.5621,
            ],
            [
                'name' => 'Baguio City Mountain Dental',
                'description' => 'Premier dental clinic in the Summer Capital of the Philippines, offering specialized dental services with a focus on oral health and aesthetics.',
                'street_address' => '987 Session Road, Baguio City',
                'region_code' => 'CAR',
                'province_code' => 'BENGUET',
                'city_municipality_code' => 'BAGUIO_CITY',
                'barangay_code' => 'SESSION_ROAD',
                'address_details' => '4th Floor, Session Medical Building',
                'postal_code' => '2600',
                'contact_number' => '+6374-8888-6789',
                'email' => 'info@baguiomountaindental.com',
                'license_number' => 'DENT-CAR-2024-006',
                'operating_hours' => [
                    'monday' => ['08:30', '17:30'],
                    'tuesday' => ['08:30', '17:30'],
                    'wednesday' => ['08:30', '17:30'],
                    'thursday' => ['08:30', '17:30'],
                    'friday' => ['08:30', '17:30'],
                    'saturday' => ['09:00', '14:00'],
                    'sunday' => null
                ],
                'subscription_plan' => 'premium',
                'subscription_status' => 'active',
                'latitude' => 16.4023,
                'longitude' => 120.5960,
            ],
            [
                'name' => 'Cagayan de Oro Dental Hub',
                'description' => 'Modern dental facility in Cagayan de Oro providing comprehensive dental care with cutting-edge technology and experienced dental professionals.',
                'street_address' => '147 Limketkai Drive, Cagayan de Oro',
                'region_code' => 'NORTHERN_MINDANAO',
                'province_code' => 'MISAMIS_ORIENTAL',
                'city_municipality_code' => 'CAGAYAN_DE_ORO',
                'barangay_code' => 'LIMKETKAI',
                'address_details' => 'Ground Floor, Limketkai Center',
                'postal_code' => '9000',
                'contact_number' => '+6388-8888-7890',
                'email' => 'info@cdodentalhub.com',
                'license_number' => 'DENT-NM-2024-007',
                'operating_hours' => [
                    'monday' => ['08:00', '18:00'],
                    'tuesday' => ['08:00', '18:00'],
                    'wednesday' => ['08:00', '18:00'],
                    'thursday' => ['08:00', '18:00'],
                    'friday' => ['08:00', '18:00'],
                    'saturday' => ['09:00', '15:00'],
                    'sunday' => null
                ],
                'subscription_plan' => 'enterprise',
                'subscription_status' => 'active',
                'latitude' => 8.4542,
                'longitude' => 124.6319,
            ],
            [
                'name' => 'Bacolod City Smile Studio',
                'description' => 'Artistic dental practice in Bacolod City specializing in cosmetic dentistry and smile makeovers with a focus on natural-looking results.',
                'street_address' => '258 Lacson Street, Bacolod City',
                'region_code' => 'WESTERN_VISAYAS',
                'province_code' => 'NEGROS_OCCIDENTAL',
                'city_municipality_code' => 'BACOLOD_CITY',
                'barangay_code' => 'LACSON',
                'address_details' => '3rd Floor, Lacson Medical Center',
                'postal_code' => '6100',
                'contact_number' => '+6334-8888-8901',
                'email' => 'hello@bacolodsmilestudio.com',
                'license_number' => 'DENT-WV-2024-008',
                'operating_hours' => [
                    'monday' => ['09:00', '17:00'],
                    'tuesday' => ['09:00', '17:00'],
                    'wednesday' => ['09:00', '17:00'],
                    'thursday' => ['09:00', '17:00'],
                    'friday' => ['09:00', '17:00'],
                    'saturday' => ['08:00', '12:00'],
                    'sunday' => null
                ],
                'subscription_plan' => 'basic',
                'subscription_status' => 'active',
                'latitude' => 10.6407,
                'longitude' => 122.9682,
            ],
            [
                'name' => 'Zamboanga City Dental Care Center',
                'description' => 'Comprehensive dental care facility in Zamboanga City offering a full range of dental services with emphasis on patient comfort and quality care.',
                'street_address' => '369 Paseo del Mar, Zamboanga City',
                'region_code' => 'ZAMBOANGA_PENINSULA',
                'province_code' => 'ZAMBOANGA_CITY',
                'city_municipality_code' => 'ZAMBOANGA_CITY',
                'barangay_code' => 'PASEO_DEL_MAR',
                'address_details' => '2nd Floor, Paseo Medical Building',
                'postal_code' => '7000',
                'contact_number' => '+6362-8888-9012',
                'email' => 'contact@zamboangadentalcare.com',
                'license_number' => 'DENT-ZP-2024-009',
                'operating_hours' => [
                    'monday' => ['08:30', '17:30'],
                    'tuesday' => ['08:30', '17:30'],
                    'wednesday' => ['08:30', '17:30'],
                    'thursday' => ['08:30', '17:30'],
                    'friday' => ['08:30', '17:30'],
                    'saturday' => ['09:00', '14:00'],
                    'sunday' => null
                ],
                'subscription_plan' => 'premium',
                'subscription_status' => 'active',
                'latitude' => 6.9214,
                'longitude' => 122.0790,
            ],
            [
                'name' => 'Tacloban City Family Dental',
                'description' => 'Family-focused dental practice in Tacloban City providing gentle and comprehensive dental care for patients of all ages.',
                'street_address' => '741 Real Street, Tacloban City',
                'region_code' => 'EASTERN_VISAYAS',
                'province_code' => 'LEYTE',
                'city_municipality_code' => 'TACLOBAN_CITY',
                'barangay_code' => 'REAL',
                'address_details' => 'Ground Floor, Real Medical Plaza',
                'postal_code' => '6500',
                'contact_number' => '+6353-8888-0123',
                'email' => 'info@taclobanfamilydental.com',
                'license_number' => 'DENT-EV-2024-010',
                'operating_hours' => [
                    'monday' => ['08:00', '18:00'],
                    'tuesday' => ['08:00', '18:00'],
                    'wednesday' => ['08:00', '18:00'],
                    'thursday' => ['08:00', '18:00'],
                    'friday' => ['08:00', '18:00'],
                    'saturday' => ['09:00', '15:00'],
                    'sunday' => null
                ],
                'subscription_plan' => 'basic',
                'subscription_status' => 'active',
                'latitude' => 11.2518,
                'longitude' => 125.0060,
            ],
            [
                'name' => 'General Santos City Dental Excellence',
                'description' => 'Advanced dental clinic in General Santos City offering specialized treatments including orthodontics, implants, and cosmetic dentistry.',
                'street_address' => '852 Pioneer Avenue, General Santos City',
                'region_code' => 'SOCCSKSARGEN',
                'province_code' => 'SOUTH_COTABATO',
                'city_municipality_code' => 'GENERAL_SANTOS_CITY',
                'barangay_code' => 'PIONEER',
                'address_details' => '4th Floor, Pioneer Medical Center',
                'postal_code' => '9500',
                'contact_number' => '+6383-8888-1234',
                'email' => 'info@gensandentalexcellence.com',
                'license_number' => 'DENT-SOC-2024-011',
                'operating_hours' => [
                    'monday' => ['09:00', '17:00'],
                    'tuesday' => ['09:00', '17:00'],
                    'wednesday' => ['09:00', '17:00'],
                    'thursday' => ['09:00', '17:00'],
                    'friday' => ['09:00', '17:00'],
                    'saturday' => ['08:00', '12:00'],
                    'sunday' => null
                ],
                'subscription_plan' => 'enterprise',
                'subscription_status' => 'active',
                'latitude' => 6.1168,
                'longitude' => 125.1716,
            ],
            [
                'name' => 'Cagayan Valley Dental Center',
                'description' => 'Modern dental facility in Tuguegarao City providing comprehensive dental care with state-of-the-art equipment and experienced professionals.',
                'street_address' => '963 Magsaysay Avenue, Tuguegarao City',
                'region_code' => 'CAGAYAN_VALLEY',
                'province_code' => 'CAGAYAN',
                'city_municipality_code' => 'TUGUEGARAO_CITY',
                'barangay_code' => 'MAGSAYSAY',
                'address_details' => '2nd Floor, Magsaysay Medical Building',
                'postal_code' => '3500',
                'contact_number' => '+6378-8888-2345',
                'email' => 'contact@cagayanvalleydental.com',
                'license_number' => 'DENT-CV-2024-012',
                'operating_hours' => [
                    'monday' => ['08:30', '17:30'],
                    'tuesday' => ['08:30', '17:30'],
                    'wednesday' => ['08:30', '17:30'],
                    'thursday' => ['08:30', '17:30'],
                    'friday' => ['08:30', '17:30'],
                    'saturday' => ['09:00', '14:00'],
                    'sunday' => null
                ],
                'subscription_plan' => 'premium',
                'subscription_status' => 'active',
                'latitude' => 17.6138,
                'longitude' => 121.7269,
            ],
            [
                'name' => 'Palawan Dental Wellness Center',
                'description' => 'Premier dental wellness center in Puerto Princesa offering holistic dental care with a focus on patient comfort and natural treatments.',
                'street_address' => '741 Rizal Avenue, Puerto Princesa City',
                'region_code' => 'MIMAROPA',
                'province_code' => 'PALAWAN',
                'city_municipality_code' => 'PUERTO_PRINCESA_CITY',
                'barangay_code' => 'RIZAL',
                'address_details' => 'Ground Floor, Rizal Medical Plaza',
                'postal_code' => '5300',
                'contact_number' => '+6348-8888-3456',
                'email' => 'info@palawandentalwellness.com',
                'license_number' => 'DENT-MIM-2024-013',
                'operating_hours' => [
                    'monday' => ['08:00', '18:00'],
                    'tuesday' => ['08:00', '18:00'],
                    'wednesday' => ['08:00', '18:00'],
                    'thursday' => ['08:00', '18:00'],
                    'friday' => ['08:00', '18:00'],
                    'saturday' => ['09:00', '15:00'],
                    'sunday' => null
                ],
                'subscription_plan' => 'basic',
                'subscription_status' => 'active',
                'latitude' => 9.7392,
                'longitude' => 118.7353,
            ],
        ];

        foreach ($clinics as $clinicData) {
            // Check if clinic already exists
            if (DB::table('clinics')->where('email', $clinicData['email'])->exists()) {
                continue; // Skip if clinic already exists
            }

            // Generate unique slug
            $slug = Str::slug($clinicData['name']);
            $originalSlug = $slug;
            $counter = 1;

            while (DB::table('clinics')->where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            // Set subscription dates
            $subscriptionStartDate = Carbon::now()->subDays(rand(30, 365));
            $subscriptionEndDate = $subscriptionStartDate->copy()->addDays(30);

            // Create clinic
            $clinicId = DB::table('clinics')->insertGetId([
                'name' => $clinicData['name'],
                'slug' => $slug,
                'logo_url' => '/images/clinic-logo.png',
                'description' => $clinicData['description'],
                'street_address' => $clinicData['street_address'],
                'region_code' => $clinicData['region_code'],
                'province_code' => $clinicData['province_code'],
                'city_municipality_code' => $clinicData['city_municipality_code'],
                'barangay_code' => $clinicData['barangay_code'],
                'address_details' => $clinicData['address_details'],
                'postal_code' => $clinicData['postal_code'],
                'contact_number' => $clinicData['contact_number'],
                'email' => $clinicData['email'],
                'license_number' => $clinicData['license_number'],
                'operating_hours' => json_encode($clinicData['operating_hours']),
                'timezone' => 'Asia/Manila',
                'is_active' => true,
                'subscription_plan' => $clinicData['subscription_plan'],
                'subscription_status' => $clinicData['subscription_status'],
                'subscription_start_date' => $subscriptionStartDate,
                'subscription_end_date' => $subscriptionEndDate,
                'trial_ends_at' => $clinicData['subscription_plan'] === 'basic' ? $subscriptionStartDate->addDays(14) : null,
                'last_payment_at' => $subscriptionStartDate,
                'next_payment_at' => $subscriptionEndDate,
                'latitude' => $clinicData['latitude'],
                'longitude' => $clinicData['longitude'],
                'created_at' => $subscriptionStartDate,
                'updated_at' => Carbon::now(),
            ]);

            // Create clinic admin user
            $adminName = 'Dr. ' . $this->generateRandomName(); // Clinic admin should have Dr. prefix
            $adminEmail = 'admin@' . strtolower(str_replace(' ', '', $clinicData['name'])) . '.com';

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
            $dentistName = $this->generateRandomName(); // Model will automatically add "Dr." prefix
            $dentistEmail = 'dentist@' . strtolower(str_replace(' ', '', $clinicData['name'])) . '.com';

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
            if (in_array($clinicData['subscription_plan'], ['premium', 'enterprise'])) {
                $staffName = $this->generateRandomName();
                $staffEmail = 'staff@' . strtolower(str_replace(' ', '', $clinicData['name'])) . '.com';

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
            'Alberto', 'Eduardo', 'Roberto', 'Daniel', 'Luis', 'Jorge', 'Andres'
        ];

        $lastNames = [
            'Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres',
            'Flores', 'Rivera', 'Gonzales', 'Diaz', 'Perez', 'Gomez', 'Martinez', 'Lopez',
            'Hernandez', 'Sanchez', 'Ramirez', 'Jimenez', 'Rodriguez', 'Lopez', 'Gutierrez',
            'Morales', 'Ramos', 'Vargas', 'Castillo', 'Moreno', 'Herrera', 'Medina'
        ];

        return $firstNames[array_rand($firstNames)] . ' ' . $lastNames[array_rand($lastNames)];
    }
}
