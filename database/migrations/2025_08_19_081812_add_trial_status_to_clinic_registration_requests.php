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
        DB::statement("ALTER TABLE clinic_registration_requests MODIFY COLUMN payment_status ENUM('pending', 'paid', 'failed', 'payment_failed', 'trial') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE clinic_registration_requests MODIFY COLUMN payment_status ENUM('pending', 'paid', 'failed', 'payment_failed') DEFAULT 'pending'");
    }
};
