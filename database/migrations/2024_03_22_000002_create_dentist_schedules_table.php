<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('dentist_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Dentist
            $table->string('day_of_week'); // Monday, Tuesday, etc.
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('buffer_time')->default(15); // Buffer time in minutes
            $table->boolean('is_available')->default(true);
            $table->date('date')->nullable(); // For specific date exceptions
            $table->string('exception_type')->nullable(); // 'day_off', 'late_start', 'early_end'
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('recurring_appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->constrained()->onDelete('cascade');
            $table->string('frequency'); // daily, weekly, monthly
            $table->integer('interval')->default(1); // Every X days/weeks/months
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->json('days_of_week')->nullable(); // For weekly recurrence
            $table->integer('day_of_month')->nullable(); // For monthly recurrence
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('recurring_appointments');
        Schema::dropIfExists('dentist_schedules');
    }
};
