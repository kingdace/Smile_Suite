<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClinicRegistrationRequest;
use App\Models\Clinic;
use App\Models\User;
use App\Mail\ClinicRegistrationApproved;
use App\Mail\ClinicRegistrationRejected;
use App\Mail\PaymentConfirmed;
use App\Mail\PaymentFailed;
use App\Mail\TrialSetupEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
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

        // Show soft deleted records if requested
        if ($request->input('show_deleted') === 'true') {
            $query->withTrashed();
        }

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

        $requests = $query->latest()->paginate(5)->withQueryString();

        return Inertia::render('Admin/ClinicRegistrationRequests/Index', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status', 'payment_status', 'show_deleted']),
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    public function show($id)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        // Find the request including soft-deleted ones
        $registrationRequest = ClinicRegistrationRequest::withTrashed()->findOrFail($id);

        // Load the clinic relationship to ensure address data is available
        $registrationRequest->load('clinic');

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

        // Add debugging
        Log::info('Approval attempt started', [
            'request_id' => $registrationRequest->id,
            'email' => $registrationRequest->email,
            'plan' => $registrationRequest->subscription_plan,
            'admin' => Auth::user()->email
        ]);

        $registrationRequest->update([
            'status' => 'approved',
            'approved_at' => now(),
            'admin_notes' => request('admin_notes'),
        ]);

        // Handle approval based on subscription plan
        if ($registrationRequest->subscription_plan === 'basic') {
            // Basic plan - free trial, send setup email directly
            Log::info('Processing Basic plan approval - free trial setup');

            // Set approval status first
            $registrationRequest->update([
                'status' => 'approved',
                'approved_at' => now(),
                'payment_status' => 'trial', // Set to trial for Basic plan
                'payment_deadline' => null, // No payment deadline for free trials
            ]);

            try {
                // First, try to send the email immediately
                Log::info('Attempting to send TrialSetupEmail to: ' . $registrationRequest->email);

                // Send the email first (before creating clinic to avoid transaction issues)
                Mail::to($registrationRequest->email)->send(new TrialSetupEmail($registrationRequest));
                Log::info('Free trial setup email sent successfully to: ' . $registrationRequest->email);
                $emailStatus = 'Email sent successfully';

                // Then create clinic and user
                $this->createClinicFromRequest($registrationRequest);
                Log::info('Clinic and user created successfully for Basic plan');

                // Generate setup link
                $setupLink = route('clinic.setup', ['token' => $registrationRequest->approval_token]);
                Log::info('Setup link generated: ' . $setupLink);

                return back()->with('success', 'Basic plan approved! Free trial setup initiated. ' . $emailStatus . '. Direct setup link: ' . $setupLink);

            } catch (\Exception $e) {
                Log::error('Failed to process Basic plan approval: ' . $e->getMessage(), [
                    'request_id' => $registrationRequest->id,
                    'email' => $registrationRequest->email,
                    'trace' => $e->getTraceAsString()
                ]);

                return back()->with('error', 'Basic plan approval failed: ' . $e->getMessage());
            }
        } else {
            // Premium/Enterprise - require payment first
            Log::info('Processing Premium/Enterprise plan approval - payment required');

            // Set payment deadline (7 days from now)
            $paymentDeadline = now()->addDays(7);

            $registrationRequest->update([
                'status' => 'approved',
                'approved_at' => now(),
                'payment_deadline' => $paymentDeadline,
                'payment_duration_days' => 7,
            ]);

            try {
                Mail::to($registrationRequest->email)->send(new ClinicRegistrationApproved($registrationRequest));
                Log::info('Approval email with payment link sent to: ' . $registrationRequest->email);
                return back()->with('success', 'Clinic registration approved! Payment link sent to ' . $registrationRequest->email . '. Payment deadline: ' . $paymentDeadline->format('M j, Y g:i A'));
            } catch (\Exception $e) {
                Log::error('Failed to send approval email: ' . $e->getMessage(), [
                    'request_id' => $registrationRequest->id,
                    'email' => $registrationRequest->email
                ]);
                return back()->with('error', 'Clinic registration approved but failed to send email. Error: ' . $e->getMessage());
            }
        }
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
        if (!in_array($newPaymentStatus, ['pending', 'pending_verification', 'paid', 'failed', 'payment_failed', 'trial'])) {
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

        // Handle email notifications based on payment status change
        if ($oldPaymentStatus !== $newPaymentStatus) {
            try {
                if ($newPaymentStatus === 'paid') {
                    // Payment confirmed - send setup email
                    Mail::to($registrationRequest->email)->send(new PaymentConfirmed($registrationRequest));
                    Log::info('Payment confirmation email sent to: ' . $registrationRequest->email);
                    Log::info('Setup link: ' . route('clinic.setup', ['token' => $registrationRequest->approval_token]));

                    return back()->with('success', 'Payment confirmed! Setup email sent to ' . $registrationRequest->email);
                } elseif ($newPaymentStatus === 'payment_failed') {
                    // Payment failed - send failure notification with retry option
                    Mail::to($registrationRequest->email)->send(new PaymentFailed($registrationRequest));
                    Log::info('Payment failed email sent to: ' . $registrationRequest->email);

                    return back()->with('success', 'Payment status updated to failed. Retry notification sent to ' . $registrationRequest->email);
                }
            } catch (\Exception $e) {
                Log::error('Failed to send payment status email: ' . $e->getMessage());
                return back()->with('error', 'Payment status updated but failed to send notification email.');
            }
        }

        return back()->with('success', 'Payment status updated successfully.');
    }

    /**
     * Verify payment and mark as paid
     */
    public function verifyPayment(Request $request, ClinicRegistrationRequest $registrationRequest)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        try {
            // Use the subscription service to verify payment
            $subscriptionService = app(\App\Services\SubscriptionService::class);
            $result = $subscriptionService->verifyPayment($registrationRequest->id);

            if ($result) {
                Log::info('Payment verified by admin', [
                    'request_id' => $registrationRequest->id,
                    'admin_user' => Auth::user()->email,
                    'clinic_name' => $registrationRequest->clinic_name,
                ]);

                return back()->with('success', 'Payment verified successfully! Setup email sent to ' . $registrationRequest->email);
            } else {
                return back()->with('error', 'Failed to verify payment. Please try again.');
            }
        } catch (\Exception $e) {
            Log::error('Payment verification failed: ' . $e->getMessage());
            return back()->with('error', 'Payment verification failed: ' . $e->getMessage());
        }
    }

    public function retryPayment(ClinicRegistrationRequest $registrationRequest)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        // Only allow retry for failed payment statuses
        if (!in_array($registrationRequest->payment_status, ['payment_failed', 'failed'])) {
            return back()->with('error', 'Payment retry is only allowed for failed payments.');
        }

        Log::info('Payment retry initiated', [
            'request_id' => $registrationRequest->id,
            'email' => $registrationRequest->email,
            'admin' => Auth::user()->email
        ]);

        try {
            // Reset to pending status
            $registrationRequest->update([
                'status' => 'pending',
                'payment_status' => 'pending',
                'approval_token' => Str::random(64),
                'expires_at' => now()->addDays(7),
                'payment_deadline' => now()->addDays(7),
                'payment_duration_days' => 7,
            ]);

            // Send new approval email
            Mail::to($registrationRequest->email)->send(new ClinicRegistrationApproved($registrationRequest));

            Log::info('Payment retry completed successfully', [
                'request_id' => $registrationRequest->id,
                'email' => $registrationRequest->email
            ]);

            return back()->with('success', 'Payment retry initiated! New payment instructions sent to ' . $registrationRequest->email);

        } catch (\Exception $e) {
            Log::error('Payment retry failed: ' . $e->getMessage(), [
                'request_id' => $registrationRequest->id,
                'email' => $registrationRequest->email
            ]);

            return back()->with('error', 'Payment retry failed: ' . $e->getMessage());
        }
    }

    /**
     * Soft delete a clinic registration request
     */
    public function softDelete($id)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        // Find the record
        $registrationRequest = ClinicRegistrationRequest::findOrFail($id);

        // Prevent deletion of completed requests (those with associated clinics)
        if ($registrationRequest->clinic) {
            return back()->with('error', 'Cannot delete a request that has been completed and has an active clinic account.');
        }

        // Prevent deletion of requests that are currently approved and paid
        if ($registrationRequest->status === 'approved' && $registrationRequest->payment_status === 'paid') {
            return back()->with('error', 'Cannot delete a request that has been approved and paid. This request may be in the process of clinic setup.');
        }

        Log::info('Soft delete initiated', [
            'request_id' => $registrationRequest->id,
            'email' => $registrationRequest->email,
            'status' => $registrationRequest->status,
            'payment_status' => $registrationRequest->payment_status,
            'admin' => Auth::user()->email
        ]);

        try {
            $registrationRequest->delete(); // This will set deleted_at timestamp

            Log::info('Soft delete completed successfully', [
                'request_id' => $registrationRequest->id,
                'email' => $registrationRequest->email
            ]);

            return back()->with('success', 'Request soft deleted successfully. The data is preserved but hidden from the main view.');

        } catch (\Exception $e) {
            Log::error('Soft delete failed: ' . $e->getMessage(), [
                'request_id' => $registrationRequest->id,
                'email' => $registrationRequest->email
            ]);

            return back()->with('error', 'Soft delete failed: ' . $e->getMessage());
        }
    }

    /**
     * Permanently delete a clinic registration request
     */
    public function hardDelete($id)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        // Find the record including soft deleted ones
        $registrationRequest = ClinicRegistrationRequest::withTrashed()->findOrFail($id);

        // Prevent deletion of completed requests (those with associated clinics)
        if ($registrationRequest->clinic) {
            return back()->with('error', 'Cannot permanently delete a request that has been completed and has an active clinic account.');
        }

        // Prevent deletion of requests that are currently approved and paid
        if ($registrationRequest->status === 'approved' && $registrationRequest->payment_status === 'paid') {
            return back()->with('error', 'Cannot permanently delete a request that has been approved and paid. This request may be in the process of clinic setup.');
        }

        Log::info('Hard delete initiated', [
            'request_id' => $registrationRequest->id,
            'email' => $registrationRequest->email,
            'status' => $registrationRequest->status,
            'payment_status' => $registrationRequest->payment_status,
            'admin' => Auth::user()->email
        ]);

        try {
            $registrationRequest->forceDelete(); // This will permanently remove from database

            Log::info('Hard delete completed successfully', [
                'request_id' => $registrationRequest->id,
                'email' => $registrationRequest->email
            ]);

            return back()->with('success', 'Request permanently deleted from the database.');

        } catch (\Exception $e) {
            Log::error('Hard delete failed: ' . $e->getMessage(), [
                'request_id' => $registrationRequest->id,
                'email' => $registrationRequest->email
            ]);

            return back()->with('error', 'Hard delete failed: ' . $e->getMessage());
        }
    }

    /**
     * Restore a soft deleted clinic registration request
     */
    public function restore($id)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        // Find the record including soft deleted ones
        $registrationRequest = ClinicRegistrationRequest::withTrashed()->findOrFail($id);

        Log::info('Restore initiated', [
            'request_id' => $registrationRequest->id,
            'email' => $registrationRequest->email,
            'admin' => Auth::user()->email
        ]);

        try {
            $registrationRequest->restore(); // This will remove the deleted_at timestamp

            Log::info('Restore completed successfully', [
                'request_id' => $registrationRequest->id,
                'email' => $registrationRequest->email
            ]);

            return back()->with('success', 'Request restored successfully.');

        } catch (\Exception $e) {
            Log::error('Restore failed: ' . $e->getMessage(), [
                'request_id' => $registrationRequest->id,
                'email' => $registrationRequest->email
            ]);

            return back()->with('error', 'Restore failed: ' . $e->getMessage());
        }
    }

    private function sendRejectionEmail(ClinicRegistrationRequest $request)
    {
        try {
            Mail::to($request->email)->send(new ClinicRegistrationRejected($request));
            Log::info('Rejection email sent to: ' . $request->email);
        } catch (\Exception $e) {
            Log::error('Failed to send rejection email: ' . $e->getMessage());
        }
    }

    private function createClinicFromRequest(ClinicRegistrationRequest $request)
    {
        Log::info('Starting clinic creation for Basic plan trial', [
            'request_id' => $request->id,
            'email' => $request->email,
            'clinic_name' => $request->clinic_name
        ]);

        try {
            DB::transaction(function () use ($request) {
                // Generate a unique slug from the clinic name
                $baseSlug = Str::slug($request->clinic_name);
                $slug = $baseSlug;
                $counter = 1;

                // Ensure slug uniqueness
                while (Clinic::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }

                // Create clinic
                $clinic = Clinic::create([
                    'name' => $request->clinic_name,
                    'slug' => $slug,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'description' => $request->description,
                    'subscription_plan' => $request->subscription_plan,
                    'subscription_status' => 'trial',
                    'subscription_start_date' => now(),
                    'subscription_end_date' => now()->addDays(14), // 14-day trial
                    'trial_ends_at' => now()->addDays(14),
                    'is_active' => true,
                ]);

                Log::info('Clinic created successfully', ['clinic_id' => $clinic->id]);

                // Create admin user
                $user = User::create([
                    'name' => $request->contact_person,
                    'email' => $request->email,
                    'password' => Hash::make(Str::random(12)), // Temporary password
                    'role' => 'clinic_admin',
                    'user_type' => User::getUserTypeFromRole('clinic_admin'),
                    'clinic_id' => $clinic->id,
                    'email_verified_at' => now(),
                ]);

                Log::info('Admin user created successfully', ['user_id' => $user->id]);

                // Update registration request
                $request->update([
                    'clinic_id' => $clinic->id,
                    'payment_status' => 'trial', // Set to trial for Basic plan
                ]);

                Log::info('Registration request updated successfully');

                Log::info('Clinic and user created for free trial', [
                    'clinic_id' => $clinic->id,
                    'user_id' => $user->id,
                    'email' => $request->email
                ]);
            });

            Log::info('Clinic creation transaction completed successfully');
        } catch (\Exception $e) {
            Log::error('Failed to create clinic for Basic plan trial: ' . $e->getMessage(), [
                'request_id' => $request->id,
                'email' => $request->email,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e; // Re-throw to be caught by the calling method
        }
    }
}
