<?php

namespace App\Policies;

use App\Models\Treatment;
use App\Models\User;
use App\Models\Clinic;
use Illuminate\Auth\Access\HandlesAuthorization;

class TreatmentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user, Clinic $clinic): bool
    {
        return (in_array($user->role, ['clinic_admin', 'dentist', 'staff'])) && $user->clinic_id === $clinic->id;
    }

    public function view(User $user, Treatment $treatment): bool
    {
        return $user->clinic->id === $treatment->clinic_id;
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
