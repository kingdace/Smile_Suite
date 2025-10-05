<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\AppointmentCancelledMail;
use App\Mail\AppointmentRescheduledMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PatientDashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index()
    {
        $user = Auth::user();

        if ($user->role !== 'patient') {
            abort(403, 'Unauthorized action.');
        }

        // Get all patient records for this user (one per clinic)
        $patients = \App\Models\Patient::where('user_id', $user->id)->with('clinic')->get();

        // Get all upcoming appointments for all patient records
        $appointments = \App\Models\Appointment::with(['clinic', 'status'])
            ->whereIn('patient_id', $patients->pluck('id'))
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at')
            ->get();

        // Get all treatments for all patient records
        $treatments = \App\Models\Treatment::with(['clinic', 'service', 'dentist', 'appointment'])
            ->whereIn('patient_id', $patients->pluck('id'))
            ->orderBy('created_at', 'desc')
            ->get();

        // Debug: Log the data being fetched
        \Log::info('PatientDashboard Debug', [
            'user_id' => $user->id,
            'patients_count' => $patients->count(),
            'patient_ids' => $patients->pluck('id')->toArray(),
            'treatments_count' => $treatments->count(),
            'treatments_data' => $treatments->toArray(),
        ]);

        // Get clinic records for statistics using PatientLinkingService
        $patientLinkingService = new \App\Services\PatientLinkingService();
        $clinicRecords = $patientLinkingService->getPatientClinicRecords($user);

        return Inertia::render('Patient/Dashboard', [
            'user' => $user,
            'patients' => $patients,
            'appointments' => $appointments,
            'treatments' => $treatments,
            'clinicRecords' => $clinicRecords,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    /**
     * Show appointment details for patient
     */
    public function showAppointment($appointmentId)
    {
        $user = Auth::user();

        if ($user->role !== 'patient') {
            abort(403, 'Unauthorized action.');
        }

        // Get the appointment and ensure it belongs to this patient
        $appointment = \App\Models\Appointment::whereHas('patient', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['clinic', 'patient', 'status', 'type', 'assignedDentist', 'service'])
        ->findOrFail($appointmentId);

        return response()->json([
            'success' => true,
            'appointment' => $appointment
        ]);
    }

    /**
     * Cancel appointment for patient
     */
    public function cancelAppointment(Request $request, $appointmentId)
    {
        $user = Auth::user();

        if ($user->role !== 'patient') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'cancellation_reason' => 'nullable|string|max:255'
        ]);

        // Get the appointment and ensure it belongs to this patient
        $appointment = \App\Models\Appointment::whereHas('patient', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['clinic', 'patient', 'status'])
        ->findOrFail($appointmentId);

        // Check if appointment can be cancelled
        if ($appointment->status->name === 'Cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'This appointment is already cancelled.'
            ], 422);
        }

        if ($appointment->status->name === 'Completed') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel a completed appointment.'
            ], 422);
        }

        // Update appointment status to cancelled
        $cancelledStatus = \App\Models\AppointmentStatus::where('name', 'Cancelled')->first();
        $appointment->update([
            'appointment_status_id' => $cancelledStatus->id,
            'cancellation_reason' => $validated['cancellation_reason'] ?? 'Cancelled by patient',
            'cancelled_at' => now(),
        ]);

        // Send email notification to clinic
        try {
            Mail::to($appointment->clinic->email)->send(new AppointmentCancelledMail($appointment));
        } catch (\Exception $e) {
            // Log error but don't fail the request
            Log::error('Failed to send cancellation email: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Appointment cancelled successfully.');
    }

    /**
     * Reschedule appointment for patient
     */
    public function rescheduleAppointment(Request $request, $appointmentId)
    {
        $user = Auth::user();

        if ($user->role !== 'patient') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'new_date' => 'required|date|after:today',
            'new_time' => 'required|string',
            'reason' => 'nullable|string|max:255'
        ]);

        // Get the appointment and ensure it belongs to this patient
        $appointment = \App\Models\Appointment::whereHas('patient', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['clinic', 'patient', 'status'])
        ->findOrFail($appointmentId);

        // Check if appointment can be rescheduled
        if ($appointment->status->name === 'Cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot reschedule a cancelled appointment.'
            ], 422);
        }

        if ($appointment->status->name === 'Completed') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot reschedule a completed appointment.'
            ], 422);
        }

        // Store old scheduled time for email notification
        $oldScheduledAt = $appointment->scheduled_at;

        // Combine date and time for new scheduled_at
        $newScheduledAt = date('Y-m-d H:i:s', strtotime($validated['new_date'] . ' ' . $validated['new_time']));
        $newEndedAt = date('Y-m-d H:i:s', strtotime($newScheduledAt . ' +1 hour'));

        // Get "Pending Reschedule" status
        $pendingRescheduleStatus = \App\Models\AppointmentStatus::where('name', 'Pending Reschedule')->first();

        // Update appointment to pending reschedule status (NOT immediately rescheduled)
        $appointment->update([
            'appointment_status_id' => $pendingRescheduleStatus->id,
            'notes' => $appointment->notes . "\n\nReschedule requested by patient on " . now()->format('Y-m-d H:i:s') .
                      ($validated['reason'] ? ". Reason: " . $validated['reason'] : '') .
                      "\nRequested new time: " . date('M d, Y H:i A', strtotime($newScheduledAt)),
            // Store the requested new time in a separate field for clinic review
            'requested_scheduled_at' => $newScheduledAt,
            'requested_ended_at' => $newEndedAt,
        ]);

        // Send email notification to clinic
        try {
            Mail::to($appointment->clinic->email)->send(new AppointmentRescheduledMail($appointment, $oldScheduledAt, $newScheduledAt));
        } catch (\Exception $e) {
            // Log error but don't fail the request
            Log::error('Failed to send rescheduling email: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Reschedule request submitted successfully. The clinic will review and confirm your new appointment time.');
    }
}
