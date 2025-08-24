<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Waitlist;
use App\Models\Clinic;
use Illuminate\Auth\Access\HandlesAuthorization;

class WaitlistPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user, Clinic $clinic): bool
    {
        return $user->clinic_id === $clinic->id &&
               in_array($user->role, ['admin', 'dentist', 'clinic_admin', 'staff']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Waitlist $waitlist, Clinic $clinic): bool
    {
        return $user->clinic_id === $clinic->id &&
               $waitlist->clinic_id === $clinic->id &&
               in_array($user->role, ['admin', 'dentist', 'clinic_admin', 'staff']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Clinic $clinic): bool
    {
        return $user->clinic_id === $clinic->id &&
               in_array($user->role, ['admin', 'dentist', 'clinic_admin', 'staff']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Waitlist $waitlist, Clinic $clinic): bool
    {
        return $user->clinic_id === $clinic->id &&
               $waitlist->clinic_id === $clinic->id &&
               in_array($user->role, ['admin', 'dentist', 'clinic_admin', 'staff']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Waitlist $waitlist, Clinic $clinic): bool
    {
        return $user->clinic_id === $clinic->id &&
               $waitlist->clinic_id === $clinic->id &&
               in_array($user->role, ['admin', 'dentist', 'clinic_admin']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Waitlist $waitlist, Clinic $clinic): bool
    {
        return $user->clinic_id === $clinic->id &&
               $waitlist->clinic_id === $clinic->id &&
               in_array($user->role, ['admin', 'dentist', 'clinic_admin']);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Waitlist $waitlist, Clinic $clinic): bool
    {
        return $user->clinic_id === $clinic->id &&
               $waitlist->clinic_id === $clinic->id &&
               $user->role === 'admin';
    }
}
