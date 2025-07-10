<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ClinicController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    /**
     * Display a listing of the clinics.
     */
    public function index(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        $query = Clinic::query();

        // Apply search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('contact_number', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($status = $request->input('status')) {
            $query->where('subscription_status', $status);
        }

        // Apply active/inactive filter
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $clinics = $query->withCount(['users', 'patients', 'appointments'])
                        ->latest()
                        ->paginate(10)
                        ->withQueryString();

        return Inertia::render('Admin/Clinics/Index', [
            'clinics' => $clinics,
            'filters' => $request->only(['search', 'status', 'is_active']),
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Show the form for creating a new clinic.
     */
    public function create()
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Admin/Clinics/Create', [
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Store a newly created clinic in storage.
     */
    public function store(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'street_address' => 'nullable|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email|unique:clinics,email',
            'license_number' => 'required|string|max:50|unique:clinics',
            'operating_hours' => 'nullable|array',
            'subscription_plan' => 'required|string|in:basic,premium,enterprise',
            'region_code' => 'nullable|string|max:10',
            'province_code' => 'nullable|string|max:10',
            'city_municipality_code' => 'nullable|string|max:10',
            'barangay_code' => 'nullable|string|max:10',
            'postal_code' => 'nullable|string|max:10',
            'address_details' => 'nullable|string',
            'slug' => 'nullable|string|max:255|unique:clinics,slug',
            'logo_url' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Remove slug from validated data to ensure auto-generation
        $data = $validated;
        unset($data['slug']);

        $clinic = Clinic::create([
            ...$data,
            'slug' => Str::slug($validated['name']),
            'logo_url' => $validated['logo_url'] ?? '/images/default-clinic-logo.png',
            'description' => $validated['description'] ?? null,
            'subscription_status' => 'active',
            'subscription_start_date' => now(),
            'subscription_end_date' => now()->addYear(),
            'is_active' => true,
        ]);

        return redirect()
            ->route('admin.clinics.index')
            ->with('success', 'Clinic created successfully.');
    }

    /**
     * Display the specified clinic.
     */
    public function show(Clinic $clinic)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        $clinic->load(['users', 'patients', 'appointments']);

        return Inertia::render('Admin/Clinics/Show', [
            'clinic' => $clinic,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Show the form for editing the specified clinic.
     */
    public function edit(Clinic $clinic)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Admin/Clinics/Edit', [
            'clinic' => $clinic,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Update the specified clinic in storage.
     */
    public function update(Request $request, Clinic $clinic)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'street_address' => 'nullable|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email|unique:clinics,email,' . $clinic->id,
            'operating_hours' => 'nullable|array',
            'subscription_plan' => 'required|string|in:basic,premium,enterprise',
            'is_active' => 'boolean',
            'region_code' => 'nullable|string|max:10',
            'province_code' => 'nullable|string|max:10',
            'city_municipality_code' => 'nullable|string|max:10',
            'barangay_code' => 'nullable|string|max:10',
            'postal_code' => 'nullable|string|max:10',
            'address_details' => 'nullable|string',
        ]);

        $clinic->update($validated);

        return redirect()
            ->route('admin.clinics.index')
            ->with('success', 'Clinic updated successfully.');
    }

    /**
     * Remove the specified clinic from storage.
     */
    public function destroy(Clinic $clinic)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        $clinic->delete();

        return redirect()
            ->route('admin.clinics.index')
            ->with('success', 'Clinic deleted successfully.');
    }

    /**
     * Update the clinic's subscription status.
     */
    public function updateSubscription(Request $request, Clinic $clinic)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'subscription_status' => 'required|string|in:active,suspended,cancelled',
            'subscription_plan' => 'required|string|in:basic,premium,enterprise',
            'subscription_end_date' => 'required|date|after:today',
        ]);

        $clinic->update($validated);

        return redirect()
            ->route('admin.clinics.show', $clinic)
            ->with('success', 'Clinic subscription updated successfully.');
    }
}
