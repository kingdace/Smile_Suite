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
        // Skip this migration on fresh installations
        // This migration was designed to modify an existing notifications table
        // but on fresh migrations, the base table already has the correct structure
        
        // Check if the notifications table has the old structure
        $columns = Schema::getColumnListing('notifications');
        if (!in_array('clinic_id', $columns)) {
            // Table doesn't exist or is already correct - skip
            return;
        }
        
        // Check if clinic_id is already nullable
        $clinicIdColumn = DB::select("SHOW COLUMNS FROM notifications WHERE Field = 'clinic_id'");
        if (!empty($clinicIdColumn) && strpos($clinicIdColumn[0]->Null, 'YES') !== false) {
            // Already nullable - skip
            return;
        }
        
        Schema::table('notifications', function (Blueprint $table) {
            // Make clinic_id nullable for admin notifications
            $table->unsignedBigInteger('clinic_id')->nullable()->change();

            // Update the foreign key constraint to handle nullable clinic_id
            $table->dropForeign(['clinic_id']);
            $table->foreign('clinic_id')->references('id')->on('clinics')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // Revert clinic_id to not nullable
            $table->unsignedBigInteger('clinic_id')->nullable(false)->change();

            // Update the foreign key constraint
            $table->dropForeign(['clinic_id']);
            $table->foreign('clinic_id')->references('id')->on('clinics')->onDelete('cascade');

            // Update the index
            $table->dropIndex(['clinic_id', 'created_at']);
            $table->index(['clinic_id', 'created_at']);
        });
    }
};
