<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add the new "Pending Reschedule" status
        DB::table('appointment_statuses')->insert([
            'name' => 'Pending Reschedule',
            'description' => 'Appointment reschedule request pending clinic approval',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the "Pending Reschedule" status
        DB::table('appointment_statuses')->where('name', 'Pending Reschedule')->delete();
    }
};
