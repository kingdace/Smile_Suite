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
        Schema::defaultStringLength(191);
        Schema::create('clinic_registration_requests', function (Blueprint $table) {
            $table->id();
            $table->string('clinic_name');
            $table->string('contact_person');
            $table->string('email');
            $table->string('phone');
            $table->string('license_number');
            $table->text('description')->nullable();
            $table->text('message')->nullable();
            $table->enum('subscription_plan', ['basic', 'premium', 'enterprise']);
            $table->decimal('subscription_amount', 10, 2);
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'payment_failed'])->default('pending');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->string('approval_token')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clinic_registration_requests');
    }
};
