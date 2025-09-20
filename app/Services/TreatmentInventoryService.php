<?php

namespace App\Services;

use App\Models\Treatment;
use App\Models\Inventory;
use App\Models\TreatmentInventoryItem;
use App\Models\InventoryTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class TreatmentInventoryService
{
    /**
     * Deduct inventory items for a completed treatment.
     *
     * @param Treatment $treatment
     * @param array $inventoryItems
     * @return void
     * @throws InsufficientStockException
     * @throws Exception
     */
    public function deductInventory(Treatment $treatment, array $inventoryItems): void
    {
        // Validate treatment can have inventory deducted
        if (!$treatment->canDeductInventory()) {
            throw new Exception('Treatment cannot have inventory deducted. Treatment must be completed and not already have inventory deducted.');
        }

        // Validate inventory items
        $this->validateInventoryItems($inventoryItems);

        DB::transaction(function () use ($treatment, $inventoryItems) {
            foreach ($inventoryItems as $item) {
                $inventory = Inventory::findOrFail($item['inventory_id']);

                // Validate stock availability
                if (!$inventory->canDeduct($item['quantity_used'])) {
                    throw new InsufficientStockException(
                        "Insufficient stock for {$inventory->name}. Available: {$inventory->quantity}, Required: {$item['quantity_used']}"
                    );
                }

                // Create treatment inventory record
                TreatmentInventoryItem::create([
                    'treatment_id' => $treatment->id,
                    'inventory_id' => $inventory->id,
                    'quantity_used' => $item['quantity_used'],
                    'unit_cost' => $inventory->unit_price,
                    'total_cost' => $inventory->unit_price * $item['quantity_used'],
                    'notes' => $item['notes'] ?? null,
                ]);

                // Deduct from inventory
                $inventory->decrement('quantity', $item['quantity_used']);

                // Create transaction record for audit trail
                InventoryTransaction::create([
                    'clinic_id' => $treatment->clinic_id,
                    'inventory_id' => $inventory->id,
                    'user_id' => $treatment->user_id,
                    'type' => InventoryTransaction::TYPE_OUT,
                    'quantity' => $item['quantity_used'],
                    'quantity_before' => $inventory->quantity + $item['quantity_used'],
                    'quantity_after' => $inventory->quantity,
                    'unit_cost' => $inventory->unit_price,
                    'total_cost' => $inventory->unit_price * $item['quantity_used'],
                    'reference_type' => InventoryTransaction::REFERENCE_TREATMENT,
                    'reference_number' => $treatment->id,
                    'notes' => "Used in treatment: {$treatment->name} (Patient: {$treatment->patient->full_name})",
                    'transaction_date' => now(),
                ]);
            }

            // Mark treatment as inventory deducted
            $treatment->update([
                'inventory_deducted' => true,
                'inventory_deducted_at' => now(),
            ]);

            Log::info('Inventory deducted for treatment', [
                'treatment_id' => $treatment->id,
                'items_count' => count($inventoryItems),
                'user_id' => $treatment->user_id,
            ]);
        });
    }

    /**
     * Update inventory deduction for a treatment with smart adjustment.
     * This calculates the difference between old and new quantities.
     *
     * @param Treatment $treatment
     * @param array $newInventoryItems
     * @return void
     * @throws Exception
     */
    public function updateInventoryDeduction(Treatment $treatment, array $newInventoryItems): void
    {
        if (!$treatment->hasInventoryDeduction()) {
            // If no previous deduction, just deduct normally
            $this->deductInventory($treatment, $newInventoryItems);
            return;
        }

        // Validate inventory adjustment before making changes
        $this->validateInventoryAdjustment($treatment, $newInventoryItems);

        DB::transaction(function () use ($treatment, $newInventoryItems) {
            $existingItems = $treatment->inventoryItems()->get()->keyBy('inventory_id');

            foreach ($newInventoryItems as $newItem) {
                $inventoryId = $newItem['inventory_id'];
                $newQuantity = $newItem['quantity_used'];

                // Check if this inventory item was previously used
                if ($existingItems->has($inventoryId)) {
                    $existingItem = $existingItems->get($inventoryId);
                    $oldQuantity = $existingItem->quantity_used;
                    $quantityDifference = $newQuantity - $oldQuantity;

                    if ($quantityDifference > 0) {
                        // Need to deduct more
                        $this->adjustInventoryQuantity($treatment, $inventoryId, $quantityDifference, 'out', $newItem['notes'] ?? null);
                    } elseif ($quantityDifference < 0) {
                        // Need to restore some
                        $this->adjustInventoryQuantity($treatment, $inventoryId, abs($quantityDifference), 'in', $newItem['notes'] ?? null);
                    }
                    // If quantityDifference == 0, no change needed

                    // Update the treatment inventory item record
                    $existingItem->update([
                        'quantity_used' => $newQuantity,
                        'unit_cost' => $existingItem->inventory->unit_price,
                        'total_cost' => $existingItem->inventory->unit_price * $newQuantity,
                        'notes' => $newItem['notes'] ?? null,
                    ]);
                } else {
                    // New inventory item - deduct normally
                    $this->adjustInventoryQuantity($treatment, $inventoryId, $newQuantity, 'out', $newItem['notes'] ?? null);

                    // Create new treatment inventory item record
                    TreatmentInventoryItem::create([
                        'treatment_id' => $treatment->id,
                        'inventory_id' => $inventoryId,
                        'quantity_used' => $newQuantity,
                        'unit_cost' => Inventory::find($inventoryId)->unit_price,
                        'total_cost' => Inventory::find($inventoryId)->unit_price * $newQuantity,
                        'notes' => $newItem['notes'] ?? null,
                    ]);
                }
            }

            // Handle removed items (items that were in old list but not in new list)
            $newInventoryIds = collect($newInventoryItems)->pluck('inventory_id')->toArray();
            $removedItems = $existingItems->whereNotIn('inventory_id', $newInventoryIds);

            foreach ($removedItems as $removedItem) {
                // Restore the full quantity for removed items
                $this->adjustInventoryQuantity($treatment, $removedItem->inventory_id, $removedItem->quantity_used, 'in', 'Item removed from treatment');

                // Delete the treatment inventory item record
                $removedItem->delete();
            }
        });
    }

    /**
     * Validate inventory adjustment with smart stock checking.
     * This considers the net difference rather than absolute quantities.
     *
     * @param Treatment $treatment
     * @param array $newInventoryItems
     * @return void
     * @throws InsufficientStockException
     */
    public function validateInventoryAdjustment(Treatment $treatment, array $newInventoryItems): void
    {
        $existingItems = $treatment->inventoryItems()->get()->keyBy('inventory_id');

        foreach ($newInventoryItems as $newItem) {
            $inventoryId = $newItem['inventory_id'];
            $newQuantity = $newItem['quantity_used'];
            $inventory = Inventory::findOrFail($inventoryId);

            if ($existingItems->has($inventoryId)) {
                // Existing item - check net difference
                $existingItem = $existingItems->get($inventoryId);
                $oldQuantity = $existingItem->quantity_used;
                $quantityDifference = $newQuantity - $oldQuantity;

                if ($quantityDifference > 0) {
                    // Need to deduct more - check if we have enough stock
                    if (!$inventory->canDeduct($quantityDifference)) {
                        throw new InsufficientStockException(
                            "Insufficient stock for {$inventory->name}. " .
                            "Available: {$inventory->quantity}, " .
                            "Additional needed: {$quantityDifference} " .
                            "(changing from {$oldQuantity} to {$newQuantity})"
                        );
                    }
                }
                // If quantityDifference <= 0, we're restoring stock, so no validation needed
            } else {
                // New item - check if we have enough stock for the full amount
                if (!$inventory->canDeduct($newQuantity)) {
                    throw new InsufficientStockException(
                        "Insufficient stock for {$inventory->name}. " .
                        "Available: {$inventory->quantity}, " .
                        "Requested: {$newQuantity}"
                    );
                }
            }
        }
    }

    /**
     * Adjust inventory quantity and create transaction record.
     *
     * @param Treatment $treatment
     * @param int $inventoryId
     * @param int $quantity
     * @param string $type 'in' or 'out'
     * @param string|null $notes
     * @return void
     * @throws InsufficientStockException
     */
    private function adjustInventoryQuantity(Treatment $treatment, int $inventoryId, int $quantity, string $type, ?string $notes = null): void
    {
        $inventory = Inventory::findOrFail($inventoryId);

        if ($type === 'out') {
            // For deductions, we already validated in validateInventoryAdjustment
            $inventory->decrement('quantity', $quantity);
            $transactionType = InventoryTransaction::TYPE_OUT;
        } else {
            // Restore inventory
            $inventory->increment('quantity', $quantity);
            $transactionType = InventoryTransaction::TYPE_IN;
        }

        // Create transaction record
        InventoryTransaction::create([
            'clinic_id' => $treatment->clinic_id,
            'inventory_id' => $inventory->id,
            'user_id' => $treatment->user_id,
            'type' => $transactionType,
            'quantity' => $quantity,
            'quantity_before' => $type === 'out' ? $inventory->quantity + $quantity : $inventory->quantity - $quantity,
            'quantity_after' => $inventory->quantity,
            'unit_cost' => $inventory->unit_price,
            'total_cost' => $inventory->unit_price * $quantity,
            'reference_type' => InventoryTransaction::REFERENCE_TREATMENT,
            'reference_number' => $treatment->id,
            'notes' => "Treatment update: {$type} {$quantity} units" . ($notes ? " ({$notes})" : ""),
            'transaction_date' => now(),
        ]);
    }

    /**
     * Update inventory items without affecting actual stock.
     * This is used when treatment is not completed but we want to save the inventory items.
     *
     * @param Treatment $treatment
     * @param array $newInventoryItems
     * @return void
     */
    public function updateInventoryItemsOnly(Treatment $treatment, array $newInventoryItems): void
    {
        DB::transaction(function () use ($treatment, $newInventoryItems) {
            // Remove existing inventory items
            $treatment->inventoryItems()->delete();

            // Add new inventory items without deducting stock
            foreach ($newInventoryItems as $item) {
                $inventory = Inventory::findOrFail($item['inventory_id']);

                TreatmentInventoryItem::create([
                    'treatment_id' => $treatment->id,
                    'inventory_id' => $item['inventory_id'],
                    'quantity_used' => $item['quantity_used'],
                    'unit_cost' => $inventory->unit_price,
                    'total_cost' => $inventory->unit_price * $item['quantity_used'],
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            // Mark treatment as not having inventory deducted
            $treatment->update([
                'inventory_deducted' => false,
                'inventory_deducted_at' => null,
            ]);
        });
    }

    /**
     * Reverse inventory deduction for a treatment.
     * This is useful for corrections or cancellations.
     *
     * @param Treatment $treatment
     * @return void
     * @throws Exception
     */
    public function reverseInventoryDeduction(Treatment $treatment): void
    {
        if (!$treatment->hasInventoryDeduction()) {
            throw new Exception('Treatment does not have inventory deducted to reverse.');
        }

        DB::transaction(function () use ($treatment) {
            $inventoryItems = $treatment->inventoryItems;

            foreach ($inventoryItems as $item) {
                $inventory = $item->inventory;

                // Restore inventory quantity
                $inventory->increment('quantity', $item->quantity_used);

                // Create reverse transaction record
                InventoryTransaction::create([
                    'clinic_id' => $treatment->clinic_id,
                    'inventory_id' => $inventory->id,
                    'user_id' => $treatment->user_id,
                    'type' => InventoryTransaction::TYPE_IN,
                    'quantity' => $item->quantity_used,
                    'quantity_before' => $inventory->quantity - $item->quantity_used,
                    'quantity_after' => $inventory->quantity,
                    'unit_cost' => $item->unit_cost,
                    'total_cost' => $item->total_cost,
                    'reference_type' => InventoryTransaction::REFERENCE_ADJUSTMENT,
                    'reference_number' => $treatment->id,
                    'notes' => "Reversed from treatment: {$treatment->name} (Patient: {$treatment->patient->full_name})",
                    'transaction_date' => now(),
                ]);

                // Delete the treatment inventory item record
                $item->delete();
            }

            // Mark treatment as not having inventory deducted
            $treatment->update([
                'inventory_deducted' => false,
                'inventory_deducted_at' => null,
            ]);

            Log::info('Inventory deduction reversed for treatment', [
                'treatment_id' => $treatment->id,
                'items_count' => $inventoryItems->count(),
                'user_id' => $treatment->user_id,
            ]);
        });
    }

    /**
     * Get inventory usage summary for a treatment.
     *
     * @param Treatment $treatment
     * @return array
     */
    public function getTreatmentInventorySummary(Treatment $treatment): array
    {
        $inventoryItems = $treatment->inventoryItems()->with('inventory')->get();

        return [
            'total_items' => $inventoryItems->count(),
            'total_quantity_used' => $inventoryItems->sum('quantity_used'),
            'total_cost' => $inventoryItems->sum('total_cost'),
            'formatted_total_cost' => '₱' . number_format($inventoryItems->sum('total_cost'), 2),
            'items' => $inventoryItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'inventory_name' => $item->inventory->name,
                    'quantity_used' => $item->quantity_used,
                    'unit_cost' => $item->unit_cost,
                    'total_cost' => $item->total_cost,
                    'formatted_unit_cost' => $item->formatted_unit_cost,
                    'formatted_total_cost' => $item->formatted_total_cost,
                    'notes' => $item->notes,
                    'used_at' => $item->formatted_usage_date,
                ];
            }),
        ];
    }

    /**
     * Get inventory usage statistics for a clinic.
     *
     * @param int $clinicId
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function getClinicInventoryUsageStats(int $clinicId, ?string $startDate = null, ?string $endDate = null): array
    {
        $query = TreatmentInventoryItem::whereHas('treatment', function ($q) use ($clinicId) {
            $q->where('clinic_id', $clinicId);
        });

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $items = $query->with(['inventory', 'treatment'])->get();

        return [
            'total_treatments' => $items->groupBy('treatment_id')->count(),
            'total_items_used' => $items->count(),
            'total_quantity_used' => $items->sum('quantity_used'),
            'total_value' => $items->sum('total_cost'),
            'formatted_total_value' => '₱' . number_format($items->sum('total_cost'), 2),
            'top_used_items' => $items->groupBy('inventory_id')->map(function ($group) {
                $inventory = $group->first()->inventory;
                return [
                    'inventory_id' => $inventory->id,
                    'name' => $inventory->name,
                    'category' => $inventory->category,
                    'total_used' => $group->sum('quantity_used'),
                    'total_value' => $group->sum('total_cost'),
                    'treatments_count' => $group->count(),
                ];
            })->sortByDesc('total_used')->take(10)->values(),
        ];
    }

    /**
     * Validate inventory items array.
     *
     * @param array $inventoryItems
     * @return void
     * @throws Exception
     */
    private function validateInventoryItems(array $inventoryItems): void
    {
        if (empty($inventoryItems)) {
            throw new Exception('No inventory items provided.');
        }

        foreach ($inventoryItems as $item) {
            if (!isset($item['inventory_id']) || !isset($item['quantity_used'])) {
                throw new Exception('Each inventory item must have inventory_id and quantity_used.');
            }

            if (!is_numeric($item['quantity_used']) || $item['quantity_used'] <= 0) {
                throw new Exception('Quantity used must be a positive number.');
            }

            if (!Inventory::where('id', $item['inventory_id'])->exists()) {
                throw new Exception("Inventory item with ID {$item['inventory_id']} does not exist.");
            }
        }
    }
}

/**
 * Custom exception for insufficient stock scenarios.
 */
class InsufficientStockException extends Exception
{
    public function __construct($message = "Insufficient stock available")
    {
        parent::__construct($message);
    }
}
