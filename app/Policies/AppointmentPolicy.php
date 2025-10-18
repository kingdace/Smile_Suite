<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\User;

class AppointmentPolicy
{
    public function viewAny(User $user, Clinic $clinic): bool
    {
        return $user->hasPermission('view_appointments') && $user->clinic_id === $clinic->id;
    }

    public function view(User $user, Appointment $appointment, Clinic $clinic): bool
    {
        return $user->hasPermission('view_appointments') && $user->clinic_id === $clinic->id;
    }

    public function create(User $user, Clinic $clinic): bool
    {
        return $user->hasPermission('create_appointments') && $user->clinic_id === $clinic->id;
    }

    public function update(User $user, Appointment $appointment, Clinic $clinic): bool
    {
        return $user->hasPermission('edit_appointments') && $user->clinic_id === $clinic->id;
    }

    public function delete(User $user, Appointment $appointment, Clinic $clinic): bool
    {
        return $user->hasPermission('delete_appointments') && $user->clinic_id === $clinic->id;
    }

    /**
     * Determine whether the user can assign dentists to appointments.
     */
    public function assignDentist(User $user, Clinic $clinic): bool
    {
        return $user->hasPermission('assign_dentists') && $user->clinic_id === $clinic->id;
    }
}
