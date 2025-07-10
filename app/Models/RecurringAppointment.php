<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecurringAppointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'appointment_id',
        'frequency',
        'interval',
        'start_date',
        'end_date',
        'days_of_week',
        'day_of_month',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'days_of_week' => 'array',
        'day_of_month' => 'integer',
        'interval' => 'integer',
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function generateAppointments()
    {
        $appointments = [];
        $currentDate = $this->start_date->copy();
        $baseAppointment = $this->appointment;

        while ($currentDate <= $this->end_date) {
            if ($this->isValidDate($currentDate)) {
                $appointments[] = $this->createAppointment($baseAppointment, $currentDate);
            }
            $currentDate->addDays($this->getNextInterval());
        }

        return $appointments;
    }

    private function isValidDate($date)
    {
        switch ($this->frequency) {
            case 'weekly':
                return in_array($date->dayOfWeek, $this->days_of_week);
            case 'monthly':
                return $date->day === $this->day_of_month;
            case 'daily':
                return true;
            default:
                return false;
        }
    }

    private function getNextInterval()
    {
        switch ($this->frequency) {
            case 'daily':
                return $this->interval;
            case 'weekly':
                return 7 * $this->interval;
            case 'monthly':
                return 30 * $this->interval;
            default:
                return 1;
        }
    }

    private function createAppointment($baseAppointment, $date)
    {
        return Appointment::create([
            'clinic_id' => $baseAppointment->clinic_id,
            'patient_id' => $baseAppointment->patient_id,
            'assigned_to' => $baseAppointment->assigned_to,
            'scheduled_at' => $date->setTimeFrom($baseAppointment->scheduled_at),
            'ended_at' => $date->setTimeFrom($baseAppointment->ended_at),
            'status' => $baseAppointment->status,
            'payment_status' => $baseAppointment->payment_status,
            'reason' => $baseAppointment->reason,
            'notes' => $baseAppointment->notes,
            'duration' => $baseAppointment->duration,
            'is_recurring' => true,
            'recurring_parent_id' => $baseAppointment->id,
        ]);
    }
}
