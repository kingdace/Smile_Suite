<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds inventory integration fields to the treatments table.
     * These fields track whether inventory has been deducted for a treatment
     * and when the deduction occurred.
     */
    public function up(): void
    {
        Schema::table('treatments', function (Blueprint $table) {
            // Inventory integration tracking
            $table->boolean('inventory_deducted')->default(false)->after('outcome')
                ->comment('Whether inventory has been deducted for this treatment');
            $table->timestamp('inventory_deducted_at')->nullable()->after('inventory_deducted')
                ->comment('When inventory was deducted for this treatment');

            // Index for performance
            $table->index(['inventory_deducted', 'status'], 'idx_treatment_inventory_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('treatments', function (Blueprint $table) {
            $table->dropIndex('idx_treatment_inventory_status');
            $table->dropColumn(['inventory_deducted', 'inventory_deducted_at']);
        });
    }
};

