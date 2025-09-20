<?php

namespace App\Console\Commands;

use App\Models\Treatment;
use App\Models\Appointment;
use Illuminate\Console\Command;

class UpdateCompletedAppointments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'appointments:update-completed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update appointment statuses to Completed for treatments that are completed and fully paid';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to update completed appointments...');

        // Find treatments that are completed and fully paid
        $treatments = Treatment::where('status', 'completed')
            ->where('payment_status', 'completed')
            ->whereNotNull('appointment_id')
            ->with(['appointment', 'payments', 'inventoryItems'])
            ->get();

        $this->info("Found {$treatments->count()} completed and paid treatments with appointments.");

        $updatedCount = 0;

        foreach ($treatments as $treatment) {
            $appointment = $treatment->appointment;
            
            if (!$appointment) {
                $this->warn("Treatment {$treatment->id} has no appointment, skipping...");
                continue;
            }

            // Check if appointment is already completed
            if ($appointment->appointment_status_id == 3) {
                $this->info("Appointment {$appointment->id} is already completed, skipping...");
                continue;
            }

            // Double-check payment status by calculating total paid vs total cost
            $totalPaid = $treatment->payments()
                ->where('status', 'completed')
                ->sum('amount');
            
            $totalCost = $treatment->cost + ($treatment->inventoryItems->sum('total_cost') ?? 0);

            if ($totalPaid >= $totalCost) {
                // Update appointment status to Completed (ID: 3)
                $appointment->update(['appointment_status_id' => 3]);
                $updatedCount++;
                
                $this->info("Updated appointment {$appointment->id} to Completed for treatment {$treatment->id}");
                $this->line("  - Total paid: ₱{$totalPaid}");
                $this->line("  - Total cost: ₱{$totalCost}");
            } else {
                $this->warn("Treatment {$treatment->id} is not fully paid (Paid: ₱{$totalPaid}, Cost: ₱{$totalCost}), skipping...");
            }
        }

        $this->info("Successfully updated {$updatedCount} appointments to Completed status.");
        
        return Command::SUCCESS;
    }
}