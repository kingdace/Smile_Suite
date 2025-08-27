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
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->foreignId('inventory_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Who made the transaction
            $table->enum('type', ['in', 'out', 'adjustment', 'transfer', 'damaged', 'expired']);
            $table->integer('quantity');
            $table->integer('quantity_before');
            $table->integer('quantity_after');
            $table->decimal('unit_cost', 10, 2)->nullable(); // Cost at time of transaction
            $table->decimal('total_cost', 10, 2)->nullable();
            $table->string('reference_number')->nullable(); // PO number, treatment ID, etc.
            $table->string('reference_type')->nullable(); // 'purchase_order', 'treatment', 'adjustment'
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable(); // Additional data like expiry dates, batch numbers
            $table->timestamp('transaction_date');
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index(['clinic_id', 'inventory_id']);
            $table->index(['clinic_id', 'type']);
            $table->index(['clinic_id', 'transaction_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
    }
};
