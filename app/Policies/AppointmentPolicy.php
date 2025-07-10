<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\User;

class AppointmentPolicy
{
    public function viewAny(User $user, Clinic $clinic): bool
    {
        return (in_array($user->role, ['clinic_admin', 'dentist', 'staff'])) && $user->clinic_id === $clinic->id;
    }

    public function view(User $user, Appointment $appointment, Clinic $clinic): bool
    {
        return (in_array($user->role, ['clinic_admin', 'dentist', 'staff'])) && $user->clinic_id === $clinic->id;
    }

    public function create(User $user, Clinic $clinic): bool
    {
        return (in_array($user->role, ['clinic_admin', 'dentist', 'staff'])) && $user->clinic_id === $clinic->id;
    }

    public function update(User $user, Appointment $appointment, Clinic $clinic): bool
    {
        return (in_array($user->role, ['clinic_admin', 'dentist', 'staff'])) && $user->clinic_id === $clinic->id;
    }

    public function delete(User $user, Appointment $appointment, Clinic $clinic): bool
    {
        return (in_array($user->role, ['clinic_admin', 'dentist', 'staff'])) && $user->clinic_id === $clinic->id;
    }
}
