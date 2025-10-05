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

        // Get all treatments for this patient across all clinics
        $treatments = \App\Models\Treatment::whereHas('patient', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['clinic', 'service', 'dentist', 'appointment'])
        ->orderBy('created_at', 'desc')
        ->paginate(10);

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

            $treatment = \App\Models\Treatment::whereHas('patient', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['clinic', 'service', 'dentist', 'appointment', 'patient'])
            ->find($treatmentId);

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
