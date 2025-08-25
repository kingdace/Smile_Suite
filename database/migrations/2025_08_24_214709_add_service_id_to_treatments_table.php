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
        Schema::table('treatments', function (Blueprint $table) {
            // Link to clinic-specific services
            $table->foreignId('service_id')->nullable()->after('appointment_id')->constrained()->onDelete('set null');

            // Dental-specific fields
            $table->json('tooth_numbers')->nullable()->after('recommendations');
            $table->json('prescriptions')->nullable()->after('tooth_numbers');
            $table->text('follow_up_notes')->nullable()->after('prescriptions');
            $table->json('materials_used')->nullable()->after('follow_up_notes');
            $table->json('insurance_info')->nullable()->after('materials_used');
            $table->enum('payment_status', ['pending', 'partial', 'completed'])->default('pending')->after('insurance_info');

            // Clinical documentation
            $table->json('vital_signs')->nullable()->after('payment_status');
            $table->text('allergies')->nullable()->after('vital_signs');
            $table->text('medical_history')->nullable()->after('allergies');
            $table->json('consent_forms')->nullable()->after('medical_history');

            // Treatment tracking
            $table->string('treatment_phase', 50)->nullable()->after('consent_forms');
            $table->string('outcome', 50)->nullable()->after('treatment_phase');
            $table->date('next_appointment_date')->nullable()->after('outcome');
            $table->integer('estimated_duration_minutes')->nullable()->after('next_appointment_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('treatments', function (Blueprint $table) {
            $table->dropForeign(['service_id']);
            $table->dropColumn([
                'service_id',
                'tooth_numbers',
                'prescriptions',
                'follow_up_notes',
                'materials_used',
                'insurance_info',
                'payment_status',
                'vital_signs',
                'allergies',
                'medical_history',
                'consent_forms',
                'treatment_phase',
                'outcome',
                'next_appointment_date',
                'estimated_duration_minutes'
            ]);
        });
    }
};
