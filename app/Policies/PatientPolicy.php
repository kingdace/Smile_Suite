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
        return $user->hasPermission('view_patients') && $user->clinic_id === $clinic->id;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Patient $patient): bool
    {
        return $user->hasPermission('view_patients') && $user->clinic->id === $patient->clinic_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('add_patients');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Patient $patient): bool
    {
        return $user->hasPermission('edit_patients') && $user->clinic->id === $patient->clinic_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Patient $patient): bool
    {
        return $user->hasPermission('delete_patients') && $user->clinic->id === $patient->clinic_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Patient $patient): bool
    {
        return $user->hasPermission('delete_patients') && $user->clinic->id === $patient->clinic_id;
    }

    /**
     * Determine whether the user can delete any models (for bulk operations).
     */
    public function deleteAny(User $user): bool
    {
        return $user->hasPermission('delete_patients');
    }
}
