<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clinic\PatientRequest;
use App\Models\Patient;
use App\Services\PatientLinkingService;
use App\Traits\SubscriptionAccessControl;
use App\Traits\ExportTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use App\Http\Controllers\PsgcApiController;
use App\Models\Clinic;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PatientController extends Controller
{
    use SubscriptionAccessControl, ExportTrait;

    protected $psgcApi;
    protected $patientLinkingService;

    public function __construct(PsgcApiController $psgcApi, PatientLinkingService $patientLinkingService)
    {
        $this->middleware(['auth', 'verified']);
        $this->psgcApi = $psgcApi;
        $this->patientLinkingService = $patientLinkingService;
    }

    public function index(Request $request)
    {
        // Check subscription access first
        $this->checkSubscriptionAccess();

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
                $query->new();
            } elseif ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'inactive') {
                $query->inactive();
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
                'name' => $patient->full_name,
                'email' => $patient->email,
                'phone' => $patient->phone_number,
                'last_visit' => $patient->last_dental_visit,
                'created_at' => $patient->created_at,
                'gender' => $patient->gender,
                'age' => $patient->age,
                'status' => $patient->status,
                'category' => $patient->category,
                'category_display_name' => $patient->category_display_name,
                'blood_type' => $patient->blood_type,
                'total_appointments' => $patient->appointments->count(),
                'total_treatments' => $patient->treatments->count(),
                'total_payments' => $patient->payments->count(),
            ];
        });

        // Calculate statistics using model scopes
        $clinicId = Auth::user()->clinic_id;
        $totalPatients = Patient::where('clinic_id', $clinicId)->count();
        $newThisMonth = Patient::where('clinic_id', $clinicId)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $recentVisits = Patient::where('clinic_id', $clinicId)->active()->count();
        $activePatients = Patient::where('clinic_id', $clinicId)->active()->count();
        $newPatients = Patient::where('clinic_id', $clinicId)->new()->count();
        $inactivePatients = Patient::where('clinic_id', $clinicId)->inactive()->count();

        // Debug logging
        Log::info('Patient statistics debug', [
            'clinic_id' => Auth::user()->clinic_id,
            'total_patients' => $totalPatients,
            'new_this_month' => $newThisMonth,
            'recent_visits' => $recentVisits,
            'active_patients' => $activePatients,
            'new_patients' => $newPatients,
            'inactive_patients' => $inactivePatients,
        ]);



        return Inertia::render('Clinic/Patients/Index', [
            'patients' => $patients,
            'filters' => $request->only(['search', 'gender', 'marital_status', 'blood_type', 'status', 'category']),
            'statistics' => [
                'total_patients' => $totalPatients,
                'new_this_month' => $newThisMonth,
                'recent_visits' => $recentVisits,
                'active_patients' => $activePatients,
                'new_patients' => $newPatients,
                'inactive_patients' => $inactivePatients,
            ],
        ]);
    }



    public function create()
    {
        $regions = $this->psgcApi->getRegions()->getData();

        return Inertia::render('Clinic/Patients/Create', [
            'regions' => $regions,
            'categories' => Patient::getAvailableCategories(),
            'bloodTypes' => Patient::getAvailableBloodTypes(),
            'lastVisitOptions' => Patient::getAvailableLastVisitOptions(),
        ]);
    }

    public function store(PatientRequest $request)
    {
        $validated = $request->validated();

        // Use the patient linking service to handle creation
        $result = $this->patientLinkingService->handleManualPatientCreation(
            $validated,
            Auth::user()->clinic
        );

        $patient = $result['patient'];

        // Check if the request expects JSON (API request)
        if ($request->expectsJson()) {
            return response()->json([
                'success' => !isset($result['error']),
                'message' => $result['message'],
                'patient' => $patient,
                'action' => $result['action']
            ]);
        }

        if (isset($result['error'])) {
            return redirect()->back()
                ->withErrors(['email' => $result['message']])
                ->withInput();
        }

        return redirect()->route('clinic.patients.show', [
            'clinic' => Auth::user()->clinic_id,
            'patient' => $patient->id
        ])->with('success', $result['message']);
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
            'categories' => Patient::getAvailableCategories(),
            'bloodTypes' => Patient::getAvailableBloodTypes(),
            'lastVisitOptions' => Patient::getAvailableLastVisitOptions(),
        ]);
    }

    public function update(PatientRequest $request, $clinic, Patient $patient)
    {
        $this->authorize('update', $patient);

        $validated = $request->validated();
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

    /**
     * Convert PSGC codes to names for a collection of patients
     */
    private function convertAddressCodesToNames($patients)
    {
        // Get all unique region codes
        $regionCodes = $patients->pluck('region_code')->filter()->unique();
        $regions = [];
        if ($regionCodes->isNotEmpty()) {
            $regions = $this->psgcApi->getRegions()->getData();
        }

        // Get all unique province codes
        $provinceCodes = $patients->pluck('province_code')->filter()->unique();
        $provinces = [];
        if ($provinceCodes->isNotEmpty()) {
            // Group provinces by region
            $provincesByRegion = [];
            foreach ($regionCodes as $regionCode) {
                $request = new Request(['regionId' => $regionCode]);
                $regionProvinces = $this->psgcApi->getProvinces($request)->getData();
                $provincesByRegion[$regionCode] = $regionProvinces;
            }
        }

        // Get all unique city/municipality codes
        $cityMunicipalityCodes = $patients->pluck('city_municipality_code')->filter()->unique();
        $citiesMunicipalities = [];
        if ($cityMunicipalityCodes->isNotEmpty()) {
            // Group cities/municipalities by province
            $citiesByProvince = [];
            foreach ($provinceCodes as $provinceCode) {
                $request = new Request(['provinceId' => $provinceCode]);
                $cities = $this->psgcApi->getCities($request)->getData();
                $municipalities = $this->psgcApi->getMunicipalities($request)->getData();
                $citiesByProvince[$provinceCode] = array_merge($cities, $municipalities);
            }
        }

        // Apply the conversions to each patient
        foreach ($patients as $patient) {
            // Convert region code to name
            if ($patient->region_code && !empty($regions)) {
                $patient->region_name = collect($regions)->firstWhere('code', $patient->region_code)?->name;
            }

            // Convert province code to name
            if ($patient->province_code && isset($provincesByRegion[$patient->region_code])) {
                $patient->province_name = collect($provincesByRegion[$patient->region_code])->firstWhere('code', $patient->province_code)?->name;
            }

            // Convert city/municipality code to name
            if ($patient->city_municipality_code && isset($citiesByProvince[$patient->province_code])) {
                $patient->city_municipality_name = collect($citiesByProvince[$patient->province_code])->firstWhere('code', $patient->city_municipality_code)?->name;
            }
        }
    }

    /**
     * Export patients data to Excel
     */
    public function export(Request $request, $clinic)
    {
        // Check subscription access first
        $this->checkSubscriptionAccess();

        $clinic = Auth::user()->clinic;

        $query = $clinic->patients()
            ->withCount(['appointments', 'treatments'])
            ->withSum('payments', 'amount')
            ->withAvg('reviews', 'rating');

        // Apply the same filters as the index method
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
                $query->new();
            } elseif ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'inactive') {
                $query->inactive();
            }
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        // If specific patient IDs are provided, filter by them
        if ($request->has('patient_ids')) {
            $patientIds = $request->input('patient_ids');
            if (is_string($patientIds)) {
                // Handle comma-separated string
                $patientIds = explode(',', $patientIds);
            }
            if (is_array($patientIds) && !empty($patientIds)) {
                $query->whereIn('id', array_filter($patientIds));
            }
        }

        // Define headers for the Excel export
        $headers = [
            'Patient ID',
            'First Name',
            'Last Name',
            'Full Name',
            'Email',
            'Phone Number',
            'Date of Birth',
            'Age (Years)',
            'Gender',
            'Patient Category',
            'Patient Status',
            'Blood Type',
            'Marital Status',
            'Total Appointments',
            'Total Treatments',
            'Total Payments (₱)',
            'Average Rating',
            'Last Dental Visit',
            'Insurance Provider',
            'Emergency Contact Name',
            'Emergency Contact Number',
            'Street Address',
            'City/Municipality',
            'Province',
            'Region',
            'Postal Code',
            'Has User Account',
            'Registration Date'
        ];

        // Data mapper function to format the data for Excel
        $dataMapper = function($patient) {
            return [
                $patient->id ?? 0,
                $patient->first_name ?? '',
                $patient->last_name ?? '',
                trim(($patient->first_name ?? '') . ' ' . ($patient->last_name ?? '')),
                $patient->email ?? '',
                $patient->phone_number ?? '',
                $patient->date_of_birth ? Carbon::parse($patient->date_of_birth)->format('Y-m-d') : '',
                $patient->date_of_birth ? Carbon::parse($patient->date_of_birth)->age : '',
                $patient->gender ? ucfirst($patient->gender) : '',
                $patient->category ? ucwords(str_replace('_', ' ', $patient->category)) : '',
                $patient->status ? ucfirst($patient->status) : '',
                $patient->blood_type ?? '',
                $patient->marital_status ? ucfirst($patient->marital_status) : '',
                $patient->appointments_count ?? 0,
                $patient->treatments_count ?? 0,
                number_format($patient->payments_sum_amount ?? 0, 2),
                $patient->reviews_avg_rating ? number_format($patient->reviews_avg_rating, 1) : '',
                $patient->last_dental_visit ?? '',
                $patient->insurance_provider ?? '',
                $patient->emergency_contact_name ?? '',
                $patient->emergency_contact_number ?? '',
                $patient->street_address ?? '',
                $patient->city_municipality_name ?? '',
                $patient->province_name ?? '',
                $patient->region_name ?? '',
                $patient->postal_code ?? '',
                $patient->user_id ? 'Yes' : 'No',
                $patient->created_at ? Carbon::parse($patient->created_at)->format('Y-m-d H:i:s') : ''
            ];
        };

        try {
            // Get the data first
            $patients = $query->get();

            // Convert PSGC codes to names for all patients
            $this->convertAddressCodesToNames($patients);

            // Generate filename with clinic ID and timestamp
            $generatedFilename = $this->generateFilename('patients_export', $this->detectFormat(), $clinic->id);

            // Determine format from request or parameter
            $exportFormat = $this->detectFormat();

            if ($exportFormat === 'excel') {
                return $this->exportToExcel($patients, $generatedFilename, $headers, $dataMapper);
            } else {
                return $this->exportToCsv($patients, $generatedFilename, $headers, $dataMapper);
            }
        } catch (\Exception $e) {
            Log::error('Patient export failed: ' . $e->getMessage(), [
                'exception' => $e,
                'clinic_id' => $clinic->id,
                'request_data' => $request->all()
            ]);

            return response()->json([
                'error' => 'Export failed. Please try again.',
                'message' => config('app.debug') ? $e->getMessage() : 'An error occurred during export.'
            ], 500);
        }
    }
}
