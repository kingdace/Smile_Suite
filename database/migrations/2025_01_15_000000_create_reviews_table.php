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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->foreignId('patient_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('appointment_id')->nullable()->constrained()->onDelete('set null');

            // Review content
            $table->string('title')->nullable();
            $table->text('content');
            $table->integer('rating')->comment('1-5 stars');

            // Review metadata
            $table->enum('source', ['internal', 'external', 'google', 'manual'])->default('internal');
            $table->string('external_review_id')->nullable(); // For Google/other platform IDs
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->boolean('is_verified')->default(false);

            // Engagement metrics
            $table->integer('helpful_count')->default(0);
            $table->integer('reported_count')->default(0);

            // Timestamps
            $table->timestamp('review_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index(['clinic_id', 'status']);
            $table->index(['clinic_id', 'rating']);
            $table->index(['patient_id', 'clinic_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
