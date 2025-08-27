<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryTransaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'clinic_id',
        'inventory_id',
        'user_id',
        'type',
        'quantity',
        'quantity_before',
        'quantity_after',
        'unit_cost',
        'total_cost',
        'reference_number',
        'reference_type',
        'notes',
        'metadata',
        'transaction_date',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'quantity_before' => 'integer',
        'quantity_after' => 'integer',
        'unit_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'metadata' => 'array',
        'transaction_date' => 'datetime',
    ];

    // Transaction types
    const TYPE_IN = 'in';
    const TYPE_OUT = 'out';
    const TYPE_ADJUSTMENT = 'adjustment';
    const TYPE_TRANSFER = 'transfer';
    const TYPE_DAMAGED = 'damaged';
    const TYPE_EXPIRED = 'expired';

    // Reference types
    const REFERENCE_PURCHASE_ORDER = 'purchase_order';
    const REFERENCE_TREATMENT = 'treatment';
    const REFERENCE_ADJUSTMENT = 'adjustment';
    const REFERENCE_TRANSFER = 'transfer';

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the transaction type label
     */
    public function getTypeLabelAttribute(): string
    {
        return match($this->type) {
            self::TYPE_IN => 'Stock In',
            self::TYPE_OUT => 'Stock Out',
            self::TYPE_ADJUSTMENT => 'Adjustment',
            self::TYPE_TRANSFER => 'Transfer',
            self::TYPE_DAMAGED => 'Damaged',
            self::TYPE_EXPIRED => 'Expired',
            default => ucfirst($this->type),
        };
    }

    /**
     * Get the transaction type color for UI
     */
    public function getTypeColorAttribute(): string
    {
        return match($this->type) {
            self::TYPE_IN => 'green',
            self::TYPE_OUT => 'red',
            self::TYPE_ADJUSTMENT => 'blue',
            self::TYPE_TRANSFER => 'purple',
            self::TYPE_DAMAGED => 'orange',
            self::TYPE_EXPIRED => 'gray',
            default => 'gray',
        };
    }

    /**
     * Scope for clinic transactions
     */
    public function scopeForClinic($query, $clinicId)
    {
        return $query->where('clinic_id', $clinicId);
    }

    /**
     * Scope for inventory item transactions
     */
    public function scopeForInventory($query, $inventoryId)
    {
        return $query->where('inventory_id', $inventoryId);
    }

    /**
     * Scope for transaction type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for date range
     */
    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('transaction_date', [$startDate, $endDate]);
    }

    /**
     * Get formatted transaction date
     */
    public function getFormattedTransactionDateAttribute(): string
    {
        return $this->transaction_date->format('M d, Y g:i A');
    }

    /**
     * Get formatted quantity change
     */
    public function getQuantityChangeAttribute(): string
    {
        $change = $this->quantity_after - $this->quantity_before;
        return $change > 0 ? "+{$change}" : "{$change}";
    }

    /**
     * Check if transaction is positive (stock in)
     */
    public function isPositive(): bool
    {
        return in_array($this->type, [self::TYPE_IN, self::TYPE_ADJUSTMENT]);
    }

    /**
     * Check if transaction is negative (stock out)
     */
    public function isNegative(): bool
    {
        return in_array($this->type, [self::TYPE_OUT, self::TYPE_DAMAGED, self::TYPE_EXPIRED]);
    }
}
