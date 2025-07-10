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
        Schema::create('clinics', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo_url')->nullable();
            $table->text('description')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->unique();
            $table->string('license_number')->unique();
            $table->json('operating_hours')->nullable();
            $table->string('timezone')->default('Asia/Manila');
            $table->boolean('is_active')->default(true);
            // Location fields
            $table->string('region_code')->nullable();
            $table->string('province_code')->nullable();
            $table->string('city_municipality_code')->nullable();
            $table->string('barangay_code')->nullable();
            // Address details
            $table->string('street_address')->nullable();
            $table->string('postal_code')->nullable();
            $table->text('address_details')->nullable();
            // Subscription fields
            $table->string('subscription_plan')->default('basic');
            $table->string('subscription_status')->default('trial');
            $table->date('subscription_start_date')->nullable();
            $table->date('subscription_end_date')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('last_payment_at')->nullable();
            $table->timestamp('next_payment_at')->nullable();
            // $table->string('address');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clinics');
    }
};
