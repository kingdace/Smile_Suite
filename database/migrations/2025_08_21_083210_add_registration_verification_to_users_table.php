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
            $table->string('registration_verification_code')->nullable()->after('email_verified_at');
            $table->timestamp('registration_verification_expires_at')->nullable()->after('registration_verification_code');
            $table->boolean('registration_verified')->default(false)->after('registration_verification_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'registration_verification_code',
                'registration_verification_expires_at',
                'registration_verified'
            ]);
        });
    }
};
