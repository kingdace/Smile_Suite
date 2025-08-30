<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentStatus;
use App\Models\AppointmentType;
use App\Models\Clinic;
use App\Models\Patient;
use App\Services\AppointmentService;
use App\Http\Controllers\PsgcApiController;
use App\Traits\SubscriptionAccessControl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Mail\AppointmentApprovedMail;
use App\Mail\AppointmentDeniedMail;
use Illuminate\Support\Facades\Mail;

class AppointmentController extends Controller
{
    use SubscriptionAccessControl;

    protected $appointmentService;

    public function __construct(AppointmentService $appointmentService)
    {
        $this->middleware(['auth', 'verified']);
        $this->appointmentService = $appointmentService;
    }

    public function index(Request $request, Clinic $clinic)
    {
        // Check subscription access first
        $this->checkSubscriptionAccess();

        $this->authorize('viewAny', [Appointment::class, $clinic]);

        $appointments = $clinic->appointments()
            ->with(['patient', 'type', 'status', 'assignedDentist', 'service'])
            ->when($request->input('search'), function ($query, $search) {
                $query->whereHas('patient', function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone_number', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->whereHas('status', function ($query) use ($status) {
                    $query->where('name', $status);
                });
            })
            ->when($request->input('type'), function ($query, $type) {
                $query->whereHas('type', function ($query) use ($type) {
                    $query->where('name', $type);
                });
            })
            ->when($request->input('date'), function ($query, $date) {
                $query->whereDate('scheduled_at', $date);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        Log::info('Appointments data for Index page', [
            'appointments_data' => $appointments->toArray()
        ]);

        return Inertia::render('Clinic/Appointments/Index', [
            'clinic' => $clinic,
            'appointments' => $appointments,
            'filters' => $request->only(['search', 'status', 'type', 'date']),
        ]);
    }

    public function calendar(Request $request, Clinic $clinic)
    {
        $this->authorize('viewAny', [Appointment::class, $clinic]);

        $appointments = $clinic->appointments()
            ->with(['patient', 'type', 'status', 'assignedDentist', 'service'])
            ->when($request->input('search'), function ($query, $search) {
                $query->whereHas('patient', function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone_number', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->whereHas('status', function ($query) use ($status) {
                    $query->where('name', $status);
                });
            })
            ->when($request->input('dentist'), function ($query, $dentist) {
                $query->where('assigned_to', $dentist);
            })
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return Inertia::render('Clinic/Appointments/Calendar', [
            'clinic' => $clinic,
            'appointments' => ['data' => $appointments],
            'filters' => $request->only(['search', 'status', 'dentist']),
        ]);
    }



