<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('clinics', function (Blueprint $table) {
            // Add index for is_active column (frequently queried)
            if (!Schema::hasIndex('clinics', ['is_active'])) {
                $table->index('is_active', 'idx_clinics_is_active');
            }
            
            // Add index for slug column (used in profile lookups)
            if (!Schema::hasIndex('clinics', ['slug'])) {
                $table->index('slug', 'idx_clinics_slug');
            }
            
            // Add composite index for is_active + name for directory listing
            if (!Schema::hasIndex('clinics', ['is_active', 'name'])) {
                $table->index(['is_active', 'name'], 'idx_clinics_active_name');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            // Add composite index for clinic_id + role (used in whereHas/join queries)
            if (!Schema::hasIndex('users', ['clinic_id', 'role'])) {
                $table->index(['clinic_id', 'role'], 'idx_users_clinic_role');
            }
            
            // Add index for role column
            if (!Schema::hasIndex('users', ['role'])) {
                $table->index('role', 'idx_users_role');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clinics', function (Blueprint $table) {
            $table->dropIndex('idx_clinics_is_active');
            $table->dropIndex('idx_clinics_slug');
            $table->dropIndex('idx_clinics_active_name');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_clinic_role');
            $table->dropIndex('idx_users_role');
        });
    }
};
