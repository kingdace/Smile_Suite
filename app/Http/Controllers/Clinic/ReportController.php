<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Payment;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Treatment;
use App\Models\Inventory;
use App\Traits\SubscriptionAccessControl;

class ReportController extends Controller
{
    use SubscriptionAccessControl;

    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request)
    {
        // Check subscription access first
        $this->checkSubscriptionAccess();

        $clinic = Auth::user()->clinic;

        // Get date range for filtering
        $dateFrom = $request->get('date_from', now()->startOfMonth()->format('Y-m-d'));
        $dateTo = $request->get('date_to', now()->endOfMonth()->format('Y-m-d'));

        // Get appointment status IDs for filtering
        $pendingStatusId = \App\Models\AppointmentStatus::where('name', 'Pending')->first()?->id;
        $completedStatusId = \App\Models\AppointmentStatus::where('name', 'Completed')->first()?->id;
        $cancelledStatusId = \App\Models\AppointmentStatus::where('name', 'Cancelled')->first()?->id;

        // Key Metrics
        $metrics = [
            'total_patients' => $clinic->patients()->count(),
            'total_appointments' => $clinic->appointments()->count(),
            'total_revenue' => $clinic->payments()->where('status', 'completed')->sum('amount'),
            'total_treatments' => $clinic->treatments()->count(),
            'pending_appointments' => $clinic->appointments()->where('appointment_status_id', $pendingStatusId)->count(),
            'completed_appointments' => $clinic->appointments()->where('appointment_status_id', $completedStatusId)->count(),
            'cancelled_appointments' => $clinic->appointments()->where('appointment_status_id', $cancelledStatusId)->count(),
            'low_stock_items' => $clinic->inventory()->where('quantity', '<=', 'reorder_level')->count(),
        ];

        // Monthly Revenue Data (Last 12 months)
        $monthlyRevenue = $clinic->payments()
            ->where('status', 'completed')
            ->whereBetween('payment_date', [now()->subMonths(11)->startOfMonth(), now()->endOfMonth()])
            ->selectRaw('DATE_FORMAT(payment_date, "%Y-%m") as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::parse($item->month . '-01')->format('M Y'),
                    'revenue' => $item->total,
                ];
            });

        // Payment Methods Distribution
        $paymentMethods = $clinic->payments()
            ->where('status', 'completed')
            ->selectRaw('payment_method, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('payment_method')
            ->get();

        // Top Patients by Revenue
        $topPatients = $clinic->patients()
            ->withSum('payments', 'amount')
            ->whereHas('payments', function ($query) {
                $query->where('status', 'completed');
            })
            ->orderByDesc('payments_sum_amount')
            ->limit(5)
            ->get();

        // Recent Activity
        $recentActivity = collect();

        // Recent payments
        $recentPayments = $clinic->payments()
            ->with(['patient.user', 'treatment'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($payment) {
                return [
                    'type' => 'payment',
                    'title' => 'Payment received',
                    'description' => $payment->patient && $payment->patient->user ? $payment->patient->user->name : 'Unknown Patient',
                    'amount' => $payment->amount,
                    'date' => $payment->payment_date,
                    'status' => $payment->status,
                ];
            });

        // Recent appointments
        $recentAppointments = $clinic->appointments()
            ->with(['patient.user', 'assignedDentist', 'status'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($appointment) {
                return [
                    'type' => 'appointment',
                    'title' => 'Appointment ' . ($appointment->status ? $appointment->status->name : 'Unknown'),
                    'description' => $appointment->patient && $appointment->patient->user ? $appointment->patient->user->name : 'Unknown Patient',
                    'date' => $appointment->scheduled_at,
                    'status' => $appointment->status ? $appointment->status->name : 'unknown',
                ];
            });

        // Merge both collections and sort by date
        $recentActivity = collect()
            ->merge($recentPayments)
            ->merge($recentAppointments)
            ->sortByDesc('date')
            ->take(10)
            ->values();

        // Treatment Categories - using service relationship instead of category
        $treatmentCategories = $clinic->treatments()
            ->with('service')
            ->get()
            ->groupBy('service.name')
            ->map(function ($group) {
                return ['name' => $group->first()->service->name ?? 'Unknown', 'count' => $group->count()];
            })
            ->values();

        return Inertia::render('Clinic/Reports/Index', [
            'clinic' => $clinic,
            'metrics' => $metrics,
            'monthlyRevenue' => $monthlyRevenue,
            'paymentMethods' => $paymentMethods,
            'topPatients' => $topPatients,
            'recentActivity' => $recentActivity,
            'treatmentCategories' => $treatmentCategories,
            'filters' => $request->only(['date_from', 'date_to']),
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                    'role' => Auth::user()->role,
                    'clinic_id' => $clinic->id,
                    'clinic' => $clinic,
                ],
                'clinic' => $clinic,
                'clinic_id' => $clinic->id,
            ],
        ]);
    }

    public function patients(Request $request)
    {
        $clinic = Auth::user()->clinic;

        $query = $clinic->patients()
            ->withCount(['appointments', 'treatments'])
            ->withSum('payments', 'amount');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                    ->orWhere('last_name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $patients = $query->latest()->paginate(15);

        // Patient statistics
        $patientStats = [
            'total_patients' => $clinic->patients()->count(),
            'new_this_month' => $clinic->patients()->whereMonth('created_at', now()->month)->count(),
            'active_patients' => $clinic->patients()->whereHas('appointments', function ($q) {
                $q->where('scheduled_at', '>=', now()->subMonths(3));
            })->count(),
            'total_revenue' => $clinic->patients()->withSum('payments', 'amount')->get()->sum('payments_sum_amount'),
        ];

        return Inertia::render('Clinic/Reports/Patients', [
            'clinic' => $clinic,
            'patients' => $patients,
            'patientStats' => $patientStats,
            'filters' => $request->only(['search']),
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                    'role' => Auth::user()->role,
                    'clinic_id' => $clinic->id,
                    'clinic' => $clinic,
                ],
                'clinic' => $clinic,
                'clinic_id' => $clinic->id,
            ],
        ]);
    }

    public function appointments(Request $request)
    {
        $clinic = Auth::user()->clinic;

        $query = $clinic->appointments()
            ->with(['patient', 'assignedDentist', 'type', 'status']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('notes', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $statusId = \App\Models\AppointmentStatus::where('name', $request->status)->first()?->id;
            if ($statusId) {
                $query->where('appointment_status_id', $statusId);
            }
        }

        if ($request->date_from) {
            $query->where('scheduled_at', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->where('scheduled_at', '<=', $request->date_to);
        }

        $appointments = $query->latest()->paginate(15);

        // Get appointment status IDs for statistics
        $pendingStatusId = \App\Models\AppointmentStatus::where('name', 'Pending')->first()?->id;
        $completedStatusId = \App\Models\AppointmentStatus::where('name', 'Completed')->first()?->id;
        $cancelledStatusId = \App\Models\AppointmentStatus::where('name', 'Cancelled')->first()?->id;

        // Appointment statistics
        $appointmentStats = [
            'total_appointments' => $clinic->appointments()->count(),
            'pending_appointments' => $clinic->appointments()->where('appointment_status_id', $pendingStatusId)->count(),
            'completed_appointments' => $clinic->appointments()->where('appointment_status_id', $completedStatusId)->count(),
            'cancelled_appointments' => $clinic->appointments()->where('appointment_status_id', $cancelledStatusId)->count(),
            'this_month' => $clinic->appointments()->whereMonth('scheduled_at', now()->month)->count(),
        ];

        return Inertia::render('Clinic/Reports/Appointments', [
            'clinic' => $clinic,
            'appointments' => $appointments,
            'appointmentStats' => $appointmentStats,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to']),
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                    'role' => Auth::user()->role,
                    'clinic_id' => $clinic->id,
                    'clinic' => $clinic,
                ],
                'clinic' => $clinic,
                'clinic_id' => $clinic->id,
            ],
        ]);
    }

    public function revenue(Request $request)
    {
        $clinic = Auth::user()->clinic;

        $query = $clinic->payments()
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

        if ($request->date_from) {
            $query->where('payment_date', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->where('payment_date', '<=', $request->date_to);
        }

        $payments = $query->latest()->paginate(15);
        $totalRevenue = $clinic->payments()->where('status', 'completed')->sum('amount');

        // Revenue statistics
        $revenueStats = [
            'total_revenue' => $totalRevenue,
            'this_month' => $clinic->payments()->where('status', 'completed')->whereMonth('payment_date', now()->month)->sum('amount'),
            'pending_payments' => $clinic->payments()->where('status', 'pending')->sum('amount'),
            'completed_payments' => $clinic->payments()->where('status', 'completed')->count(),
            'payment_methods' => $clinic->payments()->where('status', 'completed')->selectRaw('payment_method, COUNT(*) as count, SUM(amount) as total')->groupBy('payment_method')->get(),
        ];

        return Inertia::render('Clinic/Reports/Revenue', [
            'clinic' => $clinic,
            'payments' => $payments,
            'revenueStats' => $revenueStats,
            'filters' => $request->only(['search', 'status', 'payment_method', 'date_from', 'date_to']),
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                    'role' => Auth::user()->role,
                    'clinic_id' => $clinic->id,
                    'clinic' => $clinic,
                ],
                'clinic' => $clinic,
                'clinic_id' => $clinic->id,
            ],
        ]);
    }

    public function inventory(Request $request)
    {
        $clinic = Auth::user()->clinic;

        $query = $clinic->inventory();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        if ($request->stock_status) {
            if ($request->stock_status === 'low') {
                $query->where('quantity', '<=', 'minimum_quantity');
            } elseif ($request->stock_status === 'out') {
                $query->where('quantity', 0);
            }
        }

        $inventory = $query->latest()->paginate(15);

        // Inventory statistics
        $inventoryStats = [
            'total_items' => $clinic->inventory()->count(),
            'low_stock' => $clinic->inventory()->where('quantity', '<=', 'minimum_quantity')->count(),
            'out_of_stock' => $clinic->inventory()->where('quantity', 0)->count(),
            'total_value' => $clinic->inventory()->sum(DB::raw('quantity * unit_price')),
            'categories' => $clinic->inventory()->selectRaw('category, COUNT(*) as count')->groupBy('category')->get(),
        ];

        return Inertia::render('Clinic/Reports/Inventory', [
            'clinic' => $clinic,
            'inventory' => $inventory,
            'inventoryStats' => $inventoryStats,
            'filters' => $request->only(['search', 'category', 'stock_status']),
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                    'role' => Auth::user()->role,
                    'clinic_id' => $clinic->id,
                    'clinic' => $clinic,
                ],
                'clinic' => $clinic,
                'clinic_id' => $clinic->id,
            ],
        ]);
    }

    public function treatments(Request $request)
    {
        $clinic = Auth::user()->clinic;

        $query = $clinic->treatments()
            ->with(['patient', 'dentist', 'service']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('notes', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->category) {
            $query->whereHas('service', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->category}%");
            });
        }

        $treatments = $query->latest()->paginate(15);

        // Treatment statistics
        $treatmentStats = [
            'total_treatments' => $clinic->treatments()->count(),
            'completed_treatments' => $clinic->treatments()->where('status', 'completed')->count(),
            'pending_treatments' => $clinic->treatments()->where('status', 'pending')->count(),
            'this_month' => $clinic->treatments()->whereMonth('created_at', now()->month)->count(),
            'categories' => $clinic->treatments()->with('service')->get()->groupBy('service.name')->map(function ($group) {
                return ['name' => $group->first()->service->name ?? 'Unknown', 'count' => $group->count()];
            })->values(),
        ];

        return Inertia::render('Clinic/Reports/Treatments', [
            'clinic' => $clinic,
            'treatments' => $treatments,
            'treatmentStats' => $treatmentStats,
            'filters' => $request->only(['search', 'status', 'category']),
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                    'role' => Auth::user()->role,
                    'clinic_id' => $clinic->id,
                    'clinic' => $clinic,
                ],
                'clinic' => $clinic,
                'clinic_id' => $clinic->id,
            ],
        ]);
    }
}
