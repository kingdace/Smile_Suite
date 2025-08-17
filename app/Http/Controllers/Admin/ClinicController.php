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
                  ->orWhere('contact_number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        $status = $request->input('status');
        if ($status && $status !== 'all') {
            $query->where('subscription_status', $status);
        }

        // Apply active/inactive filter
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Include soft deleted clinics if requested
        $showDeleted = $request->boolean('show_deleted');
        if ($showDeleted) {
            $query->withTrashed();
        }

        $clinics = $query->withCount(['users', 'patients', 'appointments'])
                        ->latest()
                        ->paginate(5)
                        ->withQueryString();

        return Inertia::render('Admin/Clinics/Index', [
            'clinics' => $clinics,
            'show_deleted' => $showDeleted,
            'filters' => $request->only(['search', 'status', 'is_active', 'show_deleted']),
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
            'street_address' => 'nullable|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email|unique:clinics,email',
            'license_number' => 'required|string|max:50|unique:clinics',
            'operating_hours' => 'nullable|array',
            'subscription_plan' => 'required|string|in:basic,premium,enterprise',
            'subscription_status' => 'nullable|string|in:trial,active,inactive',
            'subscription_start_date' => 'nullable|date',
            'subscription_end_date' => 'nullable|date',
            'is_active' => 'nullable|boolean',
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
            'logo_url' => $validated['logo_url'] ?? '/images/clinic-logo.png',
            'description' => $validated['description'] ?? null,
            'subscription_status' => $request->input('subscription_status', 'active'),
            'subscription_start_date' => $request->input('subscription_start_date'),
            'subscription_end_date' => $request->input('subscription_end_date'),
            'is_active' => $request->input('is_active', true),
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
            'street_address' => 'nullable|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email|unique:clinics,email,' . $clinic->id,
            'license_number' => 'required|string|max:50|unique:clinics,license_number,' . $clinic->id,
            'description' => 'nullable|string',
            'operating_hours' => 'nullable|array',
            'subscription_plan' => 'required|string|in:basic,premium,enterprise',
            'subscription_status' => 'nullable|string|in:trial,active,inactive',
            'subscription_start_date' => 'nullable|date',
            'subscription_end_date' => 'nullable|date',
            'is_active' => 'nullable|boolean',
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
            ->with('success', 'Clinic soft deleted successfully.');
    }

    /**
     * Restore a soft-deleted clinic.
     */
    public function restore($id)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        // Find the soft-deleted clinic by ID
        $clinicToRestore = Clinic::withTrashed()->find($id);

        if (!$clinicToRestore) {
            abort(404, 'Clinic not found.');
        }

        // Restore the clinic
        $clinicToRestore->restore();

        return redirect()
            ->route('admin.clinics.index', ['show_deleted' => true])
            ->with('success', 'Clinic restored successfully.');
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
