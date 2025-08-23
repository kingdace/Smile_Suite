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
        $user = Auth::user();

        // Check if user is inactive
        if ($user->user_type === 'clinic_staff' && !$user->is_active) {
            // Log out the user
            Auth::logout();

            // Invalidate session
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // Redirect to login with error message
            return redirect()->route('login')->with('error', 'Your account has been deactivated. Please contact your clinic administrator.');
        }

        // Redirect admin users to admin dashboard
        if ($user->role === 'admin') {
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

    public function enhanced(Request $request, Clinic $clinic)
    {
        $user = Auth::user();

        // Check if user is inactive
        if ($user->user_type === 'clinic_staff' && !$user->is_active) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('login')->with('error', 'Your account has been deactivated. Please contact your clinic administrator.');
        }

        // Get comprehensive statistics
        $stats = [
            'total_patients' => Patient::where('clinic_id', $clinic->id)->count(),
            'new_patients_this_month' => Patient::where('clinic_id', $clinic->id)
                ->whereMonth('created_at', now()->month)
                ->count(),
            'today_appointments' => Appointment::where('clinic_id', $clinic->id)
                ->whereDate('scheduled_at', today())
                ->count(),
            'completed_today' => Appointment::where('clinic_id', $clinic->id)
                ->whereDate('scheduled_at', today())
                ->where('appointment_status_id', 3) // Completed
                ->count(),
            'active_dentists' => $clinic->users()->where('role', 'dentist')->where('is_active', true)->count(),
            'available_today' => $clinic->users()->where('role', 'dentist')->where('is_active', true)->count(),
            'monthly_revenue' => Treatment::where('clinic_id', $clinic->id)
                ->whereMonth('created_at', now()->month)
                ->sum('cost'),
            'revenue_growth' => 15, // Mock data - would calculate from previous month
            'patient_growth_rate' => 12, // Mock data
            'appointment_success_rate' => 85, // Mock data
            'confirmed_appointments' => Appointment::where('clinic_id', $clinic->id)
                ->where('appointment_status_id', 2) // Confirmed
                ->count(),
            'pending_appointments' => Appointment::where('clinic_id', $clinic->id)
                ->where('appointment_status_id', 1) // Pending
                ->count(),
            'cancelled_appointments' => Appointment::where('clinic_id', $clinic->id)
                ->where('appointment_status_id', 4) // Cancelled
                ->count(),
        ];

        // Get recent appointments
        $recentAppointments = Appointment::with(['patient', 'assignedDentist', 'type', 'status'])
            ->where('clinic_id', $clinic->id)
            ->latest()
            ->take(10)
            ->get();

        // Get upcoming appointments
        $upcomingAppointments = Appointment::with(['patient', 'assignedDentist', 'type', 'status'])
            ->where('clinic_id', $clinic->id)
            ->whereDate('scheduled_at', '>', today())
            ->where('appointment_status_id', 2) // Confirmed
            ->orderBy('scheduled_at')
            ->take(10)
            ->get();

        // Get schedule statistics
        $scheduleStats = [
            'dentist_availability' => $clinic->users()
                ->where('role', 'dentist')
                ->where('is_active', true)
                ->get()
                ->map(function ($dentist) {
                    return [
                        'id' => $dentist->id,
                        'name' => $dentist->name,
                        'availability_percentage' => rand(60, 100), // Mock data
                    ];
                }),
            'weekly_overview' => [
                ['day' => 1, 'name' => 'Monday', 'available_dentists' => rand(2, 5)],
                ['day' => 2, 'name' => 'Tuesday', 'available_dentists' => rand(2, 5)],
                ['day' => 3, 'name' => 'Wednesday', 'available_dentists' => rand(2, 5)],
                ['day' => 4, 'name' => 'Thursday', 'available_dentists' => rand(2, 5)],
                ['day' => 5, 'name' => 'Friday', 'available_dentists' => rand(2, 5)],
                ['day' => 6, 'name' => 'Saturday', 'available_dentists' => rand(1, 3)],
                ['day' => 0, 'name' => 'Sunday', 'available_dentists' => 0],
            ],
        ];

        return Inertia::render('Clinic/Dashboard/Enhanced', [
            'clinic' => $clinic,
            'stats' => $stats,
            'recentAppointments' => $recentAppointments,
            'upcomingAppointments' => $upcomingAppointments,
            'scheduleStats' => $scheduleStats,
        ]);
    }
}
