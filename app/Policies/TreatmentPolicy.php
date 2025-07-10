<?php

namespace App\Policies;

use App\Models\Treatment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TreatmentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
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
