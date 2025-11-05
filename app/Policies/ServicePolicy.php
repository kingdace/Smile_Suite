<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    public function viewAny(User $user)
    {
        return $user->clinic_id !== null;
    }

    public function view(User $user, Service $service)
    {
        return $user->clinic_id === $service->clinic_id;
    }

    public function create(User $user)
    {
        // Only clinic_admin can create services
        return $user->clinic_id !== null && $user->role === 'clinic_admin';
    }

    public function update(User $user, Service $service)
    {
        // Only clinic_admin can update services
        return $user->clinic_id === $service->clinic_id && $user->role === 'clinic_admin';
    }

    public function delete(User $user, Service $service)
    {
        // Only clinic_admin can delete services
        return $user->clinic_id === $service->clinic_id && $user->role === 'clinic_admin';
    }
}
