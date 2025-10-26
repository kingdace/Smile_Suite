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
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('clinic_id');
            $table->unsignedBigInteger('user_id');
            $table->string('ticket_number', 20)->unique();
            $table->string('subject', 255);
            $table->text('description');
            $table->enum('category', ['technical', 'billing', 'feature_request', 'bug_report', 'general'])->default('general');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open');
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('clinic_id')->references('id')->on('clinics')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');

            // Indexes for performance
            $table->index(['clinic_id', 'status'], 'idx_support_tickets_clinic_status');
            $table->index(['user_id', 'created_at'], 'idx_support_tickets_user_created');
            $table->index(['assigned_to', 'status'], 'idx_support_tickets_assigned_status');
            $table->index(['priority', 'status'], 'idx_support_tickets_priority_status');
            $table->index(['created_at'], 'idx_support_tickets_created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
    }
};
