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
     * Handle successful payment
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

            // Send notification email to admin about payment received
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

            Log::info('Subscription payment received successfully', [
                'request_id' => $subscriptionRequest->id,
                'clinic_id' => $subscriptionRequest->clinic_id,
                'payment_method' => $paymentMethod,
                'reference_number' => $referenceNumber,
                'amount_sent' => $amountSent,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment submitted successfully! Our admin team will verify and activate your subscription within 24 hours.',
                'redirect_url' => route('subscription.payment.success.show', ['token' => $token]),
                'reference_number' => $referenceNumber,
            ]);

        } catch (\Exception $e) {
            Log::error('Subscription payment processing failed: ' . $e->getMessage());
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
