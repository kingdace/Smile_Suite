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
        // First, check which columns exist before trying to drop them
        $columns = Schema::getColumnListing('inventory');
        
        Schema::table('inventory', function (Blueprint $table) use ($columns) {
            // Remove unnecessary product detail fields (only if they exist)
            $fieldsToRemove = [
                'sku', 'barcode', 'brand', 'model', 'size', 'color',
                'cost_price', 'selling_price', 'markup_percentage',
                'location', 'shelf', 'rack',
                'usage_count', 'last_used_at', 'last_restocked_at',
                'requires_prescription', 'is_controlled_substance',
                'reorder_point', 'reorder_quantity',
                'batch_number', 'lot_number',
                'specifications', 'warnings', 'instructions'
            ];
            
            $existingFields = array_intersect($fieldsToRemove, $columns);
            
            if (!empty($existingFields)) {
                $table->dropColumn($existingFields);
            }
        });

        // Drop indexes safely using raw SQL
        $this->dropIndexIfExists('inventory', 'inventory_clinic_id_category_index');
        $this->dropIndexIfExists('inventory', 'inventory_clinic_id_is_active_index');
        $this->dropIndexIfExists('inventory', 'inventory_clinic_id_expiry_date_index');
        $this->dropIndexIfExists('inventory', 'inventory_clinic_id_quantity_index');
        $this->dropIndexIfExists('inventory', 'inventory_sku_index');
        $this->dropIndexIfExists('inventory', 'inventory_barcode_index');

        // Add new simplified indexes
        Schema::table('inventory', function (Blueprint $table) {
            // Essential indexes for performance (with unique names)
            if (!$this->indexExists('inventory', 'idx_clinic_category')) {
                $table->index(['clinic_id', 'category'], 'idx_clinic_category');
            }
            
            if (!$this->indexExists('inventory', 'idx_clinic_active')) {
                $table->index(['clinic_id', 'is_active'], 'idx_clinic_active');
            }
            
            if (!$this->indexExists('inventory', 'idx_clinic_stock_levels')) {
                $table->index(['clinic_id', 'quantity', 'minimum_quantity'], 'idx_clinic_stock_levels');
            }
            
            if (!$this->indexExists('inventory', 'idx_expiry_date')) {
                $table->index(['expiry_date'], 'idx_expiry_date');
            }
        });
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
