<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $patients = $user->patients()->with('clinic')->get();

        // Get all upcoming appointments for all patient records
        $appointments = \App\Models\Appointment::with(['clinic', 'status'])
            ->whereIn('patient_id', $patients->pluck('id'))
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at')
            ->get();

        return Inertia::render('Patient/Dashboard', [
            'patients' => $patients,
            'appointments' => $appointments,
        ]);
    }
}
