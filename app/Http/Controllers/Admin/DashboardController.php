<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\InventoryItem;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\Treatment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request)
    {
        // Redirect admin users to admin dashboard
        if (Auth::user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $clinic = Clinic::where('id', Auth::user()->clinic_id)->firstOrFail();

        $stats = [
            'total_patients' => Patient::where('clinic_id', $clinic->id)->count(),
            'total_appointments' => Appointment::where('clinic_id', $clinic->id)->count(),
            'total_treatments' => Treatment::where('clinic_id', $clinic->id)->count(),
            'total_revenue' => Payment::where('clinic_id', $clinic->id)
                ->where('status', 'completed')
                ->sum('amount'),
            'low_stock_items' => InventoryItem::where('clinic_id', $clinic->id)
                ->whereRaw('quantity <= minimum_quantity')
                ->count(),
        ];

        // Get today's appointments
        $todayAppointments = Appointment::with(['patient', 'dentist'])
            ->where('clinic_id', $clinic->id)
            ->whereDate('scheduled_at', today())
            ->where('status', 'scheduled')
            ->orderBy('scheduled_at')
            ->get();

        // Get upcoming appointments
        $upcomingAppointments = Appointment::with(['patient', 'dentist'])
            ->where('clinic_id', $clinic->id)
            ->whereDate('scheduled_at', '>', today())
            ->where('status', 'scheduled')
            ->orderBy('scheduled_at')
            ->take(5)
            ->get();

        // Get recent patients
        $recentPatients = Patient::where('clinic_id', $clinic->id)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'today_appointments' => $todayAppointments,
            'upcoming_appointments' => $upcomingAppointments,
            'recent_patients' => $recentPatients,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }
}
