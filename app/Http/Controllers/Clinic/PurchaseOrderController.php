<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Inventory;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request, Clinic $clinic)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        $query = $clinic->purchaseOrders()->with(['supplier', 'createdBy', 'approvedBy']);

        // Search functionality
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('po_number', 'like', "%{$request->search}%")
                    ->orWhere('notes', 'like', "%{$request->search}%")
                    ->orWhereHas('supplier', function ($sq) use ($request) {
                        $sq->where('name', 'like', "%{$request->search}%");
                    });
            });
        }

        // Status filter
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Supplier filter
        if ($request->supplier_id) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // Date range filter
        if ($request->date_from) {
            $query->where('order_date', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->where('order_date', '<=', $request->date_to);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'order_date');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSortFields = ['po_number', 'order_date', 'expected_delivery_date', 'total_amount', 'status', 'created_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('order_date', 'desc');
        }

        $purchaseOrders = $query->paginate(15);

        // Get summary statistics
        $summary = [
            'total_pos' => $clinic->purchaseOrders()->count(),
            'pending_pos' => $clinic->purchaseOrders()->where('status', 'pending')->count(),
            'approved_pos' => $clinic->purchaseOrders()->where('status', 'approved')->count(),
            'ordered_pos' => $clinic->purchaseOrders()->where('status', 'ordered')->count(),
            'received_pos' => $clinic->purchaseOrders()->where('status', 'received')->count(),
            'total_value' => $clinic->purchaseOrders()->sum('total_amount'),
        ];

        // Get suppliers for filter
        $suppliers = $clinic->suppliers()->select('id', 'name')->get();

        return Inertia::render('Clinic/Inventory/PurchaseOrders/Index', [
            'clinic' => $clinic,
            'purchaseOrders' => $purchaseOrders,
            'summary' => $summary,
            'suppliers' => $suppliers,
            'filters' => $request->only(['search', 'status', 'supplier_id', 'date_from', 'date_to', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(Request $request, Clinic $clinic)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        $suppliers = $clinic->suppliers()->get();
        $inventoryItems = $clinic->inventory()->where('is_active', true)->get();

        return Inertia::render('Clinic/Inventory/PurchaseOrders/Create', [
            'clinic' => $clinic,
            'suppliers' => $suppliers,
            'inventoryItems' => $inventoryItems,
        ]);
    }

    public function store(Request $request, Clinic $clinic)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'expected_delivery_date' => 'required|date|after:order_date',
            'notes' => 'nullable|string',
            'delivery_notes' => 'nullable|string',
            'payment_terms' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.inventory_id' => 'required|exists:inventory,id',
            'items.*.quantity_ordered' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
            'items.*.expected_delivery_date' => 'nullable|date',
            'items.*.notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Create purchase order
            $purchaseOrder = $clinic->purchaseOrders()->create([
                'supplier_id' => $validated['supplier_id'],
                'created_by' => $user->id,
                'po_number' => PurchaseOrder::generatePoNumber($clinic),
                'status' => 'pending',
                'order_date' => $validated['order_date'],
                'expected_delivery_date' => $validated['expected_delivery_date'],
                'notes' => $validated['notes'],
                'delivery_notes' => $validated['delivery_notes'],
                'payment_terms' => $validated['payment_terms'],
                'subtotal' => 0,
                'tax_amount' => 0,
                'shipping_amount' => 0,
                'total_amount' => 0,
            ]);

            $subtotal = 0;

            // Create purchase order items
            foreach ($validated['items'] as $item) {
                $inventory = Inventory::find($item['inventory_id']);

                $purchaseOrderItem = $purchaseOrder->items()->create([
                    'inventory_id' => $item['inventory_id'],
                    'item_name' => $inventory->name,
                    'item_description' => $inventory->description,
                    'sku' => $inventory->sku,
                    'brand' => $inventory->brand,
                    'model' => $inventory->model,
                    'quantity_ordered' => $item['quantity_ordered'],
                    'quantity_received' => 0,
                    'unit_cost' => $item['unit_cost'],
                    'total_cost' => $item['quantity_ordered'] * $item['unit_cost'],
                    'unit_of_measure' => 'units',
                    'expected_delivery_date' => $item['expected_delivery_date'] ?? $validated['expected_delivery_date'],
                    'status' => 'pending',
                    'notes' => $item['notes'],
                    'specifications' => $inventory->specifications,
                ]);

                $subtotal += $purchaseOrderItem->total_cost;
            }

            // Update purchase order totals
            $purchaseOrder->update([
                'subtotal' => $subtotal,
                'total_amount' => $subtotal, // No tax or shipping for now
            ]);

            DB::commit();

            return redirect()->route('clinic.purchase-orders.show', [$clinic->id, $purchaseOrder->id])
                ->with('success', 'Purchase order created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create purchase order: ' . $e->getMessage()]);
        }
    }

    public function show(Clinic $clinic, PurchaseOrder $purchaseOrder)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        $purchaseOrder->load(['supplier', 'createdBy', 'approvedBy', 'items.inventory']);

        return Inertia::render('Clinic/Inventory/PurchaseOrders/Show', [
            'clinic' => $clinic,
            'purchaseOrder' => $purchaseOrder,
        ]);
    }

    public function edit(Clinic $clinic, PurchaseOrder $purchaseOrder)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Only allow editing of pending purchase orders
        if ($purchaseOrder->status !== 'pending') {
            return redirect()->route('clinic.purchase-orders.show', [$clinic->id, $purchaseOrder->id])
                ->with('error', 'Only pending purchase orders can be edited.');
        }

        $purchaseOrder->load(['items.inventory']);
        $suppliers = $clinic->suppliers()->get();
        $inventoryItems = $clinic->inventory()->where('is_active', true)->get();

        return Inertia::render('Clinic/Inventory/PurchaseOrders/Edit', [
            'clinic' => $clinic,
            'purchaseOrder' => $purchaseOrder,
            'suppliers' => $suppliers,
            'inventoryItems' => $inventoryItems,
        ]);
    }

    public function update(Request $request, Clinic $clinic, PurchaseOrder $purchaseOrder)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Only allow updating of pending purchase orders
        if ($purchaseOrder->status !== 'pending') {
            return back()->withErrors(['error' => 'Only pending purchase orders can be updated.']);
        }

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'expected_delivery_date' => 'required|date|after:order_date',
            'notes' => 'nullable|string',
            'delivery_notes' => 'nullable|string',
            'payment_terms' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.inventory_id' => 'required|exists:inventory,id',
            'items.*.quantity_ordered' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
            'items.*.expected_delivery_date' => 'nullable|date',
            'items.*.notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Update purchase order
            $purchaseOrder->update([
                'supplier_id' => $validated['supplier_id'],
                'order_date' => $validated['order_date'],
                'expected_delivery_date' => $validated['expected_delivery_date'],
                'notes' => $validated['notes'],
                'delivery_notes' => $validated['delivery_notes'],
                'payment_terms' => $validated['payment_terms'],
            ]);

            // Delete existing items
            $purchaseOrder->items()->delete();

            $subtotal = 0;

            // Create new purchase order items
            foreach ($validated['items'] as $item) {
                $inventory = Inventory::find($item['inventory_id']);

                $purchaseOrderItem = $purchaseOrder->items()->create([
                    'inventory_id' => $item['inventory_id'],
                    'item_name' => $inventory->name,
                    'item_description' => $inventory->description,
                    'sku' => $inventory->sku,
                    'brand' => $inventory->brand,
                    'model' => $inventory->model,
                    'quantity_ordered' => $item['quantity_ordered'],
                    'quantity_received' => 0,
                    'unit_cost' => $item['unit_cost'],
                    'total_cost' => $item['quantity_ordered'] * $item['unit_cost'],
                    'unit_of_measure' => 'units',
                    'expected_delivery_date' => $item['expected_delivery_date'] ?? $validated['expected_delivery_date'],
                    'status' => 'pending',
                    'notes' => $item['notes'],
                    'specifications' => $inventory->specifications,
                ]);

                $subtotal += $purchaseOrderItem->total_cost;
            }

            // Update purchase order totals
            $purchaseOrder->update([
                'subtotal' => $subtotal,
                'total_amount' => $subtotal,
            ]);

            DB::commit();

            return redirect()->route('clinic.purchase-orders.show', [$clinic->id, $purchaseOrder->id])
                ->with('success', 'Purchase order updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update purchase order: ' . $e->getMessage()]);
        }
    }

    public function destroy(Clinic $clinic, PurchaseOrder $purchaseOrder)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Only allow deletion of pending purchase orders
        if ($purchaseOrder->status !== 'pending') {
            return back()->withErrors(['error' => 'Only pending purchase orders can be deleted.']);
        }

        try {
            DB::beginTransaction();

            // Delete purchase order items
            $purchaseOrder->items()->delete();

            // Delete purchase order
            $purchaseOrder->delete();

            DB::commit();

            return redirect()->route('clinic.purchase-orders.index', [$clinic->id])
                ->with('success', 'Purchase order deleted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to delete purchase order: ' . $e->getMessage()]);
        }
    }

    public function approve(Clinic $clinic, PurchaseOrder $purchaseOrder)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Only allow approval of pending purchase orders
        if ($purchaseOrder->status !== 'pending') {
            return back()->withErrors(['error' => 'Only pending purchase orders can be approved.']);
        }

        $purchaseOrder->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $user->id,
        ]);

        return back()->with('success', 'Purchase order approved successfully.');
    }

    public function markAsOrdered(Clinic $clinic, PurchaseOrder $purchaseOrder)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Only allow marking as ordered if approved
        if ($purchaseOrder->status !== 'approved') {
            return back()->withErrors(['error' => 'Only approved purchase orders can be marked as ordered.']);
        }

        $purchaseOrder->update([
            'status' => 'ordered',
            'ordered_at' => now(),
        ]);

        return back()->with('success', 'Purchase order marked as ordered successfully.');
    }

    public function receiveItem(Clinic $clinic, PurchaseOrder $purchaseOrder, PurchaseOrderItem $item, Request $request)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        $validated = $request->validate([
            'quantity_received' => 'required|integer|min:1|max:' . ($item->quantity_ordered - $item->quantity_received),
        ]);

        try {
            DB::beginTransaction();

            // Update item
            $item->update([
                'quantity_received' => $item->quantity_received + $validated['quantity_received'],
                'actual_delivery_date' => now(),
                'status' => ($item->quantity_received + $validated['quantity_received']) >= $item->quantity_ordered ? 'received' : 'partially_received',
            ]);

            // Update inventory
            $inventory = $item->inventory;
            $inventory->update([
                'quantity' => $inventory->quantity + $validated['quantity_received'],
                'last_restocked_at' => now(),
            ]);

            // Create inventory transaction
            $clinic->inventoryTransactions()->create([
                'inventory_id' => $inventory->id,
                'user_id' => $user->id,
                'type' => 'in',
                'quantity' => $validated['quantity_received'],
                'quantity_before' => $inventory->quantity - $validated['quantity_received'],
                'quantity_after' => $inventory->quantity,
                'unit_cost' => $item->unit_cost,
                'total_cost' => $validated['quantity_received'] * $item->unit_cost,
                'reference_number' => $purchaseOrder->po_number,
                'reference_type' => 'purchase_order',
                'notes' => "Received from PO: {$purchaseOrder->po_number}",
                'transaction_date' => now(),
            ]);

            // Check if all items are received
            $allReceived = $purchaseOrder->items()->where('status', '!=', 'received')->count() === 0;
            if ($allReceived) {
                $purchaseOrder->update([
                    'status' => 'received',
                    'received_at' => now(),
                ]);
            }

            DB::commit();

            return back()->with('success', 'Item received successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to receive item: ' . $e->getMessage()]);
        }
    }
}
