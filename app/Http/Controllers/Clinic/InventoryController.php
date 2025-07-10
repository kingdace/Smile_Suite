<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InventoryController extends Controller
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

        $query = $clinic->inventory()->with(['supplier']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        $inventory = $query->latest()->paginate(10);

        return Inertia::render('Clinic/Inventory/Index', [
            'clinic' => $clinic,
            'inventory' => $inventory,
            'filters' => $request->only(['search', 'category']),
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

        return Inertia::render('Clinic/Inventory/Create', [
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

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'quantity' => 'required|integer|min:0',
            'minimum_quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'supplier_id' => 'required|exists:suppliers,id',
            'notes' => 'nullable|string',
        ]);

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

        $inventory->load(['supplier']);

        return Inertia::render('Clinic/Inventory/Show', [
            'clinic' => $clinic,
            'inventory' => $inventory,
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

        return Inertia::render('Clinic/Inventory/Edit', [
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

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'quantity' => 'required|integer|min:0',
            'minimum_quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'supplier_id' => 'required|exists:suppliers,id',
            'notes' => 'nullable|string',
        ]);

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
}
