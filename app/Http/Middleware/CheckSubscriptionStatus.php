<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\SubscriptionService;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscriptionStatus
{
    protected $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only check for authenticated users with clinic access
        if (Auth::check() && Auth::user()->clinic_id) {
            $user = Auth::user();
            $clinic = $user->clinic;

            if ($clinic) {
                // Check subscription status (this is safe - just monitoring)
                $status = $this->subscriptionService->checkSubscriptionStatus($clinic);

                // Store subscription status in session for frontend use
                session(['subscription_status' => $status]);
                session(['subscription_end_date' => $clinic->subscription_end_date]);
                session(['trial_ends_at' => $clinic->trial_ends_at]);

                // Log subscription status for monitoring (no blocking)
                if ($status === 'grace_period' || $status === 'suspended') {
                    \Log::info("Subscription status check - Clinic: {$clinic->id}, Status: {$status}");
                }
            }
        }

        return $next($request);
    }
}
