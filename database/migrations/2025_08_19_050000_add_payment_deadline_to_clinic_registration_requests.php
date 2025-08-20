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
        Schema::table('clinic_registration_requests', function (Blueprint $table) {
            $table->timestamp('payment_deadline')->nullable()->after('expires_at');
            $table->integer('payment_duration_days')->default(7)->after('payment_deadline');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clinic_registration_requests', function (Blueprint $table) {
            $table->dropColumn(['payment_deadline', 'payment_duration_days']);
        });
    }
};
