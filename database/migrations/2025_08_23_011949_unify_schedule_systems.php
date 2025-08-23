<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('dentist_schedules', function (Blueprint $table) {
            // Add new fields for better schedule management
            $table->string('schedule_type')->default('weekly')->after('exception_type'); // weekly, exception, template
            $table->json('recurring_pattern')->nullable()->after('schedule_type'); // For complex recurring patterns
            $table->boolean('is_template')->default(false)->after('recurring_pattern'); // For schedule templates
            $table->string('template_name')->nullable()->after('is_template'); // Name for schedule templates
            $table->date('valid_from')->nullable()->after('template_name'); // Schedule validity period
            $table->date('valid_until')->nullable()->after('valid_from'); // Schedule validity period
            $table->text('notes')->nullable()->after('valid_until'); // Additional notes for schedules
            $table->integer('slot_duration')->default(30)->after('notes'); // Default slot duration in minutes
            $table->boolean('allow_overlap')->default(false)->after('slot_duration'); // Allow overlapping appointments
            $table->integer('max_appointments_per_day')->nullable()->after('allow_overlap'); // Limit appointments per day
        });

        // Create schedule templates table
        Schema::create('schedule_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('schedule_data'); // Store the actual schedule configuration
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // Create schedule exceptions table for better exception management
        Schema::create('schedule_exceptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dentist_schedule_id')->constrained()->onDelete('cascade');
            $table->date('exception_date');
            $table->string('exception_type'); // day_off, modified_hours, unavailable
            $table->time('modified_start_time')->nullable();
            $table->time('modified_end_time')->nullable();
            $table->text('reason')->nullable();
            $table->boolean('is_recurring_yearly')->default(false); // For annual holidays
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::table('dentist_schedules', function (Blueprint $table) {
            $table->dropColumn([
                'schedule_type',
                'recurring_pattern',
                'is_template',
                'template_name',
                'valid_from',
                'valid_until',
                'notes',
                'slot_duration',
                'allow_overlap',
                'max_appointments_per_day'
            ]);
        });

        Schema::dropIfExists('schedule_exceptions');
        Schema::dropIfExists('schedule_templates');
    }
};
