<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->integer('duration')->default(30)->after('scheduled_at'); // Duration in minutes
            $table->string('payment_status')->default('pending')->after('duration');
            $table->boolean('is_follow_up')->default(false)->after('payment_status');
            $table->date('previous_visit_date')->nullable()->after('is_follow_up');
            $table->text('previous_visit_notes')->nullable()->after('previous_visit_date');
            $table->string('custom_reason')->nullable()->after('reason');
        });
    }

    public function down()
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn([
                'duration',
                'payment_status',
                'is_follow_up',
                'previous_visit_date',
                'previous_visit_notes',
                'custom_reason'
            ]);
        });
    }
};
