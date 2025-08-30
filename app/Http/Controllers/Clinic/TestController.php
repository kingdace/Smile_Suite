<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Traits\SubscriptionAccessControl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestController extends Controller
{
    use SubscriptionAccessControl;

    public function testSubscriptionAccess(Request $request)
    {
        // Check subscription access
        $this->checkSubscriptionAccess();

        $user = Auth::user();
        $clinic = $user->clinic;

        return response()->json([
            'success' => true,
            'message' => 'Subscription access check passed',
            'user_id' => $user->id,
            'clinic_id' => $clinic ? $clinic->id : null,
            'subscription_status' => $this->getSubscriptionStatus(),
            'has_active_subscription' => $this->hasActiveSubscription(),
            'is_suspended' => $this->isSuspended(),
        ]);
    }
}
