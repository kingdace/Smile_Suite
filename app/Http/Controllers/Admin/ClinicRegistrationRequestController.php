<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClinicRegistrationRequest;
use App\Mail\ClinicRegistrationApproved;
use App\Mail\PaymentConfirmed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ClinicRegistrationRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        $query = ClinicRegistrationRequest::query();

        // Apply status filter
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Apply payment status filter
        if ($paymentStatus = $request->input('payment_status')) {
            $query->where('payment_status', $paymentStatus);
        }

        // Apply search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('clinic_name', 'like', "%{$search}%")
                  ->orWhere('contact_person', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $requests = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/ClinicRegistrationRequests/Index', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status', 'payment_status']),
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    public function show(ClinicRegistrationRequest $registrationRequest)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Admin/ClinicRegistrationRequests/Show', [
            'request' => $registrationRequest,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    public function approve(ClinicRegistrationRequest $registrationRequest)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        if (!$registrationRequest->canBeApproved()) {
            return back()->with('error', 'This request cannot be approved. Please check payment status and expiration.');
        }

        $registrationRequest->update([
            'status' => 'approved',
            'approved_at' => now(),
            'admin_notes' => request('admin_notes'),
        ]);

        // Send approval email with payment instructions
        try {
            Mail::to($registrationRequest->email)->send(new ClinicRegistrationApproved($registrationRequest));
            Log::info('Approval email sent to: ' . $registrationRequest->email);
        } catch (\Exception $e) {
            Log::error('Failed to send approval email: ' . $e->getMessage());
        }

        return back()->with('success', 'Clinic registration approved! Payment instructions email sent to ' . $registrationRequest->email);
    }

    public function reject(Request $request, ClinicRegistrationRequest $registrationRequest)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        $registrationRequest->update([
            'status' => 'rejected',
            'admin_notes' => $request->input('admin_notes'),
        ]);

        // Send rejection email
        $this->sendRejectionEmail($registrationRequest);

        return back()->with('success', 'Clinic registration request rejected.');
    }

    public function updatePaymentStatus(Request $request, ClinicRegistrationRequest $registrationRequest)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        // Add debugging
        Log::info('Payment status update attempt', [
            'request_id' => $registrationRequest->id,
            'old_status' => $registrationRequest->payment_status,
            'new_status' => $request->input('payment_status'),
            'user' => Auth::user()->email
        ]);

        $oldPaymentStatus = $registrationRequest->payment_status;
        $newPaymentStatus = $request->input('payment_status');

        // Validate the payment status
        if (!in_array($newPaymentStatus, ['pending', 'paid', 'failed'])) {
            Log::error('Invalid payment status provided', ['status' => $newPaymentStatus]);
            return back()->with('error', 'Invalid payment status provided.');
        }

        $registrationRequest->update([
            'payment_status' => $newPaymentStatus,
        ]);

        Log::info('Payment status updated successfully', [
            'request_id' => $registrationRequest->id,
            'old_status' => $oldPaymentStatus,
            'new_status' => $newPaymentStatus
        ]);

        // If payment status changed to 'paid', send setup email
        if ($oldPaymentStatus !== 'paid' && $newPaymentStatus === 'paid') {
            try {
                Mail::to($registrationRequest->email)->send(new PaymentConfirmed($registrationRequest));
                Log::info('Payment confirmation email sent to: ' . $registrationRequest->email);
                Log::info('Setup link: ' . route('clinic.setup', ['token' => $registrationRequest->approval_token]));

                return back()->with('success', 'Payment confirmed! Setup email sent to ' . $registrationRequest->email);
            } catch (\Exception $e) {
                Log::error('Failed to send payment confirmation email: ' . $e->getMessage());
                return back()->with('error', 'Payment status updated but failed to send setup email.');
            }
        }

        return back()->with('success', 'Payment status updated successfully.');
    }

    private function sendRejectionEmail(ClinicRegistrationRequest $request)
    {
        // This would send a rejection email
        Log::info('Rejection email would be sent to: ' . $request->email);

        // In production, you would use:
        // Mail::to($request->email)->send(new ClinicRejectionMail($request));
    }
}
