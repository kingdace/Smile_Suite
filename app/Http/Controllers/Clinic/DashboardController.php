<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\Inventory;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\Treatment;
use App\Services\SubscriptionService;
use App\Services\DashboardMetricsService;
use App\Traits\SubscriptionAccessControl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    use SubscriptionAccessControl;

    protected $subscriptionService;
    protected $dashboardMetricsService;

    public function __construct(SubscriptionService $subscriptionService, DashboardMetricsService $dashboardMetricsService)
    {
        $this->middleware(['auth', 'verified']);
        $this->subscriptionService = $subscriptionService;
        $this->dashboardMetricsService = $dashboardMetricsService;
    }

    public function index(Request $request, Clinic $clinic)
    {
        // Check subscription access first
        $this->checkSubscriptionAccess();

        $user = Auth::user();

        // Get time range from request, default to current year
        $timeRange = $request->get('range', date('Y'));
        $validRanges = $this->getAvailableYears();
        if (!in_array($timeRange, $validRanges)) {
            $timeRange = date('Y');
        }

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

        // Get today's appointments (include pending and confirmed)
        $todayAppointments = Appointment::with(['patient', 'assignedDentist', 'type', 'status'])
            ->where('clinic_id', $clinic->id)
            ->whereDate('scheduled_at', today())
            ->whereIn('appointment_status_id', [1, 2]) // 1 = Pending, 2 = Confirmed
            ->orderBy('scheduled_at')
            ->get();

        // Get upcoming appointments (include pending and confirmed)
        $upcomingAppointments = Appointment::with(['patient', 'assignedDentist', 'type', 'status'])
            ->where('clinic_id', $clinic->id)
            ->whereDate('scheduled_at', '>', today())
            ->whereIn('appointment_status_id', [1, 2]) // 1 = Pending, 2 = Confirmed
            ->orderBy('scheduled_at')
            ->take(4)
            ->get();

        // For Today's Schedule: If no appointments today, show upcoming appointments
        $todayScheduleData = $todayAppointments->count() > 0
            ? $todayAppointments
            : $upcomingAppointments;

        // Get recent patients
        $recentPatients = Patient::where('clinic_id', $clinic->id)
            ->latest()
            ->take(4)
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

        // Get patient-initiated changes (cancellations and reschedules)
        $patientCancelledAppointments = Appointment::with(['patient', 'type', 'status'])
            ->where('clinic_id', $clinic->id)
            ->where('appointment_status_id', 4) // 4 = Cancelled
            ->whereNotNull('cancelled_at')
            ->whereNotNull('cancellation_reason')
            ->whereDate('cancelled_at', '>=', now()->subDays(7)) // Last 7 days
            ->get();

        $patientRescheduledAppointments = Appointment::with(['patient', 'type', 'status'])
            ->where('clinic_id', $clinic->id)
            ->whereNotNull('notes')
            ->where('notes', 'like', '%Rescheduled by patient%')
            ->whereDate('updated_at', '>=', now()->subDays(7)) // Last 7 days
            ->get();

        // Get subscription duration information
        $subscriptionDuration = $this->subscriptionService->getSubscriptionDuration($clinic);

        // Get advanced metrics using the new service
        $advancedMetrics = $this->dashboardMetricsService->getAllMetrics($clinic, $timeRange);

        // Calculate statistics (keeping existing for backward compatibility)
        $totalPatients = Patient::where('clinic_id', $clinic->id)->count();

        // Get previous period patient count for comparison
        $previousRange = $this->getPreviousDateRange($timeRange);
        $previousPatients = Patient::where('clinic_id', $clinic->id)
            ->whereBetween('created_at', [$previousRange['start'], $previousRange['end']])
            ->count();

        $stats = [
            'total_patients' => $totalPatients,
            'previous_patients' => $previousPatients,
            'today_appointments' => $todayAppointments->count(), // Keep original count for stats
            'upcoming_appointments' => $upcomingAppointments->count(),
            'today_treatments' => $todayTreatments->count(),
            'low_stock_items' => $lowStockItems->count(),
            'patient_cancelled_appointments' => $patientCancelledAppointments->count(),
            'patient_rescheduled_appointments' => $patientRescheduledAppointments->count(),
            'total_patient_changes' => $patientCancelledAppointments->count() + $patientRescheduledAppointments->count(),
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
            'today_appointments' => $todayScheduleData, // Use the smart data that shows today's or upcoming
            'upcoming_appointments' => $upcomingAppointments,
            'recent_patients' => $recentPatients,
            'lowStockItems' => $lowStockItems,
            'todayTreatments' => $todayTreatments,
            'patientCancelledAppointments' => $patientCancelledAppointments,
            'patientRescheduledAppointments' => $patientRescheduledAppointments,
            'stats' => $stats,
            'subscription_duration' => $subscriptionDuration,
            // New advanced metrics data
            'metrics' => $advancedMetrics,
            'current_time_range' => $timeRange,
            'available_time_ranges' => $validRanges,
            'revenue_metrics' => $advancedMetrics['revenue'],
            'appointment_metrics' => $advancedMetrics['appointments'],
            'satisfaction_metrics' => $advancedMetrics['satisfaction'],
            'staff_performance_metrics' => $advancedMetrics['staff_performance'],
            'chart_data' => $advancedMetrics['charts'],
            'patient_demographics' => $advancedMetrics['patient_demographics'],
            'treatment_success' => $advancedMetrics['treatment_success'],
            'peak_hours' => $advancedMetrics['peak_hours'],
        ]);
    }

    /**
     * Get available years for time range selection
     */
    private function getAvailableYears(): array
    {
        $currentYear = (int) date('Y');
        $years = [];

        // Get years from existing data (payments and appointments)
        $paymentYears = Payment::selectRaw('YEAR(payment_date) as year')
            ->distinct()
            ->pluck('year')
            ->filter()
            ->toArray();

        $appointmentYears = Appointment::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->pluck('year')
            ->filter()
            ->toArray();

        // Combine and get unique years
        $dataYears = array_unique(array_merge($paymentYears, $appointmentYears));

        // Always include current year and next year
        $years[] = $currentYear;
        $years[] = $currentYear + 1;

        // Add any years from data
        foreach ($dataYears as $year) {
            if ($year >= 2020 && $year <= $currentYear + 5) { // Reasonable range
                $years[] = (int) $year;
            }
        }

        // Sort and return unique years
        $years = array_unique($years);
        sort($years);

        return array_map('strval', $years); // Convert to strings for consistency
    }

    /**
     * Get previous date range for comparison
     */
    private function getPreviousDateRange(string $timeRange): array
    {
        // For year ranges, get the previous year
        if (is_numeric($timeRange)) {
            $year = (int) $timeRange;
            return [
                'start' => Carbon::create($year - 1, 1, 1)->startOfYear(),
                'end' => Carbon::create($year - 1, 12, 31)->endOfYear()
            ];
        }

        // Legacy support for old time ranges (should not be used anymore)
        $end = Carbon::now();
        switch ($timeRange) {
            case 'today':
                $start = Carbon::yesterday();
                $end = Carbon::yesterday()->endOfDay();
                break;
            case 'week':
                $start = Carbon::now()->subWeek()->startOfWeek();
                $end = Carbon::now()->subWeek()->endOfWeek();
                break;
            case 'month':
                $start = Carbon::now()->subMonth()->startOfMonth();
                $end = Carbon::now()->subMonth()->endOfMonth();
                break;
            case 'quarter':
                $start = Carbon::now()->subQuarter()->startOfQuarter();
                $end = Carbon::now()->subQuarter()->endOfQuarter();
                break;
            case 'year':
                $start = Carbon::now()->subYear()->startOfYear();
                $end = Carbon::now()->subYear()->endOfYear();
                break;
            default:
                $start = Carbon::now()->subWeek()->startOfWeek();
                $end = Carbon::now()->subWeek()->endOfWeek();
        }

        return [
            'start' => $start,
            'end' => $end
        ];
    }

    /**
     * Show the send reminders page
     */
    public function showSendRemindersPage(Request $request, Clinic $clinic)
    {
        // Check subscription access first
        $this->checkSubscriptionAccess();

        // Only clinic_admin can access
        $user = Auth::user();
        if ($user->role !== 'clinic_admin' || $user->clinic_id !== $clinic->id) {
            abort(403, 'Unauthorized action.');
        }

        $user = Auth::user();

        // Prepare user data with permissions (using accessor)
        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar_url' => $user->avatar_url,
            'clinic_id' => $user->clinic_id,
            'role' => $user->role,
            'permissions' => $user->permissions, // Uses getPermissionsAttribute accessor
        ];

        return Inertia::render('Clinic/Appointments/SendReminders', [
            'clinic' => $clinic,
            'auth' => [
                'user' => $userData,
                'clinic' => $clinic,
                'clinic_id' => $clinic->id,
            ]
        ]);
    }

    /**
     * Send SMS reminders for today's appointments (clinic-specific)
     */
    public function sendAppointmentReminders(Request $request, Clinic $clinic)
    {
        // Check subscription access first
        $this->checkSubscriptionAccess();

        // Only clinic_admin can send reminders
        $user = Auth::user();
        if ($user->role !== 'clinic_admin' || $user->clinic_id !== $clinic->id) {
            abort(403, 'Unauthorized action.');
        }

        try {
            // Get appointments scheduled for today for THIS clinic
            $todayStart = now()->startOfDay();
            $todayEnd = now()->endOfDay();

            $todayAppointments = \App\Models\Appointment::with(['patient', 'assignedDentist', 'status', 'clinic', 'service'])
                ->where('clinic_id', $clinic->id)
                ->whereBetween('scheduled_at', [$todayStart, $todayEnd])
                ->whereHas('status', function($query) {
                    $query->whereIn('name', ['Pending', 'Confirmed']);
                })
                ->where(function($query) use ($todayStart) {
                    $todayMarker = 'sms_reminder_' . $todayStart->format('Y-m-d');
                    $query->whereNull('notes')
                          ->orWhere('notes', 'NOT LIKE', "%{$todayMarker}%");
                })
                ->get();

            $smsService = app(\App\Services\SemaphoreSmsService::class);

            $stats = [
                'total' => $todayAppointments->count(),
                'sms_sent' => 0,
                'sms_failed' => 0,
                'no_phone' => 0,
            ];

            $output = "🕐 Starting daily appointment reminders for {$clinic->name}...\n";
            $output .= "📋 Found {$todayAppointments->count()} appointments scheduled for today\n\n";

            if ($todayAppointments->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'message' => 'No appointments found for today',
                    'output' => "✅ No appointments scheduled for today. Skipping reminders.\n",
                ]);
            }

            foreach ($todayAppointments as $appointment) {
                try {
                    $patient = $appointment->patient;
                    if (!$patient) {
                        continue;
                    }

                    if ($patient->phone_number) {
                        try {
                            $smsResult = $smsService->sendAppointmentReminder($appointment, $patient, $appointment->assignedDentist);

                            if ($smsResult['success']) {
                                $stats['sms_sent']++;
                                $todayMarker = 'sms_reminder_' . now()->format('Y-m-d');
                                $currentNotes = $appointment->notes ?? '';
                                $appointment->update([
                                    'notes' => $currentNotes . "\n[{$todayMarker}]"
                                ]);
                                $output .= "📱 SMS sent to {$patient->first_name} {$patient->last_name}\n";
                            } else {
                                $stats['sms_failed']++;
                                $output .= "⚠️ SMS failed for {$patient->first_name} {$patient->last_name}: " . ($smsResult['error'] ?? 'Unknown error') . "\n";
                            }
                        } catch (\Exception $e) {
                            $stats['sms_failed']++;
                            \Illuminate\Support\Facades\Log::error('Failed to send SMS reminder', [
                                'appointment_id' => $appointment->id,
                                'patient_id' => $patient->id,
                                'error' => $e->getMessage()
                            ]);
                            $output .= "⚠️ SMS failed for {$patient->first_name} {$patient->last_name}: " . $e->getMessage() . "\n";
                        }
                    } else {
                        $stats['no_phone']++;
                    }
                } catch (\Exception $e) {
                    $stats['sms_failed']++;
                    $output .= "⚠️ Error processing appointment ID {$appointment->id}: " . $e->getMessage() . "\n";
                }
            }

            $output .= "\n✅ Daily reminders completed!\n";
            $output .= "   Total: {$stats['total']}\n";
            $output .= "   SMS Sent: {$stats['sms_sent']}\n";
            $output .= "   Failed: {$stats['sms_failed']}\n";
            $output .= "   No Phone: {$stats['no_phone']}\n";

            return response()->json([
                'success' => true,
                'message' => 'Appointment reminders sent successfully',
                'output' => $output,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send reminders: ' . $e->getMessage(),
            ], 500);
        }
    }

}
