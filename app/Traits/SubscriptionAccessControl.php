<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Services\SubscriptionService;

trait SubscriptionAccessControl
{
    protected $subscriptionService;

    /**
     * Check subscription access and handle restrictions
     */
    protected function checkSubscriptionAccess()
    {
        // Only check for authenticated users with clinic access
        if (Auth::check() && Auth::user()->clinic_id) {
            $user = Auth::user();
            $clinic = $user->clinic;

            if ($clinic) {
                // Initialize subscription service if not already done
                if (!$this->subscriptionService) {
                    $this->subscriptionService = app(SubscriptionService::class);
                }

                // Check subscription status
                $status = $this->subscriptionService->checkSubscriptionStatus($clinic);

                // Store subscription status in session for frontend use
                session(['subscription_status' => $status]);
                session(['subscription_end_date' => $clinic->subscription_end_date]);
                session(['trial_ends_at' => $clinic->trial_ends_at]);

                // Handle different subscription statuses
                switch ($status) {
                    case 'suspended':
                        // Block access for suspended clinics (except admin)
                        if ($user->role !== 'admin') {
                            Auth::logout();
                            request()->session()->invalidate();
                            request()->session()->regenerateToken();

                            abort(redirect()->route('login')->with('error',
                                'Your clinic subscription has been suspended due to non-payment. ' .
                                'Please contact support to reactivate your account.'
                            ));
                        }
                        break;

                    case 'grace_period':
                        // Allow access but show warnings (handled by frontend)
                        // Log for monitoring
                        Log::info("Clinic in grace period accessing system", [
                            'clinic_id' => $clinic->id,
                            'clinic_name' => $clinic->name,
                            'user_id' => $user->id,
                            'route' => request()->route()->getName()
                        ]);
                        break;

                    case 'trial':
                        // Allow full access during trial
                        // Log for monitoring
                        if ($clinic->trial_ends_at && $clinic->trial_ends_at->diffInDays(now()) <= 3) {
                            Log::info("Trial expiring soon", [
                                'clinic_id' => $clinic->id,
                                'days_left' => $clinic->trial_ends_at->diffInDays(now())
                            ]);
                        }
                        break;

                    case 'active':
                        // Allow full access for active subscriptions
                        break;

                    default:
                        // Unknown status - allow access but log
                        Log::warning("Unknown subscription status", [
                            'clinic_id' => $clinic->id,
                            'status' => $status
                        ]);
                        break;
                }
            }
        }
    }

    /**
     * Get subscription status for the current user's clinic
     */
    protected function getSubscriptionStatus()
    {
        if (Auth::check() && Auth::user()->clinic_id) {
            $clinic = Auth::user()->clinic;
            if ($clinic && !$this->subscriptionService) {
                $this->subscriptionService = app(SubscriptionService::class);
            }
            return $clinic ? $this->subscriptionService->checkSubscriptionStatus($clinic) : null;
        }
        return null;
    }

    /**
     * Check if user has active subscription
     */
    protected function hasActiveSubscription()
    {
        $status = $this->getSubscriptionStatus();
        return in_array($status, ['active', 'trial', 'grace_period']);
    }

    /**
     * Check if user is suspended
     */
    protected function isSuspended()
    {
        return $this->getSubscriptionStatus() === 'suspended';
    }
}
