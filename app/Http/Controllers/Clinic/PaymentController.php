<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Clinic;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request, Clinic $clinic)
    {
        $query = $clinic->payments()->with(['patient', 'treatment']);

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

        // Fetch patients and treatments for the modal dropdowns
        $patients = $clinic->patients()
            ->select('id', 'first_name', 'last_name')
            ->get()
            ->map(function ($p) {
                $p->name = trim($p->first_name . ' ' . $p->last_name);
                return $p;
            });
        $treatments = $clinic->treatments()->select('id', 'name')->get();

        // Summary data
        $total_revenue = $clinic->payments()->where('status', 'completed')->sum('amount');
        $total_balance = $clinic->patients()->sum('balance'); // Assuming you have a balance field on patients
        $payments_this_month = $clinic->payments()->where('status', 'completed')
            ->whereMonth('payment_date', now()->month)
            ->whereYear('payment_date', now()->year)
            ->sum('amount');
        $pending_payments = $clinic->payments()->where('status', 'pending')->sum('amount');

        return Inertia::render('Clinic/Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'status', 'payment_method']),
            'summary' => [
                'total_revenue' => $total_revenue,
                'total_balance' => $total_balance,
                'payments_this_month' => $payments_this_month,
                'pending_payments' => $pending_payments,
            ],
            'patients' => $patients,
            'treatments' => $treatments,
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
            'payment_method' => 'required|string|in:cash,credit_card,debit_card,insurance,other',
            'status' => 'required|string|in:pending,completed,failed,refunded',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

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
        $payment->load(['patient', 'treatment']);
        return Inertia::render('Clinic/Payments/Show', [
            'clinic' => $clinic,
            'payment' => $payment,
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
            'payment_method' => 'required|string|in:cash,credit_card,debit_card,insurance,other',
            'status' => 'required|string|in:pending,completed,failed,refunded',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);
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

    public function receipt(Clinic $clinic, Payment $payment)
    {
        $payment->load(['patient', 'treatment']);
        $clinicInfo = [
            'name' => $clinic->name,
            'address' => $clinic->address ?? '123 Smile St, City',
            'phone' => $clinic->phone ?? '(123) 456-7890',
            'logo_url' => asset('images/clinic-logo.png'), // You can update this path
        ];
        return Inertia::render('Clinic/Payments/Receipt', [
            'clinic' => $clinicInfo,
            'payment' => $payment,
        ]);
    }
}
