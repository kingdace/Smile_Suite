<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Service;
use App\Models\AppointmentType;
use App\Models\AppointmentStatus;
use App\Models\User;
use App\Models\Clinic;
use Carbon\Carbon;
use Illuminate\Support\Str;

class AppointmentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates 20 realistic appointments with proper status distribution
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

        // Get all patients
        $patients = Patient::where('clinic_id', $clinic->id)->get();
        
        if ($patients->count() < 20) {
            $this->command->error('❌ Not enough patients! Please run PatientsSeeder first.');
            return;
        }

        // Get appointment types and statuses
        $appointmentTypes = AppointmentType::all();
        $appointmentStatuses = AppointmentStatus::all();
        
        if ($appointmentTypes->count() < 5 || $appointmentStatuses->count() < 5) {
            $this->command->error('❌ Appointment types or statuses not found! Please run AppointmentTypeSeeder and AppointmentStatusSeeder first.');
            return;
        }

        // Get services for reasons
        $services = Service::where('clinic_id', $clinic->id)->get();

        // Map status names to IDs
        $statusMap = [
            'Completed' => $appointmentStatuses->where('name', 'Completed')->first()->id,
            'Confirmed' => $appointmentStatuses->where('name', 'Confirmed')->first()->id,
            'Pending' => $appointmentStatuses->where('name', 'Pending')->first()->id,
            'Cancelled' => $appointmentStatuses->where('name', 'Cancelled')->first()->id,
            'No Show' => $appointmentStatuses->where('name', 'No Show')->first()->id,
        ];

        // Map type names to IDs
        $typeMap = [
            'Walk-in' => $appointmentTypes->where('name', 'Walk-in')->first()->id,
            'Phone Call' => $appointmentTypes->where('name', 'Phone Call')->first()->id,
            'Online Booking' => $appointmentTypes->where('name', 'Online Booking')->first()->id,
            'Follow-up' => $appointmentTypes->where('name', 'Follow-up')->first()->id,
            'Emergency' => $appointmentTypes->where('name', 'Emergency')->first()->id,
        ];

        $appointments = [
            // COMPLETED APPOINTMENTS (5) - Past dates
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[0]->id, // Maria Santos
                'appointment_type_id' => $typeMap['Phone Call'],
                'appointment_status_id' => $statusMap['Completed'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->subDays(15)->setTime(9, 0),
                'ended_at' => Carbon::now()->subDays(15)->setTime(9, 45),
                'reason' => 'Dental Cleaning (Prophylaxis)',
                'notes' => 'Regular cleaning completed successfully',
                'is_online_booking' => false,
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[4]->id, // Ana Mendoza
                'appointment_type_id' => $typeMap['Walk-in'],
                'appointment_status_id' => $statusMap['Completed'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->subDays(20)->setTime(14, 0),
                'ended_at' => Carbon::now()->subDays(20)->setTime(14, 30),
                'reason' => 'Dental Consultation',
                'notes' => 'First visit consultation completed',
                'is_online_booking' => false,
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[2]->id, // Sofia Reyes
                'appointment_type_id' => $typeMap['Phone Call'],
                'appointment_status_id' => $statusMap['Completed'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->subDays(12)->setTime(10, 0),
                'ended_at' => Carbon::now()->subDays(12)->setTime(10, 30),
                'reason' => 'Pediatric Dental Checkup',
                'notes' => 'Child was cooperative, no cavities found',
                'is_online_booking' => false,
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[7]->id, // Teresa Cruz
                'appointment_type_id' => $typeMap['Follow-up'],
                'appointment_status_id' => $statusMap['Completed'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->subDays(8)->setTime(11, 0),
                'ended_at' => Carbon::now()->subDays(8)->setTime(12, 0),
                'reason' => 'Dental Filling (Composite)',
                'notes' => 'Filling completed on tooth #14',
                'is_online_booking' => false,
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[15]->id, // Beatriz Navarro
                'appointment_type_id' => $typeMap['Phone Call'],
                'appointment_status_id' => $statusMap['Completed'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->subDays(5)->setTime(15, 0),
                'ended_at' => Carbon::now()->subDays(5)->setTime(16, 30),
                'reason' => 'Teeth Whitening (Professional)',
                'notes' => 'Whitening treatment completed, patient satisfied',
                'is_online_booking' => false,
            ],

            // CONFIRMED APPOINTMENTS (8) - Future dates
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[1]->id, // Juan Dela Cruz
                'appointment_type_id' => $typeMap['Phone Call'],
                'appointment_status_id' => $statusMap['Confirmed'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->addDays(3)->setTime(9, 0),
                'ended_at' => null,
                'reason' => 'Root Canal Treatment',
                'notes' => 'VIP patient, requires detailed explanation',
                'is_online_booking' => false,
                'confirmation_code' => Str::upper(Str::random(8)),
                'confirmed_at' => Carbon::now()->subDay(),
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[2]->id, // Sofia Reyes
                'appointment_type_id' => $typeMap['Follow-up'],
                'appointment_status_id' => $statusMap['Confirmed'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->addDays(5)->setTime(10, 0),
                'ended_at' => null,
                'reason' => 'Fluoride Treatment',
                'notes' => 'Follow-up fluoride application',
                'is_online_booking' => false,
                'confirmation_code' => Str::upper(Str::random(8)),
                'confirmed_at' => Carbon::now()->subDays(2),
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[8]->id, // Rafael Aquino
                'appointment_type_id' => $typeMap['Online Booking'],
                'appointment_status_id' => $statusMap['Confirmed'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->addDays(1)->setTime(14, 0),
                'ended_at' => null,
                'reason' => 'Teeth Whitening (Professional)',
                'notes' => 'Online booking, interested in cosmetic treatment',
                'is_online_booking' => true,
                'confirmation_code' => Str::upper(Str::random(8)),
                'confirmed_at' => Carbon::now()->subDays(3),
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[10]->id, // Isabella Fernandez
                'appointment_type_id' => $typeMap['Phone Call'],
                'appointment_status_id' => $statusMap['Confirmed'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->addDays(7)->setTime(13, 0),
                'ended_at' => null,
                'reason' => 'Braces Installation (Metal)',
                'notes' => 'Orthodontic consultation and installation',
                'is_online_booking' => false,
                'confirmation_code' => Str::upper(Str::random(8)),
                'confirmed_at' => Carbon::now()->subDays(4),
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[14]->id, // Antonio Lopez
                'appointment_type_id' => $typeMap['Phone Call'],
                'appointment_status_id' => $statusMap['Confirmed'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->addDays(2)->setTime(16, 0),
                'ended_at' => null,
                'reason' => 'Dental Cleaning (Prophylaxis)',
                'notes' => 'Weekend appointment as requested',
                'is_online_booking' => false,
                'confirmation_code' => Str::upper(Str::random(8)),
                'confirmed_at' => Carbon::now()->subDay(),
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[16]->id, // Fernando Castillo
                'appointment_type_id' => $typeMap['Follow-up'],
                'appointment_status_id' => $statusMap['Confirmed'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->addDays(6)->setTime(11, 0),
                'ended_at' => null,
                'reason' => 'Dental Crown (Porcelain)',
                'notes' => 'Crown fitting appointment',
                'is_online_booking' => false,
                'confirmation_code' => Str::upper(Str::random(8)),
                'confirmed_at' => Carbon::now()->subDays(2),
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[6]->id, // Miguel Torres
                'appointment_type_id' => $typeMap['Phone Call'],
                'appointment_status_id' => $statusMap['Confirmed'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->addDays(4)->setTime(10, 0),
                'ended_at' => null,
                'reason' => 'Dental Sealants',
                'notes' => 'Preventive sealants for child',
                'is_online_booking' => false,
                'confirmation_code' => Str::upper(Str::random(8)),
                'confirmed_at' => Carbon::now()->subDays(3),
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[11]->id, // Eduardo Villanueva
                'appointment_type_id' => $typeMap['Phone Call'],
                'appointment_status_id' => $statusMap['Confirmed'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->addDays(8)->setTime(9, 0),
                'ended_at' => null,
                'reason' => 'Dental Implant (Single)',
                'notes' => 'VIP patient, medical clearance obtained',
                'is_online_booking' => false,
                'confirmation_code' => Str::upper(Str::random(8)),
                'confirmed_at' => Carbon::now()->subDays(5),
            ],

            // PENDING APPOINTMENTS (3) - Future dates
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[3]->id, // Roberto Garcia
                'appointment_type_id' => $typeMap['Phone Call'],
                'appointment_status_id' => $statusMap['Pending'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->addDays(10)->setTime(14, 0),
                'ended_at' => null,
                'reason' => 'Dentures (Complete Set)',
                'notes' => 'Senior patient, needs denture fitting',
                'is_online_booking' => false,
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[17]->id, // Cristina Diaz
                'appointment_type_id' => $typeMap['Online Booking'],
                'appointment_status_id' => $statusMap['Pending'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->addDays(12)->setTime(15, 0),
                'ended_at' => null,
                'reason' => 'Dental Veneers (Porcelain)',
                'notes' => 'Online booking, cosmetic consultation',
                'is_online_booking' => true,
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[9]->id, // Luz Bautista
                'appointment_type_id' => $typeMap['Phone Call'],
                'appointment_status_id' => $statusMap['Pending'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->addDays(15)->setTime(10, 0),
                'ended_at' => null,
                'reason' => 'Dental X-Ray (Panoramic)',
                'notes' => 'Diagnostic X-ray needed',
                'is_online_booking' => false,
            ],

            // CANCELLED APPOINTMENTS (2) - Past dates
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[5]->id, // Carlos Ramos
                'appointment_type_id' => $typeMap['Phone Call'],
                'appointment_status_id' => $statusMap['Cancelled'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->subDays(7)->setTime(13, 0),
                'ended_at' => null,
                'reason' => 'Tooth Extraction (Simple)',
                'notes' => 'Patient cancelled due to work conflict',
                'is_online_booking' => false,
                'cancelled_at' => Carbon::now()->subDays(8),
                'cancellation_reason' => 'Work emergency, will reschedule',
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[18]->id, // Vicente Pascual
                'appointment_type_id' => $typeMap['Online Booking'],
                'appointment_status_id' => $statusMap['Cancelled'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->subDays(3)->setTime(16, 0),
                'ended_at' => null,
                'reason' => 'Dental Consultation',
                'notes' => 'Online booking cancelled',
                'is_online_booking' => true,
                'cancelled_at' => Carbon::now()->subDays(4),
                'cancellation_reason' => 'Schedule conflict',
            ],

            // NO SHOW APPOINTMENTS (2) - Past dates
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[12]->id, // Gabriela Morales
                'appointment_type_id' => $typeMap['Phone Call'],
                'appointment_status_id' => $statusMap['No Show'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->subDays(4)->setTime(11, 0),
                'ended_at' => null,
                'reason' => 'Retainer (After Braces)',
                'notes' => 'Patient did not show up, no call',
                'is_online_booking' => false,
            ],
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $patients[13]->id, // Esperanza Santiago
                'appointment_type_id' => $typeMap['Walk-in'],
                'appointment_status_id' => $statusMap['No Show'],
                'created_by' => $dentist->id,
                'assigned_to' => $dentist->id,
                'scheduled_at' => Carbon::now()->subDays(10)->setTime(9, 0),
                'ended_at' => null,
                'reason' => 'Dentures (Complete Set)',
                'notes' => 'Senior patient did not show up',
                'is_online_booking' => false,
            ],
        ];

        foreach ($appointments as $appointment) {
            Appointment::create($appointment);
        }

        $this->command->info('✅ Successfully created 20 appointments for Enhaynes Dental Clinic!');
        $this->command->info('   ✅ Completed: 5 appointments');
        $this->command->info('   📅 Confirmed: 8 appointments');
        $this->command->info('   ⏳ Pending: 3 appointments');
        $this->command->info('   ❌ Cancelled: 2 appointments');
        $this->command->info('   👻 No Show: 2 appointments');
    }
}
