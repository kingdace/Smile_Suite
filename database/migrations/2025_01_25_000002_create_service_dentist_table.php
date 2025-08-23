<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_dentist', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Dentist
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            
            // Dentist specialization details
            $table->boolean('is_primary_specialist')->default(false);
            $table->boolean('is_available')->default(true);
            $table->integer('experience_years')->nullable();
            $table->text('specialization_notes')->nullable();
            
            // Pricing override for this dentist
            $table->decimal('custom_price', 10, 2)->nullable();
            $table->decimal('custom_duration_minutes', 5, 2)->nullable();
            
            $table->timestamps();
            
            // Ensure unique service-dentist combinations per clinic
            $table->unique(['service_id', 'user_id', 'clinic_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_dentist');
    }
};
