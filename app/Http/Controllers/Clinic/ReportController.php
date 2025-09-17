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
use App\Traits\ExportTrait;

class ReportController extends Controller
{
    use SubscriptionAccessControl, ExportTrait;

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

        // Enhanced appointment statistics
        $appointmentStats = [
            'completed' => $clinic->appointments()->where('appointment_status_id', $completedStatusId)->count(),
            'pending' => $clinic->appointments()->where('appointment_status_id', $pendingStatusId)->count(),
            'cancelled' => $clinic->appointments()->where('appointment_status_id', $cancelledStatusId)->count(),
            'total' => $clinic->appointments()->count(),
            'this_month' => $clinic->appointments()->whereBetween('scheduled_at', [now()->startOfMonth(), now()->endOfMonth()])->count(),
        ];

        // Enhanced inventory statistics
        $inventoryStats = [
            'total_items' => $clinic->inventory()->count(),
            'low_stock' => $clinic->inventory()->whereRaw('quantity <= minimum_quantity')->count(),
            'out_of_stock' => $clinic->inventory()->where('quantity', 0)->count(),
            'total_value' => $clinic->inventory()->selectRaw('SUM(quantity * unit_price) as total')->first()->total ?? 0,
        ];

        return Inertia::render('Clinic/Reports/SimpleEnhanced', [
            'clinic' => $clinic,
            'metrics' => $metrics,
            'monthlyRevenue' => $monthlyRevenue,
            'paymentMethods' => $paymentMethods,
            'topPatients' => $topPatients,
            'recentActivity' => $recentActivity,
            'treatmentCategories' => $treatmentCategories,
            'appointmentStats' => $appointmentStats,
            'inventoryStats' => $inventoryStats,
            'filters' => $request->only(['date_from', 'date_to', 'search', 'status', 'category']),
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

    /**
     * Export patients report
     */
    public function exportPatients(Request $request)
    {
        $clinic = Auth::user()->clinic;
        
        $query = $clinic->patients()
            ->withCount(['appointments', 'treatments'])
            ->withSum('payments', 'amount');

        // Apply filters
        $query = $this->applyPatientFilters($query, $request);

        $headers = [
            'ID',
            'First Name',
            'Last Name',
            'Email',
            'Phone',
            'Date of Birth',
            'Total Appointments',
            'Total Treatments',
            'Total Payments',
            'Created Date'
        ];

        $dataMapper = function($patient) {
            return [
                $patient->id,
                $patient->first_name,
                $patient->last_name,
                $patient->email,
                $patient->phone,
                $patient->date_of_birth ? Carbon::parse($patient->date_of_birth)->format('Y-m-d') : 'N/A',
                $patient->appointments_count ?? 0,
                $patient->treatments_count ?? 0,
                $patient->payments_sum_amount ?? 0,
                $patient->created_at ? Carbon::parse($patient->created_at)->format('Y-m-d') : 'N/A'
            ];
        };

        return $this->exportData(
            $query,
            'patients_report',
            $headers,
            $this->detectFormat(),
            $dataMapper,
            $clinic->id
        );
    }

    /**
     * Export appointments report
     */
    public function exportAppointments(Request $request)
    {
        $clinic = Auth::user()->clinic;
        
        $query = $clinic->appointments()
            ->with(['patient', 'assignedDentist', 'type', 'status']);

        // Apply filters
        $query = $this->applyAppointmentFilters($query, $request);

        $headers = [
            'ID',
            'Patient Name',
            'Dentist',
            'Type',
            'Status',
            'Scheduled Date',
            'Duration',
            'Notes',
            'Created Date'
        ];

        $dataMapper = function($appointment) {
            return [
                $appointment->id,
                $appointment->patient ? 
                    trim($appointment->patient->first_name . ' ' . $appointment->patient->last_name) : 
                    'N/A',
                $appointment->assignedDentist ? $appointment->assignedDentist->name : 'N/A',
                $appointment->type ? $appointment->type->name : 'N/A',
                $appointment->status ? $appointment->status->name : 'N/A',
                $appointment->scheduled_at ? 
                    Carbon::parse($appointment->scheduled_at)->format('Y-m-d H:i') : 
                    'N/A',
                $appointment->duration ? $appointment->duration . ' min' : 'N/A',
                $appointment->notes ?? 'N/A',
                $appointment->created_at ? Carbon::parse($appointment->created_at)->format('Y-m-d') : 'N/A'
            ];
        };

        return $this->exportData(
            $query,
            'appointments_report',
            $headers,
            $this->detectFormat(),
            $dataMapper,
            $clinic->id
        );
    }

    /**
     * Export revenue report
     */
    public function exportRevenue(Request $request)
    {
        $clinic = Auth::user()->clinic;
        
        $query = $clinic->payments()
            ->with(['patient', 'treatment']);

        // Apply filters using the existing trait method
        $query = $this->applyExportFilters($query, $request);

        return $this->exportData(
            $query,
            'revenue_report',
            $this->getPaymentExportHeaders(),
            $this->detectFormat(),
            [$this, 'mapPaymentData'],
            $clinic->id
        );
    }

    /**
     * Export treatments report
     */
    public function exportTreatments(Request $request)
    {
        $clinic = Auth::user()->clinic;
        
        $query = $clinic->treatments()
            ->with(['patient', 'dentist', 'service']);

        // Apply filters
        $query = $this->applyTreatmentFilters($query, $request);

        $headers = [
            'ID',
            'Patient Name',
            'Dentist',
            'Service',
            'Cost',
            'Status',
            'Start Date',
            'End Date',
            'Diagnosis',
            'Notes'
        ];

        $dataMapper = function($treatment) {
            return [
                $treatment->id,
                $treatment->patient ? 
                    trim($treatment->patient->first_name . ' ' . $treatment->patient->last_name) : 
                    'N/A',
                $treatment->dentist ? $treatment->dentist->name : 'N/A',
                $treatment->service ? $treatment->service->name : 'N/A',
                $treatment->cost ?? 'N/A',
                $treatment->status ?? 'N/A',
                $treatment->start_date ? 
                    Carbon::parse($treatment->start_date)->format('Y-m-d') : 
                    'N/A',
                $treatment->end_date ? 
                    Carbon::parse($treatment->end_date)->format('Y-m-d') : 
                    'N/A',
                $treatment->diagnosis ?? 'N/A',
                $treatment->notes ?? 'N/A'
            ];
        };

        return $this->exportData(
            $query,
            'treatments_report',
            $headers,
            $this->detectFormat(),
            $dataMapper,
            $clinic->id
        );
    }

    /**
     * Export inventory report
     */
    public function exportInventory(Request $request)
    {
        $clinic = Auth::user()->clinic;
        
        $query = $clinic->inventory()->with('supplier');

        // Apply filters
        $query = $this->applyInventoryFilters($query, $request);

        $headers = [
            'ID',
            'Name',
            'Category',
            'Description',
            'Quantity',
            'Minimum Quantity',
            'Unit Price',
            'Total Value',
            'Supplier',
            'Status'
        ];

        $dataMapper = function($item) {
            $totalValue = ($item->quantity ?? 0) * ($item->unit_price ?? 0);
            $status = 'In Stock';
            if (($item->quantity ?? 0) <= 0) {
                $status = 'Out of Stock';
            } elseif (($item->quantity ?? 0) <= ($item->minimum_quantity ?? 0)) {
                $status = 'Low Stock';
            }

            return [
                $item->id,
                $item->name ?? 'N/A',
                $item->category ?? 'N/A',
                $item->description ?? 'N/A',
                $item->quantity ?? 0,
                $item->minimum_quantity ?? 0,
                $item->unit_price ?? 0,
                number_format($totalValue, 2),
                $item->supplier->name ?? 'N/A',
                $status
            ];
        };

        return $this->exportData(
            $query,
            'inventory_report',
            $headers,
            $this->detectFormat(),
            $dataMapper,
            $clinic->id
        );
    }

    /**
     * Export comprehensive analytics report
     */
    public function exportAnalytics(Request $request)
    {
        $clinic = Auth::user()->clinic;
        
        // Get date range for filtering
        $dateFrom = $request->get('date_from', now()->startOfMonth()->format('Y-m-d'));
        $dateTo = $request->get('date_to', now()->endOfMonth()->format('Y-m-d'));

        // Compile comprehensive analytics data
        $analyticsData = collect([
            (object)[
                'metric' => 'Total Patients',
                'value' => $clinic->patients()->count(),
                'period' => 'All Time',
                'category' => 'Patients'
            ],
            (object)[
                'metric' => 'Total Appointments',
                'value' => $clinic->appointments()->count(),
                'period' => 'All Time',
                'category' => 'Appointments'
            ],
            (object)[
                'metric' => 'Total Revenue',
                'value' => $clinic->payments()->where('status', 'completed')->sum('amount'),
                'period' => 'All Time',
                'category' => 'Revenue'
            ],
            (object)[
                'metric' => 'Monthly Revenue',
                'value' => $clinic->payments()
                    ->where('status', 'completed')
                    ->whereBetween('payment_date', [$dateFrom, $dateTo])
                    ->sum('amount'),
                'period' => $dateFrom . ' to ' . $dateTo,
                'category' => 'Revenue'
            ],
            (object)[
                'metric' => 'Completed Treatments',
                'value' => $clinic->treatments()->where('status', 'completed')->count(),
                'period' => 'All Time',
                'category' => 'Treatments'
            ],
            (object)[
                'metric' => 'Pending Appointments',
                'value' => $clinic->appointments()
                    ->whereHas('status', function($q) {
                        $q->where('name', 'Pending');
                    })->count(),
                'period' => 'Current',
                'category' => 'Appointments'
            ]
        ]);

        $headers = [
            'Metric',
            'Value',
            'Period',
            'Category'
        ];

        // Generate filename
        $filename = 'analytics_report_' . $clinic->id . '_' . now()->format('Y-m-d_H-i-s');
        $format = $this->detectFormat();
        $extension = $format === 'excel' ? 'xlsx' : 'csv';
        $fullFilename = $filename . '.' . $extension;

        if ($format === 'excel') {
            return $this->exportAnalyticsToExcel($analyticsData, $fullFilename, $headers);
        } else {
            return $this->exportAnalyticsToCsv($analyticsData, $fullFilename, $headers);
        }
    }

    /**
     * Export analytics data to CSV
     */
    private function exportAnalyticsToCsv($data, $filename, $headers)
    {
        $responseHeaders = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($data, $headers) {
            $file = fopen('php://output', 'w');

            // Write CSV headers
            fputcsv($file, $headers);

            // Write data rows
            foreach ($data as $item) {
                fputcsv($file, [
                    $item->metric,
                    $item->value,
                    $item->period,
                    $item->category
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $responseHeaders);
    }

    /**
     * Export analytics data to Excel
     */
    private function exportAnalyticsToExcel($data, $filename, $headers)
    {
        $export = new \App\Exports\ExcelExport($data, $headers, null, 'Analytics Report');
        return \Maatwebsite\Excel\Facades\Excel::download($export, $filename);
    }

    // Helper methods for applying filters

    private function applyPatientFilters($query, Request $request)
    {
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                    ->orWhere('last_name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        return $query;
    }

    private function applyAppointmentFilters($query, Request $request)
    {
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('notes', 'like', "%{$request->search}%")
                  ->orWhere('reason', 'like', "%{$request->search}%");
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

        return $query;
    }

    private function applyTreatmentFilters($query, Request $request)
    {
        if ($request->search) {
            $query->where('notes', 'like', "%{$request->search}%");
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->category) {
            $query->whereHas('service', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->category}%");
            });
        }

        return $query;
    }

    private function applyInventoryFilters($query, Request $request)
    {
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

        return $query;
    }
}
