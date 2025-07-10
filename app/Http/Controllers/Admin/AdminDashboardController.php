<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\User;
use App\Models\Patient;
use App\Models\ClinicRegistrationRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        $stats = [
            'total_users' => User::count(),
            'active_clinics' => Clinic::where('is_active', true)->count(),
            'total_patients' => Patient::count(),
            'pending_clinic_requests' => ClinicRegistrationRequest::where('status', 'pending')->count(),
            'recent_clinics' => Clinic::with('users')
                ->latest()
                ->take(5)
                ->get(),
            'recent_users' => User::with('clinic')
                ->latest()
                ->take(5)
                ->get(),
        ];

        return Inertia::render('Admin/AdminDashboard', [
            'auth' => [
                'user' => Auth::user()
            ],
            'stats' => $stats,
        ]);
    }
}
