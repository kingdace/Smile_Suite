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
        return $user->clinic_id !== null;
    }

    public function update(User $user, Service $service)
    {
        return $user->clinic_id === $service->clinic_id;
    }

    public function delete(User $user, Service $service)
    {
        return $user->clinic_id === $service->clinic_id;
    }
}
