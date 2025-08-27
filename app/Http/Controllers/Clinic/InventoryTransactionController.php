<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\Inventory;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InventoryTransactionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    /**
     * Display a listing of transactions
     */
    public function index(Request $request, Clinic $clinic)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        $query = $clinic->inventoryTransactions()
            ->with(['inventory', 'user']);

        // Apply filters
        if ($request->search) {
            $query->whereHas('inventory', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%");
            });
        }

        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->inventory_id) {
            $query->where('inventory_id', $request->inventory_id);
        }

        if ($request->date_from) {
            $query->whereDate('transaction_date', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('transaction_date', '<=', $request->date_to);
        }

        $transactions = $query->latest('transaction_date')->paginate(15);

        // Get summary statistics
        $summary = [
            'total_transactions' => $clinic->inventoryTransactions()->count(),
            'total_in' => $clinic->inventoryTransactions()->where('type', 'in')->sum('quantity'),
            'total_out' => $clinic->inventoryTransactions()->where('type', 'out')->sum('quantity'),
            'total_value' => $clinic->inventoryTransactions()->sum('total_cost'),
        ];

        // Get inventory items for filter
        $inventoryItems = $clinic->inventory()->select('id', 'name')->get();

        return Inertia::render('Clinic/Inventory/Transactions/Index', [
            'clinic' => $clinic,
            'transactions' => $transactions,
            'summary' => $summary,
            'inventoryItems' => $inventoryItems,
            'filters' => $request->only(['search', 'type', 'inventory_id', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Show the form for creating a new transaction
     */
    public function create(Request $request, Clinic $clinic)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        $inventoryItems = $clinic->inventory()
            ->select('id', 'name', 'quantity', 'unit_price')
            ->orderBy('name')
            ->get();

        return Inertia::render('Clinic/Inventory/Transactions/Create', [
            'clinic' => $clinic,
            'inventoryItems' => $inventoryItems,
        ]);
    }

    /**
     * Store a newly created transaction
     */
    public function store(Request $request, Clinic $clinic)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        $validated = $request->validate([
            'inventory_id' => 'required|exists:inventory,id',
            'type' => 'required|in:in,out,adjustment,transfer,damaged,expired',
            'quantity' => 'required|integer|min:1',
            'unit_cost' => 'nullable|numeric|min:0',
            'reference_number' => 'nullable|string|max:255',
            'reference_type' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'transaction_date' => 'required|date',
        ]);

        // Verify inventory belongs to clinic
        $inventory = $clinic->inventory()->findOrFail($validated['inventory_id']);

        DB::transaction(function () use ($validated, $clinic, $user, $inventory) {
            $quantityBefore = $inventory->quantity;
            $quantityAfter = $quantityBefore;

            // Calculate new quantity based on transaction type
            switch ($validated['type']) {
                case 'in':
                case 'adjustment':
                    $quantityAfter += $validated['quantity'];
                    break;
                case 'out':
                case 'damaged':
                case 'expired':
                    $quantityAfter -= $validated['quantity'];
                    break;
                case 'transfer':
                    // For transfers, we might need to handle differently
                    $quantityAfter = $validated['quantity'];
                    break;
            }

            // Ensure quantity doesn't go negative (except for adjustments)
            if ($quantityAfter < 0 && $validated['type'] !== 'adjustment') {
                throw new \Exception('Insufficient stock for this transaction.');
            }

            // Create transaction record
            $transaction = InventoryTransaction::create([
                'clinic_id' => $clinic->id,
                'inventory_id' => $inventory->id,
                'user_id' => $user->id,
                'type' => $validated['type'],
                'quantity' => $validated['quantity'],
                'quantity_before' => $quantityBefore,
                'quantity_after' => $quantityAfter,
                'unit_cost' => $validated['unit_cost'],
                'total_cost' => $validated['unit_cost'] ? $validated['unit_cost'] * $validated['quantity'] : null,
                'reference_number' => $validated['reference_number'],
                'reference_type' => $validated['reference_type'],
                'notes' => $validated['notes'],
                'transaction_date' => $validated['transaction_date'],
            ]);

            // Update inventory quantity
            $inventory->update([
                'quantity' => $quantityAfter,
                'last_restocked_at' => $validated['type'] === 'in' ? now() : $inventory->last_restocked_at,
            ]);

            return $transaction;
        });

        return redirect()->route('clinic.inventory.transactions.index', ['clinic' => $clinic->id])
            ->with('success', 'Transaction recorded successfully.');
    }

    /**
     * Display the specified transaction
     */
    public function show(Request $request, Clinic $clinic, InventoryTransaction $transaction)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Check if the transaction belongs to the clinic
        if ($transaction->clinic_id !== $clinic->id) {
            abort(403);
        }

        $transaction->load(['inventory', 'user']);

        return Inertia::render('Clinic/Inventory/Transactions/Show', [
            'clinic' => $clinic,
            'transaction' => $transaction,
        ]);
    }

    /**
     * Get transaction history for a specific inventory item
     */
    public function history(Request $request, Clinic $clinic, Inventory $inventory)
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

        $transactions = $inventory->transactions()
            ->with(['user'])
            ->latest('transaction_date')
            ->paginate(15);

        return Inertia::render('Clinic/Inventory/Transactions/History', [
            'clinic' => $clinic,
            'inventory' => $inventory,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Get transaction statistics
     */
    public function statistics(Request $request, Clinic $clinic)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        $dateFrom = $request->get('date_from', now()->subDays(30)->format('Y-m-d'));
        $dateTo = $request->get('date_to', now()->format('Y-m-d'));

        $statistics = [
            'total_transactions' => $clinic->inventoryTransactions()
                ->whereBetween('transaction_date', [$dateFrom, $dateTo])
                ->count(),
            'total_in' => $clinic->inventoryTransactions()
                ->where('type', 'in')
                ->whereBetween('transaction_date', [$dateFrom, $dateTo])
                ->sum('quantity'),
            'total_out' => $clinic->inventoryTransactions()
                ->where('type', 'out')
                ->whereBetween('transaction_date', [$dateFrom, $dateTo])
                ->sum('quantity'),
            'total_value' => $clinic->inventoryTransactions()
                ->whereBetween('transaction_date', [$dateFrom, $dateTo])
                ->sum('total_cost'),
            'transactions_by_type' => $clinic->inventoryTransactions()
                ->whereBetween('transaction_date', [$dateFrom, $dateTo])
                ->selectRaw('type, COUNT(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type')
                ->toArray(),
        ];

        return response()->json($statistics);
    }
}
