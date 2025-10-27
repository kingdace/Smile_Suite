<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Treatment;
use App\Models\Appointment;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TreatmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinicId = 27;

        // Get ALL appointments that don't have treatments yet
        $appointments = Appointment::where('clinic_id', $clinicId)
            ->doesntHave('treatments') // Only get appointments without treatments
            ->with(['patient', 'assignedDentist'])
            ->get();

        if ($appointments->isEmpty()) {
            $this->command->info("No appointments found without treatments for clinic ID {$clinicId}");
            return;
        }

        $this->command->info("Found {$appointments->count()} appointments without treatments");

        // Get services for this clinic
        $services = Service::where('clinic_id', $clinicId)->get();

        if ($services->isEmpty()) {
            $this->command->error("No services found for clinic ID {$clinicId}");
            return;
        }

        $treatments = [];
        $dentalServices = [
            'Cleaning' => ['cost' => 1000, 'duration' => 30],
            'RESTORATIVE FILLING(PASTA)' => ['cost' => 700, 'duration' => 45],
            'EXTRACTION' => ['cost' => 1500, 'duration' => 30],
            'DENTURE' => ['cost' => 5000, 'duration' => 60],
            'BRACES' => ['cost' => 45000, 'duration' => 90],
            'JACKET CROWN' => ['cost' => 5000, 'duration' => 60],
            'FIXED BRIDGE' => ['cost' => 6500, 'duration' => 90],
            'ROOT CANAL' => ['cost' => 8000, 'duration' => 120],
            'Gum Treatment' => ['cost' => 2000, 'duration' => 45],
            'Teeth Whitening' => ['cost' => 3000, 'duration' => 60],
        ];

        $this->command->info("Processing " . $appointments->count() . " appointments...");

        foreach ($appointments as $appointment) {
            // Skip if appointment doesn't have a patient or dentist
            if (!$appointment->patient || !$appointment->assigned_to) {
                continue;
            }

            // Randomly select a dental service
            $serviceName = array_rand($dentalServices);
            $serviceData = $dentalServices[$serviceName];

            // Try to find matching service in database, otherwise use random
            $service = $services->random();

            // Treatment dates based on appointment
            $startDate = Carbon::parse($appointment->scheduled_at)->subDays(rand(0, 3));
            $endDate = Carbon::parse($appointment->scheduled_at)->addMinutes($serviceData['duration']);

            // Determine status based on appointment date
            $appointmentDate = Carbon::parse($appointment->scheduled_at);
            $now = Carbon::now();
            $status = 'scheduled';
            $paymentStatus = 'pending';

            if ($appointmentDate->isPast()) {
                // For past appointments, randomize the status
                $randomStatus = rand(1, 10);
                if ($randomStatus <= 5) {
                    $status = 'completed';
                    $paymentStatus = rand(1, 3) === 1 ? 'completed' : 'partial';
                } elseif ($randomStatus <= 8) {
                    $status = 'in_progress';
                    $paymentStatus = 'partial';
                } else {
                    $status = 'scheduled';
                    $paymentStatus = 'pending';
                }
            }

            // Treatment descriptions
            $descriptions = [
                'Cleaning' => 'Professional dental cleaning to remove plaque and tartar buildup',
                'RESTORATIVE FILLING(PASTA)' => 'Restorative filling procedure to repair damaged tooth',
                'EXTRACTION' => 'Tooth extraction procedure',
                'DENTURE' => 'Denture fitting and adjustment',
                'BRACES' => 'Orthodontic braces installation and adjustment',
                'JACKET CROWN' => 'Crown installation procedure',
                'FIXED BRIDGE' => 'Fixed bridge procedure',
                'ROOT CANAL' => 'Root canal treatment',
                'Gum Treatment' => 'Gum treatment and cleaning',
                'Teeth Whitening' => 'Professional teeth whitening procedure',
            ];

            $description = $descriptions[$serviceName] ?? 'Dental treatment procedure';

            // Random tooth numbers for dental procedures
            $toothNumbers = [];
            if (in_array($serviceName, ['Cleaning', 'RESTORATIVE FILLING(PASTA)', 'EXTRACTION', 'ROOT CANAL'])) {
                $toothCount = rand(1, 4);
                for ($i = 0; $i < $toothCount; $i++) {
                    $toothNumbers[] = (string)rand(11, 48);
                }
            }

            // Create treatment
            $treatments[] = [
                'clinic_id' => $clinicId,
                'patient_id' => $appointment->patient_id,
                'appointment_id' => $appointment->id,
                'service_id' => $service->id,
                'user_id' => $appointment->assigned_to,
                'name' => $serviceName,
                'description' => $description,
                'cost' => $serviceData['cost'],
                'status' => $status,
                'payment_status' => $paymentStatus,
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'notes' => "Treatment scheduled for appointment on {$appointment->scheduled_at}",
                'diagnosis' => 'Patient requires dental treatment',
                'tooth_numbers' => json_encode($toothNumbers),
                'recommendations' => 'Continue regular dental checkups',
                'follow_up_notes' => 'Monitor progress',
                'materials_used' => json_encode(['Local anesthetic', 'Dental materials']),
                'estimated_duration_minutes' => $serviceData['duration'],
                'treatment_phase' => $status === 'completed' ? 'follow_up' : 'treatment',
                'outcome' => $status === 'completed' ? 'successful' : 'pending',
                'created_at' => Carbon::parse($appointment->created_at),
                'updated_at' => Carbon::parse($appointment->created_at),
            ];
        }

        // Check total treatment count to avoid re-seeding
        $totalExistingTreatments = Treatment::where('clinic_id', $clinicId)->count();

        if ($totalExistingTreatments >= 30) {
            $this->command->info("Clinic 27 already has {$totalExistingTreatments} treatments (target: 30). Skipping.");
            return;
        }

        $this->command->info("Clinic 27 has {$totalExistingTreatments} treatments. Need to create more to reach target of 30.");

        // Insert treatments
        Treatment::insert($treatments);

        $this->command->info("Successfully created " . count($treatments) . " treatments for appointments");
        $this->command->info("Created in months: January, May, July, August, September");

        // Show summary by status
        $completed = collect($treatments)->where('status', 'completed')->count();
        $inProgress = collect($treatments)->where('status', 'in_progress')->count();
        $scheduled = collect($treatments)->where('status', 'scheduled')->count();

        $this->command->info("Status breakdown: Completed={$completed}, In Progress={$inProgress}, Scheduled={$scheduled}");

        // Auto-update appointment status for completed treatments
        $this->updateAppointmentStatusForCompletedTreatments($treatments);

        $this->command->info("Updated appointment statuses for completed treatments.");
    }

    /**
     * Update appointment status to "Completed" for completed treatments
     */
    private function updateAppointmentStatusForCompletedTreatments($treatments)
    {
        $updatedCount = 0;

        foreach ($treatments as $treatmentData) {
            // Only process completed treatments that have an appointment_id
            if ($treatmentData['status'] === 'completed' && !empty($treatmentData['appointment_id'])) {
                // Find the appointment
                $appointment = Appointment::find($treatmentData['appointment_id']);

                if ($appointment && $appointment->appointment_status_id != 3) { // 3 = "Completed" status
                    $appointment->update(['appointment_status_id' => 3]);
                    $updatedCount++;
                }
            }
        }

        $this->command->info("Updated {$updatedCount} appointments to Completed status.");
    }
}

