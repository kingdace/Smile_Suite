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
        Schema::table('inventory', function (Blueprint $table) {
            // Advanced tracking fields
            $table->string('sku')->nullable()->after('name'); // Stock Keeping Unit
            $table->string('barcode')->nullable()->after('sku'); // Barcode for scanning
            $table->string('brand')->nullable()->after('barcode'); // Brand/manufacturer
            $table->string('model')->nullable()->after('brand'); // Model number
            $table->string('size')->nullable()->after('model'); // Size/variant
            $table->string('color')->nullable()->after('size'); // Color option

            // Expiry and batch tracking
            $table->date('expiry_date')->nullable()->after('notes');
            $table->string('batch_number')->nullable()->after('expiry_date');
            $table->string('lot_number')->nullable()->after('batch_number');

            // Cost and pricing
            $table->decimal('cost_price', 10, 2)->nullable()->after('unit_price'); // Actual cost
            $table->decimal('selling_price', 10, 2)->nullable()->after('cost_price'); // Selling price
            $table->decimal('markup_percentage', 5, 2)->nullable()->after('selling_price'); // Markup %

            // Location and storage
            $table->string('location')->nullable()->after('markup_percentage'); // Storage location
            $table->string('shelf')->nullable()->after('location'); // Shelf/bin number
            $table->string('rack')->nullable()->after('shelf'); // Rack number

            // Usage tracking
            $table->integer('usage_count')->default(0)->after('rack'); // Times used in treatments
            $table->timestamp('last_used_at')->nullable()->after('usage_count');
            $table->timestamp('last_restocked_at')->nullable()->after('last_used_at');

            // Status and alerts
            $table->boolean('is_active')->default(true)->after('last_restocked_at');
            $table->boolean('requires_prescription')->default(false)->after('is_active');
            $table->boolean('is_controlled_substance')->default(false)->after('requires_prescription');
            $table->integer('reorder_point')->nullable()->after('is_controlled_substance'); // When to reorder
            $table->integer('reorder_quantity')->nullable()->after('reorder_point'); // How much to reorder

            // Additional metadata
            $table->json('specifications')->nullable()->after('reorder_quantity'); // Technical specs
            $table->json('warnings')->nullable()->after('specifications'); // Safety warnings
            $table->text('instructions')->nullable()->after('warnings'); // Usage instructions

            // Indexes for performance
            $table->index(['clinic_id', 'category']);
            $table->index(['clinic_id', 'is_active']);
            $table->index(['clinic_id', 'expiry_date']);
            $table->index(['clinic_id', 'quantity']);
            $table->index('sku');
            $table->index('barcode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex(['clinic_id', 'category']);
            $table->dropIndex(['clinic_id', 'is_active']);
            $table->dropIndex(['clinic_id', 'expiry_date']);
            $table->dropIndex(['clinic_id', 'quantity']);
            $table->dropIndex('sku');
            $table->dropIndex('barcode');

            // Drop columns
            $table->dropColumn([
                'sku', 'barcode', 'brand', 'model', 'size', 'color',
                'expiry_date', 'batch_number', 'lot_number',
                'cost_price', 'selling_price', 'markup_percentage',
                'location', 'shelf', 'rack',
                'usage_count', 'last_used_at', 'last_restocked_at',
                'is_active', 'requires_prescription', 'is_controlled_substance',
                'reorder_point', 'reorder_quantity',
                'specifications', 'warnings', 'instructions'
            ]);
        });
    }
};
