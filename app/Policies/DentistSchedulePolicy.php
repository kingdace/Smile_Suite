<?php

namespace App\Policies;

use App\Models\User;
use App\Models\DentistSchedule;
use App\Models\Clinic;
use Illuminate\Auth\Access\Response;

class DentistSchedulePolicy
{
    /**
     * Determine whether the user can view any dentist schedules.
     */
    public function viewAny(User $user, Clinic $clinic): bool
    {
        return $user->hasPermission('view_schedules') && $user->clinic_id === $clinic->id;
    }

    /**
     * Determine whether the user can view the dentist schedule.
     */
    public function view(User $user, DentistSchedule $dentistSchedule): bool
    {
        return $user->hasPermission('view_schedules') && $user->clinic_id === $dentistSchedule->clinic_id;
    }

    /**
     * Determine whether the user can create dentist schedules.
     */
    public function create(User $user, Clinic $clinic): bool
    {
        return $user->hasPermission('manage_dentist_schedules') && $user->clinic_id === $clinic->id;
    }

    /**
     * Determine whether the user can update the dentist schedule.
     */
    public function update(User $user, DentistSchedule $dentistSchedule): bool
    {
        // Must have manage_dentist_schedules permission
        if (!$user->hasPermission('manage_dentist_schedules')) {
            return false;
        }

        // Must belong to the same clinic
        if ($user->clinic_id !== $dentistSchedule->clinic_id) {
            return false;
        }

        // Clinic admin can edit any schedule, dentist can only edit their own
        return $user->isClinicAdmin() || $user->id === $dentistSchedule->user_id;
    }

    /**
     * Determine whether the user can delete the dentist schedule.
     */
    public function delete(User $user, DentistSchedule $dentistSchedule): bool
    {
        // Must have manage_dentist_schedules permission
        if (!$user->hasPermission('manage_dentist_schedules')) {
            return false;
        }

        // Must belong to the same clinic
        if ($user->clinic_id !== $dentistSchedule->clinic_id) {
            return false;
        }

        // Clinic admin can delete any schedule, dentist can only delete their own
        return $user->isClinicAdmin() || $user->id === $dentistSchedule->user_id;
    }

    /**
     * Determine whether the user can restore the dentist schedule.
     */
    public function restore(User $user, DentistSchedule $dentistSchedule): bool
    {
        return $this->delete($user, $dentistSchedule);
    }

    /**
     * Determine whether the user can permanently delete the dentist schedule.
     */
    public function forceDelete(User $user, DentistSchedule $dentistSchedule): bool
    {
        return $this->delete($user, $dentistSchedule);
    }
}
