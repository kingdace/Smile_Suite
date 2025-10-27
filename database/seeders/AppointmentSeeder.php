<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\User;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinicId = 27;

        $this->command->info("Starting AppointmentSeeder for Clinic ID {$clinicId}...");

        // Get clinic data
        $patients = Patient::where('clinic_id', $clinicId)->get();
        $dentists = User::where('clinic_id', $clinicId)->where('role', 'dentist')->get();
        $services = Service::where('clinic_id', $clinicId)->get();
        $clinicAdmin = User::where('clinic_id', $clinicId)->where('role', 'clinic_admin')->first();

        $this->command->info("Found {$patients->count()} patients, {$dentists->count()} dentists, {$services->count()} services");

        if ($patients->isEmpty()) {
            $this->command->error("No patients found for clinic ID {$clinicId}");
            $this->command->info("Please ensure Clinic 27 has patients before running this seeder");
            return;
        }

        if ($dentists->isEmpty()) {
            $this->command->error("No dentists found for clinic ID {$clinicId}");
            $this->command->info("Please ensure Clinic 27 has dentists before running this seeder");
            return;
        }

        if (!$clinicAdmin) {
            $this->command->error("No clinic admin found for clinic ID {$clinicId}");
            $this->command->info("Please ensure Clinic 27 has a clinic admin before running this seeder");
            return;
        }

        // Get valid appointment types (Walk-in = 1, Online Booking = 3)
        $walkInType = $this->getAppointmentTypeId('Walk-in', $clinicId);
        $onlineType = $this->getAppointmentTypeId('Online Booking', $clinicId);

        if (!$walkInType || !$onlineType) {
            $this->command->error("Failed to get appointment types");
            return;
        }

        // Status ID 2 = "Confirmed"
        $confirmedStatus = $this->getAppointmentStatusId('Confirmed', $clinicId);

        if (!$confirmedStatus) {
            $this->command->error("Failed to get Confirmed status");
            return;
        }

        $appointments = [];

        // Define creation months with different counts
        // May: 6 (base) + 3 = 9, August: 6 (base) + 6 = 12
        $monthConfigs = [
            1 => 6,  // January: 6 appointments
            5 => 9,  // May: 6 + 3 = 9 appointments
            7 => 6,  // July: 6 appointments
            8 => 12, // August: 6 + 6 = 12 appointments
            9 => 6,  // September: 6 appointments
        ];

        $this->command->info("Starting appointment creation for months: " . implode(', ', array_keys($monthConfigs)));

        // Generate appointments for each specified month
        foreach ($monthConfigs as $month => $count) {
            $this->command->info("Creating {$count} appointments for month: {$month}");

            for ($i = 0; $i < $count; $i++) {
                // Decide if walk-in or online (alternating for variety)
                $isWalkIn = ($i % 2 == 0);

                // Random patient
                $patient = $patients->random();

                // Random dentist
                $dentist = $dentists->random();

                // Random service
                $service = $services->random();

                // Create date in the specified month of 2025
                $daysInMonth = Carbon::create(2025, $month)->daysInMonth;
                $creationDate = Carbon::create(2025, $month, rand(1, $daysInMonth), rand(8, 18), 0, 0);

                // Appointment scheduled in any month of 2026 only
                $appointmentDate = Carbon::create(2026, rand(1, 12), rand(1, 28), rand(8, 17), 0, 0);

                // Calculate end time (default 30 min duration)
                $endDate = $appointmentDate->copy()->addMinutes(30);

                // Generate confirmation code for online bookings
                $confirmationCode = null;
                $confirmedAt = null;
                $isOnlineBooking = !$isWalkIn;

                if ($isOnlineBooking) {
                    // Online booking
                    $confirmationCode = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
                    $confirmedAt = $creationDate->copy()->addHours(rand(1, 6));
                } else {
                    // Walk-ins are immediately confirmed
                    $confirmedAt = $creationDate;
                }

                $appointments[] = [
                    'clinic_id' => $clinicId,
                    'patient_id' => $patient->id,
                    'appointment_type_id' => $isWalkIn ? $walkInType : $onlineType,
                    'appointment_status_id' => $confirmedStatus,
                    'service_id' => $service->id,
                    'created_by' => $clinicAdmin->id,
                    'assigned_to' => $dentist->id,
                    'scheduled_at' => $appointmentDate,
                    'ended_at' => $endDate,
                    'duration' => 30,
                    'payment_status' => 'pending',
                    'is_online_booking' => $isOnlineBooking,
                    'confirmation_code' => $confirmationCode,
                    'confirmed_at' => $confirmedAt,
                    'reason' => $isWalkIn ? 'Walk-in consultation' : 'Online booking',
                    'notes' => $isWalkIn ? 'Patient walked in for consultation' : 'Booked through online portal',
                    'created_at' => $creationDate,
                    'updated_at' => $confirmedAt ?? $creationDate,
                ];
            }
        }

        // Check total appointment count to avoid re-seeding
        $totalExistingAppointments = Appointment::where('clinic_id', $clinicId)->count();

        if ($totalExistingAppointments >= 30) {
            $this->command->info("Clinic 27 already has {$totalExistingAppointments} appointments (target: 30). Skipping.");
            return;
        }

        $this->command->info("Clinic 27 has {$totalExistingAppointments} appointments. Need to create more to reach target of 30.");

        // Insert appointments
        Appointment::insert($appointments);

        $totalCreated = count($appointments);
        $walkInCount = collect($appointments)->where('is_online_booking', false)->count();
        $onlineCount = collect($appointments)->where('is_online_booking', true)->count();

        $this->command->info("Successfully created {$totalCreated} appointments for Clinic 27 (Enhaynes Dental Clinic)");
        $this->command->info("Created in months: " . implode(', ', array_keys($monthConfigs)));
        $this->command->info("Walk-in appointments: {$walkInCount}");
        $this->command->info("Online booking appointments: {$onlineCount}");
    }

    private function getAppointmentTypeId(string $name, int $clinicId): ?int
    {
        // Use the global appointment types
        $type = DB::table('appointment_types')
            ->where('name', $name)
            ->first();

        return $type ? $type->id : null;
    }

    private function getAppointmentStatusId(string $name, int $clinicId): ?int
    {
        // Use the global appointment statuses
        $status = DB::table('appointment_statuses')
            ->where('name', $name)
            ->first();

        return $status ? $status->id : null;
    }
}

