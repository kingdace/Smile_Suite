<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use App\Models\ClinicHoliday;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ClinicHolidayController extends Controller
{
    public function index(Clinic $clinic)
    {
        $user = Auth::user();
        if (!$clinic || $user->clinic_id !== $clinic->id) {
            abort(403);
        }

        return response()->json([
            'holidays' => $clinic->holidays()->orderBy('date', 'asc')->get(),
        ]);
    }

    public function store(Request $request, Clinic $clinic)
    {
        $user = Auth::user();
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'is_recurring' => 'sometimes|boolean',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $validated['clinic_id'] = $clinic->id;
        $validated['is_recurring'] = $validated['is_recurring'] ?? false;
        $validated['is_active'] = $validated['is_active'] ?? true;

        $holiday = ClinicHoliday::create($validated);

        return redirect()->back()
            ->with('success', 'Holiday created successfully.')
            ->with('recent_holiday', $holiday);
    }

    public function update(Request $request, Clinic $clinic, ClinicHoliday $holiday)
    {
        $user = Auth::user();
        if ($user->clinic_id !== $clinic->id || $holiday->clinic_id !== $clinic->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'is_recurring' => 'sometimes|boolean',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $holiday->update($validated);

        return redirect()->back()->with('success', 'Holiday updated successfully.');
    }

    public function destroy(Clinic $clinic, ClinicHoliday $holiday)
    {
        $user = Auth::user();
        if ($user->clinic_id !== $clinic->id || $holiday->clinic_id !== $clinic->id) {
            abort(403);
        }

        $holiday->delete();

        return redirect()->back()->with('success', 'Holiday deleted successfully.');
    }
}


