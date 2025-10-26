<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\Treatment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TreatmentPaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinicId = 27;

        // Get unpaid treatments for clinic 27
        $unpaidTreatments = Treatment::where('clinic_id', $clinicId)
            ->where('payment_status', '!=', 'completed')
            ->with('patient')
            ->get();

        if ($unpaidTreatments->isEmpty()) {
            $this->command->info("No unpaid treatments found for clinic ID {$clinicId}");
            return;
        }

        // Get clinic admin for received_by
        $clinicAdmin = User::where('clinic_id', $clinicId)
            ->where('role', 'clinic_admin')
            ->first();

        if (!$clinicAdmin) {
            $this->command->error("No clinic admin found for clinic ID {$clinicId}");
            return;
        }

        $payments = [];
        $paymentMethods = ['cash', 'credit_card', 'debit_card', 'gcash', 'bank_transfer'];

        foreach ($unpaidTreatments as $treatment) {
            // Generate unique reference number
            $timestamp = now()->format('Ymd');
            $random = str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
            $referenceNumber = 'PAY-' . $timestamp . '-' . $random;

            // Random payment method
            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];

            // Payment date is a few days after treatment creation
            $treatmentCreatedAt = Carbon::parse($treatment->created_at);
            $paymentDate = $treatmentCreatedAt->copy()->addDays(rand(1, 7));

            // Ensure payment date is not in the future
            if ($paymentDate->isFuture()) {
                $paymentDate = now()->subDays(rand(1, 30));
            }

            $payments[] = [
                'clinic_id' => $clinicId,
                'patient_id' => $treatment->patient_id,
                'treatment_id' => $treatment->id,
                'amount' => $treatment->cost,
                'payment_date' => $paymentDate->toDateString(),
                'payment_method' => $paymentMethod,
                'status' => 'completed', // Always completed for these seeders
                'reference_number' => $referenceNumber,
                'notes' => "Payment for treatment: {$treatment->name}",
                'category' => 'treatment',
                'currency' => 'PHP',
                'received_by' => $clinicAdmin->id,
                'created_at' => $paymentDate,
                'updated_at' => $paymentDate,
            ];
        }

        // Insert payments
        $insertedPayments = Payment::insert($payments);

        $this->command->info("Successfully created " . count($payments) . " payments for unpaid treatments");

        // Now manually update the treatment payment_status to 'completed'
        foreach ($unpaidTreatments as $treatment) {
            $treatment->update(['payment_status' => 'completed']);
        }

        $this->command->info("Updated " . count($unpaidTreatments) . " treatments to payment_status='completed'");
    }
}

