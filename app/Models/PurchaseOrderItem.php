<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseOrderItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'purchase_order_id',
        'inventory_id',
        'item_name',
        'item_description',
        'sku',
        'brand',
        'model',
        'quantity_ordered',
        'quantity_received',
        'unit_cost',
        'total_cost',
        'unit_of_measure',
        'expected_delivery_date',
        'actual_delivery_date',
        'status',
        'notes',
        'specifications',
    ];

    protected $casts = [
        'quantity_ordered' => 'integer',
        'quantity_received' => 'integer',
        'unit_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'expected_delivery_date' => 'date',
        'actual_delivery_date' => 'date',
        'specifications' => 'array',
    ];

    // Item statuses
    const STATUS_PENDING = 'pending';
    const STATUS_ORDERED = 'ordered';
    const STATUS_PARTIALLY_RECEIVED = 'partially_received';
    const STATUS_RECEIVED = 'received';
    const STATUS_CANCELLED = 'cancelled';

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }

    /**
     * Get the status label
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            self::STATUS_PENDING => 'Pending',
            self::STATUS_ORDERED => 'Ordered',
            self::STATUS_PARTIALLY_RECEIVED => 'Partially Received',
            self::STATUS_RECEIVED => 'Received',
            self::STATUS_CANCELLED => 'Cancelled',
            default => ucfirst($this->status),
        };
    }

    /**
     * Get the status color for UI
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            self::STATUS_PENDING => 'gray',
            self::STATUS_ORDERED => 'blue',
            self::STATUS_PARTIALLY_RECEIVED => 'yellow',
            self::STATUS_RECEIVED => 'green',
            self::STATUS_CANCELLED => 'red',
            default => 'gray',
        };
    }

    /**
     * Get remaining quantity to receive
     */
    public function getRemainingQuantityAttribute(): int
    {
        return $this->quantity_ordered - $this->quantity_received;
    }

    /**
     * Check if item is fully received
     */
    public function isFullyReceived(): bool
    {
        return $this->quantity_received >= $this->quantity_ordered;
    }

    /**
     * Check if item is partially received
     */
    public function isPartiallyReceived(): bool
    {
        return $this->quantity_received > 0 && $this->quantity_received < $this->quantity_ordered;
    }

    /**
     * Check if item can be received
     */
    public function canBeReceived(): bool
    {
        return in_array($this->status, [self::STATUS_ORDERED, self::STATUS_PARTIALLY_RECEIVED]);
    }

    /**
     * Get completion percentage
     */
    public function getCompletionPercentageAttribute(): float
    {
        if ($this->quantity_ordered === 0) {
            return 0;
        }
        return round(($this->quantity_received / $this->quantity_ordered) * 100, 2);
    }

    /**
     * Get formatted unit cost
     */
    public function getFormattedUnitCostAttribute(): string
    {
        return '$' . number_format($this->unit_cost, 2);
    }

    /**
     * Get formatted total cost
     */
    public function getFormattedTotalCostAttribute(): string
    {
        return '$' . number_format($this->total_cost, 2);
    }

    /**
     * Scope for status
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for inventory item
     */
    public function scopeForInventory($query, $inventoryId)
    {
        return $query->where('inventory_id', $inventoryId);
    }

    /**
     * Boot method to calculate total cost
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($item) {
            if (isset($item->quantity_ordered) && isset($item->unit_cost)) {
                $item->total_cost = $item->quantity_ordered * $item->unit_cost;
            }
        });
    }
}
