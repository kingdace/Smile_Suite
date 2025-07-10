<?php

namespace Database\Seeders;

use App\Models\AppointmentStatus;
use Illuminate\Database\Seeder;

class AppointmentStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'Pending',
                'color' => '#F59E0B', // Amber
                'description' => 'Appointment is waiting for confirmation',
            ],
            [
                'name' => 'Confirmed',
                'color' => '#10B981', // Emerald
                'description' => 'Appointment has been confirmed',
            ],
            [
                'name' => 'Completed',
                'color' => '#3B82F6', // Blue
                'description' => 'Appointment has been completed',
            ],
            [
                'name' => 'Cancelled',
                'color' => '#EF4444', // Red
                'description' => 'Appointment has been cancelled',
            ],
            [
                'name' => 'No Show',
                'color' => '#6B7280', // Gray
                'description' => 'Patient did not show up for the appointment',
            ],
        ];

        foreach ($statuses as $status) {
            AppointmentStatus::create($status);
        }
    }
}
