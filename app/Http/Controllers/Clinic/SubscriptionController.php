<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Traits\SubscriptionAccessControl;
use App\Mail\SubscriptionUpgradeRequest;
use App\Mail\SubscriptionRenewalRequest;
use App\Models\SubscriptionRequest;

class SubscriptionController extends Controller
{
    use SubscriptionAccessControl;

    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index()
    {
        // Check subscription access first
        $this->checkSubscriptionAccess();

        $clinic = Auth::user()->clinic;

        return Inertia::render('Clinic/Subscription/Index', [
            'clinic' => $clinic,
        ]);
    }

    /**
     * Test endpoint to verify basic functionality
     */
    public function test()
    {
        try {
            $clinic = Auth::user()->clinic;

            if (!$clinic) {
                return response()->json([
                    'success' => false,
                    'message' => 'No clinic found for this user.'
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Test endpoint working',
                'clinic_id' => $clinic->id,
                'subscription_plan' => $clinic->subscription_plan,
                'user_id' => Auth::id()
            ]);
        } catch (\Exception $e) {
            Log::error('Test endpoint failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Test endpoint failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get subscription plan pricing information
     */
    private function getPlanPricing()
    {
        return [
            'basic' => [
                'name' => 'Basic Plan',
                'price' => 999,
                'currency' => 'PHP',
                'features' => ['Basic features', 'Email support']
            ],
            'premium' => [
                'name' => 'Premium Plan',
                'price' => 1999,
                'currency' => 'PHP',
                'features' => ['Premium features', 'Priority support', 'Advanced analytics']
            ],
            'enterprise' => [
                'name' => 'Enterprise Plan',
                'price' => 2999,
                'currency' => 'PHP',
                'features' => ['Enterprise features', '24/7 support', 'Custom integrations', 'Dedicated account manager']
            ]
        ];
    }

    /**
     * Validate upgrade path
     */
    private function validateUpgradePath($currentPlan, $requestedPlan)
    {
        $validUpgrades = [
            'basic' => ['premium', 'enterprise'],
            'premium' => ['enterprise'],
            'enterprise' => [] // No upgrades from enterprise
        ];

        return in_array($requestedPlan, $validUpgrades[$currentPlan] ?? []);
    }

    /**
     * Request subscription upgrade with automatic approval
     */
    public function requestUpgrade(Request $request)
    {
        $user = Auth::user();
        $clinic = $user->clinic;

        // Debug logging
        Log::info('Upgrade request started', [
            'user_id' => $user->id,
            'user_role' => $user->role,
            'clinic_id' => $clinic ? $clinic->id : null,
            'clinic_exists' => $clinic ? true : false,
            'user_clinic_id' => $user->clinic_id
        ]);

        if (!$clinic) {
            Log::error('No clinic found for user', [
                'user_id' => $user->id,
                'user_clinic_id' => $user->clinic_id,
                'user_role' => $user->role
            ]);
            return response()->json([
                'success' => false,
                'message' => 'No clinic found for this user. Please contact support.',
                'debug' => [
                    'user_id' => $user->id,
                    'clinic_id' => $user->clinic_id,
                    'role' => $user->role
                ]
            ], 400);
        }

        $validated = $request->validate([
            'new_plan' => 'required|in:basic,premium,enterprise',
            'duration_months' => 'required|integer|min:1|max:12',
            'message' => 'nullable|string|max:500',
        ]);

        try {
            // Validate upgrade path
            if (!$this->validateUpgradePath($clinic->subscription_plan, $validated['new_plan'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid upgrade path. You cannot upgrade to the selected plan.',
                    'current_plan' => $clinic->subscription_plan,
                    'requested_plan' => $validated['new_plan']
                ], 400);
            }

            // Get plan pricing
            $planPricing = $this->getPlanPricing();
            $requestedPlan = $planPricing[$validated['new_plan']];

            // Calculate total amount
            $totalAmount = $requestedPlan['price'] * $validated['duration_months'];

            // 🚀 AUTOMATIC APPROVAL: Skip admin approval and generate payment token immediately
            $paymentToken = \Illuminate\Support\Str::random(64);
            $paymentDeadline = now()->addDays(7);

            // Store the upgrade request in database with automatic approval
            Log::info('Creating automatically approved subscription request', [
                'clinic_id' => $clinic->id,
                'request_type' => 'upgrade',
                'current_plan' => $clinic->subscription_plan,
                'requested_plan' => $validated['new_plan'],
                'duration_months' => $validated['duration_months'],
                'calculated_amount' => $totalAmount,
                'payment_token' => $paymentToken,
                'auto_approved' => true
            ]);

            $subscriptionRequest = SubscriptionRequest::create([
                'clinic_id' => $clinic->id,
                'request_type' => 'upgrade',
                'current_plan' => $clinic->subscription_plan,
                'requested_plan' => $validated['new_plan'],
                'duration_months' => $validated['duration_months'],
                'message' => $validated['message'] ?? null,
                'status' => 'approved', // 🚀 AUTOMATICALLY APPROVED
                'calculated_amount' => $totalAmount,
                'payment_token' => $paymentToken, // 🚀 IMMEDIATE PAYMENT TOKEN
                'payment_deadline' => $paymentDeadline, // 🚀 IMMEDIATE DEADLINE
                'processed_at' => now(), // 🚀 IMMEDIATE PROCESSING
                'processed_by' => null, // System processed
            ]);

            Log::info('Subscription request automatically approved and payment token generated', [
                'request_id' => $subscriptionRequest->id,
                'payment_token' => $paymentToken,
                'payment_deadline' => $paymentDeadline
            ]);

            // 🚀 IMMEDIATE PAYMENT INSTRUCTIONS: Send payment instructions email to clinic
            Log::info('Sending immediate payment instructions email to clinic');
            try {
                Mail::to($clinic->email)->send(
                    new \App\Mail\SubscriptionPaymentInstructions($subscriptionRequest)
                );
                Log::info('Payment instructions email sent successfully');
            } catch (\Exception $mailError) {
                Log::error('Failed to send payment instructions email: ' . $mailError->getMessage());
                // Don't fail the entire request if email fails
            }

            Log::info('Subscription upgrade request automatically approved and payment instructions sent', [
                'clinic_id' => $clinic->id,
                'clinic_name' => $clinic->name,
                'current_plan' => $clinic->subscription_plan,
                'requested_plan' => $validated['new_plan'],
                'duration' => $validated['duration_months'],
                'request_id' => $subscriptionRequest->id,
                'amount' => $totalAmount,
                'payment_token' => $paymentToken
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Upgrade request approved! Please check your email for payment instructions.',
                'request_id' => $subscriptionRequest->id,
                'amount' => $totalAmount,
                'plan_details' => $requestedPlan,
                'email_sent' => true,
                'check_email' => true
            ]);

        } catch (\Exception $e) {
            Log::error('Subscription upgrade request failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to process upgrade request. Please try again or contact support.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Request subscription renewal with automatic approval
     */
    public function requestRenewal(Request $request)
    {
        $user = Auth::user();
        $clinic = $user->clinic;

        // Debug logging
        Log::info('Renewal request started', [
            'user_id' => $user->id,
            'user_role' => $user->role,
            'clinic_id' => $clinic ? $clinic->id : null,
            'clinic_exists' => $clinic ? true : false,
            'user_clinic_id' => $user->clinic_id
        ]);

        if (!$clinic) {
            Log::error('No clinic found for user', [
                'user_id' => $user->id,
                'user_clinic_id' => $user->clinic_id,
                'user_role' => $user->role
            ]);
            return response()->json([
                'success' => false,
                'message' => 'No clinic found for this user. Please contact support.',
                'debug' => [
                    'user_id' => $user->id,
                    'clinic_id' => $user->clinic_id,
                    'role' => $user->role
                ]
            ], 400);
        }

        $validated = $request->validate([
            'duration_months' => 'required|integer|min:1|max:12',
            'message' => 'nullable|string|max:500',
        ]);

        try {
            // Get current plan pricing
            $planPricing = $this->getPlanPricing();
            $currentPlan = $planPricing[$clinic->subscription_plan];

            // Calculate total amount
            $totalAmount = $currentPlan['price'] * $validated['duration_months'];

            // Calculate new end date by adding to existing duration
            $currentEndDate = $clinic->subscription_end_date;
            $newDurationDays = $validated['duration_months'] * 30;

            // If subscription is expired, start from today
            if ($currentEndDate && $currentEndDate->isPast()) {
                $newEndDate = now()->addDays($newDurationDays);
            } else {
                // Add to existing duration
                $newEndDate = $currentEndDate ? $currentEndDate->addDays($newDurationDays) : now()->addDays($newDurationDays);
            }

            // 🚀 AUTOMATIC APPROVAL: Skip admin approval and generate payment token immediately
            $paymentToken = \Illuminate\Support\Str::random(64);
            $paymentDeadline = now()->addDays(7);

            // Store the renewal request in database with automatic approval
            Log::info('Creating automatically approved renewal request', [
                'clinic_id' => $clinic->id,
                'request_type' => 'renewal',
                'current_plan' => $clinic->subscription_plan,
                'duration_months' => $validated['duration_months'],
                'calculated_amount' => $totalAmount,
                'payment_token' => $paymentToken,
                'auto_approved' => true
            ]);

            $subscriptionRequest = SubscriptionRequest::create([
                'clinic_id' => $clinic->id,
                'request_type' => 'renewal',
                'current_plan' => $clinic->subscription_plan,
                'requested_plan' => $clinic->subscription_plan, // Same plan for renewal
                'duration_months' => $validated['duration_months'],
                'message' => $validated['message'] ?? null,
                'status' => 'approved', // 🚀 AUTOMATICALLY APPROVED
                'calculated_amount' => $totalAmount,
                'payment_token' => $paymentToken, // 🚀 IMMEDIATE PAYMENT TOKEN
                'payment_deadline' => $paymentDeadline, // 🚀 IMMEDIATE DEADLINE
                'processed_at' => now(), // 🚀 IMMEDIATE PROCESSING
                'processed_by' => null, // System processed
            ]);

            Log::info('Renewal request automatically approved and payment token generated', [
                'request_id' => $subscriptionRequest->id,
                'payment_token' => $paymentToken,
                'payment_deadline' => $paymentDeadline
            ]);

            // 🚀 IMMEDIATE PAYMENT INSTRUCTIONS: Send payment instructions email to clinic
            Log::info('Sending immediate payment instructions email to clinic');
            try {
                Mail::to($clinic->email)->send(
                    new \App\Mail\SubscriptionPaymentInstructions($subscriptionRequest)
                );
                Log::info('Payment instructions email sent successfully');
            } catch (\Exception $mailError) {
                Log::error('Failed to send payment instructions email: ' . $mailError->getMessage());
                // Don't fail the entire request if email fails
            }

            Log::info('Subscription renewal request automatically approved and payment instructions sent', [
                'clinic_id' => $clinic->id,
                'clinic_name' => $clinic->name,
                'current_plan' => $clinic->subscription_plan,
                'duration' => $validated['duration_months'],
                'request_id' => $subscriptionRequest->id,
                'amount' => $totalAmount,
                'current_end_date' => $currentEndDate,
                'new_end_date' => $newEndDate,
                'payment_token' => $paymentToken
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Renewal request approved! Please check your email for payment instructions.',
                'request_id' => $subscriptionRequest->id,
                'amount' => $totalAmount,
                'plan_details' => $currentPlan,
                'duration_days' => $newDurationDays,
                'new_end_date' => $newEndDate->format('Y-m-d'),
                'email_sent' => true,
                'check_email' => true
            ]);

        } catch (\Exception $e) {
            Log::error('Subscription renewal request failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to process renewal request. Please try again or contact support.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Quick renewal (for admin panel access)
     */
    public function quickRenewal()
    {
        $clinic = Auth::user()->clinic;

        // Redirect to admin subscription management with pre-filled clinic
        return redirect()->route('admin.subscriptions.index', [
            'clinic_id' => $clinic->id,
            'action' => 'renew'
        ])->with('info', 'Redirecting to admin panel for quick renewal. Please contact admin for assistance.');
    }
}
