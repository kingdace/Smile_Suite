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
        'supplier_id', // Optional - can be null
        'name',
        'description',
        'quantity',
        'minimum_quantity',
        'unit_price', // In Philippine Peso (₱)
        'category',
        'expiry_date',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'minimum_quantity' => 'integer',
        'unit_price' => 'decimal:2', // Philippine Peso format
        'is_active' => 'boolean',
        'expiry_date' => 'date',
    ];

    // Simplified Categories for Clinic Inventory
    const CATEGORY_MEDICATIONS = 'medications';
    const CATEGORY_SUPPLIES = 'supplies';
    const CATEGORY_EQUIPMENT = 'equipment';
    const CATEGORY_OTHERS = 'others';

    /**
     * Get available categories
     */
    public static function getCategories(): array
    {
        return [
            self::CATEGORY_MEDICATIONS => 'Medications',
            self::CATEGORY_SUPPLIES => 'Supplies',
            self::CATEGORY_EQUIPMENT => 'Equipment',
            self::CATEGORY_OTHERS => 'Others',
        ];
    }

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

    public function treatmentItems(): HasMany
    {
        return $this->hasMany(TreatmentInventoryItem::class);
    }

    /**
     * Get category label
     */
    public function getCategoryLabelAttribute(): string
    {
        return match($this->category) {
            self::CATEGORY_MEDICATIONS => 'Medications',
            self::CATEGORY_SUPPLIES => 'Supplies',
            self::CATEGORY_EQUIPMENT => 'Equipment',
            self::CATEGORY_OTHERS => 'Others',
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
     * Check if item needs reordering (same as low stock for simplified version)
     */
    public function needsReorder(): bool
    {
        return $this->isLowStock();
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
     * Get formatted total value in Philippine Peso
     */
    public function getFormattedTotalValueAttribute(): string
    {
        return '₱' . number_format($this->total_value, 2);
    }

    /**
     * Get formatted unit price in Philippine Peso
     */
    public function getFormattedUnitPriceAttribute(): string
    {
        return '₱' . number_format($this->unit_price, 2);
    }

    /**
     * Helper method to format any amount in PHP currency
     */
    public static function formatPhpCurrency(float $amount): string
    {
        return '₱' . number_format($amount, 2);
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
     * Scope for items needing reorder (same as low stock)
     */
    public function scopeNeedsReorder($query)
    {
        return $query->whereRaw('quantity <= minimum_quantity');
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

    // Treatment integration methods
    public function canDeduct($quantity)
    {
        return $this->quantity >= $quantity && $this->is_active;
    }

    public function getUsageCountAttribute()
    {
        return $this->treatmentItems()->sum('quantity_used');
    }

    public function getTotalUsageValueAttribute()
    {
        return $this->treatmentItems()->sum('total_cost');
    }

    public function getFormattedTotalUsageValueAttribute()
    {
        return '₱' . number_format($this->total_usage_value, 2);
    }

    public function getTreatmentsCountAttribute()
    {
        return $this->treatmentItems()->distinct('treatment_id')->count();
    }
}
