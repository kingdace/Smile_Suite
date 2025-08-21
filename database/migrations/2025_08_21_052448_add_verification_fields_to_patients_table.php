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
        Schema::table('patients', function (Blueprint $table) {
            $table->boolean('email_verified')->default(false)->after('email');
            $table->timestamp('email_verified_at')->nullable()->after('email_verified');
            $table->string('email_verification_token')->nullable()->after('email_verified_at');
            $table->timestamp('email_verification_token_expires_at')->nullable()->after('email_verification_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn([
                'email_verified',
                'email_verified_at',
                'email_verification_token',
                'email_verification_token_expires_at'
            ]);
        });
    }
};
