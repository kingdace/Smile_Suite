<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\Treatment;
use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinicId = 27;

        // Get treatments created in January, May, July, August, September 2025
        $treatments = Treatment::where('clinic_id', $clinicId)
            ->whereIn(
                DB::raw('MONTH(created_at)'),
                [1, 5, 7, 8, 9]
            )
            ->whereYear('created_at', 2025)
            ->with(['patient', 'appointment'])
            ->get();

        if ($treatments->isEmpty()) {
            $this->command->info("No treatments found for the specified months");
            return;
        }

        $this->command->info("Processing " . $treatments->count() . " treatments...");

        $paymentMethods = ['cash', 'credit_card', 'debit_card', 'gcash', 'bank_transfer', 'insurance', 'other'];
        $paymentCategories = ['treatment', 'consultation', 'medication', 'laboratory', 'imaging', 'surgery', 'emergency', 'other'];

        $payments = [];
        $paymentCount = 0;

        foreach ($treatments as $treatment) {
            // Skip if treatment doesn't have a patient
            if (!$treatment->patient) {
                continue;
            }

            // Check if this treatment already has payments
            $existingPayments = Payment::where('treatment_id', $treatment->id)->count();

            // Skip if treatment already has payments to avoid duplicates
            if ($existingPayments > 0) {
                continue;
            }

            // Get total cost of treatment
            $totalCost = $treatment->cost ?? 0;

            // Skip if treatment has no cost
            if ($totalCost <= 0) {
                continue;
            }

            // Determine payment status and amount based on treatment status
            // For dashboard purposes, we want most treatments to be fully paid
            $paymentStatus = 'completed';
            $paymentAmount = $totalCost; // Always pay full amount for clean data

            // Generate payment date based on treatment creation date
            // Payment should be within the same month as treatment creation
            $treatmentCreatedAt = Carbon::parse($treatment->created_at);
            $paymentDate = $treatmentCreatedAt->copy()->addDays(rand(0, 5));

            // Generate reference number
            $referenceNumber = 'PAY-' . $paymentDate->format('Ymd') . '-' . str_pad($paymentCount + 1, 4, '0', STR_PAD_LEFT);

            // Random payment method and category
            $method = $paymentMethods[array_rand($paymentMethods)];
            $category = $paymentCategories[array_rand($paymentCategories)];

            // Determine if there should be multiple payments for this treatment
            $numPayments = 1;

            // For expensive treatments (>3000), sometimes create multiple payments
            if ($totalCost > 3000 && rand(1, 10) <= 3) {
                $numPayments = rand(2, 3);
            }

            // Distribute payment amount across multiple payments if needed
            $remainingAmount = $paymentAmount;

            for ($i = 0; $i < $numPayments; $i++) {
                if ($i === $numPayments - 1) {
                    // Last payment gets all remaining amount
                    $amount = $remainingAmount;
                } else {
                    // Intermediate payments get a portion
                    $amount = $remainingAmount * (rand(30, 60) / 100);
                    $remainingAmount -= $amount;
                }

                $payments[] = [
                    'clinic_id' => $clinicId,
                    'patient_id' => $treatment->patient_id,
                    'treatment_id' => $treatment->id,
                    'amount' => round($amount, 2),
                    'payment_method' => $method,
                    'status' => $paymentStatus,
                    'transaction_id' => 'TXN-' . $treatment->id . '-' . ($i + 1) . '-' . rand(1000, 9999),
                    'reference_number' => $referenceNumber . ($numPayments > 1 ? '-' . ($i + 1) : ''),
                    'payment_date' => $paymentDate->copy()->addDays($i)->format('Y-m-d'),
                    'received_by' => $treatment->user_id,
                    'currency' => 'PHP',
                    'category' => $category,
                    'notes' => $numPayments > 1 ? "Payment " . ($i + 1) . " of {$numPayments} for {$treatment->name}" : "Payment for {$treatment->name}",
                    'created_at' => $paymentDate->copy()->addDays($i),
                    'updated_at' => $paymentDate->copy()->addDays($i),
                ];

                $paymentCount++;
            }
        }

        // Insert payments
        Payment::insert($payments);

        $this->command->info("Successfully created {$paymentCount} payments for treatments");
        $this->command->info("Created for treatments from months: January, May, July, August, September 2025");

        // Update treatment payment statuses and appointment statuses
        $this->updateTreatmentPaymentStatuses($treatments);
    }

    /**
     * Update treatment payment status based on total paid amount
     */
    private function updateTreatmentPaymentStatuses($treatments)
    {
        $updatedCount = 0;
        $completedCount = 0;
        $appointmentUpdatedCount = 0;

        foreach ($treatments as $treatment) {
            // Calculate total paid amount
            $totalPaid = Payment::where('treatment_id', $treatment->id)
                ->where('status', 'completed')
                ->sum('amount');

            $totalCost = $treatment->cost ?? 0;

            // Update treatment payment_status based on total paid
            if ($totalCost > 0) {
                if ($totalPaid >= $totalCost) {
                    // Fully paid - update payment_status to completed
                    $treatment->update(['payment_status' => 'completed']);

                    // If treatment status is not completed, update it
                    if ($treatment->status !== 'completed') {
                        $treatment->update(['status' => 'completed']);
                    }

                    // Update appointment status to Completed if linked
                    if ($treatment->appointment_id) {
                        $appointment = Appointment::find($treatment->appointment_id);
                        if ($appointment && $appointment->appointment_status_id != 3) { // 3 = "Completed" status
                            $appointment->update(['appointment_status_id' => 3]);
                            $appointmentUpdatedCount++;
                        }
                    }

                    $completedCount++;
                } elseif ($totalPaid > 0) {
                    $treatment->update(['payment_status' => 'partial']);
                } else {
                    $treatment->update(['payment_status' => 'pending']);
                }
                $updatedCount++;
            }
        }

        $this->command->info("Updated {$updatedCount} treatment payment statuses");
        $this->command->info("Completed treatments (fully paid): {$completedCount}");
        $this->command->info("Updated {$appointmentUpdatedCount} appointments to Completed status");
    }
}

