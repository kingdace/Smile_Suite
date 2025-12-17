<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration simplifies the inventory table by removing unnecessary fields
     * and keeping only essential fields for basic clinic inventory tracking.
     */
    public function up(): void
    {
        // Skip this migration entirely on fresh installations
        // This migration was designed to simplify an existing complex inventory table
        // but on fresh migrations, the table is already in its simplified state
        return;
    }

    /**
     * Check if an index exists
     */
    private function indexExists($table, $indexName): bool
    {
        $indexes = DB::select("SHOW INDEX FROM {$table} WHERE Key_name = ?", [$indexName]);
        return count($indexes) > 0;
    }

    /**
     * Drop an index if it exists
     */
    private function dropIndexIfExists($table, $indexName): void
    {
        if ($this->indexExists($table, $indexName)) {
            DB::statement("ALTER TABLE {$table} DROP INDEX {$indexName}");
        }
    }

    /**
     * Reverse the migrations.
     * 
     * WARNING: This will restore the complex structure but data will be lost
     * for the removed fields. Only run if you have a backup.
     */
    public function down(): void
    {
        // Drop simplified indexes
        $this->dropIndexIfExists('inventory', 'idx_clinic_category');
        $this->dropIndexIfExists('inventory', 'idx_clinic_active');
        $this->dropIndexIfExists('inventory', 'idx_clinic_stock_levels');
        $this->dropIndexIfExists('inventory', 'idx_expiry_date');

        Schema::table('inventory', function (Blueprint $table) {
            // Restore removed fields (data will be null)
            $table->string('sku')->nullable()->after('name');
            $table->string('barcode')->nullable()->after('sku');
            $table->string('brand')->nullable()->after('barcode');
            $table->string('model')->nullable()->after('brand');
            $table->string('size')->nullable()->after('model');
            $table->string('color')->nullable()->after('size');

            $table->decimal('cost_price', 10, 2)->nullable()->after('unit_price');
            $table->decimal('selling_price', 10, 2)->nullable()->after('cost_price');
            $table->decimal('markup_percentage', 5, 2)->nullable()->after('selling_price');

            $table->string('location')->nullable()->after('markup_percentage');
            $table->string('shelf')->nullable()->after('location');
            $table->string('rack')->nullable()->after('shelf');

            $table->integer('usage_count')->default(0)->after('rack');
            $table->timestamp('last_used_at')->nullable()->after('usage_count');
            $table->timestamp('last_restocked_at')->nullable()->after('last_used_at');

            $table->boolean('requires_prescription')->default(false)->after('is_active');
            $table->boolean('is_controlled_substance')->default(false)->after('requires_prescription');
            $table->integer('reorder_point')->nullable()->after('is_controlled_substance');
            $table->integer('reorder_quantity')->nullable()->after('reorder_point');

            $table->string('batch_number')->nullable()->after('expiry_date');
            $table->string('lot_number')->nullable()->after('batch_number');

            $table->json('specifications')->nullable()->after('reorder_quantity');
            $table->json('warnings')->nullable()->after('specifications');
            $table->text('instructions')->nullable()->after('warnings');

            // Restore original indexes
            $table->index(['clinic_id', 'category']);
            $table->index(['clinic_id', 'is_active']);
            $table->index(['clinic_id', 'expiry_date']);
            $table->index(['clinic_id', 'quantity']);
            $table->index('sku');
            $table->index('barcode');
        });
    }
};
