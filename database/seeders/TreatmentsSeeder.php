<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Treatment;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Service;
use App\Models\User;
use App\Models\Clinic;
use Carbon\Carbon;

class TreatmentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates 20 realistic treatment records linked to appointments
     */
    public function run(): void
    {
        // Get Enhaynes Dental Clinic
        $clinic = Clinic::where('slug', 'enhaynes-dental-clinic')->first();
        
        if (!$clinic) {
            $this->command->error('❌ Enhaynes Dental Clinic not found! Please run TestAccountsSeeder first.');
            return;
        }

        // Get Dr. Enhaynes (dentist)
        $dentist = User::where('email', 'enhaynesdental@gmail.com')->first();
        
        if (!$dentist) {
            $this->command->error('❌ Dr. Enhaynes not found! Please run TestAccountsSeeder first.');
            return;
        }

        // Get all appointments (we'll create treatments for Completed and Confirmed appointments)
        $appointments = Appointment::where('clinic_id', $clinic->id)
            ->with(['patient', 'status'])
            ->get();
        
        if ($appointments->count() < 20) {
            $this->command->error('❌ Not enough appointments! Please run AppointmentsSeeder first.');
            return;
        }

        // Get services for pricing reference
        $services = Service::where('clinic_id', $clinic->id)->get();

        $treatments = [];
        $treatmentCount = 0;

        // Create treatments for Completed appointments (5 treatments - all completed)
        $completedAppointments = $appointments->filter(function($apt) {
            return $apt->status && $apt->status->name === 'Completed';
        });

        foreach ($completedAppointments as $appointment) {
            $serviceName = $appointment->reason;
            $service = $services->where('name', $serviceName)->first();
            $cost = $service ? $service->price : 1000.00;

            $treatments[] = [
                'clinic_id' => $clinic->id,
                'patient_id' => $appointment->patient_id,
                'appointment_id' => $appointment->id,
                'user_id' => $dentist->id,
                'name' => $serviceName,
                'description' => "Treatment provided during appointment on " . $appointment->scheduled_at->format('M d, Y'),
                'cost' => $cost,
                'status' => 'completed',
                'start_date' => $appointment->scheduled_at->format('Y-m-d'),
                'end_date' => $appointment->ended_at ? $appointment->ended_at->format('Y-m-d') : null,
                'notes' => 'Treatment completed successfully. Patient satisfied with results.',
                'next_appointment' => null,
                'created_at' => $appointment->scheduled_at,
                'updated_at' => $appointment->ended_at,
            ];
            $treatmentCount++;
        }

        // Create treatments for Confirmed appointments (8 treatments - mix of in-progress and pending)
        $confirmedAppointments = $appointments->filter(function($apt) {
            return $apt->status && $apt->status->name === 'Confirmed';
        });

        $confirmedCount = 0;
        foreach ($confirmedAppointments as $appointment) {
            $serviceName = $appointment->reason;
            $service = $services->where('name', $serviceName)->first();
            $cost = $service ? $service->price : 1000.00;

            // First 5 confirmed appointments = in-progress, rest = pending
            $status = $confirmedCount < 5 ? 'in-progress' : 'pending';
            $nextAppt = $status === 'in-progress' ? $appointment->scheduled_at->copy()->addDays(14) : null;

            $treatments[] = [
                'clinic_id' => $clinic->id,
                'patient_id' => $appointment->patient_id,
                'appointment_id' => $appointment->id,
                'user_id' => $dentist->id,
                'name' => $serviceName,
                'description' => "Treatment scheduled for " . $appointment->scheduled_at->format('M d, Y'),
                'cost' => $cost,
                'status' => $status,
                'start_date' => $status === 'in-progress' ? Carbon::now()->subDays(rand(1, 5))->format('Y-m-d') : $appointment->scheduled_at->format('Y-m-d'),
                'end_date' => null,
                'notes' => $status === 'in-progress' ? 'Treatment in progress, follow-up required.' : 'Treatment pending appointment.',
                'next_appointment' => $nextAppt,
                'created_at' => Carbon::now()->subDays(rand(1, 7)),
                'updated_at' => Carbon::now(),
            ];
            $treatmentCount++;
            $confirmedCount++;
        }

        // Create treatments for Pending appointments (3 treatments - all pending)
        $pendingAppointments = $appointments->filter(function($apt) {
            return $apt->status && $apt->status->name === 'Pending';
        });

        foreach ($pendingAppointments as $appointment) {
            $serviceName = $appointment->reason;
            $service = $services->where('name', $serviceName)->first();
            $cost = $service ? $service->price : 1000.00;

            $treatments[] = [
                'clinic_id' => $clinic->id,
                'patient_id' => $appointment->patient_id,
                'appointment_id' => $appointment->id,
                'user_id' => $dentist->id,
                'name' => $serviceName,
                'description' => "Treatment planned for " . $appointment->scheduled_at->format('M d, Y'),
                'cost' => $cost,
                'status' => 'pending',
                'start_date' => $appointment->scheduled_at->format('Y-m-d'),
                'end_date' => null,
                'notes' => 'Awaiting appointment confirmation.',
                'next_appointment' => null,
                'created_at' => Carbon::now()->subDays(rand(1, 5)),
                'updated_at' => Carbon::now(),
            ];
            $treatmentCount++;
        }

        // Create additional treatments for some patients who had multiple visits (4 more to reach 20)
        $additionalTreatments = [
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $appointments[0]->patient_id, // Maria Santos
                'appointment_id' => $appointments[0]->id,
                'user_id' => $dentist->id,
                'name' => 'Fluoride Treatment',
                'description' => 'Additional fluoride treatment during cleaning appointment',
                'cost' => 500.00,
                'status' => 'completed',
                'start_date' => $appointments[0]->scheduled_at->format('Y-m-d'),
                'end_date' => $appointments[0]->ended_at ? $appointments[0]->ended_at->format('Y-m-d') : null,
                'notes' => 'Applied after cleaning for extra protection',
                'next_appointment' => null,
                'created_at' => $appointments[0]->scheduled_at,
                'updated_at' => $appointments[0]->ended_at,
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $appointments[1]->patient_id, // Juan Dela Cruz
                'appointment_id' => $appointments[1]->id,
                'user_id' => $dentist->id,
                'name' => 'Dental X-Ray (Panoramic)',
                'description' => 'Diagnostic X-ray for root canal planning',
                'cost' => 800.00,
                'status' => 'completed',
                'start_date' => Carbon::now()->subDays(25)->format('Y-m-d'),
                'end_date' => Carbon::now()->subDays(25)->format('Y-m-d'),
                'notes' => 'X-ray taken before root canal procedure',
                'next_appointment' => null,
                'created_at' => Carbon::now()->subDays(25),
                'updated_at' => Carbon::now()->subDays(25),
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $appointments[3]->patient_id, // Teresa Cruz
                'appointment_id' => $appointments[3]->id,
                'user_id' => $dentist->id,
                'name' => 'Dental Consultation',
                'description' => 'Initial consultation before filling',
                'cost' => 500.00,
                'status' => 'completed',
                'start_date' => Carbon::now()->subDays(15)->format('Y-m-d'),
                'end_date' => Carbon::now()->subDays(15)->format('Y-m-d'),
                'notes' => 'Consultation completed, filling scheduled',
                'next_appointment' => null,
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $appointments[7]->patient_id, // Isabella Fernandez
                'appointment_id' => $appointments[7]->id,
                'user_id' => $dentist->id,
                'name' => 'Dental Consultation',
                'description' => 'Orthodontic consultation for braces',
                'cost' => 500.00,
                'status' => 'completed',
                'start_date' => Carbon::now()->subDays(10)->format('Y-m-d'),
                'end_date' => Carbon::now()->subDays(10)->format('Y-m-d'),
                'notes' => 'Consultation completed, braces installation scheduled',
                'next_appointment' => $appointments[7]->scheduled_at,
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10),
            ],
        ];

        $treatments = array_merge($treatments, $additionalTreatments);

        foreach ($treatments as $treatment) {
            Treatment::create($treatment);
        }

        $completedCount = collect($treatments)->where('status', 'completed')->count();
        $inProgressCount = collect($treatments)->where('status', 'in-progress')->count();
        $pendingCount = collect($treatments)->where('status', 'pending')->count();

        $this->command->info('✅ Successfully created 20 treatment records for Enhaynes Dental Clinic!');
        $this->command->info("   ✅ Completed: {$completedCount} treatments");
        $this->command->info("   🔄 In-progress: {$inProgressCount} treatments");
        $this->command->info("   ⏳ Pending: {$pendingCount} treatments");
    }
}
