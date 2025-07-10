<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentStatus;
use App\Models\AppointmentType;
use App\Models\Clinic;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Mail\AppointmentApprovedMail;
use App\Mail\AppointmentDeniedMail;
use Illuminate\Support\Facades\Mail;

class AppointmentController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request, Clinic $clinic)
    {
        $this->authorize('viewAny', [Appointment::class, $clinic]);

        $appointments = $clinic->appointments()
            ->with(['patient', 'type', 'status', 'assignedDentist'])
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

    public function create(Request $request, Clinic $clinic)
    {
        $this->authorize('create', [Appointment::class, $clinic]);

        return Inertia::render('Clinic/Appointments/Create', [
            'clinic' => $clinic,
            'types' => AppointmentType::all(),
            'statuses' => AppointmentStatus::all(),
            'dentists' => $clinic->users()
                ->where('role', 'dentist')
                ->select('id', 'name', 'email')
                ->get(),
            'auth' => [
                'id' => Auth::user()->id,
                'name' => Auth::user()->name,
                'email' => Auth::user()->email,
                'clinic_id' => Auth::user()->clinic_id,
                'clinic' => Auth::user()->clinic,
            ],
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
                'ended_at' => 'required|date|after:scheduled_at',
                'appointment_type_id' => 'required|exists:appointment_types,id',
                'appointment_status_id' => 'required|exists:appointment_statuses,id',
                'payment_status' => 'required|in:pending,paid,partial',
                'reason' => 'required|string|max:255',
                'notes' => 'nullable|string',
            ]);

            Log::info('Appointment Validated Data', $validated);

            // Check for scheduling conflicts
            $conflict = Appointment::where('assigned_to', $validated['assigned_to'])
                ->where(function ($query) use ($validated) {
                    $query->whereBetween('scheduled_at', [$validated['scheduled_at'], $validated['ended_at']])
                        ->orWhereBetween('ended_at', [$validated['scheduled_at'], $validated['ended_at']])
                        ->orWhere(function ($q) use ($validated) {
                            $q->where('scheduled_at', '<=', $validated['scheduled_at'])
                                ->where('ended_at', '>=', $validated['ended_at']);
                        });
                })
                ->exists();

            if ($conflict) {
                Log::warning('Appointment Conflict Detected', $validated);
                return back()->withErrors(['scheduled_at' => 'This time slot conflicts with an existing appointment.']);
            }

            // After validating, determine the type
            $type = AppointmentType::find($validated['appointment_type_id']);
            if ($type && strtolower($type->name) === 'walk-in') {
                $status = AppointmentStatus::where('name', 'Confirmed')->first();
                $validated['appointment_status_id'] = $status ? $status->id : null;
            } elseif ($type && strtolower($type->name) === 'online booking') {
                $status = AppointmentStatus::where('name', 'Pending')->first();
                $validated['appointment_status_id'] = $status ? $status->id : null;
            }

            // Create the appointment
            $appointment = $clinic->appointments()->create([
                'patient_id' => $validated['patient_id'],
                'assigned_to' => $validated['assigned_to'],
                'scheduled_at' => $validated['scheduled_at'],
                'ended_at' => $validated['ended_at'],
                'appointment_type_id' => $validated['appointment_type_id'],
                'appointment_status_id' => $validated['appointment_status_id'],
                'payment_status' => $validated['payment_status'],
                'reason' => $validated['reason'],
                'notes' => $validated['notes'],
                'created_by' => Auth::id(),
            ]);

            Log::info('Appointment Created Successfully', [
                'appointment_id' => $appointment->id,
                'appointment' => $appointment->toArray()
            ]);

            return redirect()->route('clinic.appointments.index', $clinic)
                ->with('success', 'Appointment created successfully.');
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
        $appointment->load(['patient', 'type', 'status', 'assignedDentist']);
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
        $appointment->load(['patient', 'type', 'status', 'assignedDentist']);
        return Inertia::render('Clinic/Appointments/Edit', [
            'clinic' => $clinic,
            'appointment' => $appointment,
            'types' => AppointmentType::all(),
            'statuses' => AppointmentStatus::all(),
            'dentists' => $clinic->users()->where('role', 'dentist')->get(),
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
        $validated = $request->validate([
            'appointment_type_id' => ['required', 'exists:appointment_types,id'],
            'appointment_status_id' => ['required', 'exists:appointment_statuses,id'],
            'assigned_to' => ['nullable', 'exists:users,id'],
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
        ]);

        // Check for scheduling conflicts, excluding the current appointment
        $scheduledAt = \Carbon\Carbon::parse($validated['scheduled_at']);
        $endTime = $scheduledAt->copy()->addMinutes($validated['duration']);

        $conflictingAppointment = $clinic->appointments()
            ->where('id', '!=', $appointment->id)
            ->where('assigned_to', $validated['assigned_to'])
            ->where(function ($query) use ($scheduledAt, $endTime) {
                $query->whereBetween('scheduled_at', [$scheduledAt, $endTime])
                    ->orWhereBetween('ended_at', [$scheduledAt, $endTime])
                    ->orWhere(function ($q) use ($scheduledAt, $endTime) {
                        $q->where('scheduled_at', '<=', $scheduledAt)
                            ->where('ended_at', '>=', $endTime);
                    });
            })
            ->first();

        if ($conflictingAppointment) {
            return back()->withErrors([
                'scheduled_at' => 'The selected time slot conflicts with an existing appointment.',
            ])->withInput();
        }

        // Calculate ended_at based on duration
        $validated['ended_at'] = $endTime;

        $appointment->update($validated);

        if ($request->input('appointment_status_id') == 4) { // Cancelled
            $appointment->update([
                'cancelled_at' => now(),
            ]);
        }

        return redirect()->route('clinic.appointments.show', [$clinic->id, $appointment->id])
            ->with('success', 'Appointment updated successfully.');
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
}
