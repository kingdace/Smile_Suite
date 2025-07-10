<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\DentistSchedule;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DentistScheduleController extends Controller
{
    public function index(Clinic $clinic)
    {
        $schedules = DentistSchedule::with('dentist')
            ->where('clinic_id', $clinic->id)
            ->get()
            ->groupBy('user_id');

        $dentists = $clinic->users()
            ->where('role', 'dentist')
            ->select('id', 'name', 'email')
            ->get();

        Log::info('DentistScheduleController@index', [
            'clinic_id' => $clinic->id,
            'schedules_count' => count($schedules),
            'dentists_count' => count($dentists),
            'schedules_sample' => $schedules->first(),
            'dentists_sample' => $dentists->first()
        ]);

        return Inertia::render('Clinic/DentistSchedules/Index', [
            'clinic' => $clinic,
            'schedules' => $schedules,
            'dentists' => $dentists,
        ]);
    }

    public function getAvailableSlots(Request $request, Clinic $clinic)
    {
        $validated = $request->validate([
            'dentist_id' => 'required|exists:users,id',
            'date' => 'required|date',
        ]);

        Log::info('Getting available slots for dentist', [
            'dentist_id' => $validated['dentist_id'],
            'date' => $validated['date']
        ]);

        // Define fixed time slots with start and end times
        $morningSlots = [
            ['start' => '08:00', 'end' => '09:00'],
            ['start' => '09:00', 'end' => '10:00'],
            ['start' => '10:00', 'end' => '11:00'],
        ];

        $afternoonSlots = [
            ['start' => '13:00', 'end' => '14:00'],
            ['start' => '14:00', 'end' => '15:00'],
            ['start' => '15:00', 'end' => '16:00'],
        ];

        $allSlots = [...$morningSlots, ...$afternoonSlots];

        // Get existing appointments for this date
        $existingAppointments = \App\Models\Appointment::where('assigned_to', $validated['dentist_id'])
            ->whereDate('scheduled_at', $validated['date'])
            ->get()
            ->map(function ($appointment) {
                return \Carbon\Carbon::parse($appointment->scheduled_at)->format('H:i');
            })
            ->toArray(); // Convert Collection to array

        Log::info('Existing appointments', ['appointments' => $existingAppointments]);

        // Filter out booked morning slots
        $availableMorningSlots = array_values(array_filter($morningSlots, function ($slot) use ($existingAppointments) {
            return !in_array($slot['start'], $existingAppointments);
        }));

        // Filter out booked afternoon slots
        $availableAfternoonSlots = array_values(array_filter($afternoonSlots, function ($slot) use ($existingAppointments) {
            return !in_array($slot['start'], $existingAppointments);
        }));

        // Group slots by period
        $groupedSlots = [
            'morning' => $availableMorningSlots,
            'afternoon' => $availableAfternoonSlots
        ];

        Log::info('Available slots', ['slots' => $groupedSlots]);

        return response()->json(['slots' => $groupedSlots]);
    }
}
