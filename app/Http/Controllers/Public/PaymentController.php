<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ClinicRegistrationRequest;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    /**
     * Show payment page for approved registration request OR subscription request
     */
    public function showPayment($token)
    {
        // First try to find a clinic registration request
        $registrationRequest = ClinicRegistrationRequest::where('approval_token', $token)
            ->where('status', 'approved')
            ->where('payment_status', 'pending')
            ->where('expires_at', '>', now())
            ->first();

        if ($registrationRequest) {
            // Handle clinic registration payment
            return Inertia::render('Public/Payment', [
                'request' => $registrationRequest,
                'token' => $token,
                'paymentMethods' => $this->subscriptionService->getPaymentMethods(),
                'requestType' => 'registration'
            ]);
        }

        // If not found, try to find a subscription request (including completed ones)
        $subscriptionRequest = \App\Models\SubscriptionRequest::where('payment_token', $token)
            ->whereIn('status', ['approved', 'completed'])
            ->with('clinic')
            ->first();

        if ($subscriptionRequest) {
            // Check if payment is already completed
            if (in_array($subscriptionRequest->payment_status, ['paid', 'verified'])) {
                // Redirect to success page if payment is already completed
                return redirect()->route('subscription.upgrade.renewal.success', ['token' => $token]);
            }

            // Check if payment deadline has passed
            if ($subscriptionRequest->payment_deadline < now()) {
                abort(404, 'Payment deadline has expired');
            }

            // Handle subscription payment using the same payment page
            // Add clinic data to make it compatible with the Payment.jsx component
            $subscriptionRequest->clinic_name = $subscriptionRequest->clinic->name;
            $subscriptionRequest->contact_person = $subscriptionRequest->clinic->contact_person;
            $subscriptionRequest->email = $subscriptionRequest->clinic->email;
            $subscriptionRequest->subscription_plan = $subscriptionRequest->requested_plan;

            return Inertia::render('Public/Payment', [
                'request' => $subscriptionRequest,
                'token' => $token,
                'paymentMethods' => $this->subscriptionService->getPaymentMethods(),
                'requestType' => 'subscription'
            ]);
        }

        // If neither found, throw 404
        abort(404, 'Payment request not found or expired');
    }

    /**
     * Create payment intent for simulation (handles both registration and subscription)
     */
    public function createPaymentIntent(Request $request, $token)
    {
        // First try to find a clinic registration request
        $registrationRequest = ClinicRegistrationRequest::where('approval_token', $token)
            ->where('status', 'approved')
            ->where('payment_status', 'pending')
            ->where('expires_at', '>', now())
            ->first();

        if ($registrationRequest) {
            // Handle clinic registration payment intent
            try {
                // Create customer if not exists
                if (!$registrationRequest->stripe_customer_id) {
                    $customer = $this->subscriptionService->createCustomer($registrationRequest);
                    $registrationRequest->update(['stripe_customer_id' => $customer->id]);
                }

                // Create payment intent
                $paymentIntent = $this->subscriptionService->createPaymentIntent($registrationRequest);

                return response()->json([
                    'payment_intent_id' => $paymentIntent->id,
                    'amount' => $paymentIntent->amount,
                    'currency' => $paymentIntent->currency,
                ]);

            } catch (\Exception $e) {
                Log::error('Registration payment intent creation failed: ' . $e->getMessage());
                return response()->json(['error' => 'Payment setup failed'], 500);
            }
        }

        // If not found, try to find a subscription request
        $subscriptionRequest = \App\Models\SubscriptionRequest::where('payment_token', $token)
            ->where('status', 'approved')
            ->where('payment_deadline', '>', now())
            ->with('clinic')
            ->first();

        if ($subscriptionRequest) {
            // Handle subscription payment intent
            try {
                // For subscription requests, we'll use a simpler payment intent creation
                $paymentIntentId = 'sub_' . $subscriptionRequest->id . '_' . time();

                // Store payment intent in cache for verification
                \Illuminate\Support\Facades\Cache::put("payment_intent_{$paymentIntentId}", [
                    'type' => 'subscription',
                    'request_id' => $subscriptionRequest->id,
                    'amount' => $subscriptionRequest->calculated_amount,
                    'clinic_id' => $subscriptionRequest->clinic_id,
                    'created_at' => now()
                ], 3600); // 1 hour

                return response()->json([
                    'payment_intent_id' => $paymentIntentId,
                    'amount' => $subscriptionRequest->calculated_amount * 100, // Convert to cents
                    'currency' => 'php',
                ]);

            } catch (\Exception $e) {
                Log::error('Subscription payment intent creation failed: ' . $e->getMessage());
                return response()->json(['error' => 'Payment setup failed'], 500);
            }
        }

        // If neither found, throw 404
        abort(404, 'Payment request not found or expired');
    }

    /**
     * Handle successful payment (handles both registration and subscription)
     */
    public function handlePaymentSuccess(Request $request, $token)
    {
        // First try to find a clinic registration request
        $registrationRequest = ClinicRegistrationRequest::where('approval_token', $token)
            ->where('status', 'approved')
            ->where('payment_status', 'pending')
            ->where('expires_at', '>', now())
            ->first();

        if ($registrationRequest) {
            // Handle clinic registration payment success
            try {
                $paymentIntentId = $request->input('payment_intent_id');
                $paymentMethod = $request->input('payment_method', 'simulation');
                $paymentDetails = $request->input('payment_details');

                // Store payment details if provided (for QR code payments)
                if ($paymentDetails) {
                    $registrationRequest->update([
                        'payment_details' => $paymentDetails,
                    ]);
                }

                // Simulate payment processing with enhanced validation
                $result = $this->subscriptionService->simulatePayment($paymentIntentId, $paymentMethod, $paymentDetails);

                if ($result) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Payment successful! Setup instructions have been sent to your email.',
                        'setup_url' => route('clinic.setup', ['token' => $token]),
                        'email_sent' => true,
                        'verification_type' => 'automatic'
                    ]);
                }

                return response()->json(['error' => 'Payment verification failed'], 400);

            } catch (\Exception $e) {
                Log::error('Registration payment success handling failed: ' . $e->getMessage());
                return response()->json(['error' => 'Payment processing failed'], 500);
            }
        }

        // If not found, try to find a subscription request
        $subscriptionRequest = \App\Models\SubscriptionRequest::where('payment_token', $token)
            ->where('status', 'approved')
            ->where('payment_deadline', '>', now())
            ->with('clinic')
            ->first();

        if ($subscriptionRequest) {
            // Handle subscription payment success with automatic verification
            try {
                $paymentIntentId = $request->input('payment_intent_id');
                $paymentMethod = $request->input('payment_method', 'simulation');
                $paymentDetails = $request->input('payment_details');

                // Store payment details if provided
                if ($paymentDetails) {
                    $subscriptionRequest->update([
                        'payment_details' => $paymentDetails,
                    ]);
                }

                // 🚀 AUTOMATIC VERIFICATION: Use same logic as clinic registration
                $automaticVerificationResult = $this->attemptAutomaticVerification($subscriptionRequest, $paymentMethod, $paymentDetails);

                if ($automaticVerificationResult['success']) {
                    // AUTOMATIC VERIFICATION SUCCESSFUL
                    Log::info('Subscription payment automatically verified and completed', [
                        'request_id' => $subscriptionRequest->id,
                        'clinic_id' => $subscriptionRequest->clinic_id,
                        'payment_method' => $paymentMethod,
                        'verification_type' => 'automatic'
                    ]);

                    return response()->json([
                        'success' => true,
                        'message' => 'Payment successful! Your subscription has been automatically activated.',
                        'redirect_url' => route('subscription.upgrade.renewal.success', ['token' => $token]),
                        'verification_type' => 'automatic',
                        'subscription_activated' => true
                    ]);
                } else {
                    // AUTOMATIC VERIFICATION FAILED - FALLBACK TO MANUAL
                    Log::warning('Automatic verification failed, falling back to manual verification', [
                        'request_id' => $subscriptionRequest->id,
                        'clinic_id' => $subscriptionRequest->clinic_id,
                        'payment_method' => $paymentMethod,
                        'verification_type' => 'manual_fallback',
                        'error' => $automaticVerificationResult['error'] ?? 'Unknown error'
                    ]);

                    return response()->json([
                        'success' => true,
                        'message' => 'Payment submitted successfully! Our admin team will verify and activate your subscription within 24 hours.',
                        'redirect_url' => route('subscription.upgrade.renewal.success', ['token' => $token]),
                        'verification_type' => 'manual'
                    ]);
                }

            } catch (\Exception $e) {
                Log::error('Subscription payment success handling failed: ' . $e->getMessage());
                return response()->json(['error' => 'Payment processing failed'], 500);
            }
        }

        // If neither found, throw 404
        abort(404, 'Payment request not found or expired');
    }

    /**
     * Handle payment failure
     */
    public function handlePaymentFailure(Request $request, $token)
    {
        $registrationRequest = ClinicRegistrationRequest::where('approval_token', $token)
            ->where('status', 'approved')
            ->where('payment_status', 'pending')
            ->where('expires_at', '>', now())
            ->firstOrFail();

        try {
            $registrationRequest->update(['payment_status' => 'payment_failed']);

            return response()->json([
                'success' => true,
                'message' => 'Payment failed. You can retry payment.',
            ]);

        } catch (\Exception $e) {
            Log::error('Payment failure handling failed: ' . $e->getMessage());
            return response()->json(['error' => 'Payment failure processing failed'], 500);
        }
    }

    /**
     * Attempt automatic verification of subscription payment
     * Uses same logic as clinic registration flow
     */
    private function attemptAutomaticVerification($subscriptionRequest, $paymentMethod, $paymentDetails)
    {
        try {
            Log::info('Starting automatic verification for subscription payment', [
                'request_id' => $subscriptionRequest->id,
                'clinic_id' => $subscriptionRequest->clinic_id,
                'payment_method' => $paymentMethod,
                'request_type' => $subscriptionRequest->request_type
            ]);

            // Validate payment details using same logic as clinic registration
            $isValid = $this->validatePaymentDetails($paymentDetails, $paymentMethod);

            if (!$isValid) {
                Log::warning('Payment validation failed during automatic verification', [
                    'request_id' => $subscriptionRequest->id,
                    'payment_method' => $paymentMethod,
                    'payment_details' => $paymentDetails
                ]);
                return [
                    'success' => false,
                    'error' => 'Payment validation failed'
                ];
            }

            // Simulate payment processing with same logic as clinic registration
            $gatewayResponse = $this->simulateGatewayResponse($paymentMethod, $paymentDetails);

            if (!$gatewayResponse['success']) {
                Log::warning('Payment gateway simulation failed during automatic verification', [
                    'request_id' => $subscriptionRequest->id,
                    'payment_method' => $paymentMethod,
                    'gateway_response' => $gatewayResponse
                ]);
                return [
                    'success' => false,
                    'error' => $gatewayResponse['error'] ?? 'Payment gateway simulation failed'
                ];
            }

            // AUTOMATIC VERIFICATION SUCCESSFUL - Update subscription
            $clinic = $subscriptionRequest->clinic;
            if (!$clinic) {
                Log::error('Clinic not found for subscription request during automatic verification', [
                    'request_id' => $subscriptionRequest->id,
                    'clinic_id' => $subscriptionRequest->clinic_id
                ]);
                return [
                    'success' => false,
                    'error' => 'Clinic not found'
                ];
            }

            // Process the subscription change based on request type
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

            // Update subscription request status to completed
            $subscriptionRequest->update([
                'status' => 'completed',
                'payment_status' => 'verified',
                'processed_at' => now(),
                'processed_by' => null, // System processed
                'payment_verification_notes' => 'Automatically verified by system'
            ]);

            // Send completion email to clinic
            try {
                Mail::to($clinic->email)->send(new \App\Mail\SubscriptionRequestCompleted($subscriptionRequest));
                Log::info('Subscription completion email sent automatically', [
                    'request_id' => $subscriptionRequest->id,
                    'clinic_email' => $clinic->email
                ]);
            } catch (\Exception $emailError) {
                Log::error('Failed to send subscription completion email', [
                    'request_id' => $subscriptionRequest->id,
                    'clinic_email' => $clinic->email,
                    'error' => $emailError->getMessage()
                ]);
            }

            Log::info('Subscription payment automatically verified and completed', [
                'request_id' => $subscriptionRequest->id,
                'clinic_id' => $subscriptionRequest->clinic_id,
                'payment_method' => $paymentMethod,
                'request_type' => $subscriptionRequest->request_type
            ]);

            return ['success' => true, 'message' => 'Subscription automatically verified and activated'];

        } catch (\Exception $e) {
            Log::error('Automatic verification failed with exception', [
                'request_id' => $subscriptionRequest->id,
                'clinic_id' => $subscriptionRequest->clinic_id,
                'payment_method' => $paymentMethod,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return ['success' => false, 'error' => 'Automatic verification failed: ' . $e->getMessage()];
        }
    }

    /**
     * Validate payment details for different payment methods
     * Uses same validation logic as SubscriptionService
     */
    private function validatePaymentDetails($paymentDetails, $paymentMethod)
    {
        // For non-QR payments (like credit card), no additional validation needed
        if (!$paymentDetails || empty($paymentDetails)) {
            return true;
        }

        // Validate QR payment details (GCash, PayMaya)
        $requiredFields = ['sender_name', 'sender_phone', 'transaction_reference', 'payment_amount'];

        foreach ($requiredFields as $field) {
            if (empty($paymentDetails[$field])) {
                Log::warning('Missing payment field during validation', [
                    'field' => $field,
                    'payment_details' => $paymentDetails
                ]);
                return false;
            }
        }

        // Validate phone number format (Philippine mobile)
        $phone = $paymentDetails['sender_phone'];
        if (!preg_match('/^(\+63|0)9\d{9}$/', $phone)) {
            Log::warning('Invalid phone number format during validation', [
                'phone' => $phone
            ]);
            return false;
        }

        // Validate transaction reference format
        $reference = $paymentDetails['transaction_reference'];
        if (strlen($reference) < 8 || !preg_match('/^[A-Z0-9-]+$/', $reference)) {
            Log::warning('Invalid transaction reference format during validation', [
                'reference' => $reference
            ]);
            return false;
        }

        // Validate payment amount (should be positive)
        $amount = floatval($paymentDetails['payment_amount']);
        if ($amount <= 0) {
            Log::warning('Invalid payment amount during validation', [
                'amount' => $amount
            ]);
            return false;
        }

        return true;
    }

    /**
     * Simulate payment gateway response
     * Uses same simulation logic as SubscriptionService
     */
    private function simulateGatewayResponse($paymentMethod, $paymentDetails)
    {
        // Simulate different success rates based on payment method
        $successRates = [
            'gcash' => 0.95,      // 95% success rate
            'paymaya' => 0.93,    // 93% success rate
            'bank_transfer' => 0.90, // 90% success rate
            'credit_card' => 0.98,   // 98% success rate
            'simulation' => 1.0   // 100% success rate for testing
        ];

        $successRate = $successRates[$paymentMethod] ?? 0.95;
        $isSuccess = (mt_rand() / mt_getrandmax()) < $successRate;

        if ($isSuccess) {
            return [
                'success' => true,
                'transaction_id' => 'TXN_' . strtoupper(substr(md5(uniqid()), 0, 12)),
                'gateway_reference' => 'GW_' . strtoupper(substr(md5(uniqid()), 0, 8)),
                'processed_at' => date('Y-m-d\TH:i:s\Z'),
                'status' => 'completed',
                'message' => 'Payment processed successfully'
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Payment processing failed',
                'error_code' => 'PAYMENT_FAILED',
                'processed_at' => date('Y-m-d\TH:i:s\Z'),
                'status' => 'failed'
            ];
        }
    }

    /**
     * Show subscription upgrade/renewal success page
     */
    public function showSubscriptionSuccess($token)
    {
        $subscriptionRequest = \App\Models\SubscriptionRequest::where('payment_token', $token)
            ->whereIn('status', ['approved', 'completed'])
            ->with('clinic')
            ->firstOrFail();

        return Inertia::render('Public/SubscriptionUpgradeRenewalSuccess', [
            'request' => $subscriptionRequest,
        ]);
    }

}
