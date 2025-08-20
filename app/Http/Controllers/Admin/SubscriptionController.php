<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Artisan;

class SubscriptionController extends Controller
{
    protected $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    /**
     * Display subscription dashboard
     */
    public function index()
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        // Get subscription statistics
        $stats = [
            'total_clinics' => Clinic::count(),
            'active_subscriptions' => Clinic::where('subscription_status', 'active')->count(),
            'trial_clinics' => Clinic::where('subscription_status', 'trial')->count(),
            'grace_period' => Clinic::where('subscription_status', 'grace_period')->count(),
            'suspended' => Clinic::where('subscription_status', 'suspended')->count(),
            'expiring_soon' => Clinic::where('subscription_end_date', '<=', now()->addDays(7))
                ->where('subscription_end_date', '>', now())
                ->count(),
            'trials_expiring_soon' => Clinic::where('trial_ends_at', '<=', now()->addDays(3))
                ->where('trial_ends_at', '>', now())
                ->where('subscription_status', 'trial')
                ->count(),
        ];

        // Get clinics by subscription status with duration information
        $clinics = Clinic::with(['users'])
            ->orderBy('subscription_end_date', 'asc')
            ->get()
            ->map(function ($clinic) {
                $duration = $this->subscriptionService->getSubscriptionDuration($clinic);

                return [
                    'id' => $clinic->id,
                    'name' => $clinic->name,
                    'email' => $clinic->email,
                    'subscription_plan' => $clinic->subscription_plan,
                    'subscription_status' => $clinic->subscription_status,
                    'subscription_start_date' => $clinic->subscription_start_date,
                    'subscription_end_date' => $clinic->subscription_end_date,
                    'trial_ends_at' => $clinic->trial_ends_at,
                    'is_active' => $clinic->is_active,
                    'users_count' => $clinic->users->count(),
                    'days_until_expiry' => $clinic->subscription_end_date
                        ? now()->diffInDays($clinic->subscription_end_date, false)
                        : null,
                    'duration_info' => $duration,
                    'trial_days_left' => isset($duration['trial']) ? $duration['trial']['days_left'] : null,
                    'subscription_days_left' => isset($duration['subscription']) ? $duration['subscription']['days_left'] : null,
                    'is_in_grace_period' => isset($duration['subscription']) ? $duration['subscription']['is_in_grace_period'] : false,
                    'is_suspended' => isset($duration['subscription']) ? $duration['subscription']['is_suspended'] : false,
                ];
            });

        return Inertia::render('Admin/Subscriptions/Index', [
            'stats' => $stats,
            'clinics' => $clinics,
        ]);
    }

    /**
     * Check subscription status for a specific clinic
     */
    public function checkStatus(Clinic $clinic)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $oldStatus = $clinic->subscription_status;
        $newStatus = $this->subscriptionService->checkSubscriptionStatus($clinic);

        return response()->json([
            'clinic_id' => $clinic->id,
            'clinic_name' => $clinic->name,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'status_changed' => $oldStatus !== $newStatus,
            'subscription_end_date' => $clinic->subscription_end_date,
            'trial_ends_at' => $clinic->trial_ends_at,
        ]);
    }

    /**
     * Manually start trial for a clinic
     */
    public function startTrial(Clinic $clinic)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        try {
            $this->subscriptionService->startTrial($clinic);

            return response()->json([
                'success' => true,
                'message' => "Trial started for {$clinic->name}",
                'status' => $clinic->fresh()->subscription_status,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start trial: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Manually activate subscription for a clinic
     */
    public function activateSubscription(Request $request, Clinic $clinic)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'plan' => 'required|in:basic,premium,enterprise',
            'duration_months' => 'required|integer|min:1|max:12',
        ]);

        try {
            $this->subscriptionService->activateSubscription(
                $clinic,
                $request->plan,
                $request->duration_months
            );

            return response()->json([
                'success' => true,
                'message' => "Subscription activated for {$clinic->name}",
                'status' => $clinic->fresh()->subscription_status,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to activate subscription: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get subscription statistics
     */
    public function stats()
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $stats = [
            'total_clinics' => Clinic::count(),
            'active_subscriptions' => Clinic::where('subscription_status', 'active')->count(),
            'trial_clinics' => Clinic::where('subscription_status', 'trial')->count(),
            'grace_period' => Clinic::where('subscription_status', 'grace_period')->count(),
            'suspended' => Clinic::where('subscription_status', 'suspended')->count(),
            'expiring_soon' => Clinic::where('subscription_end_date', '<=', now()->addDays(7))
                ->where('subscription_end_date', '>', now())
                ->count(),
            'expired_today' => Clinic::whereDate('subscription_end_date', today())->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Get detailed duration information for a clinic
     */
    public function getDurationInfo(Clinic $clinic)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $duration = $this->subscriptionService->getSubscriptionDuration($clinic);

        return response()->json([
            'clinic_id' => $clinic->id,
            'clinic_name' => $clinic->name,
            'duration' => $duration,
            'subscription_status' => $clinic->subscription_status,
            'subscription_plan' => $clinic->subscription_plan,
        ]);
    }

    /**
     * Extend trial period for a clinic
     */
    public function extendTrial(Clinic $clinic, Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $additionalDays = $request->input('days', 7);

        try {
            $this->subscriptionService->extendTrial($clinic, $additionalDays);

            return response()->json([
                'success' => true,
                'message' => "Trial extended by {$additionalDays} days for {$clinic->name}",
                'new_trial_end' => $clinic->fresh()->trial_ends_at,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to extend trial: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Renew subscription for a clinic
     */
    public function renewSubscription(Clinic $clinic, Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $plan = $request->input('plan', $clinic->subscription_plan);
        $durationInMonths = $request->input('duration', 1);

        try {
            $this->subscriptionService->renewSubscription($clinic, $plan, $durationInMonths);

            return response()->json([
                'success' => true,
                'message' => "Subscription renewed for {$clinic->name}",
                'new_end_date' => $clinic->fresh()->subscription_end_date,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to renew subscription: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send manual notification to clinic
     */
    public function sendNotification(Clinic $clinic, Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $notificationType = $request->input('type', 'expiration');

        try {
            $this->subscriptionService->sendExpirationNotifications($clinic);

            return response()->json([
                'success' => true,
                'message' => "Notification sent to {$clinic->name}",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send notification: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Run the console command to check expirations
     */
    public function runConsoleCommand()
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        try {
            // Run the console command
            Artisan::call('subscriptions:check-expirations');
            $output = Artisan::output();

            return response()->json([
                'success' => true,
                'message' => 'Subscription expirations checked successfully',
                'output' => $output,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check expirations: ' . $e->getMessage(),
            ], 500);
        }
    }
}
