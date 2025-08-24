<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('waitlist', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->foreignId('preferred_dentist_id')->nullable()->constrained('users')->onDelete('restrict');
            $table->foreignId('service_id')->nullable()->constrained()->onDelete('set null');
            
            // Waitlist details
            $table->string('reason')->nullable(); // Reason for waitlist
            $table->text('notes')->nullable(); // Additional notes
            $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            $table->enum('status', ['active', 'contacted', 'scheduled', 'cancelled', 'expired'])->default('active');
            
            // Preferred scheduling
            $table->date('preferred_start_date')->nullable();
            $table->date('preferred_end_date')->nullable();
            $table->json('preferred_days')->nullable(); // Array of preferred days of week
            $table->time('preferred_start_time')->nullable();
            $table->time('preferred_end_time')->nullable();
            
            // Contact preferences
            $table->enum('contact_method', ['phone', 'email', 'sms', 'any'])->default('any');
            $table->string('contact_notes')->nullable(); // Special contact instructions
            
            // Duration and type
            $table->integer('estimated_duration')->default(30); // in minutes
            $table->foreignId('appointment_type_id')->nullable()->constrained()->onDelete('set null');
            
            // Tracking
            $table->timestamp('contacted_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('expires_at')->nullable(); // Auto-expire after certain time
            $table->integer('contact_attempts')->default(0);
            $table->timestamp('last_contact_attempt')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for performance
            $table->index(['clinic_id', 'status']);
            $table->index(['clinic_id', 'priority']);
            $table->index(['clinic_id', 'preferred_dentist_id']);
            $table->index(['expires_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('waitlist');
    }
};
