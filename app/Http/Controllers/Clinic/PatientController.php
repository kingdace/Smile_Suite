<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clinic\PatientRequest;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use App\Http\Controllers\PsgcApiController;
use App\Models\Clinic;
use Illuminate\Support\Facades\Log;

class PatientController extends Controller
{
    protected $psgcApi;

    public function __construct(PsgcApiController $psgcApi)
    {
        $this->middleware(['auth', 'verified']);
        $this->psgcApi = $psgcApi;
    }

    public function index(Request $request)
    {
        $query = Auth::user()->clinic->patients()
            ->with(['appointments', 'treatments', 'payments']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                    ->orWhere('last_name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
                    ->orWhere('phone_number', 'like', "%{$request->search}%");
            });
        }

        if ($request->gender) {
            $query->where('gender', $request->gender);
        }

        if ($request->marital_status) {
            $query->where('marital_status', $request->marital_status);
        }

        if ($request->blood_type) {
            $query->where('blood_type', $request->blood_type);
        }

        if ($request->status) {
            if ($request->status === 'new') {
                $query->where(function($q) {
                    $q->whereNull('last_dental_visit')
                      ->orWhere('last_dental_visit', '')
                      ->orWhere('last_dental_visit', 'No previous visit');
                });
            } elseif ($request->status === 'active') {
                $query->where(function($q) {
                    $q->where('last_dental_visit', 'like', '%Within 3 months%')
                      ->orWhere('last_dental_visit', 'like', '%Within 6 months%')
                      ->orWhere('last_dental_visit', 'like', '%Within 1 year%');
                });
            } elseif ($request->status === 'inactive') {
                $query->where('last_dental_visit', 'like', '%More than 1 year%');
            }
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        $patients = $query->latest()->paginate(10);

        // Transform the data to match the view's expectations
        $patients->getCollection()->transform(function ($patient) {
            return [
                'id' => $patient->id,
                'name' => $patient->first_name . ' ' . $patient->last_name,
                'email' => $patient->email,
                'phone' => $patient->phone_number,
                'last_visit' => $patient->last_dental_visit,
                'created_at' => $patient->created_at,
                'gender' => $patient->gender,
                'age' => $patient->date_of_birth ? $patient->date_of_birth->age : null,
                'status' => $this->getPatientStatus($patient),
                'category' => $patient->category,
                'blood_type' => $patient->blood_type,
                'total_appointments' => $patient->appointments->count(),
                'total_treatments' => $patient->treatments->count(),
                'total_payments' => $patient->payments->count(),
            ];
        });

        // Calculate statistics
        $totalPatients = Auth::user()->clinic->patients()->count();
        $newThisMonth = Auth::user()->clinic->patients()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $recentVisits = Auth::user()->clinic->patients()
            ->where(function($q) {
                $q->where('last_dental_visit', 'like', '%Within 3 months%')
                  ->orWhere('last_dental_visit', 'like', '%Within 6 months%');
            })
            ->count();
        $activePatients = Auth::user()->clinic->patients()
            ->where(function($q) {
                $q->where('last_dental_visit', 'like', '%Within 3 months%')
                  ->orWhere('last_dental_visit', 'like', '%Within 6 months%')
                  ->orWhere('last_dental_visit', 'like', '%Within 1 year%');
            })
            ->count();

        return Inertia::render('Clinic/Patients/Index', [
            'patients' => $patients,
            'filters' => $request->only(['search', 'gender', 'marital_status', 'blood_type', 'status', 'category']),
            'statistics' => [
                'total_patients' => $totalPatients,
                'new_this_month' => $newThisMonth,
                'recent_visits' => $recentVisits,
                'active_patients' => $activePatients,
            ],
        ]);
    }

    /**
     * Get patient status based on last visit
     */
    private function getPatientStatus($patient)
    {
        if (!$patient->last_dental_visit) {
            return 'new';
        }

        // Handle the new string format for last_dental_visit
        $lastVisitText = $patient->last_dental_visit;

        if ($lastVisitText === 'No previous visit' || empty($lastVisitText)) {
            return 'new';
        }

        if (str_contains($lastVisitText, 'Within 3 months')) {
            return 'active';
        }

        if (str_contains($lastVisitText, 'Within 6 months') || str_contains($lastVisitText, 'Within 1 year')) {
            return 'active';
        }

        if (str_contains($lastVisitText, 'More than 1 year')) {
            return 'inactive';
        }

        // Default to active if we can't determine
        return 'active';
    }

