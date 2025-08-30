<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionRequest;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class SubscriptionRequestController extends Controller
{
    protected $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    public function index()
    {
        $requests = SubscriptionRequest::with('clinic')
            ->latest()
            ->get();

        // Calculate stats
        $stats = [
            'total' => $requests->count(),
            'pending' => $requests->where('status', 'pending')->count(),
            'upgrades' => $requests->where('request_type', 'upgrade')->count(),
            'renewals' => $requests->where('request_type', 'renewal')->count(),
        ];

        return Inertia::render('Admin/SubscriptionRequests/Index', [
            'requests' => $requests,
            'stats' => $stats,
        ]);
    }

    public function approve(SubscriptionRequest $subscriptionRequest)
    {
        try {
            $clinic = $subscriptionRequest->clinic;

            if (!$clinic) {
                return response()->json([
                    'success' => false,
                    'message' => 'Clinic not found for this request.',
                ], 404);
            }

            // Generate payment token
            $paymentToken = \Illuminate\Support\Str::random(64);
            $paymentDeadline = now()->addDays(7);

            $subscriptionRequest->update([
                'status' => 'approved',
                'payment_token' => $paymentToken,
                'payment_deadline' => $paymentDeadline,
                'processed_at' => now(),
                'processed_by' => Auth::id(),
            ]);

            // Send payment instructions email
            try {
                Mail::to($clinic->email)->send(
                    new \App\Mail\SubscriptionPaymentInstructions($subscriptionRequest)
                );

                Log::info('Payment instructions email sent successfully', [
                    'request_id' => $subscriptionRequest->id,
                    'clinic_email' => $clinic->email,
                ]);
            } catch (\Exception $emailError) {
                Log::error('Failed to send payment instructions email: ' . $emailError->getMessage());
            }

            Log::info('Subscription request approved', [
                'request_id' => $subscriptionRequest->id,
                'clinic_id' => $subscriptionRequest->clinic_id,
                'amount' => $subscriptionRequest->calculated_amount,
                'admin_id' => Auth::id(),
                'payment_token' => $paymentToken,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Request approved! Payment instructions sent to clinic.',
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to approve subscription request: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to approve request. Please try again.',
            ], 500);
        }
    }

    public function reject(Request $request, SubscriptionRequest $subscriptionRequest)
    {
        try {
            $validated = $request->validate([
                'admin_notes' => 'required|string|min:10',
            ]);

            $subscriptionRequest->update([
                'status' => 'rejected',
                'admin_notes' => $validated['admin_notes'],
                'processed_at' => now(),
                'processed_by' => Auth::id(),
            ]);

            // Send rejection email to clinic
            try {
                Mail::to($subscriptionRequest->clinic->email)->send(
                    new \App\Mail\SubscriptionRequestRejected($subscriptionRequest)
                );
            } catch (\Exception $emailError) {
                Log::error('Failed to send rejection email: ' . $emailError->getMessage());
            }

            Log::info('Subscription request rejected', [
                'request_id' => $subscriptionRequest->id,
                'clinic_id' => $subscriptionRequest->clinic_id,
                'admin_id' => Auth::id(),
                'notes' => $validated['admin_notes'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Request rejected successfully.',
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to reject subscription request: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to reject request. Please try again.',
            ], 500);
        }
    }

    public function complete(Request $request, SubscriptionRequest $subscriptionRequest)
    {
        try {
            $clinic = $subscriptionRequest->clinic;

            // Verify payment details if payment_status is pending_verification
            if ($subscriptionRequest->payment_status === 'pending_verification') {
                $validated = $request->validate([
                    'payment_verification_notes' => 'nullable|string',
                    'verify_payment' => 'required|boolean',
                ]);

                if (!$validated['verify_payment']) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Payment verification is required to complete the request.',
                    ], 400);
                }

                // Update payment verification notes and mark as verified
                $subscriptionRequest->update([
                    'payment_verification_notes' => $validated['payment_verification_notes'],
                    'payment_status' => 'verified',
                ]);
            }

            // Proceed with completion
            $this->completeSubscriptionRequest($subscriptionRequest);

            return response()->json([
                'success' => true,
                'message' => 'Request completed! Subscription updated successfully.',
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to complete subscription request: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to complete request. Please try again.',
            ], 500);
        }
    }

    /**
     * Verify payment details (similar to clinic registration)
     */
    public function verifyPayment(Request $request, SubscriptionRequest $subscriptionRequest)
    {
        try {
            // Mark payment as verified and send completion email
            $subscriptionRequest->update([
                'payment_status' => 'verified',
                'payment_verification_notes' => $request->input('payment_verification_notes'),
            ]);

            Log::info('Subscription payment verified by admin', [
                'request_id' => $subscriptionRequest->id,
                'admin_user' => Auth::user()->email,
                'clinic_name' => $subscriptionRequest->clinic->name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully! Subscription will be activated.',
            ]);

        } catch (\Exception $e) {
            Log::error('Payment verification failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update payment status (similar to clinic registration)
     */
    public function updatePaymentStatus(Request $request, SubscriptionRequest $subscriptionRequest)
    {
        try {
            $oldPaymentStatus = $subscriptionRequest->payment_status;
            $newPaymentStatus = $request->input('payment_status');

            // Validate the payment status
            if (!in_array($newPaymentStatus, ['pending', 'pending_verification', 'verified', 'rejected'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid payment status provided.',
                ], 400);
            }

            $subscriptionRequest->update([
                'payment_status' => $newPaymentStatus,
                'payment_verification_notes' => $request->input('payment_verification_notes'),
            ]);

            Log::info('Subscription payment status updated', [
                'request_id' => $subscriptionRequest->id,
                'old_status' => $oldPaymentStatus,
                'new_status' => $newPaymentStatus,
                'admin_id' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment status updated successfully.',
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update payment status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment status. Please try again.',
            ], 500);
        }
    }

    private function completeSubscriptionRequest(SubscriptionRequest $subscriptionRequest)
    {
        $clinic = $subscriptionRequest->clinic;

        // Process the subscription change
        if ($subscriptionRequest->request_type === 'upgrade') {
            // Use upgrade method for plan changes
            $this->subscriptionService->upgradeSubscription(
                $clinic,
                $subscriptionRequest->requested_plan,
                $subscriptionRequest->duration_months
            );
        } else {
            // Use renewal method for extending duration
            $this->subscriptionService->renewSubscription(
                $clinic,
                $clinic->subscription_plan,
                $subscriptionRequest->duration_months
            );
        }

        // Update request status
        $subscriptionRequest->update([
            'status' => 'completed',
            'processed_at' => now(),
            'processed_by' => Auth::id(),
        ]);

        // Send completion email to clinic
        Mail::to($clinic->email)->send(
            new \App\Mail\SubscriptionRequestCompleted($subscriptionRequest)
        );

        // Log detailed completion information
        Log::info('Subscription request completed', [
            'request_id' => $subscriptionRequest->id,
            'clinic_id' => $subscriptionRequest->clinic_id,
            'admin_id' => Auth::id(),
            'request_type' => $subscriptionRequest->request_type,
            'current_plan' => $subscriptionRequest->current_plan,
            'requested_plan' => $subscriptionRequest->requested_plan,
            'duration_months' => $subscriptionRequest->duration_months,
            'payment_verified' => $subscriptionRequest->payment_status === 'verified',
            'clinic_old_plan' => $clinic->getOriginal('subscription_plan'),
            'clinic_new_plan' => $clinic->fresh()->subscription_plan,
            'clinic_old_end_date' => $clinic->getOriginal('subscription_end_date'),
            'clinic_new_end_date' => $clinic->fresh()->subscription_end_date,
        ]);
    }

    private function calculatePaymentAmount(SubscriptionRequest $request)
    {
        // Use the same pricing logic as the clinic controller
        $planPricing = [
            'basic' => [
                'name' => 'Basic Plan',
                'price' => 999,
                'currency' => 'PHP',
            ],
            'premium' => [
                'name' => 'Premium Plan',
                'price' => 1999,
                'currency' => 'PHP',
            ],
            'enterprise' => [
                'name' => 'Enterprise Plan',
                'price' => 2999,
                'currency' => 'PHP',
            ]
        ];

        $plan = $request->request_type === 'upgrade'
            ? $request->requested_plan
            : $request->current_plan;

        $basePrice = $planPricing[$plan]['price'] ?? 0;

        return $basePrice * $request->duration_months;
    }
}
