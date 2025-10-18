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
        return $user->hasPermission('view_inventory');
    }

    public function view(User $user, Inventory $inventory): bool
    {
        return $user->hasPermission('view_inventory') && $user->clinic->id === $inventory->clinic_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('add_inventory');
    }

    public function update(User $user, Inventory $inventory): bool
    {
        return $user->hasPermission('edit_inventory') && $user->clinic->id === $inventory->clinic_id;
    }

    public function delete(User $user, Inventory $inventory): bool
    {
        return $user->hasPermission('delete_inventory') && $user->clinic->id === $inventory->clinic_id;
    }
}
