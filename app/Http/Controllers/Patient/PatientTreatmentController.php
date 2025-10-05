<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PatientTreatmentController extends Controller
{
    /**
     * Display patient's treatment history across all connected clinics
     */
    public function index()
    {
        $user = Auth::user();

        // First, let's check if the user has any patient records
        $patients = \App\Models\Patient::where('user_id', $user->id)->get();
        \Log::info('PatientTreatmentController::index - User patients', [
            'user_id' => $user->id,
            'patients_count' => $patients->count(),
            'patients_data' => $patients->toArray(),
        ]);

        // Get all treatments for this patient across all clinics
        $treatments = \App\Models\Treatment::whereHas('patient', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['clinic', 'service', 'dentist', 'appointment'])
        ->orderBy('created_at', 'desc')
        ->paginate(10);

        \Log::info('PatientTreatmentController::index - Treatments found', [
            'user_id' => $user->id,
            'treatments_count' => $treatments->count(),
            'treatments_data' => $treatments->toArray(),
        ]);

        // Get connected clinics for statistics using PatientLinkingService
        $patientLinkingService = new \App\Services\PatientLinkingService();
        $clinicRecords = $patientLinkingService->getPatientClinicRecords($user);

        return Inertia::render('Patient/Treatments/Index', [
            'user' => $user,
            'treatments' => $treatments,
            'clinicRecords' => $clinicRecords,
        ]);
    }

    /**
     * Show specific treatment details
     */
public function show($id)
    {
        $user = Auth::user();

        try {
            // Ensure $id is a valid integer
            $treatmentId = (int) $id;

            if ($treatmentId <= 0) {
                throw new \Exception('Invalid treatment ID');
            }

            // First, let's check if the user has any patient records
            $patients = \App\Models\Patient::where('user_id', $user->id)->get();
            \Log::info('PatientTreatmentController::show - User patients', [
                'user_id' => $user->id,
                'patients_count' => $patients->count(),
                'patients_data' => $patients->toArray(),
            ]);

            // Check if there are any treatments for this user's patients
            $allTreatments = \App\Models\Treatment::whereIn('patient_id', $patients->pluck('id'))->get();
            \Log::info('PatientTreatmentController::show - All treatments for user', [
                'user_id' => $user->id,
                'treatments_count' => $allTreatments->count(),
                'treatments_data' => $allTreatments->toArray(),
            ]);

            $treatment = \App\Models\Treatment::whereHas('patient', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['clinic', 'service', 'dentist', 'appointment', 'patient'])
            ->find($treatmentId);

            // Debug: Log the treatment data
            \Log::info('PatientTreatmentController::show - Treatment found', [
                'user_id' => $user->id,
                'treatment_id' => $treatmentId,
                'treatment_found' => $treatment ? true : false,
                'treatment_data' => $treatment ? $treatment->toArray() : null,
            ]);

            // If treatment not found, return a placeholder treatment
            if (!$treatment) {
                $treatment = $this->getPlaceholderTreatment($user);
            }

            return Inertia::render('Patient/Treatments/Show', [
                'user' => $user,
                'treatment' => $treatment,
                'isPlaceholder' => !$treatment->exists ?? true,
            ]);

        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('PatientTreatmentController::show error: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'treatment_id' => $id,
                'error' => $e->getMessage()
            ]);

            // Return placeholder treatment on error
            $treatment = $this->getPlaceholderTreatment($user);

            return Inertia::render('Patient/Treatments/Show', [
                'user' => $user,
                'treatment' => $treatment,
                'isPlaceholder' => true,
            ]);
        }
    }

    /**
     * Get a placeholder treatment for error cases
     */
    private function getPlaceholderTreatment($user)
    {
        return (object) [
            'id' => 0,
            'name' => 'Treatment Not Found',
            'description' => 'This treatment record could not be found or may not be available yet.',
            'status' => 'not_found',
            'cost' => 0,
            'notes' => 'The treatment details are not available at this time. Please contact your clinic for more information.',
            'created_at' => now(),
            'updated_at' => now(),
            'clinic' => (object) [
                'id' => 0,
                'name' => 'Clinic Information Not Available',
                'address' => 'Please contact your clinic for details',
                'phone' => null,
                'email' => null,
            ],
            'service' => (object) [
                'id' => 0,
                'name' => 'Service Not Specified',
                'description' => 'Service details are not available',
            ],
            'dentist' => null,
            'appointment' => null,
            'patient' => (object) [
                'id' => 0,
                'user_id' => $user->id,
                'first_name' => $user->name ?? 'Patient',
                'last_name' => '',
            ],
        ];
    }
}
