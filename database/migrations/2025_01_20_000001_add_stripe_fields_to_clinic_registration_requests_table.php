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
            $table->string('stripe_customer_id')->nullable()->after('payment_status');
            $table->string('stripe_payment_intent_id')->nullable()->after('stripe_customer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clinic_registration_requests', function (Blueprint $table) {
            $table->dropColumn([
                'stripe_customer_id',
                'stripe_payment_intent_id',
            ]);
        });
    }
};
