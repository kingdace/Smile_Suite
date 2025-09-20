<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Creates the junction table for treatment-inventory integration
     * This table tracks which inventory items were used in each treatment
     * and maintains a complete audit trail.
     */
    public function up(): void
    {
        Schema::create('treatment_inventory_items', function (Blueprint $table) {
            $table->id();

            // Foreign keys
            $table->foreignId('treatment_id')->constrained()->onDelete('cascade');
            $table->foreignId('inventory_id')->constrained()->onDelete('cascade');

            // Usage details
            $table->integer('quantity_used')->comment('Quantity of inventory item used in treatment');
            $table->decimal('unit_cost', 10, 2)->comment('Unit cost at time of usage');
            $table->decimal('total_cost', 10, 2)->comment('Total cost (quantity_used * unit_cost)');
            $table->text('notes')->nullable()->comment('Additional notes about usage');

            // Timestamps
            $table->timestamps();

            // Indexes for performance
            $table->index(['treatment_id', 'inventory_id'], 'idx_treatment_inventory');
            $table->index(['inventory_id', 'created_at'], 'idx_inventory_usage_date');
            $table->index('created_at', 'idx_usage_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('treatment_inventory_items');
    }
};

