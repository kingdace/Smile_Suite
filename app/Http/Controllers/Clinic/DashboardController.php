<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\Inventory;
use App\Models\Patient;
use App\Models\Treatment;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->middleware(['auth', 'verified']);
        $this->subscriptionService = $subscriptionService;
    }

    public function index(Request $request, Clinic $clinic)
    {
        // Redirect admin users to admin dashboard
        if (Auth::user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        // Get today's appointments
        $todayAppointments = Appointment::with(['patient', 'assignedDentist', 'type', 'status'])
            ->where('clinic_id', $clinic->id)
            ->whereDate('scheduled_at', today())
            ->where('appointment_status_id', 2) // 2 = Confirmed
            ->orderBy('scheduled_at')
            ->get();

        // Get upcoming appointments
        $upcomingAppointments = Appointment::with(['patient', 'assignedDentist', 'type', 'status'])
            ->where('clinic_id', $clinic->id)
            ->whereDate('scheduled_at', '>', today())
            ->where('appointment_status_id', 2) // 2 = Confirmed
            ->orderBy('scheduled_at')
            ->take(5)
            ->get();

        // Get recent patients
        $recentPatients = Patient::where('clinic_id', $clinic->id)
            ->latest()
            ->take(5)
            ->get();

        // Get low stock items
        $lowStockItems = Inventory::where('clinic_id', $clinic->id)
            ->whereRaw('quantity <= minimum_quantity')
            ->get();

        // Get today's treatments
        $todayTreatments = Treatment::with(['patient', 'dentist'])
            ->where('clinic_id', $clinic->id)
            ->whereDate('created_at', today())
            ->get();

        // Get subscription duration information
        $subscriptionDuration = $this->subscriptionService->getSubscriptionDuration($clinic);

        // Calculate statistics
        $stats = [
            'total_patients' => Patient::where('clinic_id', $clinic->id)->count(),
            'today_appointments' => $todayAppointments->count(),
            'upcoming_appointments' => $upcomingAppointments->count(),
            'today_treatments' => $todayTreatments->count(),
            'low_stock_items' => $lowStockItems->count(),
        ];

        // Enhanced clinic data with duration information
        $enhancedClinic = array_merge($clinic->toArray(), [
            'subscription_duration' => $subscriptionDuration,
            'trial_days_left' => isset($subscriptionDuration['trial']) ? $subscriptionDuration['trial']['days_left'] : null,
            'subscription_days_left' => isset($subscriptionDuration['subscription']) ? $subscriptionDuration['subscription']['days_left'] : null,
            'is_in_grace_period' => isset($subscriptionDuration['subscription']) ? $subscriptionDuration['subscription']['is_in_grace_period'] : false,
            'is_suspended' => isset($subscriptionDuration['subscription']) ? $subscriptionDuration['subscription']['is_suspended'] : false,
        ]);

        return Inertia::render('Clinic/Dashboard', [
            'clinic' => $enhancedClinic,
            'today_appointments' => $todayAppointments,
            'upcoming_appointments' => $upcomingAppointments,
            'recent_patients' => $recentPatients,
            'lowStockItems' => $lowStockItems,
            'todayTreatments' => $todayTreatments,
            'stats' => $stats,
            'subscription_duration' => $subscriptionDuration,
        ]);
    }
}
