<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\Treatment;
use App\Models\Patient;
use App\Models\User;
use App\Models\Clinic;
use Carbon\Carbon;
use Illuminate\Support\Str;

class PaymentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates 20 realistic payment records linked to treatments
     */
    public function run(): void
    {
        // Get Enhaynes Dental Clinic
        $clinic = Clinic::where('slug', 'enhaynes-dental-clinic')->first();
        
        if (!$clinic) {
            $this->command->error('❌ Enhaynes Dental Clinic not found! Please run TestAccountsSeeder first.');
            return;
        }

        // Get Dr. Enhaynes (receiver)
        $dentist = User::where('email', 'enhaynesdental@gmail.com')->first();
        
        if (!$dentist) {
            $this->command->error('❌ Dr. Enhaynes not found! Please run TestAccountsSeeder first.');
            return;
        }

        // Get all treatments
        $treatments = Treatment::where('clinic_id', $clinic->id)
            ->with('patient')
            ->get();
        
        if ($treatments->count() < 20) {
            $this->command->error('❌ Not enough treatments! Please run TreatmentsSeeder first.');
            return;
        }

        $paymentMethods = ['Cash', 'GCash', 'PayMaya', 'Bank Transfer', 'Credit Card'];
        $payments = [];

        // Create payments for each treatment
        foreach ($treatments as $index => $treatment) {
            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
            
            // Determine payment status and amount based on treatment status and cost
            if ($treatment->status === 'completed') {
                // Completed treatments: 80% full payment, 20% partial
                $isPartial = $index % 5 === 0; // Every 5th completed treatment is partial
                
                if ($isPartial && $treatment->cost > 5000) {
                    // Partial payment for expensive treatments
                    $amount = round($treatment->cost * 0.5, 2); // 50% paid
                    $status = 'pending'; // Still pending full payment
                    $notes = "Partial payment (50%). Remaining balance: ₱" . number_format($treatment->cost - $amount, 2);
                } else {
                    // Full payment
                    $amount = $treatment->cost;
                    $status = 'completed';
                    $notes = "Full payment received. Thank you!";
                }
                
                $paymentDate = $treatment->updated_at ?? Carbon::now()->subDays(rand(1, 30));
            } elseif ($treatment->status === 'in-progress') {
                // In-progress treatments: 50% down payment
                $amount = round($treatment->cost * 0.5, 2);
                $status = 'pending';
                $notes = "Down payment (50%). Remaining balance: ₱" . number_format($treatment->cost - $amount, 2);
                $paymentDate = $treatment->created_at ?? Carbon::now()->subDays(rand(1, 10));
            } else {
                // Pending treatments: no payment yet or small deposit
                if ($index % 3 === 0) {
                    // Some pending treatments have deposits
                    $amount = 500.00; // Fixed deposit
                    $status = 'pending';
                    $notes = "Deposit payment. Remaining balance: ₱" . number_format($treatment->cost - $amount, 2);
                    $paymentDate = $treatment->created_at ?? Carbon::now()->subDays(rand(1, 5));
                } else {
                    // Skip payment for this pending treatment
                    continue;
                }
            }

            // Generate transaction ID and reference number
            $transactionId = 'TXN-' . strtoupper(Str::random(10));
            $referenceNumber = 'REF-' . date('Ymd') . '-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT);
            
            // Generate GCash reference for GCash payments
            $gcashReference = null;
            if ($paymentMethod === 'GCash') {
                $gcashReference = 'GCASH-' . strtoupper(Str::random(12));
            }

            $payments[] = [
                'clinic_id' => $clinic->id,
                'patient_id' => $treatment->patient_id,
                'treatment_id' => $treatment->id,
                'amount' => $amount,
                'payment_method' => $paymentMethod,
                'status' => $status,
                'transaction_id' => $transactionId,
                'notes' => $notes,
                'reference_number' => $referenceNumber,
                'payment_date' => $paymentDate,
                'received_by' => $dentist->id,
                'currency' => 'PHP',
                'gcash_reference' => $gcashReference,
                'category' => 'treatment',
                'created_at' => $paymentDate,
                'updated_at' => $paymentDate,
            ];
        }

        foreach ($payments as $payment) {
            Payment::create($payment);
        }

        $completedCount = collect($payments)->where('status', 'completed')->count();
        $pendingCount = collect($payments)->where('status', 'pending')->count();
        $totalRevenue = collect($payments)->where('status', 'completed')->sum('amount');

        $this->command->info('✅ Successfully created ' . count($payments) . ' payment records for Enhaynes Dental Clinic!');
        $this->command->info("   ✅ Completed: {$completedCount} payments");
        $this->command->info("   ⏳ Pending: {$pendingCount} payments");
        $this->command->info("   💰 Total Revenue: ₱" . number_format($totalRevenue, 2));
        $this->command->info('');
        $this->command->info('Payment Methods Distribution:');
        foreach ($paymentMethods as $method) {
            $count = collect($payments)->where('payment_method', $method)->count();
            if ($count > 0) {
                $this->command->info("   - {$method}: {$count} payments");
            }
        }
    }
}
