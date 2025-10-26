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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('clinic_id');
            $table->unsignedBigInteger('user_id')->nullable(); // NULL = all users, specific ID = personal notification
            $table->json('target_roles'); // ['clinic_admin', 'dentist', 'staff']
            $table->string('type', 50); // 'appointment', 'inventory', 'subscription', 'patient', 'system'
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable(); // Additional data for actions/links
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['clinic_id', 'created_at']);
            $table->index(['user_id', 'is_read']);
            $table->index(['type', 'priority']);
            $table->index(['expires_at']);

            // Foreign key constraints
            $table->foreign('clinic_id')->references('id')->on('clinics')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
