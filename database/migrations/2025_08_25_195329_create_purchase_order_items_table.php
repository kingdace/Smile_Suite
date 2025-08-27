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
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('inventory_id')->nullable()->constrained()->nullOnDelete(); // Can be null for new items
            $table->string('item_name'); // Name of the item being ordered
            $table->text('item_description')->nullable();
            $table->string('sku')->nullable();
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->integer('quantity_ordered');
            $table->integer('quantity_received')->default(0);
            $table->decimal('unit_cost', 10, 2);
            $table->decimal('total_cost', 10, 2);
            $table->string('unit_of_measure')->default('pieces'); // pieces, boxes, bottles, etc.
            $table->date('expected_delivery_date')->nullable();
            $table->date('actual_delivery_date')->nullable();
            $table->enum('status', ['pending', 'ordered', 'partially_received', 'received', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->json('specifications')->nullable(); // Additional item specs
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index(['purchase_order_id', 'status']);
            $table->index(['inventory_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_order_items');
    }
};
