<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventory;
use App\Models\Supplier;
use App\Models\Clinic;
use Carbon\Carbon;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates suppliers and 20 realistic dental inventory items for Enhaynes Dental Clinic
     */
    public function run(): void
    {
        // Get Enhaynes Dental Clinic
        $clinic = Clinic::where('slug', 'enhaynes-dental-clinic')->first();
        
        if (!$clinic) {
            $this->command->error('❌ Enhaynes Dental Clinic not found! Please run TestAccountsSeeder first.');
            return;
        }

        // Create suppliers first
        $suppliers = [
            [
                'clinic_id' => $clinic->id,
                'name' => 'MedSupply Philippines Inc.',
                'contact_person' => 'Maria Santos',
                'email' => 'sales@medsupply.ph',
                'phone' => '09171234567',
                'address' => 'Quezon City, Metro Manila',
                'notes' => 'Main supplier for medications and medical supplies',
            ],
            [
                'clinic_id' => $clinic->id,
                'name' => 'Dental Equipment Solutions',
                'contact_person' => 'Juan Dela Cruz',
                'email' => 'info@dentalequip.ph',
                'phone' => '09189876543',
                'address' => 'Makati City, Metro Manila',
                'notes' => 'Supplier for dental equipment and instruments',
            ],
            [
                'clinic_id' => $clinic->id,
                'name' => 'PharmaCare Distributors',
                'contact_person' => 'Ana Reyes',
                'email' => 'orders@pharmacare.ph',
                'phone' => '09156789012',
                'address' => 'Mandaluyong City, Metro Manila',
                'notes' => 'Pharmaceutical and medication supplier',
            ],
        ];

        $createdSuppliers = [];
        foreach ($suppliers as $supplierData) {
            $createdSuppliers[] = Supplier::create($supplierData);
        }

        // Now create 20 inventory items
        $inventoryItems = [
            // MEDICATIONS (4 items)
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[2]->id, // PharmaCare
                'name' => 'Lidocaine 2% Injectable',
                'description' => 'Local anesthetic for dental procedures. 2% lidocaine hydrochloride with epinephrine 1:100,000.',
                'quantity' => 50,
                'minimum_quantity' => 20,
                'unit_price' => 150.00,
                'category' => 'medications',
                'expiry_date' => Carbon::now()->addMonths(18),
                'notes' => 'Store in cool, dry place. Check expiry before use.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[2]->id, // PharmaCare
                'name' => 'Amoxicillin 500mg Capsules',
                'description' => 'Antibiotic for dental infections. 500mg capsules.',
                'quantity' => 200,
                'minimum_quantity' => 50,
                'unit_price' => 8.00,
                'category' => 'medications',
                'expiry_date' => Carbon::now()->addMonths(24),
                'notes' => 'Prescription required. Store at room temperature.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[2]->id, // PharmaCare
                'name' => 'Ibuprofen 400mg Tablets',
                'description' => 'Pain reliever and anti-inflammatory medication.',
                'quantity' => 150,
                'minimum_quantity' => 40,
                'unit_price' => 5.00,
                'category' => 'medications',
                'expiry_date' => Carbon::now()->addMonths(30),
                'notes' => 'For post-procedure pain management.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[2]->id, // PharmaCare
                'name' => 'Mefenamic Acid 500mg Capsules',
                'description' => 'Analgesic for moderate to severe dental pain.',
                'quantity' => 100,
                'minimum_quantity' => 30,
                'unit_price' => 6.00,
                'category' => 'medications',
                'expiry_date' => Carbon::now()->addMonths(20),
                'notes' => 'Take with food to avoid stomach upset.',
                'is_active' => true,
            ],

            // SUPPLIES (10 items)
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[0]->id, // MedSupply
                'name' => 'Dental Gloves (Latex) - Medium',
                'description' => 'Disposable latex examination gloves, powder-free, medium size.',
                'quantity' => 500,
                'minimum_quantity' => 100,
                'unit_price' => 10.00,
                'category' => 'supplies',
                'expiry_date' => null,
                'notes' => 'Box of 100 pairs. Check for latex allergies.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[0]->id, // MedSupply
                'name' => 'Face Masks (Surgical) 3-Ply',
                'description' => 'Disposable 3-ply surgical face masks with ear loops.',
                'quantity' => 1000,
                'minimum_quantity' => 200,
                'unit_price' => 3.00,
                'category' => 'supplies',
                'expiry_date' => null,
                'notes' => 'Box of 50 pieces. Essential PPE for infection control.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[1]->id, // Dental Equipment
                'name' => 'Dental Burs (Assorted)',
                'description' => 'Assorted carbide and diamond dental burs for various procedures.',
                'quantity' => 200,
                'minimum_quantity' => 50,
                'unit_price' => 50.00,
                'category' => 'supplies',
                'expiry_date' => null,
                'notes' => 'Sterilize before use. Replace when worn.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[1]->id, // Dental Equipment
                'name' => 'Composite Resin (A2 Shade)',
                'description' => 'Light-cured composite resin for tooth-colored fillings, A2 shade.',
                'quantity' => 20,
                'minimum_quantity' => 5,
                'unit_price' => 800.00,
                'category' => 'supplies',
                'expiry_date' => Carbon::now()->addMonths(12),
                'notes' => 'Store away from light. Most popular shade for Filipino patients.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[0]->id, // MedSupply
                'name' => 'Cotton Rolls (Medium)',
                'description' => 'Sterile cotton rolls for moisture control during procedures.',
                'quantity' => 500,
                'minimum_quantity' => 100,
                'unit_price' => 15.00,
                'category' => 'supplies',
                'expiry_date' => null,
                'notes' => 'Pack of 100 pieces. Keep in dry storage.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[1]->id, // Dental Equipment
                'name' => 'Dental Needles (27G)',
                'description' => '27-gauge dental needles for local anesthetic injection.',
                'quantity' => 300,
                'minimum_quantity' => 75,
                'unit_price' => 12.00,
                'category' => 'supplies',
                'expiry_date' => Carbon::now()->addMonths(36),
                'notes' => 'Single use only. Dispose in sharps container.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[0]->id, // MedSupply
                'name' => 'Dental Bibs (Disposable)',
                'description' => 'Disposable patient bibs with plastic backing.',
                'quantity' => 1000,
                'minimum_quantity' => 200,
                'unit_price' => 2.00,
                'category' => 'supplies',
                'expiry_date' => null,
                'notes' => 'Box of 500 pieces. Blue color.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[1]->id, // Dental Equipment
                'name' => 'Impression Material (Alginate)',
                'description' => 'Fast-setting alginate impression material for dental impressions.',
                'quantity' => 10,
                'minimum_quantity' => 3,
                'unit_price' => 1200.00,
                'category' => 'supplies',
                'expiry_date' => Carbon::now()->addMonths(18),
                'notes' => 'Mix with water according to instructions. Store in airtight container.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[1]->id, // Dental Equipment
                'name' => 'Dental Cement (Glass Ionomer)',
                'description' => 'Glass ionomer cement for permanent restorations and luting.',
                'quantity' => 15,
                'minimum_quantity' => 5,
                'unit_price' => 650.00,
                'category' => 'supplies',
                'expiry_date' => Carbon::now()->addMonths(24),
                'notes' => 'Follow mixing instructions carefully.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[1]->id, // Dental Equipment
                'name' => 'Articulating Paper',
                'description' => 'Thin paper strips for marking occlusal contacts.',
                'quantity' => 100,
                'minimum_quantity' => 25,
                'unit_price' => 8.00,
                'category' => 'supplies',
                'expiry_date' => null,
                'notes' => 'Red and blue colors available.',
                'is_active' => true,
            ],

            // EQUIPMENT (4 items)
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[1]->id, // Dental Equipment
                'name' => 'Dental Mirrors (#5)',
                'description' => 'Stainless steel dental mouth mirrors, size #5.',
                'quantity' => 50,
                'minimum_quantity' => 15,
                'unit_price' => 200.00,
                'category' => 'equipment',
                'expiry_date' => null,
                'notes' => 'Autoclavable. Replace when scratched or damaged.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[1]->id, // Dental Equipment
                'name' => 'Dental Explorers',
                'description' => 'Stainless steel dental explorers for cavity detection.',
                'quantity' => 30,
                'minimum_quantity' => 10,
                'unit_price' => 250.00,
                'category' => 'equipment',
                'expiry_date' => null,
                'notes' => 'Sharpen regularly. Autoclavable.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[1]->id, // Dental Equipment
                'name' => 'Dental Scalers (Assorted)',
                'description' => 'Assorted dental scalers for plaque and calculus removal.',
                'quantity' => 25,
                'minimum_quantity' => 8,
                'unit_price' => 350.00,
                'category' => 'equipment',
                'expiry_date' => null,
                'notes' => 'Set includes sickle and curette scalers. Sharpen regularly.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[1]->id, // Dental Equipment
                'name' => 'Dental Forceps (Extraction Set)',
                'description' => 'Complete set of extraction forceps for various teeth.',
                'quantity' => 15,
                'minimum_quantity' => 5,
                'unit_price' => 1500.00,
                'category' => 'equipment',
                'expiry_date' => null,
                'notes' => 'Set of 8 forceps. Autoclavable stainless steel.',
                'is_active' => true,
            ],

            // OTHERS (2 items)
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[0]->id, // MedSupply
                'name' => 'Sterilization Pouches (Self-Seal)',
                'description' => 'Self-sealing sterilization pouches with indicators.',
                'quantity' => 500,
                'minimum_quantity' => 100,
                'unit_price' => 8.00,
                'category' => 'others',
                'expiry_date' => null,
                'notes' => 'Various sizes available. Check indicator before use.',
                'is_active' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'supplier_id' => $createdSuppliers[0]->id, // MedSupply
                'name' => 'Disinfectant Solution (1 Liter)',
                'description' => 'Hospital-grade disinfectant for surface cleaning and sterilization.',
                'quantity' => 30,
                'minimum_quantity' => 10,
                'unit_price' => 250.00,
                'category' => 'others',
                'expiry_date' => Carbon::now()->addMonths(24),
                'notes' => 'Dilute according to instructions. Use for all surfaces.',
                'is_active' => true,
            ],
        ];

        foreach ($inventoryItems as $item) {
            Inventory::create($item);
        }

        $this->command->info('✅ Successfully created 3 suppliers and 20 inventory items for Enhaynes Dental Clinic!');
        $this->command->info('   📦 Medications: 4 items');
        $this->command->info('   📦 Supplies: 10 items');
        $this->command->info('   📦 Equipment: 4 items');
        $this->command->info('   📦 Others: 2 items');
    }
}
