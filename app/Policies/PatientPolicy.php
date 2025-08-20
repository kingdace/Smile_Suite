<?php

namespace App\Policies;

use App\Models\Patient;
use App\Models\User;
use App\Models\Clinic;
use Illuminate\Auth\Access\HandlesAuthorization;

class PatientPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user, Clinic $clinic): bool
    {
        return ($user->role === 'clinic_admin' || $user->role === 'dentist' || $user->role === 'staff') && $user->clinic_id === $clinic->id;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Patient $patient): bool
    {
        return $user->clinic->id === $patient->clinic_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can create patients
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Patient $patient): bool
    {
        return $user->clinic->id === $patient->clinic_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Patient $patient): bool
    {
        // Only clinic_admin can delete patients
        return $user->role === 'clinic_admin' && $user->clinic->id === $patient->clinic_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Patient $patient): bool
    {
        // Only clinic_admin can restore patients
        return $user->role === 'clinic_admin' && $user->clinic->id === $patient->clinic_id;
    }

    /**
     * Determine whether the user can delete any models (for bulk operations).
     */
    public function deleteAny(User $user): bool
    {
        // Only clinic_admin can perform bulk delete operations
        return $user->role === 'clinic_admin';
    }
}
