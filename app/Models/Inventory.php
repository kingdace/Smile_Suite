<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventory extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'inventory';

    protected $fillable = [
        'clinic_id',
        'supplier_id',
        'name',
        'sku',
        'barcode',
        'brand',
        'model',
        'size',
        'color',
        'description',
        'quantity',
        'minimum_quantity',
        'unit_price',
        'cost_price',
        'selling_price',
        'markup_percentage',
        'category',
        'location',
        'shelf',
        'rack',
        'usage_count',
        'last_used_at',
        'last_restocked_at',
        'is_active',
        'requires_prescription',
        'is_controlled_substance',
        'reorder_point',
        'reorder_quantity',
        'expiry_date',
        'batch_number',
        'lot_number',
        'specifications',
        'warnings',
        'instructions',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'minimum_quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'markup_percentage' => 'decimal:2',
        'usage_count' => 'integer',
        'reorder_point' => 'integer',
        'reorder_quantity' => 'integer',
        'is_active' => 'boolean',
        'requires_prescription' => 'boolean',
        'is_controlled_substance' => 'boolean',
        'expiry_date' => 'date',
        'last_used_at' => 'datetime',
        'last_restocked_at' => 'datetime',
        'specifications' => 'array',
        'warnings' => 'array',
    ];

    // Categories
    const CATEGORY_DENTAL_SUPPLIES = 'dental_supplies';
    const CATEGORY_EQUIPMENT = 'equipment';
    const CATEGORY_MEDICATIONS = 'medications';
    const CATEGORY_LABORATORY = 'laboratory';
    const CATEGORY_OFFICE_SUPPLIES = 'office_supplies';
    const CATEGORY_OTHER = 'other';

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    public function purchaseOrderItems(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    /**
     * Get the category label
     */
    public function getCategoryLabelAttribute(): string
    {
        return match($this->category) {
            self::CATEGORY_DENTAL_SUPPLIES => 'Dental Supplies',
            self::CATEGORY_EQUIPMENT => 'Equipment',
            self::CATEGORY_MEDICATIONS => 'Medications',
            self::CATEGORY_LABORATORY => 'Laboratory',
            self::CATEGORY_OFFICE_SUPPLIES => 'Office Supplies',
            self::CATEGORY_OTHER => 'Other',
            default => ucfirst(str_replace('_', ' ', $this->category)),
        };
    }

    /**
     * Check if item is low stock
     */
    public function isLowStock(): bool
    {
        return $this->quantity <= $this->minimum_quantity;
    }

    /**
     * Check if item is out of stock
     */
    public function isOutOfStock(): bool
    {
        return $this->quantity <= 0;
    }

    /**
     * Check if item needs reordering
     */
    public function needsReorder(): bool
    {
        return $this->reorder_point && $this->quantity <= $this->reorder_point;
    }

    /**
     * Check if item is expired
     */
    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    /**
     * Check if item is expiring soon (within 30 days)
     */
    public function isExpiringSoon(): bool
    {
        return $this->expiry_date && $this->expiry_date->diffInDays(now()) <= 30;
    }

    /**
     * Get total value of current stock
     */
    public function getTotalValueAttribute(): float
    {
        return $this->quantity * $this->unit_price;
    }

    /**
     * Get formatted total value
     */
    public function getFormattedTotalValueAttribute(): string
    {
        return '$' . number_format($this->total_value, 2);
    }

    /**
     * Get formatted unit price
     */
    public function getFormattedUnitPriceAttribute(): string
    {
        return '$' . number_format($this->unit_price, 2);
    }

    /**
     * Get formatted cost price
     */
    public function getFormattedCostPriceAttribute(): string
    {
        return $this->cost_price ? '$' . number_format($this->cost_price, 2) : 'N/A';
    }

    /**
     * Get formatted selling price
     */
    public function getFormattedSellingPriceAttribute(): string
    {
        return $this->selling_price ? '$' . number_format($this->selling_price, 2) : 'N/A';
    }

    /**
     * Get stock status color
     */
    public function getStockStatusColorAttribute(): string
    {
        if ($this->isOutOfStock()) {
            return 'red';
        } elseif ($this->isLowStock()) {
            return 'yellow';
        } else {
            return 'green';
        }
    }

    /**
     * Get stock status label
     */
    public function getStockStatusLabelAttribute(): string
    {
        if ($this->isOutOfStock()) {
            return 'Out of Stock';
        } elseif ($this->isLowStock()) {
            return 'Low Stock';
        } else {
            return 'In Stock';
        }
    }

    /**
     * Get expiry status color
     */
    public function getExpiryStatusColorAttribute(): string
    {
        if ($this->isExpired()) {
            return 'red';
        } elseif ($this->isExpiringSoon()) {
            return 'yellow';
        } else {
            return 'green';
        }
    }

    /**
     * Get expiry status label
     */
    public function getExpiryStatusLabelAttribute(): string
    {
        if ($this->isExpired()) {
            return 'Expired';
        } elseif ($this->isExpiringSoon()) {
            return 'Expiring Soon';
        } else {
            return 'Valid';
        }
    }

    /**
     * Scope for active items
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for low stock items
     */
    public function scopeLowStock($query)
    {
        return $query->whereRaw('quantity <= minimum_quantity');
    }

    /**
     * Scope for out of stock items
     */
    public function scopeOutOfStock($query)
    {
        return $query->where('quantity', '<=', 0);
    }

    /**
     * Scope for items needing reorder
     */
    public function scopeNeedsReorder($query)
    {
        return $query->whereRaw('quantity <= reorder_point');
    }

    /**
     * Scope for expired items
     */
    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now());
    }

    /**
     * Scope for expiring soon items
     */
    public function scopeExpiringSoon($query)
    {
        return $query->where('expiry_date', '<=', now()->addDays(30))
                    ->where('expiry_date', '>', now());
    }

    /**
     * Scope for category
     */
    public function scopeInCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope for supplier
     */
    public function scopeFromSupplier($query, $supplierId)
    {
        return $query->where('supplier_id', $supplierId);
    }

    /**
     * Get route key name
     */
    public function getRouteKeyName()
    {
        return 'id';
    }
}
