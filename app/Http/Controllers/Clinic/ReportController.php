<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index()
    {
        return Inertia::render('Clinic/Reports/Index');
    }

    public function patients(Request $request)
    {
        $query = Auth::user()->clinic->patients()
            ->withCount(['appointments', 'treatments'])
            ->withSum('payments', 'amount');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                    ->orWhere('last_name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $patients = $query->latest()->paginate(10);

        return Inertia::render('Clinic/Reports/Patients', [
            'patients' => $patients,
            'filters' => $request->only(['search'])
        ]);
    }

    public function appointments(Request $request)
    {
        $query = Auth::user()->clinic->appointments()
            ->with(['patient', 'dentist']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('notes', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $appointments = $query->latest()->paginate(10);

        return Inertia::render('Clinic/Reports/Appointments', [
            'appointments' => $appointments,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function revenue(Request $request)
    {
        $query = Auth::user()->clinic->payments()
            ->with(['patient', 'treatment']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('reference_number', 'like', "%{$request->search}%")
                    ->orWhere('notes', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }

        $payments = $query->latest()->paginate(10);
        $totalRevenue = $query->where('status', 'completed')->sum('amount');

        return Inertia::render('Clinic/Reports/Revenue', [
            'payments' => $payments,
            'totalRevenue' => $totalRevenue,
            'filters' => $request->only(['search', 'status', 'payment_method'])
        ]);
    }
}
