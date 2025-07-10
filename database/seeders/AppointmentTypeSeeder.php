<?php

namespace Database\Seeders;

use App\Models\AppointmentType;
use Illuminate\Database\Seeder;

class AppointmentTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name' => 'Walk-in',
                'description' => 'Patient walked in for an appointment',
            ],
            [
                'name' => 'Phone Call',
                'description' => 'Appointment scheduled via phone call',
            ],
            [
                'name' => 'Online Booking',
                'description' => 'Appointment booked through patient portal',
            ],
            [
                'name' => 'Follow-up',
                'description' => 'Follow-up appointment from previous visit',
            ],
            [
                'name' => 'Emergency',
                'description' => 'Emergency dental appointment',
            ],
        ];

        foreach ($types as $type) {
            AppointmentType::create($type);
        }
    }
}
