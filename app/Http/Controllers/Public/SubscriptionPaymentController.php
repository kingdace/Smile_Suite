<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionRequest;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class SubscriptionPaymentController extends Controller
{
    protected $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    /**
     * Show payment page for approved subscription request
     */
    public function showPayment($token)
    {
        $request = SubscriptionRequest::where('payment_token', $token)
            ->where('status', 'approved')
            ->where('payment_deadline', '>', now())
            ->with('clinic')
            ->firstOrFail();

        return Inertia::render('Public/SubscriptionPayment', [
            'request' => $request,
            'token' => $token,
            'paymentMethods' => $this->subscriptionService->getPaymentMethods(),
        ]);
    }

    /**
     * Handle successful payment with automatic verification
     */
    public function handlePaymentSuccess(Request $request, $token)
    {
        $subscriptionRequest = SubscriptionRequest::where('payment_token', $token)
            ->where('status', 'approved')
            ->where('payment_deadline', '>', now())
            ->with('clinic')
            ->firstOrFail();

        try {
            $paymentMethod = $request->input('payment_method', 'simulation');
            $paymentDetails = $request->input('payment_details', []);

            // Generate reference number
            $referenceNumber = $this->generateReferenceNumber($subscriptionRequest, $paymentMethod);

            // Extract payment details
            $senderName = $paymentDetails['sender_name'] ?? 'Not provided';
            $senderNumber = $paymentDetails['sender_number'] ?? 'Not provided';
            $amountSent = $paymentDetails['amount_sent'] ?? $subscriptionRequest->calculated_amount;

            // Store payment details in the same format as clinic registration
            $paymentDetailsForStorage = [
                'sender_name' => $senderName,
                'sender_phone' => $senderNumber,
                'transaction_reference' => $referenceNumber,
                'payment_amount' => $amountSent,
                'payment_method' => $paymentMethod,
                'user_reference_number' => $paymentDetails['reference_number'] ?? null, // User's input reference number
            ];

            // Store payment details
            $subscriptionRequest->update([
                'payment_method' => $paymentMethod,
                'payment_details' => json_encode($paymentDetailsForStorage),
                'reference_number' => $referenceNumber,
                'sender_name' => $senderName,
                'sender_number' => $senderNumber,
                'amount_sent' => $amountSent,
                'payment_received_at' => now(),
                'payment_status' => 'pending_verification', // Same as clinic registration flow
                // Don't update main status - keep it as 'approved' until admin verifies
            ]);

            // 🚀 AUTOMATIC VERIFICATION: Apply same logic as clinic registration
            $automaticVerificationResult = $this->attemptAutomaticVerification($subscriptionRequest, $paymentMethod, $paymentDetails);

            if ($automaticVerificationResult['success']) {
                // AUTOMATIC VERIFICATION SUCCESSFUL
                Log::info('Subscription payment automatically verified and completed', [
                    'request_id' => $subscriptionRequest->id,
                    'clinic_id' => $subscriptionRequest->clinic_id,
                    'payment_method' => $paymentMethod,
                    'reference_number' => $referenceNumber,
                    'amount_sent' => $amountSent,
                    'verification_type' => 'automatic',
                    'subscription_updated' => true
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Payment successful! Your subscription has been automatically activated.',
                    'redirect_url' => route('subscription.payment.success.show', ['token' => $token]),
                    'reference_number' => $referenceNumber,
                    'verification_type' => 'automatic',
                    'subscription_activated' => true
                ]);
            } else {
                // AUTOMATIC VERIFICATION FAILED - FALLBACK TO MANUAL
                Log::warning('Automatic verification failed, falling back to manual verification', [
                    'request_id' => $subscriptionRequest->id,
                    'clinic_id' => $subscriptionRequest->clinic_id,
                    'payment_method' => $paymentMethod,
                    'reference_number' => $referenceNumber,
                    'amount_sent' => $amountSent,
                    'verification_type' => 'manual_fallback',
                    'error' => $automaticVerificationResult['error'] ?? 'Unknown error'
                ]);

                // Send notification email to admin about payment received (MANUAL FALLBACK)
                try {
                    $adminUsers = \App\Models\User::where('role', 'admin')->get();
                    foreach ($adminUsers as $admin) {
                        Mail::to($admin->email)->send(
                            new \App\Mail\SubscriptionPaymentReceived($subscriptionRequest)
                        );
                    }
                } catch (\Exception $emailError) {
                    Log::error('Failed to send payment received notification: ' . $emailError->getMessage());
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Payment submitted successfully! Our admin team will verify and activate your subscription within 24 hours.',
                    'redirect_url' => route('subscription.payment.success.show', ['token' => $token]),
                    'reference_number' => $referenceNumber,
                    'verification_type' => 'manual'
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Subscription payment processing failed: ' . $e->getMessage(), [
                'request_id' => $subscriptionRequest->id,
                'clinic_id' => $subscriptionRequest->clinic_id,
                'payment_method' => $paymentMethod ?? 'unknown',
                'error_trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Payment processing failed. Please try again.',
            ], 500);
        }
    }

    /**
     * Show payment success page
     */
    public function showPaymentSuccess($token)
    {
        $request = SubscriptionRequest::where('payment_token', $token)
            ->where('status', 'approved')
            ->with('clinic')
            ->firstOrFail();

        return Inertia::render('Public/SubscriptionPaymentSuccess', [
            'request' => $request,
        ]);
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
                Mail::to($clinic->email)->send(
                    new \App\Mail\SubscriptionRequestCompleted($subscriptionRequest)
                );
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
                // Don't fail the verification if email fails
            }

            Log::info('Subscription payment automatically verified and completed successfully', [
                'request_id' => $subscriptionRequest->id,
                'clinic_id' => $clinic->id,
                'request_type' => $subscriptionRequest->request_type,
                'payment_method' => $paymentMethod,
                'verification_type' => 'automatic'
            ]);

            return [
                'success' => true,
                'message' => 'Subscription automatically verified and activated'
            ];

        } catch (\Exception $e) {
            Log::error('Automatic verification failed with exception', [
                'request_id' => $subscriptionRequest->id,
                'clinic_id' => $subscriptionRequest->clinic_id,
                'payment_method' => $paymentMethod,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return [
                'success' => false,
                'error' => 'Automatic verification failed: ' . $e->getMessage()
            ];
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
                'processed_at' => now()->toISOString(),
                'status' => 'completed',
                'message' => 'Payment processed successfully'
            ];
        } else {
            $errorMessages = [
                'gcash' => 'GCash payment failed. Please check your account balance and try again.',
                'paymaya' => 'PayMaya payment failed. Please verify your account details.',
                'bank_transfer' => 'Bank transfer failed. Please check your account details.',
                'credit_card' => 'Card payment failed. Please check your card details.',
                'simulation' => 'Payment simulation failed for testing purposes.'
            ];

            return [
                'success' => false,
                'error' => $errorMessages[$paymentMethod] ?? 'Payment processing failed',
                'error_code' => 'PAYMENT_FAILED',
                'processed_at' => now()->toISOString(),
                'status' => 'failed'
            ];
        }
    }

    /**
     * Generate unique reference number for payment
     */
    private function generateReferenceNumber($subscriptionRequest, $paymentMethod)
    {
        $prefix = strtoupper(substr($paymentMethod, 0, 3));
        $date = now()->format('Ymd');
        $requestId = str_pad($subscriptionRequest->id, 4, '0', STR_PAD_LEFT);
        $random = strtoupper(substr(md5(uniqid()), 0, 6));

        return "{$prefix}-{$date}-{$requestId}-{$random}";
    }
}
