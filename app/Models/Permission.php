<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'category'
    ];

    /**
     * Get the role permissions for this permission
     */
    public function rolePermissions()
    {
        return $this->hasMany(RolePermission::class);
    }

    /**
     * Get all roles that have this permission
     */
    public function roles()
    {
        return $this->belongsToMany('role', 'role_permissions', 'permission_id', 'role')
            ->withTimestamps();
    }
}
