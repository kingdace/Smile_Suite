<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Service categorization and organization
            $table->string('category')->default('general')->after('description');
            $table->string('subcategory')->nullable()->after('category');
            $table->string('code')->nullable()->after('subcategory'); // Service code for billing
            
            // Service details
            $table->integer('duration_minutes')->default(30)->after('price');
            $table->text('procedure_details')->nullable()->after('duration_minutes');
            $table->text('preparation_instructions')->nullable()->after('procedure_details');
            $table->text('post_procedure_care')->nullable()->after('preparation_instructions');
            
            // Pricing and billing
            $table->decimal('cost_price', 10, 2)->nullable()->after('price'); // Internal cost
            $table->decimal('insurance_price', 10, 2)->nullable()->after('cost_price');
            $table->boolean('is_insurance_eligible')->default(false)->after('insurance_price');
            $table->json('insurance_codes')->nullable()->after('is_insurance_eligible');
            
            // Service availability and scheduling
            $table->boolean('requires_consultation')->default(false)->after('is_insurance_eligible');
            $table->boolean('is_emergency_service')->default(false)->after('requires_consultation');
            $table->integer('advance_booking_days')->default(0)->after('is_emergency_service');
            $table->integer('max_daily_bookings')->nullable()->after('advance_booking_days');
            
            // Service status and metadata
            $table->integer('sort_order')->default(0)->after('is_active');
            $table->json('tags')->nullable()->after('sort_order');
            $table->text('notes')->nullable()->after('tags');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'category',
                'subcategory', 
                'code',
                'duration_minutes',
                'procedure_details',
                'preparation_instructions',
                'post_procedure_care',
                'cost_price',
                'insurance_price',
                'is_insurance_eligible',
                'insurance_codes',
                'requires_consultation',
                'is_emergency_service',
                'advance_booking_days',
                'max_daily_bookings',
                'sort_order',
                'tags',
                'notes'
            ]);
        });
    }
};
