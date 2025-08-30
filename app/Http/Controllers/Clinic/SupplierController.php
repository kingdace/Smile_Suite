<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Traits\SubscriptionAccessControl;

class SupplierController extends Controller
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

        $query = $clinic->suppliers();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('contact_person', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $suppliers = $query->latest()->paginate(10);

        return Inertia::render('Clinic/Suppliers/Index', [
            'clinic' => $clinic,
            'suppliers' => $suppliers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(Request $request, Clinic $clinic)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        return Inertia::render('Clinic/Suppliers/Create', [
            'clinic' => $clinic,
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
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'tax_id' => 'nullable|string|max:255',
            'payment_terms' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $supplier = $clinic->suppliers()->create($validated);

        return redirect()->route('clinic.suppliers.show', ['clinic' => $clinic->id, 'supplier' => $supplier])
            ->with('success', 'Supplier created successfully.');
    }

    public function show(Request $request, Clinic $clinic, Supplier $supplier)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Check if the supplier belongs to the clinic
        if ($supplier->clinic_id !== $clinic->id) {
            abort(403);
        }

        $supplier->load(['inventory']);

        return Inertia::render('Clinic/Suppliers/Show', [
            'clinic' => $clinic,
            'supplier' => $supplier,
        ]);
    }

    public function edit(Request $request, Clinic $clinic, Supplier $supplier)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Check if the supplier belongs to the clinic
        if ($supplier->clinic_id !== $clinic->id) {
            abort(403);
        }

        return Inertia::render('Clinic/Suppliers/Edit', [
            'clinic' => $clinic,
            'supplier' => $supplier,
        ]);
    }

    public function update(Request $request, Clinic $clinic, Supplier $supplier)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Check if the supplier belongs to the clinic
        if ($supplier->clinic_id !== $clinic->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'tax_id' => 'nullable|string|max:255',
            'payment_terms' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $supplier->update($validated);

        return redirect()->route('clinic.suppliers.show', ['clinic' => $clinic->id, 'supplier' => $supplier])
            ->with('success', 'Supplier updated successfully.');
    }

    public function destroy(Request $request, Clinic $clinic, Supplier $supplier)
    {
        $user = Auth::user();

        // Check if user belongs to this clinic
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        // Check if the supplier belongs to the clinic
        if ($supplier->clinic_id !== $clinic->id) {
            abort(403);
        }

        $supplier->delete();

        return redirect()->route('clinic.suppliers.index', ['clinic' => $clinic->id])
            ->with('success', 'Supplier deleted successfully.');
    }
}
