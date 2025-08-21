<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PatientProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    /**
     * Show patient profile
     */
    public function show()
    {
        $user = Auth::user();

        if ($user->user_type !== User::TYPE_PATIENT) {
            abort(403, 'Unauthorized action.');
        }

        // Get all patient records for this user
        $patients = $user->patients()->with('clinic')->get();

        return Inertia::render('Patient/Profile/Show', [
            'user' => $user,
            'patients' => $patients,
        ]);
    }

    /**
     * Show patient profile edit form
     */
    public function edit()
    {
        $user = Auth::user();

        if ($user->user_type !== User::TYPE_PATIENT) {
            abort(403, 'Unauthorized action.');
        }

        // Get all patient records for this user
        $patients = $user->patients()->with('clinic')->get();

        return Inertia::render('Patient/Profile/Edit', [
            'user' => $user,
            'patients' => $patients,
        ]);
    }

    /**
     * Update patient profile
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        if ($user->user_type !== User::TYPE_PATIENT) {
            abort(403, 'Unauthorized action.');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'patients' => 'array',
            'patients.*.id' => 'required|exists:patients,id',
            'patients.*.first_name' => 'required|string|max:255',
            'patients.*.last_name' => 'required|string|max:255',
            'patients.*.phone_number' => 'required|string|max:20',
            'patients.*.emergency_contact_name' => 'nullable|string|max:255',
            'patients.*.emergency_contact_number' => 'nullable|string|max:20',
            'patients.*.emergency_contact_relationship' => 'nullable|string|max:50',
            'patients.*.medical_history' => 'nullable|string|max:2000',
            'patients.*.allergies' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Update user information
        $user->update([
            'name' => $request->name,
            'phone_number' => $request->phone_number,
        ]);

        // Update patient records
        if ($request->has('patients')) {
            foreach ($request->patients as $patientData) {
                $patient = Patient::find($patientData['id']);

                // Ensure this patient belongs to the authenticated user
                if ($patient && $patient->user_id === $user->id) {
                    $patient->update([
                        'first_name' => $patientData['first_name'],
                        'last_name' => $patientData['last_name'],
                        'phone_number' => $patientData['phone_number'],
                        'emergency_contact_name' => $patientData['emergency_contact_name'] ?? null,
                        'emergency_contact_number' => $patientData['emergency_contact_number'] ?? null,
                        'emergency_contact_relationship' => $patientData['emergency_contact_relationship'] ?? null,
                        'medical_history' => $patientData['medical_history'] ?? null,
                        'allergies' => $patientData['allergies'] ?? null,
                    ]);
                }
            }
        }

        return redirect()->route('patient.profile.show')
            ->with('success', 'Profile updated successfully.');
    }
}

