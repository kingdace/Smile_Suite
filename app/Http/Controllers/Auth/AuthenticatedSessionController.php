<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    protected $activityLogService;

    public function __construct(ActivityLogService $activityLogService)
    {
        $this->activityLogService = $activityLogService;
    }
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        // Log successful login
        try {
            $this->activityLogService->logLogin($user);
        } catch (\Exception $e) {
            // Log error but don't break login flow
            \Illuminate\Support\Facades\Log::error('Failed to log user login', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }

        // Check if clinic staff user is inactive
        if ($user->user_type === 'clinic_staff' && !$user->is_active) {
            // Log out the user
            Auth::logout();

            // Invalidate session
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // Redirect to login with error message
            return redirect()->route('login')->with('error', 'Your account has been deactivated. Please contact your clinic administrator.');
        }

        // Handle different user types - redirect directly to avoid conflicts
        if ($user->user_type === 'system_admin' || $user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        } elseif ($user->user_type === 'patient') {
            return redirect()->route('patient.dashboard');
        } else {
            // clinic_staff users - redirect directly to clinic dashboard
            return redirect()->route('clinic.dashboard', ['clinic' => $user->clinic_id]);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();

        // Log logout before destroying session
        if ($user) {
            try {
                $this->activityLogService->logLogout($user);
            } catch (\Exception $e) {
                // Log error but don't break logout flow
                \Illuminate\Support\Facades\Log::error('Failed to log user logout', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
