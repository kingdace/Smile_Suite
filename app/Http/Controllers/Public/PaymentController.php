<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ClinicRegistrationRequest;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    /**
     * Show payment page for approved registration request
     */
    public function showPayment($token)
    {
        $request = ClinicRegistrationRequest::where('approval_token', $token)
            ->where('status', 'approved')
            ->where('payment_status', 'pending')
            ->where('expires_at', '>', now())
            ->firstOrFail();

        return Inertia::render('Public/Payment', [
            'request' => $request,
            'token' => $token,
            'paymentMethods' => $this->subscriptionService->getPaymentMethods(),
        ]);
    }

    /**
     * Create payment intent for simulation
     */
    public function createPaymentIntent(Request $request, $token)
    {
        $registrationRequest = ClinicRegistrationRequest::where('approval_token', $token)
            ->where('status', 'approved')
            ->where('payment_status', 'pending')
            ->where('expires_at', '>', now())
            ->firstOrFail();

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
            Log::error('Payment intent creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Payment setup failed'], 500);
        }
    }

    /**
     * Handle successful payment
     */
    public function handlePaymentSuccess(Request $request, $token)
    {
        $registrationRequest = ClinicRegistrationRequest::where('approval_token', $token)
            ->where('status', 'approved')
            ->where('payment_status', 'pending')
            ->where('expires_at', '>', now())
            ->firstOrFail();

        try {
            $paymentIntentId = $request->input('payment_intent_id');
            $paymentMethod = $request->input('payment_method', 'simulation');

            // Simulate payment processing
            $result = $this->subscriptionService->simulatePayment($paymentIntentId, $paymentMethod);

            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Payment successful! Check your email for setup instructions.',
                    'setup_url' => route('clinic.setup', ['token' => $token]),
                ]);
            }

            return response()->json(['error' => 'Payment verification failed'], 400);

        } catch (\Exception $e) {
            Log::error('Payment success handling failed: ' . $e->getMessage());
            return response()->json(['error' => 'Payment processing failed'], 500);
        }
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


}
