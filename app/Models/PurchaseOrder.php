<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseOrder extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'clinic_id',
        'supplier_id',
        'created_by',
        'po_number',
        'status',
        'order_date',
        'expected_delivery_date',
        'actual_delivery_date',
        'subtotal',
        'tax_amount',
        'shipping_amount',
        'total_amount',
        'notes',
        'delivery_notes',
        'payment_terms',
        'approved_at',
        'approved_by',
        'ordered_at',
        'received_at',
    ];

    protected $casts = [
        'order_date' => 'date',
        'expected_delivery_date' => 'date',
        'actual_delivery_date' => 'date',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'payment_terms' => 'array',
        'approved_at' => 'datetime',
        'ordered_at' => 'datetime',
        'received_at' => 'datetime',
    ];

    // Purchase order statuses
    const STATUS_DRAFT = 'draft';
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_ORDERED = 'ordered';
    const STATUS_RECEIVED = 'received';
    const STATUS_CANCELLED = 'cancelled';

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    /**
     * Get the status label
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            self::STATUS_DRAFT => 'Draft',
            self::STATUS_PENDING => 'Pending Approval',
            self::STATUS_APPROVED => 'Approved',
            self::STATUS_ORDERED => 'Ordered',
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
            self::STATUS_DRAFT => 'gray',
            self::STATUS_PENDING => 'yellow',
            self::STATUS_APPROVED => 'blue',
            self::STATUS_ORDERED => 'purple',
            self::STATUS_RECEIVED => 'green',
            self::STATUS_CANCELLED => 'red',
            default => 'gray',
        };
    }

    /**
     * Check if PO can be approved
     */
    public function canBeApproved(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if PO can be ordered
     */
    public function canBeOrdered(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    /**
     * Check if PO can be received
     */
    public function canBeReceived(): bool
    {
        return $this->status === self::STATUS_ORDERED;
    }

    /**
     * Check if PO can be cancelled
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_PENDING, self::STATUS_APPROVED]);
    }

    /**
     * Get total items count
     */
    public function getTotalItemsAttribute(): int
    {
        return $this->items->sum('quantity_ordered');
    }

    /**
     * Get received items count
     */
    public function getReceivedItemsAttribute(): int
    {
        return $this->items->sum('quantity_received');
    }

    /**
     * Get completion percentage
     */
    public function getCompletionPercentageAttribute(): float
    {
        if ($this->total_items === 0) {
            return 0;
        }
        return round(($this->received_items / $this->total_items) * 100, 2);
    }

    /**
     * Scope for clinic purchase orders
     */
    public function scopeForClinic($query, $clinicId)
    {
        return $query->where('clinic_id', $clinicId);
    }

    /**
     * Scope for supplier purchase orders
     */
    public function scopeForSupplier($query, $supplierId)
    {
        return $query->where('supplier_id', $supplierId);
    }

    /**
     * Scope for status
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for date range
     */
    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('order_date', [$startDate, $endDate]);
    }

    /**
     * Generate PO number
     */
    public static function generatePoNumber($clinicId): string
    {
        $prefix = 'PO';
        $year = date('Y');
        $month = date('m');

        $lastPo = self::where('clinic_id', $clinicId)
            ->where('po_number', 'like', "{$prefix}{$year}{$month}%")
            ->orderBy('po_number', 'desc')
            ->first();

        if ($lastPo) {
            $lastNumber = (int) substr($lastPo->po_number, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return sprintf('%s%s%s%04d', $prefix, $year, $month, $newNumber);
    }

    /**
     * Boot method to auto-generate PO number
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($purchaseOrder) {
            if (empty($purchaseOrder->po_number)) {
                $purchaseOrder->po_number = self::generatePoNumber($purchaseOrder->clinic_id);
            }
        });
    }
}
