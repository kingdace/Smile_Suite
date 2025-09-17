<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Patient;
use App\Models\Treatment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Clinic;
use Carbon\Carbon;
use App\Traits\SubscriptionAccessControl;
use App\Traits\ExportTrait;

class PaymentController extends Controller
{
    use SubscriptionAccessControl, ExportTrait;

    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request, Clinic $clinic)
    {
        // Check subscription access first
        $this->checkSubscriptionAccess();

        $query = $clinic->payments()->with(['patient', 'treatment', 'receivedBy']);

        // Advanced search functionality
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('reference_number', 'like', "%{$request->search}%")
                    ->orWhere('notes', 'like', "%{$request->search}%")
                    ->orWhere('transaction_id', 'like', "%{$request->search}%")
                    ->orWhereHas('patient', function ($patientQuery) use ($request) {
                        $patientQuery->where('first_name', 'like', "%{$request->search}%")
                                    ->orWhere('last_name', 'like', "%{$request->search}%");
                    })
                    ->orWhereHas('treatment', function ($treatmentQuery) use ($request) {
                        $treatmentQuery->where('name', 'like', "%{$request->search}%");
                    });
            });
        }

        // Advanced filtering
        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        if ($request->patient_id) {
            $query->where('patient_id', $request->patient_id);
        }

        if ($request->treatment_id) {
            $query->where('treatment_id', $request->treatment_id);
        }

        if ($request->date_from && $request->date_to) {
            $query->whereBetween('payment_date', [$request->date_from, $request->date_to]);
        } elseif ($request->date_from) {
            $query->where('payment_date', '>=', $request->date_from);
        } elseif ($request->date_to) {
            $query->where('payment_date', '<=', $request->date_to);
        }

        if ($request->amount_min) {
            $query->where('amount', '>=', $request->amount_min);
        }

        if ($request->amount_max) {
            $query->where('amount', '<=', $request->amount_max);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'payment_date');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortBy, $sortDirection);

        $payments = $query->paginate($request->get('per_page', 15));

        // Enhanced summary data
        $summary = $this->getPaymentSummary($clinic->id, $request);

        // Fetch patients and treatments for the modal dropdowns
        $patients = $clinic->patients()
            ->select('id', 'first_name', 'last_name')
            ->get()
            ->map(function ($p) {
                $p->name = trim($p->first_name . ' ' . $p->last_name);
                return $p;
            });
        $treatments = $clinic->treatments()->select('id', 'name')->get();

        // Get payment methods and categories for filters
        $paymentMethods = Payment::where('clinic_id', $clinic->id)
            ->distinct()
            ->pluck('payment_method')
            ->filter()
            ->values();

        $categories = Payment::where('clinic_id', $clinic->id)
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return Inertia::render('Clinic/Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'status', 'payment_method', 'category', 'patient_id', 'treatment_id', 'date_from', 'date_to', 'amount_min', 'amount_max', 'sort_by', 'sort_direction', 'per_page']),
            'summary' => $summary,
            'patients' => $patients,
            'treatments' => $treatments,
            'paymentMethods' => $paymentMethods,
            'categories' => $categories,
        ]);
    }

    public function create(Clinic $clinic)
    {
        $patients = $clinic->patients()
            ->select('id', 'first_name', 'last_name')
            ->get()
            ->map(function ($p) {
                $p->name = trim($p->first_name . ' ' . $p->last_name);
                return $p;
            });
        $treatments = $clinic->treatments()->select('id', 'name')->get();

        return Inertia::render('Clinic/Payments/Create', [
            'patients' => $patients,
            'treatments' => $treatments,
            'auth' => [
                'id' => Auth::id(),
                'name' => Auth::user()->name,
                'email' => Auth::user()->email,
                'clinic_id' => $clinic->id,
                'clinic' => $clinic,
            ],
        ]);
    }

    public function store(Request $request, Clinic $clinic)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'treatment_id' => 'nullable|exists:treatments,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string|in:cash,credit_card,debit_card,insurance,gcash,bank_transfer,check,other',
            'status' => 'required|string|in:pending,completed,failed,refunded,cancelled',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'category' => 'nullable|string|in:consultation,treatment,medication,laboratory,imaging,surgery,emergency,other',
            'currency' => 'nullable|string|max:3',
            'gcash_reference' => 'nullable|string|max:255',
        ]);

        $validated['received_by'] = Auth::id();
        $validated['currency'] = $validated['currency'] ?? 'PHP';

        $payment = $clinic->payments()->create($validated);

        // Auto-generate reference number if blank
        if (empty($payment->reference_number)) {
            $payment->reference_number = 'PAY-' . now()->format('Ymd') . '-' . str_pad($payment->id, 4, '0', STR_PAD_LEFT);
            $payment->save();
        }

        return redirect()->route('clinic.payments.show', [$clinic->id, $payment->id])
            ->with('success', 'Payment created successfully.');
    }

    public function show(Clinic $clinic, Payment $payment)
    {
        $this->authorize('view', $payment);
        $payment->load(['patient', 'treatment', 'receivedBy']);

        // Get related payments for this patient
        $relatedPayments = $clinic->payments()
            ->where('patient_id', $payment->patient_id)
            ->where('id', '!=', $payment->id)
            ->with(['treatment'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Clinic/Payments/Show', [
            'clinic' => $clinic,
            'payment' => $payment,
            'relatedPayments' => $relatedPayments,
            'auth' => [
                'id' => Auth::id(),
                'name' => Auth::user()->name,
                'email' => Auth::user()->email,
                'clinic_id' => $clinic->id,
                'clinic' => $clinic,
            ],
        ]);
    }

    public function edit(Clinic $clinic, Payment $payment)
    {
        $this->authorize('update', $payment);
        $patients = $clinic->patients()
            ->select('id', 'first_name', 'last_name')
            ->get()
            ->map(function ($p) {
                $p->name = trim($p->first_name . ' ' . $p->last_name);
                return $p;
            });
        $treatments = $clinic->treatments()->select('id', 'name')->get();
        return Inertia::render('Clinic/Payments/Edit', [
            'clinic' => $clinic,
            'payment' => $payment,
            'patients' => $patients,
            'treatments' => $treatments,
            'auth' => [
                'id' => Auth::id(),
                'name' => Auth::user()->name,
                'email' => Auth::user()->email,
                'clinic_id' => $clinic->id,
            ],
        ]);
    }

    public function update(Request $request, Clinic $clinic, Payment $payment)
    {
        $this->authorize('update', $payment);
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'treatment_id' => 'nullable|exists:treatments,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string|in:cash,credit_card,debit_card,insurance,gcash,bank_transfer,check,other',
            'status' => 'required|string|in:pending,completed,failed,refunded,cancelled',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'category' => 'nullable|string|in:consultation,treatment,medication,laboratory,imaging,surgery,emergency,other',
            'currency' => 'nullable|string|max:3',
            'gcash_reference' => 'nullable|string|max:255',
        ]);

        $validated['currency'] = $validated['currency'] ?? 'PHP';
        $payment->update($validated);

        return redirect()->route('clinic.payments.show', [$clinic->id, $payment->id])
            ->with('success', 'Payment updated successfully.');
    }

    public function destroy(Clinic $clinic, Payment $payment)
    {
        $this->authorize('delete', $payment);
        $payment->delete();
        return redirect()->route('clinic.payments.index', [$clinic->id])
            ->with('success', 'Payment deleted successfully.');
    }

    public function bulkDestroy(Request $request, Clinic $clinic)
    {
        $this->authorize('deleteAny', Payment::class);

        $validated = $request->validate([
            'payment_ids' => 'required|array',
            'payment_ids.*' => 'exists:payments,id'
        ]);

        $payments = Payment::whereIn('id', $validated['payment_ids'])
            ->where('clinic_id', $clinic->id)
            ->get();

        foreach ($payments as $payment) {
            $this->authorize('delete', $payment);
            $payment->delete();
        }

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => count($payments) . ' payment(s) deleted successfully.'
            ]);
        }

        return redirect()->route('clinic.payments.index', [$clinic->id])
            ->with('success', count($payments) . ' payment(s) deleted successfully.');
    }

    public function bulkUpdate(Request $request, Clinic $clinic)
    {
        $this->authorize('updateAny', Payment::class);

        $validated = $request->validate([
            'payment_ids' => 'required|array',
            'payment_ids.*' => 'exists:payments,id',
            'status' => 'required|string|in:pending,completed,failed,refunded,cancelled',
        ]);

        $payments = Payment::whereIn('id', $validated['payment_ids'])
            ->where('clinic_id', $clinic->id)
            ->get();

        foreach ($payments as $payment) {
            $this->authorize('update', $payment);
            $payment->update(['status' => $validated['status']]);
        }

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => count($payments) . ' payment(s) updated successfully.'
            ]);
        }

        return redirect()->route('clinic.payments.index', [$clinic->id])
            ->with('success', count($payments) . ' payment(s) updated successfully.');
    }

    public function statistics(Request $request, Clinic $clinic)
    {
        $dateFrom = $request->get('date_from', now()->subDays(30)->format('Y-m-d'));
        $dateTo = $request->get('date_to', now()->format('Y-m-d'));

        $statistics = [
            'total_payments' => $clinic->payments()
                ->whereBetween('payment_date', [$dateFrom, $dateTo])
                ->count(),
            'total_revenue' => $clinic->payments()
                ->where('status', Payment::STATUS_COMPLETED)
                ->whereBetween('payment_date', [$dateFrom, $dateTo])
                ->sum('amount'),
            'pending_amount' => $clinic->payments()
                ->where('status', Payment::STATUS_PENDING)
                ->whereBetween('payment_date', [$dateFrom, $dateTo])
                ->sum('amount'),
            'failed_amount' => $clinic->payments()
                ->where('status', Payment::STATUS_FAILED)
                ->whereBetween('payment_date', [$dateFrom, $dateTo])
                ->sum('amount'),
            'refunded_amount' => $clinic->payments()
                ->where('status', Payment::STATUS_REFUNDED)
                ->whereBetween('payment_date', [$dateFrom, $dateTo])
                ->sum('amount'),
            'payment_methods_distribution' => Payment::getPaymentMethodsDistribution($clinic->id, $dateFrom, $dateTo),
            'categories_distribution' => Payment::getCategoriesDistribution($clinic->id, $dateFrom, $dateTo),
            'top_patients' => Payment::getTopPatients($clinic->id, 5, $dateFrom, $dateTo),
            'payment_trends' => Payment::getPaymentTrends($clinic->id, 30),
            'daily_average' => $clinic->payments()
                ->where('status', Payment::STATUS_COMPLETED)
                ->whereBetween('payment_date', [$dateFrom, $dateTo])
                ->avg('amount'),
            'largest_payment' => $clinic->payments()
                ->where('status', Payment::STATUS_COMPLETED)
                ->whereBetween('payment_date', [$dateFrom, $dateTo])
                ->max('amount'),
        ];

        return response()->json($statistics);
    }

    public function export(Request $request, Clinic $clinic)
    {
        $query = $clinic->payments()->with(['patient', 'treatment']);

        // Apply filters using the trait method
        $query = $this->applyExportFilters($query, $request);

        return $this->exportData(
            $query,
            'payments',
            $this->getPaymentExportHeaders(),
            $this->detectFormat(),
            [$this, 'mapPaymentData'],
            $clinic->id
        );
    }

    public function receipt(Clinic $clinic, Payment $payment)
    {
        $this->authorize('view', $payment);
        $payment->load(['patient', 'treatment', 'receivedBy']);

        return Inertia::render('Clinic/Payments/Receipt', [
            'clinic' => $clinic,
            'payment' => $payment,
        ]);
    }

    public function refund(Request $request, Clinic $clinic, Payment $payment)
    {
        $this->authorize('update', $payment);

        if (!$payment->canBeRefunded()) {
            return response()->json([
                'success' => false,
                'message' => 'This payment cannot be refunded.'
            ], 400);
        }

        $validated = $request->validate([
            'refund_amount' => 'required|numeric|min:0|max:' . $payment->amount,
            'refund_reason' => 'required|string|max:500',
        ]);

        DB::transaction(function () use ($payment, $validated) {
            // Create refund payment record
            $refundPayment = $payment->clinic->payments()->create([
                'patient_id' => $payment->patient_id,
                'treatment_id' => $payment->treatment_id,
                'amount' => $validated['refund_amount'],
                'payment_method' => $payment->payment_method,
                'status' => Payment::STATUS_REFUNDED,
                'payment_date' => now(),
                'notes' => 'Refund: ' . $validated['refund_reason'] . ' (Original Payment: ' . $payment->reference_number . ')',
                'reference_number' => 'REF-' . now()->format('Ymd') . '-' . str_pad($payment->id, 4, '0', STR_PAD_LEFT),
                'received_by' => Auth::id(),
                'currency' => $payment->currency,
            ]);

            // Update original payment status if full refund
            if ($validated['refund_amount'] >= $payment->amount) {
                $payment->update(['status' => Payment::STATUS_REFUNDED]);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Refund processed successfully.'
        ]);
    }

    private function getPaymentSummary($clinicId, Request $request)
    {
        $query = Payment::where('clinic_id', $clinicId);

        // Apply date filters if provided
        if ($request->date_from && $request->date_to) {
            $query->whereBetween('payment_date', [$request->date_from, $request->date_to]);
        }

        $total_revenue = (clone $query)->where('status', Payment::STATUS_COMPLETED)->sum('amount');
        $total_balance = Patient::where('clinic_id', $clinicId)->sum('balance') ?? 0;
        $payments_this_month = (clone $query)->where('status', Payment::STATUS_COMPLETED)
            ->whereMonth('payment_date', now()->month)
            ->whereYear('payment_date', now()->year)
            ->sum('amount');
        $pending_payments = (clone $query)->where('status', Payment::STATUS_PENDING)->sum('amount');

        return [
            'total_revenue' => $total_revenue,
            'total_balance' => $total_balance,
            'payments_this_month' => $payments_this_month,
            'pending_payments' => $pending_payments,
        ];
    }
}
