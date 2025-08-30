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
        Schema::table('subscription_requests', function (Blueprint $table) {
            $table->string('payment_token', 64)->nullable()->after('calculated_amount');
            $table->timestamp('payment_deadline')->nullable()->after('payment_token');
            
            // Payment details fields
            $table->string('payment_method')->nullable()->after('payment_deadline');
            $table->text('payment_details')->nullable()->after('payment_method');
            $table->string('reference_number')->nullable()->after('payment_details');
            $table->string('sender_name')->nullable()->after('reference_number');
            $table->string('sender_number')->nullable()->after('sender_name');
            $table->decimal('amount_sent', 10, 2)->nullable()->after('sender_number');
            $table->timestamp('payment_received_at')->nullable()->after('amount_sent');
            $table->string('payment_status')->default('pending')->after('payment_received_at');
            $table->text('payment_verification_notes')->nullable()->after('payment_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscription_requests', function (Blueprint $table) {
            $table->dropColumn([
                'payment_token', 
                'payment_deadline',
                'payment_method',
                'payment_details',
                'reference_number',
                'sender_name',
                'sender_number',
                'amount_sent',
                'payment_received_at',
                'payment_status',
                'payment_verification_notes'
            ]);
        });
    }
};
