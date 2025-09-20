<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventory;
use App\Models\Clinic;

class TestInventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinic = Clinic::first();
        
        if (!$clinic) {
            $this->command->error('No clinic found. Please create a clinic first.');
            return;
        }

        $testItems = [
            [
                'name' => 'Dental Composite Resin',
                'category' => 'materials',
                'quantity' => 50,
                'unit_price' => 125.00,
                'minimum_quantity' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Local Anesthetic (Lidocaine)',
                'category' => 'medication',
                'quantity' => 25,
                'unit_price' => 85.50,
                'minimum_quantity' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Dental Floss',
                'category' => 'supplies',
                'quantity' => 100,
                'unit_price' => 15.75,
                'minimum_quantity' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Dental X-Ray Film',
                'category' => 'supplies',
                'quantity' => 30,
                'unit_price' => 45.00,
                'minimum_quantity' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Dental Cement',
                'category' => 'materials',
                'quantity' => 15,
                'unit_price' => 95.25,
                'minimum_quantity' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($testItems as $item) {
            Inventory::create([
                'clinic_id' => $clinic->id,
                'name' => $item['name'],
                'category' => $item['category'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'minimum_quantity' => $item['minimum_quantity'],
                'is_active' => $item['is_active'],
                'description' => 'Test inventory item for treatment integration',
            ]);
        }

        $this->command->info('Test inventory items created successfully!');
    }
}

