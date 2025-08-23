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
        Schema::table('users', function (Blueprint $table) {
            // Dentist-specific fields
            $table->string('license_number')->nullable()->after('phone_number');
            $table->text('specialties')->nullable()->after('license_number'); // JSON array of specialties
            $table->text('qualifications')->nullable()->after('specialties'); // JSON array of qualifications
            $table->integer('years_experience')->nullable()->after('qualifications');
            $table->text('bio')->nullable()->after('years_experience');
            $table->string('profile_photo')->nullable()->after('bio');

            // Availability settings
            $table->json('working_hours')->nullable()->after('profile_photo'); // JSON object for weekly schedule
            $table->json('unavailable_dates')->nullable()->after('working_hours'); // JSON array of dates
            $table->boolean('is_active')->default(true)->after('unavailable_dates');
            $table->timestamp('last_active_at')->nullable()->after('is_active');

            // Additional contact info
            $table->string('emergency_contact')->nullable()->after('last_active_at');
            $table->string('emergency_phone')->nullable()->after('emergency_contact');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'license_number',
                'specialties',
                'qualifications',
                'years_experience',
                'bio',
                'profile_photo',
                'working_hours',
                'unavailable_dates',
                'is_active',
                'last_active_at',
                'emergency_contact',
                'emergency_phone',
            ]);
        });
    }
};
