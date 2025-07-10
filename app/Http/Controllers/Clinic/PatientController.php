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

        $patients = $query->latest()->paginate(10);

        // Transform the data to match the view's expectations
        $patients->getCollection()->transform(function ($patient) {
            return [
                'id' => $patient->id,
                'name' => $patient->first_name . ' ' . $patient->last_name,
                'email' => $patient->email,
                'phone' => $patient->phone_number,
                'last_visit' => $patient->last_dental_visit,
            ];
        });

        return Inertia::render('Clinic/Patients/Index', [
            'patients' => $patients,
            'filters' => $request->only(['search', 'gender', 'marital_status']),
        ]);
    }

    public function create()
    {
        $regions = $this->psgcApi->getRegions()->getData();
        return Inertia::render('Clinic/Patients/Create', [
            'regions' => $regions,
            'auth' => Auth::user(),
            'clinic' => Auth::user()->clinic_id
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
            'blood_type' => 'nullable|string|max:5',
            'occupation' => 'nullable|string|max:255',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'last_dental_visit' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $patient = Auth::user()->clinic->patients()->create($validated);

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
            'auth' => Auth::user(),
            'clinic' => Auth::user()->clinic_id
        ]);
    }

    public function edit(Request $request, $clinic, Patient $patient)
    {
        $this->authorize('update', $patient);

        $regions = $this->psgcApi->getRegions()->getData();

        return Inertia::render('Clinic/Patients/Edit', [
            'patient' => $patient,
            'regions' => $regions,
            'auth' => Auth::user(),
            'clinic' => Auth::user()->clinic_id
        ]);
    }

    public function update(Request $request, Patient $patient)
    {
        $this->authorize('update', $patient);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone_number' => 'required|string|max:20',
            'date_of_birth' => 'required|date',
            'gender' => 'required|string|in:male,female,other',
            'region_code' => 'nullable|string|max:10',
            'province_code' => 'nullable|string|max:10',
            'city_municipality_code' => 'nullable|string|max:10',
            'barangay_code' => 'nullable|string|max:10',
            'postal_code' => 'nullable|string|max:10',
            'address_details' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'blood_type' => 'nullable|string|max:5',
            'occupation' => 'nullable|string|max:255',
            'marital_status' => 'nullable|string|in:single,married,divorced,widowed',
            'last_dental_visit' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $patient->update($validated);

        return redirect()->route('clinic.patients.show', $patient)
            ->with('success', 'Patient updated successfully.');
    }

    public function destroy(Patient $patient)
    {
        $clinic = Auth::user()->clinic;
        $this->authorize('delete', [$patient, $clinic]);

        $patient->delete();

        return redirect()->route('clinic.patients.index')
            ->with('success', 'Patient deleted successfully.');
    }

    public function restore($id)
    {
        $patient = Patient::withTrashed()->findOrFail($id);
        $this->authorize('restore', $patient);

        $patient->restore();

        return redirect()->route('clinic.patients.show', $patient)
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
