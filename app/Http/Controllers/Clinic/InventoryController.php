<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Traits\SubscriptionAccessControl;

class InventoryController extends Controller
{
    use SubscriptionAccessControl;

    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request, Clinic $clinic)
    {
        // Check subscription access first
        $this->checkSubscriptionAccess();

        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        $query = $clinic->inventory()->with(['supplier']);

        // Search functionality (simplified)
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        // Category filter
        if ($request->category) {
            $query->where('category', $request->category);
        }

        // Simple stock filter
        if ($request->stock_filter) {
            switch ($request->stock_filter) {
                case 'in_stock':
                    $query->where('quantity', '>', 0)
                          ->whereRaw('quantity > minimum_quantity');
                    break;
                case 'low_stock':
                    $query->whereRaw('quantity <= minimum_quantity AND quantity > 0');
                    break;
                case 'out_of_stock':
                    $query->where('quantity', '<=', 0);
                    break;
            }
        }

        // Simple sorting (name only)
        $query->orderBy('name', 'asc');

        $inventory = $query->paginate(15);

        return Inertia::render('Clinic/Inventory/Index', [
            'clinic' => $clinic,
            'inventory' => $inventory,
            'filters' => $request->only(['search', 'category', 'stock_filter']),
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

        return Inertia::render('Clinic/Inventory/CreateSimplified', [
            'clinic' => $clinic,
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request, Clinic $clinic)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Coerce empty supplier selection to null so validation treats it as optional
        if (!$request->filled('supplier_id') || $request->input('supplier_id') === '' || $request->input('supplier_id') === 'none') {
            $request->merge(['supplier_id' => null]);
        }

        // Simplified validation for essential fields only
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:0',
            'minimum_quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'category' => 'required|string|in:medications,supplies,equipment,others',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'expiry_date' => 'nullable|date|after:today',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // Set default values
        $validated['is_active'] = $validated['is_active'] ?? true;

        $inventory = $clinic->inventory()->create($validated);

        return redirect()->route('clinic.inventory.show', ['clinic' => $clinic->id, 'inventory' => $inventory])
            ->with('success', 'Inventory item created successfully.');
    }

    public function show(Request $request, Clinic $clinic, Inventory $inventory)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Check if the inventory belongs to the clinic
        if ($inventory->clinic_id !== $clinic->id) {
            abort(403);
        }

        $inventory->load(['supplier', 'transactions' => function ($query) {
            $query->latest('transaction_date')->limit(10);
        }]);

        // Get recent transactions
        $recentTransactions = $inventory->transactions()
            ->with(['user'])
            ->latest('transaction_date')
            ->limit(5)
            ->get();

        return Inertia::render('Clinic/Inventory/Show', [
            'clinic' => $clinic,
            'inventory' => $inventory,
            'recentTransactions' => $recentTransactions,
        ]);
    }

    public function edit(Request $request, Clinic $clinic, Inventory $inventory)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Check if the inventory belongs to the clinic
        if ($inventory->clinic_id !== $clinic->id) {
            abort(403);
        }

        $suppliers = $clinic->suppliers()->get();

        return Inertia::render('Clinic/Inventory/EditSimplified', [
            'clinic' => $clinic,
            'inventory' => $inventory,
            'suppliers' => $suppliers,
        ]);
    }

    public function update(Request $request, Clinic $clinic, Inventory $inventory)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Check if the inventory belongs to the clinic
        if ($inventory->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Coerce empty supplier selection to null so validation treats it as optional
        if (!$request->filled('supplier_id') || $request->input('supplier_id') === '' || $request->input('supplier_id') === 'none') {
            $request->merge(['supplier_id' => null]);
        }

        // Simplified validation for essential fields only (update method)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:0',
            'minimum_quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'category' => 'required|string|in:medications,supplies,equipment,others',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'expiry_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // Set default values
        $validated['is_active'] = $validated['is_active'] ?? true;

        $inventory->update($validated);

        return redirect()->route('clinic.inventory.show', ['clinic' => $clinic->id, 'inventory' => $inventory])
            ->with('success', 'Inventory item updated successfully.');
    }

    public function destroy(Request $request, Clinic $clinic, Inventory $inventory)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Check if the inventory belongs to the clinic
        if ($inventory->clinic_id !== $clinic->id) {
            abort(403);
        }

        $inventory->delete();

        return redirect()->route('clinic.inventory.index', ['clinic' => $clinic->id])
            ->with('success', 'Inventory item deleted successfully.');
    }

    /**
     * Quick quantity adjustment
     */
    public function adjustQuantity(Request $request, Clinic $clinic, Inventory $inventory)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Check if the inventory belongs to the clinic
        if ($inventory->clinic_id !== $clinic->id) {
            abort(403);
        }

        $validated = $request->validate([
            'adjustment' => 'required|integer', // Can be positive or negative
        ]);

        $oldQuantity = $inventory->quantity;
        $newQuantity = max(0, $oldQuantity + $validated['adjustment']); // Prevent negative quantities

        $inventory->update([
            'quantity' => $newQuantity,
        ]);

        return back()->with('success', 'Stock quantity adjusted successfully.');
    }

    /**
     * Get inventory statistics
     */
    public function statistics(Request $request, Clinic $clinic)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        $statistics = [
            'total_items' => $clinic->inventory()->count(),
            'active_items' => $clinic->inventory()->where('is_active', true)->count(),
            'low_stock_items' => $clinic->inventory()->whereRaw('quantity <= minimum_quantity')->count(),
            'out_of_stock_items' => $clinic->inventory()->where('quantity', '<=', 0)->count(),
            'expiring_items' => $clinic->inventory()
                ->where('expiry_date', '<=', now()->addDays(30))
                ->where('expiry_date', '>', now())
                ->count(),
            'expired_items' => $clinic->inventory()->where('expiry_date', '<', now())->count(),
            'total_value' => $clinic->inventory()
                ->get()
                ->sum(function ($item) {
                    return $item->quantity * $item->unit_price;
                }),
            'categories_count' => $clinic->inventory()->distinct('category')->count(),
            'suppliers_count' => $clinic->inventory()->distinct('supplier_id')->count(),
        ];

        return response()->json($statistics);
    }
}
