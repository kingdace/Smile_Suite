<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Treatment;
use App\Models\Service;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Traits\SubscriptionAccessControl;

class TreatmentController extends Controller
{
    use SubscriptionAccessControl;

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
            'service_id' => 'nullable|string',
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

        // Create treatment first to get the ID
        $treatment = Auth::user()->clinic->treatments()->create($validated);

        // Handle file uploads
        $uploadedImages = [];

        if ($request->hasFile('imageFiles')) {
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
            if (!empty($uploadedImages)) {
                $allImages = array_merge($uploadedImages, $validated['images'] ?? []);
                $treatment->update(['images' => $allImages]);
            }
        }

        return redirect()->route('clinic.treatments.show', [
            'clinic' => Auth::user()->clinic->id,
            'treatment' => $treatment->id
        ])->with('success', 'Treatment created successfully.');
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
            }
        ]);

        return Inertia::render('Clinic/Treatments/Show', [
            'treatment' => $treatment
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

        return Inertia::render('Clinic/Treatments/Edit', [
            'treatment' => $treatment,
            'patients' => $patients,
            'dentists' => $dentists,
            'services' => $services,
            'appointments' => $appointments,
        ]);
    }

    public function update(Request $request, Clinic $clinic, Treatment $treatment)
    {
        $this->authorize('update', $treatment);

        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'dentist_id' => 'required|exists:users,id',
            'service_id' => 'nullable|string|in:none|exists:services,id',
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

        $treatment->update($validated);

        return redirect()->route('clinic.treatments.show', $treatment)
            ->with('success', 'Treatment updated successfully.');
    }

    public function destroy(Clinic $clinic, Treatment $treatment)
    {
        $this->authorize('delete', $treatment);

        $treatment->delete();

        return redirect()->route('clinic.treatments.index')
            ->with('success', 'Treatment deleted successfully.');
    }
}
