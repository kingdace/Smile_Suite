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
        Schema::table('notifications', function (Blueprint $table) {
            // Make clinic_id nullable for admin notifications
            $table->unsignedBigInteger('clinic_id')->nullable()->change();

            // Update the foreign key constraint to handle nullable clinic_id
            $table->dropForeign(['clinic_id']);
            $table->foreign('clinic_id')->references('id')->on('clinics')->onDelete('cascade');

            // Update the index to handle nullable clinic_id
            $table->dropIndex(['clinic_id', 'created_at']);
            $table->index(['clinic_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // Revert clinic_id to not nullable
            $table->unsignedBigInteger('clinic_id')->nullable(false)->change();

            // Update the foreign key constraint
            $table->dropForeign(['clinic_id']);
            $table->foreign('clinic_id')->references('id')->on('clinics')->onDelete('cascade');

            // Update the index
            $table->dropIndex(['clinic_id', 'created_at']);
            $table->index(['clinic_id', 'created_at']);
        });
    }
};