    public function createSimplified(Request $request, Clinic $clinic)
    {
        $this->authorize('create', [Appointment::class, $clinic]);

        return Inertia::render('Clinic/Appointments/CreateSimplified', [
            'clinic' => $clinic,
            'types' => AppointmentType::all(),
            'statuses' => AppointmentStatus::all(),
            'dentists' => $clinic->users()
                ->where('role', 'dentist')
                ->where('is_active', true)
                ->select('id', 'name', 'email')
                ->get(),
            'services' => $clinic->services()
                ->where('is_active', true)
                ->with('dentists')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request, Clinic $clinic)
    {
        Log::info('Appointment Store Request', [
            'all' => $request->all(),
            'headers' => $request->headers->all(),
            'user' => Auth::user(),
            'clinic' => $clinic
        ]);

        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,id',
                'assigned_to' => 'required|exists:users,id',
                'scheduled_at' => 'required|date',
                'duration' => 'nullable|integer|min:15|max:240',
                'appointment_type_id' => 'required|exists:appointment_types,id',
                'payment_status' => 'nullable|in:pending,paid,partial,insurance',
                'reason' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
                'service_id' => 'nullable|exists:services,id',
            ]);

            Log::info('Appointment Validated Data', $validated);

            // Use the appointment service to create the appointment
            $appointment = $this->appointmentService->createAppointment(
                $validated,
                $clinic->id,
                Auth::id()
            );

            Log::info('Appointment Created Successfully', [
                'appointment_id' => $appointment->id,
                'appointment' => $appointment->toArray()
            ]);

            return redirect()->route('clinic.appointments.index', $clinic)
                ->with('success', 'Appointment created successfully.');

        } catch (\InvalidArgumentException $e) {
            Log::warning('Appointment Creation Failed - Validation Error', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            // Debug: Log the exact error message
            Log::info('Error message check', [
                'error_message' => $e->getMessage(),
                'contains_conflict' => str_contains($e->getMessage(), 'conflicts with an existing appointment'),
                'contains_conflict_alt' => str_contains($e->getMessage(), 'time slot conflicts'),
            ]);

            // Check if it's a scheduling conflict and offer waitlist option
            if (str_contains($e->getMessage(), 'conflicts with an existing appointment') ||
                str_contains($e->getMessage(), 'time slot conflicts')) {

                Log::info('Conflict detected - setting flash data', [
                    'patient_id' => $request->input('patient_id'),
                    'assigned_to' => $request->input('assigned_to'),
                    'scheduled_at' => $request->input('scheduled_at'),
                ]);

                return back()
                    ->withErrors(['general' => $e->getMessage()])
                    ->with('conflict_detected', true)
                    ->with('conflict_data', [
                        'patient_id' => $request->input('patient_id'),
                        'assigned_to' => $request->input('assigned_to'),
                        'scheduled_at' => $request->input('scheduled_at'),
                        'duration' => $request->input('duration'),
                        'reason' => $request->input('reason'),
                        'notes' => $request->input('notes'),
                        'service_id' => $request->input('service_id'),
                    ]);
            }

            return back()->withErrors(['general' => $e->getMessage()]);
        } catch (\Exception $e) {
            Log::error('Error creating appointment', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            return back()->withErrors(['general' => 'Failed to create appointment: ' . $e->getMessage()]);
        }
    }

    public function show(Clinic $clinic, Appointment $appointment)
    {
        $this->authorize('view', [$appointment, $clinic]);
        $appointment->load(['patient', 'type', 'status', 'assignedDentist', 'service', 'creator']);

        // Load patient address names if patient exists
        if ($appointment->patient) {
            $patient = $appointment->patient;

            // Fetch address data from PSGC API (same logic as PatientController)
            if ($patient->region_code) {
                $psgcApi = app(\App\Http\Controllers\PsgcApiController::class);
                $region = $psgcApi->getRegions()->getData();
                $patient->region_name = collect($region)->firstWhere('code', $patient->region_code)?->name;
            }

            if ($patient->province_code) {
                $psgcApi = app(\App\Http\Controllers\PsgcApiController::class);
                $request = new \Illuminate\Http\Request(['regionId' => $patient->region_code]);
                $provinces = $psgcApi->getProvinces($request)->getData();
                $patient->province_name = collect($provinces)->firstWhere('code', $patient->province_code)?->name;
            }

            if ($patient->city_municipality_code) {
                $psgcApi = app(\App\Http\Controllers\PsgcApiController::class);
                $request = new \Illuminate\Http\Request(['provinceId' => $patient->province_code]);
                $cities = $psgcApi->getCities($request)->getData();
                $municipalities = $psgcApi->getMunicipalities($request)->getData();
                $combined = array_merge($cities, $municipalities);
                $patient->city_municipality_name = collect($combined)->firstWhere('code', $patient->city_municipality_code)?->name;
            }

            if ($patient->barangay_code) {
                $psgcApi = app(\App\Http\Controllers\PsgcApiController::class);
                $request = new \Illuminate\Http\Request(['cityId' => $patient->city_municipality_code]);
                $barangays = $psgcApi->getBarangays($request)->getData();
                $patient->barangay_name = collect($barangays)->firstWhere('code', $patient->barangay_code)?->name;
            }
        }

        return Inertia::render('Clinic/Appointments/Show', [
            'clinic' => $clinic,
            'appointment' => $appointment,
            'auth' => [
                'id' => Auth::user()->id,
                'name' => Auth::user()->name,
                'email' => Auth::user()->email,
                'clinic_id' => Auth::user()->clinic_id,
                'clinic' => Auth::user()->clinic,
            ],
        ]);
    }

    public function edit(Clinic $clinic, Appointment $appointment)
    {
        $this->authorize('update', [$appointment, $clinic]);
        $appointment->load(['patient', 'type', 'status', 'assignedDentist', 'service']);
        return Inertia::render('Clinic/Appointments/Edit', [
            'clinic' => $clinic,
            'appointment' => $appointment,
            'types' => AppointmentType::all(),
            'statuses' => AppointmentStatus::all(),
            'dentists' => $clinic->users()->where('role', 'dentist')->get(),
            'services' => $clinic->services()->active()->get(),
            'auth' => [
                'id' => Auth::user()->id,
                'name' => Auth::user()->name,
                'email' => Auth::user()->email,
                'clinic_id' => Auth::user()->clinic_id,
                'clinic' => Auth::user()->clinic,
            ],
        ]);
    }

    public function update(Request $request, Clinic $clinic, Appointment $appointment)
    {
        $this->authorize('update', [$appointment, $clinic]);

        try {
            $validated = $request->validate([
                'appointment_type_id' => ['required', 'exists:appointment_types,id'],
                'appointment_status_id' => ['required', 'exists:appointment_statuses,id'],
                'assigned_to' => ['nullable', 'string'],
                'scheduled_at' => ['required', 'date'],
                'duration' => ['required', 'integer', 'min:15', 'max:240'],
                'reason' => ['nullable', 'string', 'max:255'],
                'custom_reason' => ['nullable', 'string', 'max:255'],
                'payment_status' => ['required', 'string', 'in:pending,partial,paid,insurance'],
                'is_follow_up' => ['boolean'],
                'previous_visit_date' => ['nullable', 'required_if:is_follow_up,true', 'date'],
                'previous_visit_notes' => ['nullable', 'string'],
                'notes' => ['nullable', 'string'],
                'cancellation_reason' => ['nullable', 'required_if:appointment_status_id,4', 'string', 'max:255'],
                'service_id' => ['nullable', 'string'],
            ]);

            // Handle special values
            if ($validated['assigned_to'] === 'unassigned') {
                $validated['assigned_to'] = null;
            }
            if ($validated['service_id'] === 'none') {
                $validated['service_id'] = null;
            }

            // Use the appointment service to update the appointment
            $updatedAppointment = $this->appointmentService->updateAppointment($appointment, $validated);

            return redirect()->route('clinic.appointments.show', [$clinic->id, $appointment->id])
                ->with('success', 'Appointment updated successfully.');

        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['general' => $e->getMessage()])->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating appointment', [
                'error' => $e->getMessage(),
                'appointment_id' => $appointment->id,
                'request' => $request->all()
            ]);
            return back()->withErrors(['general' => 'Failed to update appointment: ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy(Clinic $clinic, Appointment $appointment)
    {
        $this->authorize('delete', [$appointment, $clinic]);
        $appointment->delete();
        return redirect()->route('clinic.appointments.index', $clinic->id)
            ->with('success', 'Appointment deleted successfully.');
    }

    public function approveOnlineRequest(Request $request, Clinic $clinic, Appointment $appointment)
    {
        $this->authorize('update', [$appointment, $clinic]);
        if (!$appointment->type || !isset($appointment->type->name) || strtolower($appointment->type->name) !== 'online booking' || !$appointment->status || !isset($appointment->status->name) || $appointment->status->name !== 'Pending') {
            $msg = 'Only pending online requests can be approved.';
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json(['message' => $msg], 422);
            }
            return back()->withErrors(['general' => $msg]);
        }
        $validated = $request->validate([
            'assigned_to' => 'nullable|exists:users,id',
        ]);
        $confirmedStatus = AppointmentStatus::where('name', 'Confirmed')->first();
        $appointment->update([
            'appointment_status_id' => $confirmedStatus ? $confirmedStatus->id : $appointment->appointment_status_id,
            'assigned_to' => $validated['assigned_to'] ?? null,
        ]);
        // Ensure relationships are loaded for email
        $appointment->load(['clinic', 'patient', 'assignedDentist']);
        $patient = $appointment->patient;
        $dentist = $appointment->assignedDentist;
        $mailSent = false;
        $mailError = null;
        if ($patient && $patient->email) {
            try {
                Log::info('Sending approval email to: ' . $patient->email);
                Mail::to($patient->email)->send(new \App\Mail\AppointmentApprovedMail($appointment, $patient, $dentist));
                $mailSent = true;
            } catch (\Exception $e) {
                Log::error('Failed to send approval email: ' . $e->getMessage());
                $mailError = $e->getMessage();
            }
        }
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'mail_sent' => $mailSent,
                'mail_error' => $mailError,
                'message' => 'Appointment approved and confirmed.'
            ]);
        }
        return back()->with('success', 'Appointment approved and confirmed.');
    }

    public function denyOnlineRequest(Request $request, Clinic $clinic, Appointment $appointment)
    {
        $this->authorize('update', [$appointment, $clinic]);
        if (!$appointment->type || !isset($appointment->type->name) || strtolower($appointment->type->name) !== 'online booking' || !$appointment->status || !isset($appointment->status->name) || $appointment->status->name !== 'Pending') {
            $msg = 'Only pending online requests can be denied.';
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json(['message' => $msg], 422);
            }
            return back()->withErrors(['general' => $msg]);
        }
        $validated = $request->validate([
            'cancellation_reason' => 'nullable|string|max:255',
        ]);
        $cancelledStatus = AppointmentStatus::where('name', 'Cancelled')->first();
        $appointment->update([
            'appointment_status_id' => $cancelledStatus ? $cancelledStatus->id : $appointment->appointment_status_id,
            'cancellation_reason' => $validated['cancellation_reason'] ?? null,
            'cancelled_at' => now(),
        ]);
        // Ensure relationships are loaded for email
        $appointment->load(['clinic', 'patient']);
        $patient = $appointment->patient;
        $mailSent = false;
        $mailError = null;
        if ($patient && $patient->email) {
            try {
                Log::info('Sending denial email to: ' . $patient->email);
                Mail::to($patient->email)->send(new \App\Mail\AppointmentDeniedMail($appointment, $patient, $validated['cancellation_reason'] ?? null));
                $mailSent = true;
            } catch (\Exception $e) {
                Log::error('Failed to send denial email: ' . $e->getMessage());
                $mailError = $e->getMessage();
            }
        }
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'mail_sent' => $mailSent,
                'mail_error' => $mailError,
                'message' => 'Appointment request denied.'
            ]);
        }
        return back()->with('success', 'Appointment request denied.');
    }

    /**
     * Add appointment to waitlist when there's a conflict
     */
    public function addToWaitlist(Request $request, Clinic $clinic)
    {
        $this->authorize('create', [Appointment::class, $clinic]);

        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'assigned_to' => 'required|exists:users,id',
            'scheduled_at' => 'required|date',
            'duration' => 'nullable|integer|min:15|max:480',
            'reason' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'service_id' => 'nullable|exists:services,id',
            'priority' => 'required|in:urgent,high,normal,low',
            'preferred_contact_method' => 'required|in:phone,email,sms',
        ]);

        try {
            // Create waitlist entry
            $waitlist = $clinic->waitlist()->create([
                'patient_id' => $validated['patient_id'],
                'assigned_dentist_id' => $validated['assigned_to'],
                'preferred_date' => $validated['scheduled_at'],
                'preferred_time' => \Carbon\Carbon::parse($validated['scheduled_at'])->format('H:i'),
                'duration' => $validated['duration'] ?? 30,
                'reason' => $validated['reason'],
                'notes' => $validated['notes'],
                'service_id' => $validated['service_id'],
                'priority' => $validated['priority'],
                'preferred_contact_method' => $validated['preferred_contact_method'],
                'status' => 'active',
                'created_by' => Auth::id(),
            ]);

            Log::info('Waitlist entry created from appointment conflict', [
                'waitlist_id' => $waitlist->id,
                'patient_id' => $validated['patient_id'],
                'preferred_date' => $validated['scheduled_at'],
            ]);

            return redirect()->route('clinic.waitlist.index', $clinic)
                ->with('success', 'Patient added to waitlist successfully. We will contact you when a slot becomes available.');

        } catch (\Exception $e) {
            Log::error('Error adding to waitlist', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);
            return back()->withErrors(['general' => 'Failed to add to waitlist: ' . $e->getMessage()]);
        }
    }
}
