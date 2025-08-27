<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'clinic_id',
        'name',
        'contact_person',
        'email',
        'phone',
        'address',
        'tax_id',
        'payment_terms',
        'notes',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function inventory(): HasMany
    {
        return $this->hasMany(Inventory::class);
    }

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    /**
     * Get total items from this supplier
     */
    public function getTotalItemsAttribute(): int
    {
        return $this->inventory()->count();
    }

    /**
     * Get total purchase orders from this supplier
     */
    public function getTotalPurchaseOrdersAttribute(): int
    {
        return $this->purchaseOrders()->count();
    }

    /**
     * Get active purchase orders from this supplier
     */
    public function getActivePurchaseOrdersAttribute(): int
    {
        return $this->purchaseOrders()
            ->whereIn('status', [PurchaseOrder::STATUS_PENDING, PurchaseOrder::STATUS_APPROVED, PurchaseOrder::STATUS_ORDERED])
            ->count();
    }

    /**
     * Get total value of purchases from this supplier
     */
    public function getTotalPurchaseValueAttribute(): float
    {
        return $this->purchaseOrders()
            ->where('status', PurchaseOrder::STATUS_RECEIVED)
            ->sum('total_amount');
    }

    /**
     * Get formatted total purchase value
     */
    public function getFormattedTotalPurchaseValueAttribute(): string
    {
        return '$' . number_format($this->total_purchase_value, 2);
    }

    /**
     * Get average delivery time in days
     */
    public function getAverageDeliveryTimeAttribute(): ?float
    {
        $orders = $this->purchaseOrders()
            ->whereNotNull('actual_delivery_date')
            ->whereNotNull('ordered_at')
            ->get();

        if ($orders->isEmpty()) {
            return null;
        }

        $totalDays = $orders->sum(function ($order) {
            return $order->ordered_at->diffInDays($order->actual_delivery_date);
        });

        return round($totalDays / $orders->count(), 1);
    }

    /**
     * Check if supplier has active orders
     */
    public function hasActiveOrders(): bool
    {
        return $this->active_purchase_orders > 0;
    }

    /**
     * Scope for suppliers with active orders
     */
    public function scopeWithActiveOrders($query)
    {
        return $query->whereHas('purchaseOrders', function ($q) {
            $q->whereIn('status', [PurchaseOrder::STATUS_PENDING, PurchaseOrder::STATUS_APPROVED, PurchaseOrder::STATUS_ORDERED]);
        });
    }

    /**
     * Scope for suppliers with inventory
     */
    public function scopeWithInventory($query)
    {
        return $query->whereHas('inventory');
    }

    /**
     * Get route key name
     */
    public function getRouteKeyName()
    {
        return 'id';
    }
}
