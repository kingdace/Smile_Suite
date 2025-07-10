<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Str;

class InitialDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        DB::table('users')->insert([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'password' => Hash::make('Gales123'),
            'role' => 'admin',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Create demo clinic
        DB::table('clinics')->insert([
            'name' => 'Enhaynes Dental Clinic',
            'description' => 'Enhaynes Dental Clinic is a dental clinic that provides dental services to the community.',
            'slug' => Str::slug('Enhaynes Dental Clinic'),
            'street_address' => '123 Main Street',
            'region_code' => 'CARAGA',
            'province_code' => 'SURIGAO_DEL_NORTE',
            'city_municipality_code' => 'SURIGAO_CITY',
            'barangay_code' => 'IPIL',
            'address_details' => 'Near City Hall',
            'contact_number' => '+639123456789',
            'email' => 'contact@enhaynesdental.com',
            'license_number' => 'DENT-2024-001',
            'operating_hours' => json_encode([
                'monday' => ['09:00', '17:00'],
                'tuesday' => ['09:00', '17:00'],
                'wednesday' => ['09:00', '17:00'],
                'thursday' => ['09:00', '17:00'],
                'friday' => ['09:00', '17:00'],
                'saturday' => ['09:00', '12:00'],
                'sunday' => null
            ]),
            'timezone' => 'Asia/Manila',
            'is_active' => true,
            'subscription_status' => 'active',
            'subscription_plan' => 'basic',
            'subscription_start_date' => Carbon::now(),
            'subscription_end_date' => Carbon::now()->addYear(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Create demo staff user
        DB::table('users')->insert([
            'name' => 'Demo Staff',
            'email' => 'staff@staff.com',
            'password' => Hash::make('Gales123'),
            'role' => 'staff',
            'clinic_id' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Create a sample dentist
        DB::table('users')->insert([
            'name' => 'Dr. John Doe',
            'email' => 'dentist@dentist.com',
            'password' => Hash::make('Gales123'),
            'role' => 'dentist',
            'clinic_id' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Create sample suppliers
        $suppliers = [
            [
                'name' => 'Dental Supplies Co.',
                'contact_person' => 'John Smith',
                'email' => 'contact@dentalsupplies.com',
                'phone' => '+639123456789',
                'address' => '456 Supply Street, Manila',
                'tax_id' => 'TAX-001',
                'payment_terms' => 'Net 30',
                'clinic_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Medical Supplies Inc.',
                'contact_person' => 'Jane Doe',
                'email' => 'contact@medsupplies.com',
                'phone' => '+639987654321',
                'address' => '789 Medical Ave, Manila',
                'tax_id' => 'TAX-002',
                'payment_terms' => 'Net 15',
                'clinic_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($suppliers as $supplier) {
            DB::table('suppliers')->insert($supplier);
        }

        // Create some sample inventory items
        $inventoryItems = [
            [
                'name' => 'Dental Floss',
                'category' => 'dental_supplies',
                'description' => 'Waxed dental floss, 50m per roll',
                'quantity' => 100,
                'minimum_quantity' => 20,
                'unit_price' => 50.00,
                'supplier_id' => 1,
                'clinic_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Toothpaste',
                'category' => 'dental_supplies',
                'description' => 'Fluoride toothpaste, 100g tube',
                'quantity' => 50,
                'minimum_quantity' => 10,
                'unit_price' => 75.00,
                'supplier_id' => 1,
                'clinic_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Dental Anesthetic',
                'category' => 'medications',
                'description' => 'Local anesthetic, 50ml bottle',
                'quantity' => 30,
                'minimum_quantity' => 5,
                'unit_price' => 500.00,
                'supplier_id' => 2,
                'clinic_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($inventoryItems as $item) {
            DB::table('inventory')->insert($item);
        }
    }
}
