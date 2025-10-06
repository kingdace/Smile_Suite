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
        Schema::table('reviews', function (Blueprint $table) {
            // Add staff_id for doctor reviews (only dentists can be reviewed)
            $table->foreignId('staff_id')->nullable()->constrained('users')->onDelete('set null');

            // Add pre-defined review category ratings (1-5 scale)
            $table->tinyInteger('professionalism_rating')->nullable()->comment('1-5 rating for professionalism');
            $table->tinyInteger('communication_rating')->nullable()->comment('1-5 rating for communication');
            $table->tinyInteger('treatment_quality_rating')->nullable()->comment('1-5 rating for treatment quality');
            $table->tinyInteger('bedside_manner_rating')->nullable()->comment('1-5 rating for bedside manner');

            // Add optional comment field (max 200 characters)
            $table->text('comment')->nullable()->comment('Optional additional comments');

            // Add indexes for performance
            $table->index(['staff_id', 'status']);
            $table->index(['clinic_id', 'staff_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['staff_id']);
            $table->dropIndex(['staff_id', 'status']);
            $table->dropIndex(['clinic_id', 'staff_id']);
            $table->dropColumn([
                'staff_id',
                'professionalism_rating',
                'communication_rating',
                'treatment_quality_rating',
                'bedside_manner_rating',
                'comment'
            ]);
        });
    }
};
