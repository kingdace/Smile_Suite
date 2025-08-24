<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\Waitlist;
use App\Models\Patient;
use App\Models\Service;
use App\Models\AppointmentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class WaitlistController extends Controller
{
    public function index(Request $request, Clinic $clinic)
    {
        $this->authorize('viewAny', [Waitlist::class, $clinic]);

        $waitlist = $clinic->waitlist()
            ->with(['patient', 'preferredDentist', 'service', 'appointmentType', 'creator'])
            ->when($request->input('search'), function ($query, $search) {
                $query->whereHas('patient', function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone_number', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->input('priority'), function ($query, $priority) {
                $query->where('priority', $priority);
            })
            ->when($request->input('dentist'), function ($query, $dentist) {
                $query->where('preferred_dentist_id', $dentist);
            })
            ->when($request->input('service'), function ($query, $service) {
                $query->where('service_id', $service);
            })
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'asc')
            ->paginate(15)
            ->withQueryString();

        // Get statistics
        $stats = [
            'total' => $clinic->waitlist()->count(),
            'active' => $clinic->waitlist()->where('status', 'active')->count(),
            'contacted' => $clinic->waitlist()->where('status', 'contacted')->count(),
            'scheduled' => $clinic->waitlist()->where('status', 'scheduled')->count(),
            'urgent' => $clinic->waitlist()->where('priority', 'urgent')->where('status', 'active')->count(),
        ];

        // Get filters data
        $dentists = $clinic->users()
            ->whereIn('role', ['dentist', 'clinic_staff'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $services = $clinic->services()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();





        return Inertia::render('Clinic/Waitlist/Index', [
            'clinic' => $clinic,
            'waitlist' => $waitlist,
            'stats' => $stats,
            'dentists' => $dentists,
            'services' => $services,
            'filters' => $request->only(['search', 'status', 'priority', 'dentist', 'service']),
        ]);
    }

    public function create(Request $request, Clinic $clinic)
    {
        $this->authorize('create', [Waitlist::class, $clinic]);

        $patients = $clinic->patients()
            ->orderBy('first_name')
            ->get();

        $dentists = $clinic->users()
            ->whereIn('role', ['dentist', 'clinic_staff'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $services = $clinic->services()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $appointmentTypes = AppointmentType::orderBy('name')->get();

        return Inertia::render('Clinic/Waitlist/Create', [
            'clinic' => $clinic,
            'patients' => $patients,
            'dentists' => $dentists,
            'services' => $services,
            'appointmentTypes' => $appointmentTypes,
        ]);
    }

    public function store(Request $request, Clinic $clinic)
    {
        $this->authorize('create', [Waitlist::class, $clinic]);

        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'preferred_dentist_id' => 'nullable|exists:users,id',
            'service_id' => 'nullable|exists:services,id',
            'appointment_type_id' => 'nullable|exists:appointment_types,id',
            'reason' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'priority' => 'required|in:low,normal,high,urgent',
            'preferred_start_date' => 'nullable|date',
            'preferred_end_date' => 'nullable|date|after_or_equal:preferred_start_date',
            'preferred_days' => 'nullable|array',
            'preferred_days.*' => 'integer|between:0,6',
            'preferred_start_time' => 'nullable|date_format:H:i',
            'preferred_end_time' => 'nullable|date_format:H:i|after:preferred_start_time',
            'contact_method' => 'required|in:phone,email,sms,any',
            'contact_notes' => 'nullable|string|max:255',
            'estimated_duration' => 'required|integer|min:15|max:240',
        ]);

        try {
            $waitlist = Waitlist::create([
                'clinic_id' => $clinic->id,
                'created_by' => Auth::id(),
                ...$validated,
                'status' => 'active',
                'expires_at' => now()->addDays(30), // Auto-expire after 30 days
            ]);

            Log::info('Waitlist entry created', [
                'waitlist_id' => $waitlist->id,
                'clinic_id' => $clinic->id,
                'patient_id' => $validated['patient_id'],
                'created_by' => Auth::id(),
            ]);

            return redirect()->route('clinic.waitlist.index', $clinic)
                ->with('success', 'Patient added to waitlist successfully.');

        } catch (\Exception $e) {
            Log::error('Error creating waitlist entry', [
                'error' => $e->getMessage(),
                'clinic_id' => $clinic->id,
                'request' => $request->all(),
            ]);

            return back()->withErrors(['general' => 'Failed to add patient to waitlist: ' . $e->getMessage()]);
        }
    }

    public function show(Clinic $clinic, Waitlist $waitlist)
    {
        $this->authorize('view', [$waitlist, $clinic]);

        $waitlist->load(['patient', 'preferredDentist', 'service', 'appointmentType', 'creator']);

        return Inertia::render('Clinic/Waitlist/Show', [
            'clinic' => $clinic,
            'waitlist' => $waitlist,
        ]);
    }

    public function edit(Clinic $clinic, Waitlist $waitlist)
    {
        $this->authorize('update', [$waitlist, $clinic]);

        $waitlist->load(['patient', 'preferredDentist', 'service', 'appointmentType']);

        $patients = $clinic->patients()
            ->orderBy('first_name')
            ->get();

        $dentists = $clinic->users()
            ->whereIn('role', ['dentist', 'clinic_staff'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $services = $clinic->services()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $appointmentTypes = AppointmentType::orderBy('name')->get();

        return Inertia::render('Clinic/Waitlist/Edit', [
            'clinic' => $clinic,
            'waitlist' => $waitlist,
            'patients' => $patients,
            'dentists' => $dentists,
            'services' => $services,
            'appointmentTypes' => $appointmentTypes,
        ]);
    }

    public function update(Request $request, Clinic $clinic, Waitlist $waitlist)
    {
        $this->authorize('update', [$waitlist, $clinic]);

        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'preferred_dentist_id' => 'nullable|exists:users,id',
            'service_id' => 'nullable|exists:services,id',
            'appointment_type_id' => 'nullable|exists:appointment_types,id',
            'reason' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'priority' => 'required|in:low,normal,high,urgent',
            'status' => 'required|in:active,contacted,scheduled,cancelled,expired',
            'preferred_start_date' => 'nullable|date',
            'preferred_end_date' => 'nullable|date|after_or_equal:preferred_start_date',
            'preferred_days' => 'nullable|array',
            'preferred_days.*' => 'integer|between:0,6',
            'preferred_start_time' => 'nullable|date_format:H:i',
            'preferred_end_time' => 'nullable|date_format:H:i|after:preferred_start_time',
            'contact_method' => 'required|in:phone,email,sms,any',
            'contact_notes' => 'nullable|string|max:255',
            'estimated_duration' => 'required|integer|min:15|max:240',
        ]);

        try {
            $waitlist->update($validated);

            Log::info('Waitlist entry updated', [
                'waitlist_id' => $waitlist->id,
                'clinic_id' => $clinic->id,
                'updated_by' => Auth::id(),
            ]);

            return redirect()->route('clinic.waitlist.show', [$clinic, $waitlist])
                ->with('success', 'Waitlist entry updated successfully.');

        } catch (\Exception $e) {
            Log::error('Error updating waitlist entry', [
                'error' => $e->getMessage(),
                'waitlist_id' => $waitlist->id,
                'clinic_id' => $clinic->id,
            ]);

            return back()->withErrors(['general' => 'Failed to update waitlist entry: ' . $e->getMessage()]);
        }
    }

    public function destroy(Clinic $clinic, Waitlist $waitlist)
    {
        $this->authorize('delete', [$waitlist, $clinic]);

        try {
            $waitlist->delete();

            Log::info('Waitlist entry deleted', [
                'waitlist_id' => $waitlist->id,
                'clinic_id' => $clinic->id,
                'deleted_by' => Auth::id(),
            ]);

            return redirect()->route('clinic.waitlist.index', $clinic)
                ->with('success', 'Waitlist entry removed successfully.');

        } catch (\Exception $e) {
            Log::error('Error deleting waitlist entry', [
                'error' => $e->getMessage(),
                'waitlist_id' => $waitlist->id,
                'clinic_id' => $clinic->id,
            ]);

            return back()->withErrors(['general' => 'Failed to remove waitlist entry: ' . $e->getMessage()]);
        }
    }

    // Additional methods for waitlist management

    public function markAsContacted(Clinic $clinic, Waitlist $waitlist)
    {
        $this->authorize('update', [$waitlist, $clinic]);

        try {
            $waitlist->markAsContacted();

            Log::info('Waitlist entry marked as contacted', [
                'waitlist_id' => $waitlist->id,
                'clinic_id' => $clinic->id,
                'contacted_by' => Auth::id(),
            ]);

            return back()->with('success', 'Patient marked as contacted.');

        } catch (\Exception $e) {
            Log::error('Error marking waitlist as contacted', [
                'error' => $e->getMessage(),
                'waitlist_id' => $waitlist->id,
            ]);

            return back()->withErrors(['general' => 'Failed to mark as contacted: ' . $e->getMessage()]);
        }
    }

    public function markAsScheduled(Clinic $clinic, Waitlist $waitlist)
    {
        $this->authorize('update', [$waitlist, $clinic]);

        try {
            $waitlist->markAsScheduled();

            Log::info('Waitlist entry marked as scheduled', [
                'waitlist_id' => $waitlist->id,
                'clinic_id' => $clinic->id,
                'scheduled_by' => Auth::id(),
            ]);

            return back()->with('success', 'Patient marked as scheduled.');

        } catch (\Exception $e) {
            Log::error('Error marking waitlist as scheduled', [
                'error' => $e->getMessage(),
                'waitlist_id' => $waitlist->id,
            ]);

            return back()->withErrors(['general' => 'Failed to mark as scheduled: ' . $e->getMessage()]);
        }
    }

    public function markAsCancelled(Clinic $clinic, Waitlist $waitlist)
    {
        $this->authorize('update', [$waitlist, $clinic]);

        try {
            $waitlist->markAsCancelled();

            Log::info('Waitlist entry marked as cancelled', [
                'waitlist_id' => $waitlist->id,
                'clinic_id' => $clinic->id,
                'cancelled_by' => Auth::id(),
            ]);

            return back()->with('success', 'Waitlist entry cancelled.');

        } catch (\Exception $e) {
            Log::error('Error marking waitlist as cancelled', [
                'error' => $e->getMessage(),
                'waitlist_id' => $waitlist->id,
            ]);

            return back()->withErrors(['general' => 'Failed to cancel waitlist entry: ' . $e->getMessage()]);
        }
    }

    public function convertToAppointment(Request $request, Clinic $clinic, Waitlist $waitlist)
    {
        $this->authorize('update', [$waitlist, $clinic]);

        $validated = $request->validate([
            'scheduled_at' => 'required|date',
            'duration' => 'required|integer|min:15|max:240',
            'assigned_to' => 'required|exists:users,id',
        ]);

        try {
            // Create appointment from waitlist
            $appointment = $clinic->appointments()->create([
                'patient_id' => $waitlist->patient_id,
                'assigned_to' => $validated['assigned_to'],
                'scheduled_at' => $validated['scheduled_at'],
                'ended_at' => Carbon::parse($validated['scheduled_at'])->addMinutes($validated['duration']),
                'duration' => $validated['duration'],
                'reason' => $waitlist->reason,
                'notes' => $waitlist->notes,
                'appointment_type_id' => $waitlist->appointment_type_id,
                'appointment_status_id' => 2, // Confirmed
                'service_id' => $waitlist->service_id,
                'payment_status' => 'pending',
                'created_by' => Auth::id(),
            ]);

            // Mark waitlist as scheduled
            $waitlist->markAsScheduled();

            Log::info('Waitlist converted to appointment', [
                'waitlist_id' => $waitlist->id,
                'appointment_id' => $appointment->id,
                'clinic_id' => $clinic->id,
                'converted_by' => Auth::id(),
            ]);

            return redirect()->route('clinic.appointments.show', [$clinic, $appointment])
                ->with('success', 'Patient scheduled successfully from waitlist.');

        } catch (\Exception $e) {
            Log::error('Error converting waitlist to appointment', [
                'error' => $e->getMessage(),
                'waitlist_id' => $waitlist->id,
                'clinic_id' => $clinic->id,
            ]);

            return back()->withErrors(['general' => 'Failed to schedule appointment: ' . $e->getMessage()]);
        }
    }

    public function getAvailableSlots(Request $request, Clinic $clinic, Waitlist $waitlist)
    {
        $this->authorize('view', [$waitlist, $clinic]);

        $validated = $request->validate([
            'dentist_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'duration' => 'required|integer|min:15|max:240',
        ]);

        try {
            // Use the existing schedule service to get available slots
            $scheduleService = app(\App\Services\ScheduleService::class);
            $slots = $scheduleService->getAvailableSlots(
                $validated['dentist_id'],
                $validated['date'],
                $validated['duration']
            );

            return response()->json([
                'success' => true,
                'slots' => $slots,
            ]);

        } catch (\Exception $e) {
            Log::error('Error getting available slots for waitlist', [
                'error' => $e->getMessage(),
                'waitlist_id' => $waitlist->id,
                'request' => $validated,
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to get available slots',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
