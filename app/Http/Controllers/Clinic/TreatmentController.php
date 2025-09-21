<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Treatment;
use App\Models\Service;
use App\Models\Clinic;
use App\Models\Inventory;
use App\Services\TreatmentInventoryService;
use App\Traits\ExportTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Traits\SubscriptionAccessControl;
use Carbon\Carbon;

class TreatmentController extends Controller
{
    use SubscriptionAccessControl, ExportTrait;

    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request)
    {
        // Check subscription access first
        $this->checkSubscriptionAccess();

        $clinicId = Auth::user()->clinic->id;

        $query = Treatment::where('clinic_id', $clinicId)
                         ->with(['patient.user', 'dentist', 'service']);

        // Apply filters
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhere('notes', 'like', '%' . $request->search . '%')
                  ->orWhereHas('patient', function($patientQuery) use ($request) {
                      $patientQuery->where('first_name', 'like', '%' . $request->search . '%')
                                  ->orWhere('last_name', 'like', '%' . $request->search . '%');
                  })
                  ->orWhereHas('dentist', function($dentistQuery) use ($request) {
                      $dentistQuery->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->filled('service_id') && $request->service_id !== 'all') {
            $query->where('service_id', $request->service_id);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');

        // Handle special sorting cases
        if ($sortBy === 'service_id') {
            $query->join('services', 'treatments.service_id', '=', 'services.id')
                  ->orderBy('services.name', $sortDirection)
                  ->select('treatments.*');
        } elseif ($sortBy === 'patient_id') {
            $query->join('patients', 'treatments.patient_id', '=', 'patients.id')
                  ->orderBy('patients.first_name', $sortDirection)
                  ->select('treatments.*');
        } elseif ($sortBy === 'user_id') {
            $query->join('users', 'treatments.user_id', '=', 'users.id')
                  ->orderBy('users.name', $sortDirection)
                  ->select('treatments.*');
        } else {
            $query->orderBy($sortBy, $sortDirection);
        }

        $treatments = $query->paginate(10)->withQueryString();

        // Get clinic services for filtering
        $services = Auth::user()->clinic->services()
                          ->where('is_active', true)
                          ->orderBy('name')
                          ->get(['id', 'name', 'category']);

        return Inertia::render('Clinic/Treatments/Index', [
            'treatments' => $treatments,
            'services' => $services,
            'filters' => $request->only(['search', 'service_id', 'status', 'payment_status', 'sort_by', 'sort_direction'])
        ]);
    }

    public function create()
    {
        $clinic = Auth::user()->clinic;

        if (!$clinic) {
            // Handle case where clinic is not found for the authenticated user
            return redirect()->route('dashboard')->with('error', 'Clinic not found.');
        }

        $patients = $clinic->patients()->with('user')->get();
        $dentists = $clinic->users()->where('role', 'dentist')->get();
        $services = $clinic->services()
                          ->where('is_active', true)
                          ->orderBy('name')
                          ->get(['id', 'name', 'category', 'price', 'duration_minutes']);

        $appointments = $clinic->appointments()
            ->with(['patient.user', 'assignedDentist', 'type', 'status'])
            ->orderBy('scheduled_at', 'desc')
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'scheduled_at' => $appointment->scheduled_at,
                    'patient' => [
                        'id' => $appointment->patient?->id,
                        'name' => (empty($appointment->patient?->full_name) ? 'Unknown Patient' : $appointment->patient->full_name),
                    ],
                    'dentist' => [
                        'id' => $appointment->assignedDentist?->id,
                        'name' => $appointment->assignedDentist?->name ?? 'Unassigned',
                    ],
                    'type' => $appointment->type?->name ?? 'Unknown Type',
                    'status' => $appointment->status?->name ?? 'Unknown Status',
                ];
            });

        return Inertia::render('Clinic/Treatments/Create', [
            'patients' => $patients,
            'dentists' => $dentists,
            'services' => $services,
            'appointments' => $appointments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'dentist_id' => 'required|exists:users,id',
            'service_id' => 'nullable|integer|exists:services,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'cost' => 'required|numeric|min:0',
            'status' => 'required|string|in:scheduled,in_progress,completed,cancelled',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'procedures_details' => 'nullable|array',
            'images' => 'nullable|array',
            'imageFiles.*' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'recommendations' => 'nullable|string',
            'tooth_numbers' => 'nullable|array',
            'prescriptions' => 'nullable|array',
            'follow_up_notes' => 'nullable|string',
            'materials_used' => 'nullable|array',
            'insurance_info' => 'nullable|array',
            'payment_status' => 'nullable|string|in:pending,partial,completed',
            'vital_signs' => 'nullable|array',
            'allergies' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'consent_forms' => 'nullable|array',
            'treatment_phase' => 'nullable|string|max:50|in:initial,treatment,follow_up,maintenance,none',
            'outcome' => 'nullable|string|max:50|in:successful,partial,failed,pending,none',
            'next_appointment_date' => 'nullable|date',
            'estimated_duration_minutes' => 'nullable|integer|min:1',
            // Inventory integration fields
            'inventory_items' => 'nullable|array',
            'inventory_items.*.inventory_id' => 'required_with:inventory_items|exists:inventory,id',
            'inventory_items.*.quantity_used' => 'required_with:inventory_items|integer|min:1',
            'inventory_items.*.notes' => 'nullable|string|max:500',
        ]);

        // Map dentist_id to user_id for the database
        $validated['user_id'] = $validated['dentist_id'];
        unset($validated['dentist_id']);

        // Handle "none" value for service_id
        if ($validated['service_id'] === 'none') {
            $validated['service_id'] = null;
        } elseif ($validated['service_id'] && !Service::where('id', $validated['service_id'])->exists()) {
            return back()->withErrors(['service_id' => 'The selected service is invalid.']);
        }

        // Handle "none" and "no_*" values for treatment_phase and outcome
        if (isset($validated['treatment_phase']) && ($validated['treatment_phase'] === 'none' || $validated['treatment_phase'] === 'no_phase')) {
            $validated['treatment_phase'] = null;
        }
        if (isset($validated['outcome']) && ($validated['outcome'] === 'none' || $validated['outcome'] === 'no_outcome')) {
            $validated['outcome'] = null;
        }

        // Set default payment status if not provided
        if (!isset($validated['payment_status'])) {
            $validated['payment_status'] = 'pending';
        }

        // Handle inventory deduction when treatment is completed
        $inventoryItems = $validated['inventory_items'] ?? [];
        unset($validated['inventory_items']); // Remove from treatment creation data

        $treatment = null;
        try {
            DB::transaction(function () use ($validated, $inventoryItems, &$treatment) {
                // Create treatment first to get the ID
                $treatment = Auth::user()->clinic->treatments()->create($validated);

                // Handle inventory deduction if treatment is completed and has inventory items
                if ($validated['status'] === Treatment::STATUS_COMPLETED &&
                    !empty($inventoryItems)) {

                    $inventoryService = new TreatmentInventoryService();
                    $inventoryService->deductInventory($treatment, $inventoryItems);
                }
            });
        } catch (\App\Services\InsufficientStockException $e) {
            return back()->withErrors(['inventory_items' => $e->getMessage()]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create treatment: ' . $e->getMessage()]);
        }

        // Handle file uploads
        $uploadedImages = [];

        if ($request->hasFile('imageFiles') && $treatment) {
            $clinicId = Auth::user()->clinic->id;
            $treatmentId = $treatment->id;

            foreach ($request->file('imageFiles') as $file) {
                if ($file && $file->isValid()) {
                    $filename = time() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs(
                        "clinics/{$clinicId}/treatments/{$treatmentId}",
                        $filename,
                        'public'
                    );

                    if ($path) {
                        $uploadedImages[] = Storage::url($path);
                    }
                }
            }

            // Update treatment with uploaded images
            if (!empty($uploadedImages) && $treatment) {
                $allImages = array_merge($uploadedImages, $validated['images'] ?? []);
                $treatment->update(['images' => $allImages]);
            }
        }

        $message = 'Treatment created successfully.';
        if (!empty($inventoryItems) && $validated['status'] === Treatment::STATUS_COMPLETED) {
            $message .= ' Inventory has been deducted.';
        }

        if (!$treatment) {
            return back()->withErrors(['error' => 'Failed to create treatment.']);
        }

        return redirect()->route('clinic.treatments.show', [
            'clinic' => Auth::user()->clinic->id,
            'treatment' => $treatment->id
        ])->with('success', $message);
    }

    public function show(Clinic $clinic, Treatment $treatment)
    {
        $this->authorize('view', $treatment);

        $treatment->load([
            'patient.user',
            'dentist',
            'service',
            'appointment' => function($query) {
                $query->with(['patient.user', 'type', 'status', 'assignedDentist']);
            },
            'inventoryItems.inventory',
            'payments' => function($query) {
                $query->with('receivedBy')->orderBy('created_at', 'desc');
            }
        ]);

        // Get inventory summary if treatment has inventory deduction
        $inventorySummary = null;
        if ($treatment->hasInventoryDeduction()) {
            $inventoryService = new TreatmentInventoryService();
            $inventorySummary = $inventoryService->getTreatmentInventorySummary($treatment);
        }

        // Debug: Log the loaded data
        Log::info('Treatment Show - Loaded data', [
            'treatment_id' => $treatment->id,
            'inventory_items_count' => $treatment->inventoryItems->count(),
            'inventory_items' => $treatment->inventoryItems->toArray(),
            'inventory_deducted' => $treatment->inventory_deducted,
            'inventory_deducted_at' => $treatment->inventory_deducted_at,
        ]);

        // Ensure inventory items are properly serialized
        $treatmentData = $treatment->toArray();
        $treatmentData['inventoryItems'] = $treatment->inventoryItems->toArray();

        return Inertia::render('Clinic/Treatments/Show', [
            'treatment' => $treatmentData,
            'inventorySummary' => $inventorySummary
        ]);
    }

    public function edit(Clinic $clinic, Treatment $treatment)
    {
        $this->authorize('update', $treatment);

        $clinic = Auth::user()->clinic;

        $patients = $clinic->patients()->with('user')->get();
        $dentists = $clinic->users()->where('role', 'dentist')->get();
        $services = $clinic->services()
                          ->where('is_active', true)
                          ->orderBy('name')
                          ->get(['id', 'name', 'category', 'price', 'duration_minutes']);

        $appointments = $clinic->appointments()
            ->with(['patient.user', 'assignedDentist', 'type', 'status'])
            ->orderBy('scheduled_at', 'desc')
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'scheduled_at' => $appointment->scheduled_at,
                    'patient' => [
                        'id' => $appointment->patient?->id,
                        'name' => (empty($appointment->patient?->full_name) ? 'Unknown Patient' : $appointment->patient->full_name),
                    ],
                    'dentist' => [
                        'id' => $appointment->assignedDentist?->id,
                        'name' => $appointment->assignedDentist?->name ?? 'Unassigned',
                    ],
                    'type' => $appointment->type?->name ?? 'Unknown Type',
                    'status' => $appointment->status?->name ?? 'Unknown Status',
                ];
            });

        // Load inventory items relationship
        $treatment->load('inventoryItems.inventory');

        // Debug: Log the loaded data
        Log::info('Edit method - Treatment loaded with inventory items', [
            'treatment_id' => $treatment->id,
            'inventory_items_count' => $treatment->inventoryItems->count(),
            'inventory_items' => $treatment->inventoryItems->toArray(),
            'procedures_details' => $treatment->procedures_details,
            'procedures_details_type' => gettype($treatment->procedures_details),
            'procedures_details_count' => is_array($treatment->procedures_details) ? count($treatment->procedures_details) : 'Not an array',
            'procedures_details_first_item' => is_array($treatment->procedures_details) && count($treatment->procedures_details) > 0 ? $treatment->procedures_details[0] : 'No items'
        ]);

        // Ensure inventory items are included in the response
        $treatmentData = $treatment->toArray();
        $treatmentData['inventoryItems'] = $treatment->inventoryItems->toArray();

        return Inertia::render('Clinic/Treatments/Edit', [
            'treatment' => $treatmentData,
            'patients' => $patients,
            'dentists' => $dentists,
            'services' => $services,
            'appointments' => $appointments,
        ]);
    }

    public function update(Request $request, Clinic $clinic, Treatment $treatment)
    {
        $this->authorize('update', $treatment);

        Log::info('Treatment update request received', [
            'treatment_id' => $treatment->id,
            'request_data' => $request->all()
        ]);

        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'dentist_id' => 'required|exists:users,id',
            'service_id' => 'nullable|integer|exists:services,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'cost' => 'required|numeric|min:0',
            'status' => 'required|string|in:scheduled,in_progress,completed,cancelled',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'procedures_details' => 'nullable|array',
            'images' => 'nullable|array',
            'recommendations' => 'nullable|string',
            'tooth_numbers' => 'nullable|array',
            'prescriptions' => 'nullable|array',
            'follow_up_notes' => 'nullable|string',
            'materials_used' => 'nullable|array',
            'insurance_info' => 'nullable|array',
            'payment_status' => 'nullable|string|in:pending,partial,completed',
            'vital_signs' => 'nullable|array',
            'allergies' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'consent_forms' => 'nullable|array',
            'treatment_phase' => 'nullable|string|max:50|in:initial,treatment,follow_up,maintenance,none,no_phase',
            'outcome' => 'nullable|string|max:50|in:successful,partial,failed,pending,none,no_outcome',
            'next_appointment_date' => 'nullable|date',
            'estimated_duration_minutes' => 'nullable|integer|min:1',
            // Inventory integration fields
            'inventory_items' => 'nullable|array',
            'inventory_items.*.inventory_id' => 'required_with:inventory_items|exists:inventory,id',
            'inventory_items.*.quantity_used' => 'required_with:inventory_items|integer|min:1',
            'inventory_items.*.notes' => 'nullable|string|max:500',
        ]);

        // Map dentist_id to user_id for the database
        $validated['user_id'] = $validated['dentist_id'];
        unset($validated['dentist_id']);

        // Handle "none" value for service_id
        if ($validated['service_id'] === 'none') {
            $validated['service_id'] = null;
        } elseif ($validated['service_id'] && !Service::where('id', $validated['service_id'])->exists()) {
            return back()->withErrors(['service_id' => 'The selected service is invalid.']);
        }

        // Handle "none" and "no_*" values for treatment_phase and outcome
        if (isset($validated['treatment_phase']) && ($validated['treatment_phase'] === 'none' || $validated['treatment_phase'] === 'no_phase')) {
            $validated['treatment_phase'] = null;
        }
        if (isset($validated['outcome']) && ($validated['outcome'] === 'none' || $validated['outcome'] === 'no_outcome')) {
            $validated['outcome'] = null;
        }

        // Handle inventory deduction when treatment is completed
        $inventoryItems = $validated['inventory_items'] ?? [];
        unset($validated['inventory_items']); // Remove from treatment update data

        try {
            // Validate inventory changes BEFORE updating treatment (regardless of status)
            if (!empty($inventoryItems)) {
                $inventoryService = new TreatmentInventoryService();
                $inventoryService->validateInventoryAdjustment($treatment, $inventoryItems);
            }

            DB::transaction(function () use ($treatment, $validated, $inventoryItems, $clinic) {
                // Update treatment
                $treatment->update($validated);

                // Auto-update appointment status to "Completed" if treatment is completed and fully paid
                if ($validated['status'] === Treatment::STATUS_COMPLETED && $treatment->appointment_id) {
                    // Check if treatment is fully paid
                    $totalPaid = $clinic->payments()
                        ->where('treatment_id', $treatment->id)
                        ->where('status', 'completed')
                        ->sum('amount');

                    $totalCost = $treatment->cost + ($treatment->inventoryItems->sum('total_cost') ?? 0);

                    if ($totalPaid >= $totalCost) {
                        $appointment = \App\Models\Appointment::find($treatment->appointment_id);
                        if ($appointment && $appointment->appointment_status_id != 3) { // 3 = "Completed" status
                            $appointment->update(['appointment_status_id' => 3]);

                            Log::info('Appointment status auto-updated to Completed via treatment update', [
                                'appointment_id' => $appointment->id,
                                'treatment_id' => $treatment->id,
                                'treatment_status' => $treatment->status,
                                'treatment_payment_status' => $treatment->payment_status,
                                'total_paid' => $totalPaid,
                                'total_cost' => $totalCost
                            ]);
                        }
                    }
                }

                // Handle inventory items update with smart adjustment
                if (!empty($inventoryItems)) {
                    $inventoryService = new TreatmentInventoryService();

                    if ($validated['status'] === Treatment::STATUS_COMPLETED) {
                        // Use smart adjustment logic that calculates differences
                        $inventoryService->updateInventoryDeduction($treatment, $inventoryItems);
                    } else {
                        // If treatment is not completed, just update the inventory items without deducting
                        // This allows validation to happen but doesn't affect actual stock
                        $inventoryService->updateInventoryItemsOnly($treatment, $inventoryItems);
                    }
                } elseif ($treatment->inventory_deducted) {
                    // If no inventory items provided but treatment had inventory deducted, reverse it
                    $inventoryService = new TreatmentInventoryService();
                    $inventoryService->reverseInventoryDeduction($treatment);
                }
            });

            $message = 'Treatment updated successfully.';
            if (!empty($inventoryItems) && $validated['status'] === Treatment::STATUS_COMPLETED) {
                $message .= ' Inventory has been adjusted.';
            }

            Log::info('Treatment update completed successfully', [
                'treatment_id' => $treatment->id,
                'message' => $message,
                'inventory_adjusted' => !empty($inventoryItems) && $validated['status'] === Treatment::STATUS_COMPLETED
            ]);

            return redirect()->route('clinic.treatments.show', [
                'clinic' => $clinic->id,
                'treatment' => $treatment->id
            ])->with('success', $message);

        } catch (\App\Services\InsufficientStockException $e) {
            return back()->withErrors(['inventory_items' => $e->getMessage()]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update treatment: ' . $e->getMessage()]);
        }
    }

    public function destroy(Clinic $clinic, Treatment $treatment)
    {
        $this->authorize('delete', $treatment);

        $treatment->delete();

        return redirect()->route('clinic.treatments.index')
            ->with('success', 'Treatment deleted successfully.');
    }

    /**
     * Get available inventory items for a clinic
     */
    public function getAvailableInventory(Clinic $clinic)
    {
        // Check if user belongs to this clinic
        if (Auth::user()->clinic_id !== $clinic->id) {
            return response()->json(['error' => 'Unauthorized access to clinic inventory'], 403);
        }

        // Debug: Log the query
        Log::info('Fetching available inventory for clinic', [
            'clinic_id' => $clinic->id,
            'clinic_name' => $clinic->name
        ]);

        // Check if is_active field exists, if not, just filter by quantity
        $query = $clinic->inventory()->where('quantity', '>', 0);

        // Only add is_active filter if the column exists
        if (Schema::hasColumn('inventory', 'is_active')) {
            $query->where('is_active', true);
        }

        $inventory = $query->orderBy('name')
            ->get(['id', 'name', 'category', 'quantity', 'unit_price', 'minimum_quantity']);

        // Debug: Log the results
        Log::info('Available inventory found', [
            'count' => $inventory->count(),
            'items' => $inventory->toArray()
        ]);

        return response()->json($inventory);
    }

    /**
     * Deduct inventory for a specific treatment
     */
    public function deductInventory(Request $request, Clinic $clinic, Treatment $treatment)
    {
        // Check if user belongs to this clinic and can update the treatment
        if (Auth::user()->clinic_id !== $clinic->id || $treatment->clinic_id !== $clinic->id) {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        $validated = $request->validate([
            'inventory_items' => 'required|array|min:1',
            'inventory_items.*.inventory_id' => 'required|exists:inventory,id',
            'inventory_items.*.quantity_used' => 'required|integer|min:1',
            'inventory_items.*.notes' => 'nullable|string|max:500',
        ]);

        try {
            $inventoryService = new TreatmentInventoryService();
            $inventoryService->deductInventory($treatment, $validated['inventory_items']);

            return response()->json([
                'message' => 'Inventory deducted successfully',
                'treatment_id' => $treatment->id,
                'items_count' => count($validated['inventory_items'])
            ]);

        } catch (\App\Services\InsufficientStockException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to deduct inventory: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Reverse inventory deduction for a treatment
     */
    public function reverseInventoryDeduction(Clinic $clinic, Treatment $treatment)
    {
        // Check if user belongs to this clinic and can update the treatment
        if (Auth::user()->clinic_id !== $clinic->id || $treatment->clinic_id !== $clinic->id) {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        try {
            $inventoryService = new TreatmentInventoryService();
            $inventoryService->reverseInventoryDeduction($treatment);

            return response()->json([
                'message' => 'Inventory deduction reversed successfully',
                'treatment_id' => $treatment->id
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to reverse inventory deduction: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get inventory usage summary for a treatment
     */
    public function getInventorySummary(Clinic $clinic, Treatment $treatment)
    {
        // Check if user belongs to this clinic and can view the treatment
        if (Auth::user()->clinic_id !== $clinic->id || $treatment->clinic_id !== $clinic->id) {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        $inventoryService = new TreatmentInventoryService();
        $summary = $inventoryService->getTreatmentInventorySummary($treatment);

        return response()->json($summary);
    }

    /**
     * Complete treatment with inventory deduction
     */
    public function completeTreatment(Request $request, Clinic $clinic, Treatment $treatment)
    {
        // Check if user belongs to this clinic and can update the treatment
        if (Auth::user()->clinic_id !== $clinic->id || $treatment->clinic_id !== $clinic->id) {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        $validated = $request->validate([
            'inventory_items' => 'nullable|array',
            'inventory_items.*.inventory_id' => 'required_with:inventory_items|exists:inventory,id',
            'inventory_items.*.quantity_used' => 'required_with:inventory_items|integer|min:1',
            'inventory_items.*.notes' => 'nullable|string|max:500',
            'outcome' => 'nullable|string|in:successful,partial,failed,pending',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($treatment, $validated, $clinic) {
                // Update treatment status to completed
                $treatment->update([
                    'status' => Treatment::STATUS_COMPLETED,
                    'outcome' => $validated['outcome'] ?? null,
                    'notes' => $validated['notes'] ?? $treatment->notes,
                ]);

                // Auto-update appointment status to "Completed" if treatment is completed and fully paid
                if ($treatment->appointment_id) {
                    // Check if treatment is fully paid
                    $totalPaid = $clinic->payments()
                        ->where('treatment_id', $treatment->id)
                        ->where('status', 'completed')
                        ->sum('amount');

                    $totalCost = $treatment->cost + ($treatment->inventoryItems->sum('total_cost') ?? 0);

                    if ($totalPaid >= $totalCost) {
                        $appointment = \App\Models\Appointment::find($treatment->appointment_id);
                        if ($appointment && $appointment->appointment_status_id != 3) { // 3 = "Completed" status
                            $appointment->update(['appointment_status_id' => 3]);

                            Log::info('Appointment status auto-updated to Completed via completeTreatment', [
                                'appointment_id' => $appointment->id,
                                'treatment_id' => $treatment->id,
                                'treatment_status' => $treatment->status,
                                'treatment_payment_status' => $treatment->payment_status,
                                'total_paid' => $totalPaid,
                                'total_cost' => $totalCost
                            ]);
                        }
                    }
                }

                // Deduct inventory if items provided
                if (!empty($validated['inventory_items'])) {
                    $inventoryService = new TreatmentInventoryService();
                    $inventoryService->deductInventory($treatment, $validated['inventory_items']);
                }
            });

            $message = 'Treatment completed successfully.';
            if (!empty($validated['inventory_items'])) {
                $message .= ' Inventory has been deducted.';
            }

            return redirect()->route('clinic.treatments.show', [
                'clinic' => $clinic->id,
                'treatment' => $treatment->id
            ])->with('success', $message);

        } catch (\App\Services\InsufficientStockException $e) {
            return back()->withErrors(['inventory_items' => $e->getMessage()]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to complete treatment: ' . $e->getMessage()]);
        }
    }

    /**
     * Export treatments data to Excel
     */
    public function export(Request $request, $clinic)
    {
        $clinicId = is_object($clinic) ? $clinic->id : $clinic;

        // Debug: Log the request
        Log::info('Treatment export called', [
            'clinic_id' => $clinicId,
            'user_id' => Auth::id(),
            'format' => $request->get('format', 'excel'),
            'request_data' => $request->all()
        ]);

        $query = Treatment::where('clinic_id', $clinicId)
                         ->with(['patient.user', 'dentist', 'service', 'inventoryItems.inventory']);

        // Apply the same filters as the index method
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhere('notes', 'like', '%' . $request->search . '%')
                  ->orWhereHas('patient', function($patientQuery) use ($request) {
                      $patientQuery->where('first_name', 'like', '%' . $request->search . '%')
                                  ->orWhere('last_name', 'like', '%' . $request->search . '%');
                  })
                  ->orWhereHas('dentist', function($dentistQuery) use ($request) {
                      $dentistQuery->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->filled('service_id') && $request->service_id !== 'all') {
            $query->where('service_id', $request->service_id);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        // If specific treatment IDs are provided, filter by them
        if ($request->has('treatment_ids')) {
            $treatmentIds = $request->input('treatment_ids');
            if (is_string($treatmentIds)) {
                $treatmentIds = explode(',', $treatmentIds);
            }
            if (is_array($treatmentIds) && !empty($treatmentIds)) {
                $query->whereIn('id', array_filter($treatmentIds));
            }
        }

        // Define headers for the Excel export
        $headers = [
            'Treatment ID',
            'Treatment Name',
            'Description',
            'Patient Name',
            'Patient Email',
            'Patient Phone',
            'Dentist Name',
            'Dentist Email',
            'Service Name',
            'Service Category',
            'Service Price',
            'Status',
            'Payment Status',
            'Cost',
            'Notes',
            'Reason for Visit',
            'Start Date',
            'End Date',
            'Created Date',
            'Updated Date',
            'Inventory Items Used',
            'Total Inventory Cost'
        ];

        // Data mapper function to format the data for Excel
        $dataMapper = function($treatment) {
            // Calculate inventory items used and total cost
            $inventoryItems = [];
            $totalInventoryCost = 0;

            if ($treatment->inventoryItems && $treatment->inventoryItems->count() > 0) {
                foreach ($treatment->inventoryItems as $item) {
                    $inventoryItems[] = $item->inventory->name . ' (Qty: ' . $item->quantity_used . ')';
                    $totalInventoryCost += ($item->quantity_used * $item->unit_cost);
                }
            }

            return [
                $treatment->id ?? 0,
                $treatment->name ?? 'N/A',
                $treatment->description ?? 'N/A',
                $treatment->patient ? trim($treatment->patient->first_name . ' ' . $treatment->patient->last_name) : 'N/A',
                $treatment->patient->email ?? 'N/A',
                $treatment->patient->phone_number ?? 'N/A',
                $treatment->dentist->name ?? 'N/A',
                $treatment->dentist->email ?? 'N/A',
                $treatment->service->name ?? 'N/A',
                $treatment->service->category ?? 'N/A',
                number_format($treatment->service->price ?? 0, 2),
                $treatment->status ?? 'N/A',
                $treatment->payment_status ?? 'N/A',
                number_format($treatment->cost ?? 0, 2),
                $treatment->notes ?? 'N/A',
                $treatment->reason_for_visit ?? 'N/A',
                $treatment->start_date ? Carbon::parse($treatment->start_date)->format('Y-m-d') : 'N/A',
                $treatment->end_date ? Carbon::parse($treatment->end_date)->format('Y-m-d') : 'N/A',
                $treatment->created_at ? Carbon::parse($treatment->created_at)->format('Y-m-d H:i:s') : 'N/A',
                $treatment->updated_at ? Carbon::parse($treatment->updated_at)->format('Y-m-d H:i:s') : 'N/A',
                implode('; ', $inventoryItems) ?: 'N/A',
                number_format($totalInventoryCost, 2)
            ];
        };

        try {
            // Get the data first
            $treatments = $query->get();

            // Generate filename with clinic ID and timestamp
            $generatedFilename = $this->generateFilename('treatments_export', $this->detectFormat(), $clinicId);

            // Determine format from request or parameter
            $exportFormat = $this->detectFormat();

            if ($exportFormat === 'excel') {
                return $this->exportToExcel($treatments, $generatedFilename, $headers, $dataMapper);
            } else {
                return $this->exportToCsv($treatments, $generatedFilename, $headers, $dataMapper);
            }
        } catch (\Exception $e) {
            Log::error('Treatments export failed: ' . $e->getMessage(), [
                'exception' => $e,
                'clinic_id' => $clinicId,
                'request_data' => $request->all()
            ]);

            return response()->json([
                'error' => 'Export failed. Please try again.',
                'message' => config('app.debug') ? $e->getMessage() : 'An error occurred during export.'
            ], 500);
        }
    }
}
