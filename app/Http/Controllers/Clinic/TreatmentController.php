<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Treatment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TreatmentController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request)
    {
        $clinicId = Auth::user()->clinic->id;

        $treatments = Treatment::where('clinic_id', $clinicId)
                               ->with(['patient.user', 'dentist'])
                               ->orderByDesc('created_at')
                               ->paginate(10);

        // Temporarily dump and die to inspect data
        // dd($treatments->toArray()); // Uncomment this line to inspect the data

        return Inertia::render('Clinic/Treatments/Index', [
            'treatments' => $treatments,
            'filters' => $request->only(['search'])
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

        // dd($appointments->toArray()); // <-- This line will be re-added

        return Inertia::render('Clinic/Treatments/Create', [
            'patients' => $patients,
            'dentists' => $dentists,
            'appointments' => $appointments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'dentist_id' => 'required|exists:users,id',
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
            'recommendations' => 'nullable|string',
        ]);

        // Map dentist_id to user_id for the database
        $validated['user_id'] = $validated['dentist_id'];
        unset($validated['dentist_id']);

        $treatment = Auth::user()->clinic->treatments()->create($validated);

        // Temporarily dump and die to inspect route parameters
        // dd([
        //     'clinic_id' => Auth::user()->clinic->id,
        //     'treatment_id' => $treatment->id
        // ]); // Uncomment this line to inspect the data

        return redirect()->route('clinic.treatments.show', [
            'clinic' => Auth::user()->clinic->id,
            'treatment' => $treatment->id
        ])->with('success', 'Treatment created successfully.');
    }

    public function show(Request $request, $treatmentId)
    {
        // We will explicitly retrieve the treatment ID from the route parameters
        // as a workaround for the persistent binding issue.
        $actualTreatmentId = $request->route('treatment');

        $treatment = Treatment::findOrFail($actualTreatmentId);
        $this->authorize('view', $treatment);

        $treatment->load([
            'patient.user',
            'dentist',
            'appointment' => function($query) {
                $query->with(['patient.user', 'type', 'status', 'assignedDentist']);
            }
        ]);

        return Inertia::render('Clinic/Treatments/Show', [
            'treatment' => $treatment
        ]);
    }

    public function edit(Treatment $treatment)
    {
        $this->authorize('update', $treatment);

        return Inertia::render('Clinic/Treatments/Edit', [
            'treatment' => $treatment
        ]);
    }

    public function update(Request $request, Treatment $treatment)
    {
        $this->authorize('update', $treatment);

        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'dentist_id' => 'required|exists:users,id',
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
        ]);

        $treatment->update($validated);

        return redirect()->route('clinic.treatments.show', $treatment)
            ->with('success', 'Treatment updated successfully.');
    }

    public function destroy(Treatment $treatment)
    {
        $this->authorize('delete', $treatment);

        $treatment->delete();

        return redirect()->route('clinic.treatments.index')
            ->with('success', 'Treatment deleted successfully.');
    }
}
