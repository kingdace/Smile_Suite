<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScheduleTemplate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'clinic_id',
        'name',
        'description',
        'schedule_data',
        'is_active',
    ];

    protected $casts = [
        'schedule_data' => 'array',
        'is_active' => 'boolean',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    /**
     * Apply this template to a dentist
     */
    public function applyToDentist(User $dentist)
    {
        if (!$dentist->isDentist()) {
            throw new \InvalidArgumentException('User must be a dentist');
        }

        $scheduleData = $this->schedule_data;

        foreach ($scheduleData as $daySchedule) {
            DentistSchedule::create([
                'clinic_id' => $this->clinic_id,
                'user_id' => $dentist->id,
                'day_of_week' => $daySchedule['day_of_week'],
                'start_time' => $daySchedule['start_time'],
                'end_time' => $daySchedule['end_time'],
                'buffer_time' => $daySchedule['buffer_time'] ?? 15,
                'slot_duration' => $daySchedule['slot_duration'] ?? 30,
                'is_available' => $daySchedule['is_available'] ?? true,
                'schedule_type' => 'weekly',
            ]);
        }
    }

    /**
     * Get default templates for a clinic
     */
    public static function getDefaultTemplates(): array
    {
        return [
            'standard_week' => [
                'name' => 'Standard Week (Mon-Fri)',
                'description' => 'Standard working hours Monday to Friday',
                'schedule_data' => [
                    ['day_of_week' => 1, 'start_time' => '09:00', 'end_time' => '17:00', 'buffer_time' => 15, 'slot_duration' => 30],
                    ['day_of_week' => 2, 'start_time' => '09:00', 'end_time' => '17:00', 'buffer_time' => 15, 'slot_duration' => 30],
                    ['day_of_week' => 3, 'start_time' => '09:00', 'end_time' => '17:00', 'buffer_time' => 15, 'slot_duration' => 30],
                    ['day_of_week' => 4, 'start_time' => '09:00', 'end_time' => '17:00', 'buffer_time' => 15, 'slot_duration' => 30],
                    ['day_of_week' => 5, 'start_time' => '09:00', 'end_time' => '17:00', 'buffer_time' => 15, 'slot_duration' => 30],
                ]
            ],
            'extended_hours' => [
                'name' => 'Extended Hours (Mon-Sat)',
                'description' => 'Extended working hours including Saturday',
                'schedule_data' => [
                    ['day_of_week' => 1, 'start_time' => '08:00', 'end_time' => '18:00', 'buffer_time' => 15, 'slot_duration' => 30],
                    ['day_of_week' => 2, 'start_time' => '08:00', 'end_time' => '18:00', 'buffer_time' => 15, 'slot_duration' => 30],
                    ['day_of_week' => 3, 'start_time' => '08:00', 'end_time' => '18:00', 'buffer_time' => 15, 'slot_duration' => 30],
                    ['day_of_week' => 4, 'start_time' => '08:00', 'end_time' => '18:00', 'buffer_time' => 15, 'slot_duration' => 30],
                    ['day_of_week' => 5, 'start_time' => '08:00', 'end_time' => '18:00', 'buffer_time' => 15, 'slot_duration' => 30],
                    ['day_of_week' => 6, 'start_time' => '09:00', 'end_time' => '14:00', 'buffer_time' => 15, 'slot_duration' => 30],
                ]
            ],
            'part_time' => [
                'name' => 'Part-Time (Mon-Wed-Fri)',
                'description' => 'Part-time schedule Monday, Wednesday, Friday',
                'schedule_data' => [
                    ['day_of_week' => 1, 'start_time' => '10:00', 'end_time' => '16:00', 'buffer_time' => 15, 'slot_duration' => 30],
                    ['day_of_week' => 3, 'start_time' => '10:00', 'end_time' => '16:00', 'buffer_time' => 15, 'slot_duration' => 30],
                    ['day_of_week' => 5, 'start_time' => '10:00', 'end_time' => '16:00', 'buffer_time' => 15, 'slot_duration' => 30],
                ]
            ]
        ];
    }
}
