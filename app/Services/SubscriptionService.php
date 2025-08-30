<?php

namespace App\Services;

use App\Models\Clinic;
use App\Models\ClinicRegistrationRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;

class SubscriptionService
{
    /**
     * Calculate subscription duration in days for consistent 30-day billing cycles
     */
    private function calculateSubscriptionDays($durationInMonths = 1)
    {
        // Ensure minimum 1 month
        $durationInMonths = max(1, $durationInMonths);

        // Calculate 30-day billing cycles (30 days per month)
        return $durationInMonths * 30;
    }
    /**
     * Create a payment intent for subscription setup
     */
    public function createPaymentIntent(ClinicRegistrationRequest $request)
    {
        try {
            // Generate a unique payment reference based on method
            $date = now()->format('Ymd');
            $requestId = str_pad($request->id, 4, '0', STR_PAD_LEFT);
            $paymentReference = 'PAY-' . $date . '-' . $requestId;

            // Store payment intent in session or cache for simulation
            $paymentIntent = [
                'id' => $paymentReference,
                'amount' => $request->subscription_amount,
                'currency' => 'PHP',
                'status' => 'requires_payment_method',
                'metadata' => [
                    'clinic_registration_id' => $request->id,
                    'subscription_plan' => $request->subscription_plan,
                    'clinic_name' => $request->clinic_name,
                    'contact_person' => $request->contact_person,
                    'email' => $request->email,
                ],
                'payment_methods' => [
                    'gcash' => [
                        'name' => 'GCash',
                        'icon' => '📱',
                        'description' => 'Pay using your GCash wallet',
                        'simulation_number' => '0917-123-4567',
                        'reference_number' => 'GCASH-' . $date . '-' . $requestId,
                    ],
                    'paymaya' => [
                        'name' => 'PayMaya',
                        'icon' => '📱',
                        'description' => 'Pay using your PayMaya wallet',
                        'simulation_number' => '0918-987-6543',
                        'reference_number' => 'PAYMAYA-' . $date . '-' . $requestId,
                    ],
                    'bank_transfer' => [
                        'name' => 'Bank Transfer',
                        'icon' => '🏦',
                        'description' => 'Direct bank transfer',
                        'simulation_account' => 'BDO: 1234-5678-9012',
                        'reference_number' => 'BANK-' . $date . '-' . $requestId,
                    ],
                    'credit_card' => [
                        'name' => 'Credit/Debit Card',
                        'icon' => '💳',
                        'description' => 'Visa, Mastercard, and other cards',
                        'simulation_card' => '4242 4242 4242 4242',
                        'reference_number' => 'CARD-' . $date . '-' . $requestId,
                    ],
                ],
            ];

            // Store in cache for 30 minutes
            Cache::put("payment_intent_{$paymentReference}", $paymentIntent, 1800);

            return (object) $paymentIntent;
        } catch (\Exception $e) {
            Log::error('Payment intent creation failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Create a customer for the clinic
     */
    public function createCustomer(ClinicRegistrationRequest $request)
    {
        try {
            $customer = [
                'id' => 'CUST-' . now()->format('Ymd') . '-' . str_pad($request->id, 4, '0', STR_PAD_LEFT),
                'email' => $request->email,
                'name' => $request->contact_person,
                'phone' => $request->phone,
                'metadata' => [
                    'clinic_registration_id' => $request->id,
                    'license_number' => $request->license_number,
                ],
            ];

            return (object) $customer;
        } catch (\Exception $e) {
            Log::error('Customer creation failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle successful payment simulation
     */
    public function handleSuccessfulPayment($paymentIntentId, $paymentMethod = 'simulation')
    {
        try {
            // Retrieve payment intent from cache
            $paymentIntent = Cache::get("payment_intent_{$paymentIntentId}");

            if (!$paymentIntent) {
                Log::error('Payment intent not found: ' . $paymentIntentId);
                return null;
            }

            $registrationId = $paymentIntent['metadata']['clinic_registration_id'] ?? null;
            $request = ClinicRegistrationRequest::find($registrationId);

            if ($request) {
                // Update payment status to pending verification
                $request->update([
                    'payment_status' => 'pending_verification',
                    'stripe_payment_intent_id' => $paymentIntentId,
                ]);

                // Log the payment confirmation
                Log::info("Payment confirmation received", [
                    'payment_intent_id' => $paymentIntentId,
                    'payment_method' => $paymentMethod,
                    'amount' => $paymentIntent['amount'],
                    'clinic_registration_id' => $registrationId,
                    'status' => 'pending_verification',
                ]);

                // Clear the payment intent from cache
                Cache::forget("payment_intent_{$paymentIntentId}");

                return $request;
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Payment handling failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Admin verifies payment and marks as paid
     */
    public function verifyPayment($registrationId)
    {
        try {
            $request = ClinicRegistrationRequest::find($registrationId);

            if (!$request) {
                Log::error('Registration request not found: ' . $registrationId);
                return null;
            }

            // Update payment status to paid
            $request->update([
                'payment_status' => 'paid',
            ]);

            // Send setup email
            $this->sendSetupEmail($request);

            // Log the payment verification
            Log::info("Payment verified by admin", [
                'registration_id' => $registrationId,
                'clinic_name' => $request->clinic_name,
                'email' => $request->email,
                'amount' => $request->subscription_amount,
            ]);

            return $request;
        } catch (\Exception $e) {
            Log::error('Payment verification failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Start trial period for a clinic
     */
    public function startTrial(Clinic $clinic)
    {
        try {
            $clinic->update([
                'subscription_status' => 'trial',
                'subscription_start_date' => now(),
                'subscription_end_date' => now()->addDays(14), // 14-day trial
                'trial_ends_at' => now()->addDays(14),
                'is_active' => true,
            ]);

            Log::info("Trial started for clinic: {$clinic->id}");
            return true;
        } catch (\Exception $e) {
            Log::error('Trial start failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Activate paid subscription with 30-day billing cycles
     */
    public function activateSubscription(Clinic $clinic, $plan, $durationInMonths = 1)
    {
        try {
            // Calculate 30-day billing cycles using helper method
            $totalDays = $this->calculateSubscriptionDays($durationInMonths);

            $clinic->update([
                'subscription_status' => 'active',
                'subscription_plan' => $plan,
                'subscription_start_date' => now(),
                'subscription_end_date' => now()->addDays($totalDays),
                'last_payment_at' => now(),
                'next_payment_at' => now()->addDays($totalDays),
                'is_active' => true,
            ]);

            Log::info("Subscription activated for clinic: {$clinic->id}, plan: {$plan}, duration: {$totalDays} days");
            return true;
        } catch (\Exception $e) {
            Log::error('Subscription activation failed: ' . $e->getMessage());
            throw $e;
        }
    }

        /**
     * Check and handle subscription expiration
     */
    public function checkSubscriptionStatus(Clinic $clinic)
    {
        try {
            // For testing purposes, if the subscription was manually set with a very short duration
            // and it's still within a reasonable time window, respect the manual override
            if ($clinic->subscription_status === 'active' || $clinic->subscription_status === 'grace_period') {
                // If the end date is in the future, keep the current status
                if ($clinic->subscription_end_date && $clinic->subscription_end_date->isFuture()) {
                    return $clinic->subscription_status;
                }

                                // If the end date is in the past but very recent (within 1 hour),
                // allow some buffer for testing
                if ($clinic->subscription_end_date && $clinic->subscription_end_date->isPast()) {
                    $timeSinceExpiry = $clinic->subscription_end_date->diffInMinutes(now());

                    // If expired less than 1 hour ago, keep current status for testing
                    if ($timeSinceExpiry <= 60) {
                        Log::info("Clinic subscription recently expired but keeping status for testing: {$clinic->id}, expired {$timeSinceExpiry} minutes ago");
                        return $clinic->subscription_status;
                    }

                    // If expired more than 1 hour ago, log it for debugging
                    Log::info("Clinic subscription expired {$timeSinceExpiry} minutes ago, should move to grace period: {$clinic->id}");
                }
            }

            // Check trial expiration first
            if ($clinic->subscription_status === 'trial' && $clinic->trial_ends_at && $clinic->trial_ends_at->isPast()) {
                // Trial expired - move to grace period
                $clinic->update([
                    'subscription_status' => 'grace_period',
                    'subscription_end_date' => $clinic->trial_ends_at->addDays(7), // 7-day grace period
                ]);

                Log::info("Trial expired for clinic: {$clinic->id}, moved to grace period");
                return 'grace_period';
            }

            // Check if subscription is expired
            if ($clinic->subscription_end_date && $clinic->subscription_end_date->isPast()) {
                // Check if within grace period (7 days)
                $gracePeriodEnd = $clinic->subscription_end_date->addDays(7);

                if (now()->isPast($gracePeriodEnd)) {
                    // Past grace period - suspend clinic
                    $clinic->update([
                        'subscription_status' => 'suspended',
                        'is_active' => false,
                    ]);

                    Log::info("Clinic suspended due to expired subscription: {$clinic->id}");
                    return 'suspended';
                } else {
                    // Within grace period
                    if ($clinic->subscription_status !== 'grace_period') {
                        $clinic->update([
                            'subscription_status' => 'grace_period',
                        ]);
                        Log::info("Clinic moved to grace period: {$clinic->id}");
                    }
                    return 'grace_period';
                }
            }

            return $clinic->subscription_status;
        } catch (\Exception $e) {
            Log::error('Subscription status check failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get subscription duration information
     */
    public function getSubscriptionDuration(Clinic $clinic)
    {
        try {
            $now = now();
            $duration = [];

            // Trial information
            if ($clinic->subscription_status === 'trial' && $clinic->trial_ends_at) {
                $trialDaysLeft = $now->diffInDays($clinic->trial_ends_at, false);
                $duration['trial'] = [
                    'days_left' => $trialDaysLeft > 0 ? $trialDaysLeft : 0,
                    'expires_at' => $clinic->trial_ends_at,
                    'is_expired' => $trialDaysLeft <= 0,
                ];
            }

            // Subscription information
            if ($clinic->subscription_end_date) {
                $daysLeft = $now->diffInDays($clinic->subscription_end_date, false);
                $duration['subscription'] = [
                    'days_left' => $daysLeft > 0 ? $daysLeft : 0,
                    'expires_at' => $clinic->subscription_end_date,
                    'is_expired' => $daysLeft <= 0,
                    'is_in_grace_period' => $daysLeft <= 0 && $daysLeft > -7,
                    'is_suspended' => $daysLeft <= -7,
                ];
            }

            // Next payment information
            if ($clinic->next_payment_at) {
                $nextPaymentDays = $now->diffInDays($clinic->next_payment_at, false);
                $duration['next_payment'] = [
                    'days_until' => $nextPaymentDays > 0 ? $nextPaymentDays : 0,
                    'due_at' => $clinic->next_payment_at,
                    'is_overdue' => $nextPaymentDays < 0,
                ];
            }

            return $duration;
        } catch (\Exception $e) {
            Log::error('Duration calculation failed: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Send subscription expiration notifications
     */
    public function sendExpirationNotifications(Clinic $clinic)
    {
        try {
            $duration = $this->getSubscriptionDuration($clinic);

            // Trial expiration notification (3 days before)
            if (isset($duration['trial']) && $duration['trial']['days_left'] <= 3 && $duration['trial']['days_left'] > 0) {
                $this->sendTrialExpirationNotification($clinic, $duration['trial']['days_left']);
            }

            // Subscription expiration notification (7 days before)
            if (isset($duration['subscription']) && $duration['subscription']['days_left'] <= 7 && $duration['subscription']['days_left'] > 0) {
                $this->sendSubscriptionExpirationNotification($clinic, $duration['subscription']['days_left']);
            }

            // Grace period notification (when entering grace period)
            if (isset($duration['subscription']) && $duration['subscription']['is_in_grace_period'] && !$duration['subscription']['is_suspended']) {
                $this->sendGracePeriodNotification($clinic);
            }

            // Suspension notification (when suspended)
            if (isset($duration['subscription']) && $duration['subscription']['is_suspended']) {
                $this->sendSuspensionNotification($clinic);
            }

            Log::info("Expiration notifications processed for clinic: {$clinic->id}");
            return true;
        } catch (\Exception $e) {
            Log::error('Expiration notification failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send trial expiration notification
     */
    private function sendTrialExpirationNotification(Clinic $clinic, $daysLeft)
    {
        try {
            // Send actual email notification
            Mail::to($clinic->email)->send(new \App\Mail\TrialExpirationNotification($clinic, $daysLeft));
            Log::info("Trial expiration notification sent to clinic {$clinic->id}: {$daysLeft} days left");
        } catch (\Exception $e) {
            Log::error('Trial expiration notification failed: ' . $e->getMessage());
        }
    }

    /**
     * Send subscription expiration notification
     */
    private function sendSubscriptionExpirationNotification(Clinic $clinic, $daysLeft)
    {
        try {
            // Send actual email notification
            Mail::to($clinic->email)->send(new \App\Mail\SubscriptionExpirationNotification($clinic, $daysLeft));
            Log::info("Subscription expiration notification sent to clinic {$clinic->id}: {$daysLeft} days left");
        } catch (\Exception $e) {
            Log::error('Subscription expiration notification failed: ' . $e->getMessage());
        }
    }

    /**
     * Send grace period notification
     */
    private function sendGracePeriodNotification(Clinic $clinic)
    {
        try {
            // Send actual email notification
            Mail::to($clinic->email)->send(new \App\Mail\GracePeriodNotification($clinic));
            Log::info("Grace period notification sent to clinic {$clinic->id}");
        } catch (\Exception $e) {
            Log::error('Grace period notification failed: ' . $e->getMessage());
        }
    }

    /**
     * Send suspension notification
     */
    private function sendSuspensionNotification(Clinic $clinic)
    {
        try {
            // Send actual email notification
            Mail::to($clinic->email)->send(new \App\Mail\SuspensionNotification($clinic));
            Log::info("Suspension notification sent to clinic {$clinic->id}");
        } catch (\Exception $e) {
            Log::error('Suspension notification failed: ' . $e->getMessage());
        }
    }

    /**
     * Upgrade subscription to a new plan (starts fresh from today)
     */
    public function upgradeSubscription(Clinic $clinic, $newPlan, $durationInMonths = 1)
    {
        try {
            // Calculate 30-day billing cycles using helper method
            $totalDays = $this->calculateSubscriptionDays($durationInMonths);

            $clinic->update([
                'subscription_status' => 'active',
                'subscription_plan' => $newPlan,
                'subscription_start_date' => now(),
                'subscription_end_date' => now()->addDays($totalDays),
                'last_payment_at' => now(),
                'next_payment_at' => now()->addDays($totalDays),
                'is_active' => true,
            ]);

            Log::info("Subscription upgraded for clinic: {$clinic->id}, new plan: {$newPlan}, duration: {$totalDays} days");
            
            // Verify the upgrade was successful
            $clinic->refresh();
            if ($clinic->subscription_plan !== $newPlan) {
                Log::error("Subscription upgrade verification failed: expected plan {$newPlan}, got {$clinic->subscription_plan}");
                throw new \Exception("Subscription upgrade verification failed: plan mismatch");
            }
            
            return true;
        } catch (\Exception $e) {
            Log::error('Subscription upgrade failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Renew subscription by adding duration to existing end date
     */
    public function renewSubscription(Clinic $clinic, $plan = null, $durationInMonths = 1)
    {
        try {
            $plan = $plan ?: $clinic->subscription_plan;

            // Calculate 30-day billing cycles using helper method
            $totalDays = $this->calculateSubscriptionDays($durationInMonths);

            // Get current end date or start from today if expired
            $currentEndDate = $clinic->subscription_end_date;
            $newEndDate = null;

            if ($currentEndDate && $currentEndDate->isFuture()) {
                // Add to existing duration (extend from current end date)
                $newEndDate = $currentEndDate->addDays($totalDays);
            } else {
                // Start fresh from today if expired or no end date
                $newEndDate = now()->addDays($totalDays);
            }

            $clinic->update([
                'subscription_status' => 'active',
                'subscription_plan' => $plan,
                'subscription_start_date' => $clinic->subscription_start_date, // Keep original start date
                'subscription_end_date' => $newEndDate,
                'last_payment_at' => now(),
                'next_payment_at' => $newEndDate,
                'is_active' => true,
            ]);

            Log::info("Subscription renewed for clinic: {$clinic->id}, plan: {$plan}, duration: {$totalDays} days, new end date: {$newEndDate->format('Y-m-d')}");
            
            // Verify the renewal was successful
            $clinic->refresh();
            if ($clinic->subscription_end_date->format('Y-m-d') !== $newEndDate->format('Y-m-d')) {
                Log::error("Subscription renewal verification failed: expected end date {$newEndDate->format('Y-m-d')}, got {$clinic->subscription_end_date->format('Y-m-d')}");
                throw new \Exception("Subscription renewal verification failed: end date mismatch");
            }
            
            return true;
        } catch (\Exception $e) {
            Log::error('Subscription renewal failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Extend trial period
     */
    public function extendTrial(Clinic $clinic, $additionalDays = 7)
    {
        try {
            $newTrialEnd = $clinic->trial_ends_at ? $clinic->trial_ends_at->addDays($additionalDays) : now()->addDays($additionalDays);

            $clinic->update([
                'trial_ends_at' => $newTrialEnd,
                'subscription_end_date' => $newTrialEnd->addDays(7), // Extend grace period too
            ]);

            Log::info("Trial extended for clinic: {$clinic->id} by {$additionalDays} days");
            return true;
        } catch (\Exception $e) {
            Log::error('Trial extension failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get subscription pricing
     */
    public function getSubscriptionPricing()
    {
        return [
            'basic' => [
                'price' => 999.00,
                'currency' => 'PHP',
                'period' => 'month',
                'hasTrial' => true,
                'trialDays' => 14,
                'features' => [
                    'Up to 2 dentist accounts',
                    'Basic patient management',
                    'Appointment scheduling',
                    'Basic reporting',
                    'Email support',
                    '14-day free trial',
                ],
            ],
            'premium' => [
                'price' => 1999.00,
                'currency' => 'PHP',
                'period' => 'month',
                'hasTrial' => false,
                'trialDays' => 0,
                'features' => [
                    'Up to 5 dentist accounts',
                    'Advanced patient management',
                    'Treatment planning',
                    'Inventory management',
                    'Financial reporting',
                    'Priority support',
                ],
            ],
            'enterprise' => [
                'price' => 2999.00,
                'currency' => 'PHP',
                'period' => 'month',
                'hasTrial' => false,
                'trialDays' => 0,
                'features' => [
                    'Unlimited dentist accounts',
                    'Multi-branch management',
                    'Advanced analytics',
                    'Custom reporting',
                    'API access',
                    '24/7 priority support',
                    'Training sessions',
                ],
            ],
        ];
    }

    /**
     * Send setup email after successful payment
     */
    private function sendSetupEmail(ClinicRegistrationRequest $request)
    {
        try {
            Mail::to($request->email)->send(new \App\Mail\PaymentConfirmed($request));
            Log::info('Setup email sent to: ' . $request->email);
        } catch (\Exception $e) {
            Log::error('Failed to send setup email: ' . $e->getMessage());
        }
    }

    /**
     * Get payment methods for Philippine market
     */
    public function getPaymentMethods()
    {
        return [
            [
                'id' => 'gcash',
                'name' => 'GCash',
                'icon' => '📱',
                'description' => 'Pay using your GCash wallet',
                'instructions' => 'Scan the QR code below with your GCash app to complete payment',
                'qr_code' => '/icons/gcashqr.png',
                'reference_format' => 'GCASH-{DATE}-{ID}',
                'color' => 'bg-green-500',
                'has_qr' => true,
            ],
            [
                'id' => 'paymaya',
                'name' => 'PayMaya',
                'icon' => '📱',
                'description' => 'Pay using your PayMaya wallet',
                'instructions' => 'Scan the QR code below with your PayMaya app to complete payment',
                'qr_code' => '/icons/paymayaqr.png',
                'reference_format' => 'PAYMAYA-{DATE}-{ID}',
                'color' => 'bg-blue-500',
                'has_qr' => true,
            ],
            [
                'id' => 'bank_transfer',
                'name' => 'Bank Transfer',
                'icon' => '🏦',
                'description' => 'Direct bank transfer',
                'instructions' => 'Transfer to BDO Account: 1234-5678-9012',
                'reference_format' => 'BANK-{DATE}-{ID}',
                'color' => 'bg-purple-500',
                'has_qr' => false,
            ],
        ];
    }

    /**
     * Simulate payment processing
     */
    public function simulatePayment($paymentIntentId, $paymentMethod)
    {
        try {
            // Simulate payment processing delay
            sleep(2);

            // Simulate success (you can add random failures for testing)
            $success = true; // You can make this random for testing

            if ($success) {
                return $this->handleSuccessfulPayment($paymentIntentId, $paymentMethod);
            } else {
                throw new \Exception('Payment simulation failed');
            }
        } catch (\Exception $e) {
            Log::error('Payment simulation failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get payment status
     */
    public function getPaymentStatus($paymentIntentId)
    {
        $paymentIntent = Cache::get("payment_intent_{$paymentIntentId}");
        return $paymentIntent ? $paymentIntent['status'] : 'not_found';
    }

    /**
     * Cancel payment intent
     */
    public function cancelPaymentIntent($paymentIntentId)
    {
        Cache::forget("payment_intent_{$paymentIntentId}");
        return true;
    }
}
