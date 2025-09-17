<?php

namespace App\Observers;

use App\Models\Appointment;
use App\Events\AppointmentUpdated;

class AppointmentObserver
{
    /**
     * Handle the Appointment "created" event.
     */
    public function created(Appointment $appointment): void
    {
        // Broadcast appointment creation for real-time dashboard updates
        broadcast(new AppointmentUpdated($appointment, 'created'));
    }

    /**
     * Handle the Appointment "updated" event.
     */
    public function updated(Appointment $appointment): void
    {
        // Only broadcast if significant changes occurred
        if ($this->hasSignificantChanges($appointment)) {
            broadcast(new AppointmentUpdated($appointment, 'updated'));
        }
    }

    /**
     * Handle the Appointment "deleted" event.
     */
    public function deleted(Appointment $appointment): void
    {
        // Broadcast appointment deletion
        broadcast(new AppointmentUpdated($appointment, 'deleted'));
    }

    /**
     * Handle the Appointment "restored" event.
     */
    public function restored(Appointment $appointment): void
    {
        // Broadcast appointment restoration
        broadcast(new AppointmentUpdated($appointment, 'restored'));
    }

    /**
     * Handle the Appointment "force deleted" event.
     */
    public function forceDeleted(Appointment $appointment): void
    {
        // Broadcast appointment force deletion
        broadcast(new AppointmentUpdated($appointment, 'force_deleted'));
    }

    /**
     * Determine if the appointment has significant changes that warrant broadcasting
     */
    private function hasSignificantChanges(Appointment $appointment): bool
    {
        // Check for changes in important fields
        $significantFields = [
            'appointment_status_id',
            'appointment_date',
            'appointment_time',
            'patient_id',
            'dentist_id',
            'appointment_type_id',
        ];

        foreach ($significantFields as $field) {
            if ($appointment->wasChanged($field)) {
                return true;
            }
        }

        return false;
    }
}