    public function create()
    {
        $regions = $this->psgcApi->getRegions()->getData();

        return Inertia::render('Clinic/Patients/Create', [
            'regions' => $regions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone_number' => 'required|string|max:20',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'street_address' => 'nullable|string|max:255',
            'region_code' => 'nullable|string|max:10',
            'province_code' => 'nullable|string|max:10',
            'city_municipality_code' => 'nullable|string|max:10',
            'barangay_code' => 'nullable|string|max:10',
            'postal_code' => 'nullable|string|max:10',
            'address_details' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_number' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:50',
            'insurance_provider' => 'nullable|string|max:255',
            'insurance_policy_number' => 'nullable|string|max:50',
            'blood_type' => 'nullable|string|max:10',
            'occupation' => 'nullable|string|max:255',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'last_dental_visit' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'category' => 'nullable|string|max:50',
            'tags' => 'nullable|json',
        ]);

        $patient = Auth::user()->clinic->patients()->create($validated);

        // Check if the request expects JSON (API request)
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Patient created successfully.',
                'patient' => $patient
            ]);
        }

        return redirect()->route('clinic.patients.show', [
            'clinic' => Auth::user()->clinic_id,
            'patient' => $patient->id
        ])->with('success', 'Patient created successfully.');
    }

    public function show(Request $request, $clinic, Patient $patient)
    {
        $this->authorize('view', $patient);

        // Load basic relationships
        $patient->load(['appointments', 'treatments', 'payments']);

        // Fetch address data from PSGC API
        if ($patient->region_code) {
            $region = $this->psgcApi->getRegions()->getData();
            $patient->region_name = collect($region)->firstWhere('code', $patient->region_code)?->name;
        }

        if ($patient->province_code) {
            $request = new Request(['regionId' => $patient->region_code]);
            $provinces = $this->psgcApi->getProvinces($request)->getData();
            $patient->province_name = collect($provinces)->firstWhere('code', $patient->province_code)?->name;
        }

        if ($patient->city_municipality_code) {
            $request = new Request(['provinceId' => $patient->province_code]);
            $cities = $this->psgcApi->getCities($request)->getData();
            $municipalities = $this->psgcApi->getMunicipalities($request)->getData();
            $combined = array_merge($cities, $municipalities);
            $patient->city_municipality_name = collect($combined)->firstWhere('code', $patient->city_municipality_code)?->name;
        }

        if ($patient->barangay_code) {
            $request = new Request(['cityId' => $patient->city_municipality_code]);
            $barangays = $this->psgcApi->getBarangays($request)->getData();
            $patient->barangay_name = collect($barangays)->firstWhere('code', $patient->barangay_code)?->name;
        }

        return Inertia::render('Clinic/Patients/Show', [
            'patient' => $patient,
        ]);
    }

    public function edit(Request $request, $clinic, Patient $patient)
    {
        $this->authorize('update', $patient);

        $regions = $this->psgcApi->getRegions()->getData();

        // Debug: Log the patient data being passed
        Log::info('Patient data for edit:', [
            'id' => $patient->id,
            'region_code' => $patient->region_code,
            'province_code' => $patient->province_code,
            'city_municipality_code' => $patient->city_municipality_code,
            'barangay_code' => $patient->barangay_code,
            'street_address' => $patient->street_address,
            'postal_code' => $patient->postal_code,
        ]);

        return Inertia::render('Clinic/Patients/Edit', [
            'patient' => $patient,
            'regions' => $regions,
        ]);
    }

    public function update(Request $request, $clinic, Patient $patient)
    {
        $this->authorize('update', $patient);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone_number' => 'required|string|max:20',
            'date_of_birth' => 'required|date',
            'gender' => 'required|string|in:male,female,other',
            'street_address' => 'nullable|string|max:255',
            'region_code' => 'nullable|string|max:10',
            'province_code' => 'nullable|string|max:10',
            'city_municipality_code' => 'nullable|string|max:10',
            'barangay_code' => 'nullable|string|max:10',
            'postal_code' => 'nullable|string|max:10',
            'address_details' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_number' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:50',
            'insurance_provider' => 'nullable|string|max:255',
            'insurance_policy_number' => 'nullable|string|max:50',
            'blood_type' => 'nullable|string|max:10',
            'occupation' => 'nullable|string|max:255',
            'marital_status' => 'nullable|string|in:single,married,divorced,widowed',
            'last_dental_visit' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'category' => 'nullable|string|max:50',
            'tags' => 'nullable|json',
        ]);

        $patient->update($validated);

        // Check if the request expects JSON (API request)
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Patient updated successfully.',
                'patient' => $patient
            ]);
        }

        return redirect()->route('clinic.patients.show', ['clinic' => $clinic, 'patient' => $patient])
            ->with('success', 'Patient updated successfully.');
    }

    public function destroy(Request $request, $clinic, Patient $patient)
    {
        $this->authorize('delete', $patient);

        $patient->delete();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Patient deleted successfully.'
            ]);
        }

        return redirect()->route('clinic.patients.index', ['clinic' => $clinic])
            ->with('success', 'Patient deleted successfully.');
    }

    public function bulkDestroy(Request $request, $clinic)
    {
        $this->authorize('deleteAny', Patient::class);

        $validated = $request->validate([
            'patient_ids' => 'required|array',
            'patient_ids.*' => 'exists:patients,id'
        ]);

        $patients = Patient::whereIn('id', $validated['patient_ids'])
            ->where('clinic_id', Auth::user()->clinic_id)
            ->get();

        foreach ($patients as $patient) {
            $this->authorize('delete', $patient);
            $patient->delete();
        }

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => count($patients) . ' patient(s) deleted successfully.'
            ]);
        }

        return redirect()->route('clinic.patients.index', ['clinic' => $clinic])
            ->with('success', count($patients) . ' patient(s) deleted successfully.');
    }

    public function restore(Request $request, $clinic, $patientId)
    {
        $patient = Patient::withTrashed()->findOrFail($patientId);
        $this->authorize('restore', $patient);

        $patient->restore();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Patient restored successfully.'
            ]);
        }

        return redirect()->route('clinic.patients.show', ['clinic' => $clinic, 'patient' => $patient])
            ->with('success', 'Patient restored successfully.');
    }

    public function search(Request $request, Clinic $clinic)
    {
        $this->authorize('viewAny', [Patient::class, $clinic]);

        $search = $request->input('search');

        $patients = $clinic->patients()
            ->where(function ($query) use ($search) {
                $query->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            })
            ->limit(10)
            ->get();

        return response()->json($patients);
    }
}
