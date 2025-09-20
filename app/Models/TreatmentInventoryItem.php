<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TreatmentInventoryItem extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'treatment_inventory_items';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'treatment_id',
        'inventory_id',
        'quantity_used',
        'unit_cost',
        'total_cost',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'quantity_used' => 'integer',
        'unit_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    /**
     * Get the treatment that owns this inventory item usage.
     */
    public function treatment(): BelongsTo
    {
        return $this->belongsTo(Treatment::class);
    }

    /**
     * Get the inventory item that was used.
     */
    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }

    /**
     * Get the clinic through the treatment relationship.
     */
    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class, 'clinic_id', 'id')
            ->through('treatment');
    }

    /**
     * Scope for items used in a specific clinic.
     */
    public function scopeForClinic($query, $clinicId)
    {
        return $query->whereHas('treatment', function ($q) use ($clinicId) {
            $q->where('clinic_id', $clinicId);
        });
    }

    /**
     * Scope for items used in a specific date range.
     */
    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Scope for items used in a specific inventory item.
     */
    public function scopeForInventory($query, $inventoryId)
    {
        return $query->where('inventory_id', $inventoryId);
    }

    /**
     * Get formatted unit cost.
     */
    public function getFormattedUnitCostAttribute(): string
    {
        return '₱' . number_format($this->unit_cost, 2);
    }

    /**
     * Get formatted total cost.
     */
    public function getFormattedTotalCostAttribute(): string
    {
        return '₱' . number_format($this->total_cost, 2);
    }

    /**
     * Get usage date formatted.
     */
    public function getFormattedUsageDateAttribute(): string
    {
        return $this->created_at->format('M d, Y g:i A');
    }
}

