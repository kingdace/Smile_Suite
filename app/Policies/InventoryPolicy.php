<?php

namespace App\Policies;

use App\Models\Inventory;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class InventoryPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Inventory $inventory): bool
    {
        return $user->clinic->id === $inventory->clinic_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Inventory $inventory): bool
    {
        return $user->clinic->id === $inventory->clinic_id;
    }

    public function delete(User $user, Inventory $inventory): bool
    {
        return $user->clinic->id === $inventory->clinic_id;
    }
}
