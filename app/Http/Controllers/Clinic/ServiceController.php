<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Clinic;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Traits\SubscriptionAccessControl;

class ServiceController extends Controller
{
    use SubscriptionAccessControl;

    public function index(Request $request, Clinic $clinic)
    {
        // Check subscription access first
        $this->checkSubscriptionAccess();

        $this->authorize('viewAny', Service::class);

        $query = $clinic->services()->with(['dentists']);

        // Apply filters
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $services = $query->orderBy('sort_order')->orderBy('name')->get();

        // Get dentists for assignment
        $dentists = $clinic->users()
                          ->whereIn('role', ['dentist', 'clinic_staff'])
                          ->where('is_active', true)
                          ->orderBy('name')
                          ->get();

        return Inertia::render('Clinic/Services/Index', [
            'clinic' => $clinic,
            'services' => $services,
            'dentists' => $dentists,
            'categories' => Service::getAvailableCategories(),
            'filters' => $request->only(['search', 'category', 'status']),
        ]);
    }

    public function create(Clinic $clinic)
    {
        $this->authorize('create', Service::class);

        $dentists = $clinic->users()
                          ->whereIn('role', ['dentist', 'clinic_staff'])
                          ->where('is_active', true)
                          ->orderBy('name')
                          ->get();

        return Inertia::render('Clinic/Services/Create', [
            'clinic' => $clinic,
            'categories' => Service::getAvailableCategories(),
            'dentists' => $dentists,
        ]);
    }

    public function store(Request $request, Clinic $clinic)
    {
        $this->authorize('create', Service::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|in:' . implode(',', array_keys(Service::getAvailableCategories())),
            'subcategory' => 'nullable|string',
            'code' => 'nullable|string|max:50|unique:services,code,NULL,id,clinic_id,' . $clinic->id,
            'price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'insurance_price' => 'nullable|numeric|min:0',
            'is_insurance_eligible' => 'boolean',
            'insurance_codes' => 'nullable|array',
            'duration_minutes' => 'required|integer|min:15|max:480',
            'procedure_details' => 'nullable|string',
            'preparation_instructions' => 'nullable|string',
            'post_procedure_care' => 'nullable|string',
            'requires_consultation' => 'boolean',
            'is_emergency_service' => 'boolean',
            'advance_booking_days' => 'integer|min:0',
            'max_daily_bookings' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'tags' => 'nullable|array',
            'notes' => 'nullable|string',
            'dentist_ids' => 'nullable|array',
            'dentist_ids.*' => 'exists:users,id',
        ]);

