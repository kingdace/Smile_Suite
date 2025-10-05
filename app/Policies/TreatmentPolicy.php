<?php

namespace App\Policies;

use App\Models\Treatment;
use App\Models\User;
use App\Models\Clinic;
use Illuminate\Auth\Access\HandlesAuthorization;

class TreatmentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user, Clinic $clinic = null): bool
    {
        // Allow clinic staff to view treatments in their clinic
        if ($user->isClinicStaff() && $clinic && $user->clinic_id === $clinic->id) {
            return true;
        }
        
        // Allow patients to view their own treatments (no clinic parameter needed)
        if ($user->isPatient()) {
            return true;
        }
        
        return false;
    }

    public function view(User $user, Treatment $treatment): bool
    {
        // Allow clinic staff to view treatments in their clinic
        if ($user->isClinicStaff() && $user->clinic_id === $treatment->clinic_id) {
            return true;
        }
        
        // Allow patients to view their own treatments
        if ($user->isPatient()) {
            return $treatment->patient->user_id === $user->id;
        }
        
        return false;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Treatment $treatment): bool
    {
        return $user->clinic->id === $treatment->clinic_id;
    }

    public function delete(User $user, Treatment $treatment): bool
    {
        return $user->clinic->id === $treatment->clinic_id;
    }
}
