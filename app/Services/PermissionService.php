<?php

namespace App\Services;

use App\Models\User;
use App\Models\RolePermission;
use Illuminate\Support\Collection;

class PermissionService
{
    /**
     * Check if a user has a specific permission
     */
    public function hasPermission(User $user, string $permission): bool
    {
        // Check if user's role has the permission
        return RolePermission::where('role', $user->role)
            ->whereHas('permission', function($q) use ($permission) {
                $q->where('name', $permission);
            })->exists();
    }

    /**
     * Get all permissions for a user
     */
    public function getUserPermissions(User $user): Collection
    {
        return RolePermission::where('role', $user->role)
            ->with('permission')
            ->get()
            ->pluck('permission.name');
    }

    /**
     * Check if user has any of the given permissions
     */
    public function hasAnyPermission(User $user, array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($user, $permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if user has all of the given permissions
     */
    public function hasAllPermissions(User $user, array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$this->hasPermission($user, $permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Assign permissions to a role
     */
    public function assignRolePermissions(string $role, array $permissions): void
    {
        foreach ($permissions as $permissionName) {
            $permission = \App\Models\Permission::where('name', $permissionName)->first();
            if ($permission) {
                RolePermission::firstOrCreate([
                    'role' => $role,
                    'permission_id' => $permission->id
                ]);
            }
        }
    }

    /**
     * Remove permissions from a role
     */
    public function removeRolePermissions(string $role, array $permissions): void
    {
        foreach ($permissions as $permissionName) {
            $permission = \App\Models\Permission::where('name', $permissionName)->first();
            if ($permission) {
                RolePermission::where('role', $role)
                    ->where('permission_id', $permission->id)
                    ->delete();
            }
        }
    }
}