        try {
            $service = $clinic->services()->create($validated);

            // Assign dentists if provided
            if (!empty($validated['dentist_ids'])) {
                $dentistData = [];
                foreach ($validated['dentist_ids'] as $dentistId) {
                    $dentistData[$dentistId] = [
                        'clinic_id' => $clinic->id,
                        'is_available' => true,
                    ];
                }
                $service->dentists()->attach($dentistData);
            }

            Log::info('Service created successfully', [
                'service_id' => $service->id,
                'clinic_id' => $clinic->id,
                'created_by' => Auth::id(),
            ]);

            if ($request->wantsJson()) {
                return response()->json($service->load('dentists'), 201);
            }

            return redirect()->route('clinic.services.index', $clinic)
                           ->with('success', 'Service created successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to create service', [
                'error' => $e->getMessage(),
                'clinic_id' => $clinic->id,
                'request' => $request->all(),
            ]);

            if ($request->wantsJson()) {
                return response()->json(['error' => 'Failed to create service'], 500);
            }

            return back()->withErrors(['general' => 'Failed to create service: ' . $e->getMessage()]);
        }
    }

    public function show(Clinic $clinic, Service $service)
    {
        $this->authorize('view', $service);

        $service->load(['dentists', 'appointments', 'treatments']);

        return Inertia::render('Clinic/Services/Show', [
            'clinic' => $clinic,
            'service' => $service,
            'categories' => Service::getAvailableCategories(),
            'subcategories' => Service::getSubcategories($service->category),
        ]);
    }

    public function edit(Clinic $clinic, Service $service)
    {
        $this->authorize('update', $service);

        $service->load('dentists');

        $dentists = $clinic->users()
                          ->whereIn('role', ['dentist', 'clinic_staff'])
                          ->where('is_active', true)
                          ->orderBy('name')
                          ->get();

        return Inertia::render('Clinic/Services/Edit', [
            'clinic' => $clinic,
            'service' => $service,
            'categories' => Service::getAvailableCategories(),
            'subcategories' => Service::getSubcategories($service->category),
            'dentists' => $dentists,
        ]);
    }

    public function update(Request $request, Clinic $clinic, Service $service)
    {
        $this->authorize('update', $service);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|in:' . implode(',', array_keys(Service::getAvailableCategories())),
            'subcategory' => 'nullable|string',
            'code' => 'nullable|string|max:50|unique:services,code,' . $service->id . ',id,clinic_id,' . $clinic->id,
            'price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'insurance_price' => 'nullable|numeric|min:0',
            'is_insurance_eligible' => 'boolean',
            'insurance_codes' => 'nullable|array',
            'duration_minutes' => 'required|integer|min:15|max:480',
            'procedure_details' => 'nullable|string',
            'preparation_instructions' => 'nullable|string',
            'post_procedure_care' => 'nullable|string',
            'requires_consultation' => 'boolean',
            'is_emergency_service' => 'boolean',
            'advance_booking_days' => 'integer|min:0',
            'max_daily_bookings' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'tags' => 'nullable|array',
            'notes' => 'nullable|string',
            'dentist_ids' => 'nullable|array',
            'dentist_ids.*' => 'exists:users,id',
        ]);

        try {
            $service->update($validated);

            // Update dentist assignments
            if (isset($validated['dentist_ids'])) {
                $dentistData = [];
                foreach ($validated['dentist_ids'] as $dentistId) {
                    $dentistData[$dentistId] = [
                        'clinic_id' => $clinic->id,
                        'is_available' => true,
                    ];
                }
                $service->dentists()->sync($dentistData);
            }

            Log::info('Service updated successfully', [
                'service_id' => $service->id,
                'clinic_id' => $clinic->id,
                'updated_by' => Auth::id(),
            ]);

            if ($request->wantsJson()) {
                return response()->json($service->load('dentists'));
            }

            return redirect()->route('clinic.services.index', $clinic)
                           ->with('success', 'Service updated successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to update service', [
                'error' => $e->getMessage(),
                'service_id' => $service->id,
                'clinic_id' => $clinic->id,
                'request' => $request->all(),
            ]);

            if ($request->wantsJson()) {
                return response()->json(['error' => 'Failed to update service'], 500);
            }

            return back()->withErrors(['general' => 'Failed to update service: ' . $e->getMessage()]);
        }
    }

    public function destroy(Clinic $clinic, Service $service)
    {
        $this->authorize('delete', $service);

        try {
            // Check if service has appointments or treatments
            $hasAppointments = $service->appointments()->exists();
            $hasTreatments = $service->treatments()->exists();

            if ($hasAppointments || $hasTreatments) {
                $message = 'Cannot delete service. ';
                if ($hasAppointments) $message .= 'Service has appointments. ';
                if ($hasTreatments) $message .= 'Service has treatments. ';
                $message .= 'Consider deactivating instead.';

                if (request()->wantsJson()) {
                    return response()->json(['error' => $message], 422);
                }

                return back()->withErrors(['general' => $message]);
            }

            $service->delete();

            Log::info('Service deleted successfully', [
                'service_id' => $service->id,
                'clinic_id' => $clinic->id,
                'deleted_by' => Auth::id(),
            ]);

            if (request()->wantsJson()) {
                return response()->json(['message' => 'Service deleted successfully']);
            }

            return redirect()->route('clinic.services.index', $clinic)
                           ->with('success', 'Service deleted successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to delete service', [
                'error' => $e->getMessage(),
                'service_id' => $service->id,
                'clinic_id' => $clinic->id,
            ]);

            if (request()->wantsJson()) {
                return response()->json(['error' => 'Failed to delete service'], 500);
            }

            return back()->withErrors(['general' => 'Failed to delete service: ' . $e->getMessage()]);
        }
    }

    /**
     * Get subcategories for a category (AJAX)
     */
    public function getSubcategories(Request $request, Clinic $clinic)
    {
        $category = $request->get('category');
        $subcategories = Service::getSubcategories($category);

        return response()->json($subcategories);
    }

    /**
     * Toggle service status
     */
    public function toggleStatus(Request $request, Clinic $clinic, Service $service)
    {
        $this->authorize('update', $service);

        $service->update(['is_active' => !$service->is_active]);

        $status = $service->is_active ? 'activated' : 'deactivated';

        Log::info("Service {$status}", [
            'service_id' => $service->id,
            'clinic_id' => $clinic->id,
            'updated_by' => Auth::id(),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => "Service {$status} successfully",
                'is_active' => $service->is_active
            ]);
        }

        return back()->with('success', "Service {$status} successfully.");
    }

    /**
     * Update service sort order
     */
    public function updateSortOrder(Request $request, Clinic $clinic)
    {
        $this->authorize('update', Service::class);

        $validated = $request->validate([
            'services' => 'required|array',
            'services.*.id' => 'required|exists:services,id',
            'services.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($validated['services'] as $serviceData) {
            Service::where('id', $serviceData['id'])
                  ->where('clinic_id', $clinic->id)
                  ->update(['sort_order' => $serviceData['sort_order']]);
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Sort order updated successfully']);
        }

        return back()->with('success', 'Sort order updated successfully.');
    }
}
