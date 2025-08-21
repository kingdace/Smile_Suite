<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;

class ClinicUserController extends Controller
{
    // Hardcoded user limits by plan
    protected $planLimits = [
        'basic' => 5,
        'premium' => 10,
        'enterprise' => 25,
    ];

    public function index()
    {
        $user = Auth::user();
        if ($user->role !== 'clinic_admin') {
            abort(403);
        }
        $clinic = $user->clinic;
        $users = User::where('clinic_id', $clinic->id)->get();
        $plan = $clinic->subscription_plan ?? 'basic';
        $limit = $this->planLimits[$plan] ?? 5;
        return inertia('Clinic/Users/Index', [
            'users' => $users,
            'limit' => $limit,
            'count' => $users->count(),
            'plan' => $plan,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        if ($user->role !== 'clinic_admin') {
            abort(403);
        }
        $clinic = $user->clinic;
        $plan = $clinic->subscription_plan ?? 'basic';
        $limit = $this->planLimits[$plan] ?? 5;
        $count = User::where('clinic_id', $clinic->id)->count();
        if ($count >= $limit) {
            return redirect()->route('clinic.users.index')->withErrors(['limit' => 'User limit reached for your subscription plan.']);
        }
        return inertia('Clinic/Users/Create');
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'clinic_admin') {
            abort(403);
        }
        $clinic = $user->clinic;
        $plan = $clinic->subscription_plan ?? 'basic';
        $limit = $this->planLimits[$plan] ?? 5;
        $count = User::where('clinic_id', $clinic->id)->count();
        if ($count >= $limit) {
            return redirect()->route('clinic.users.index')->withErrors(['limit' => 'User limit reached for your subscription plan.']);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:dentist,staff',
        ]);
        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'user_type' => User::getUserTypeFromRole($validated['role']),
            'clinic_id' => $clinic->id,
        ]);
        return redirect()->route('clinic.users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $authUser = Auth::user();
        if ($authUser->role !== 'clinic_admin') {
            abort(403);
        }
        $clinic = $authUser->clinic;
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }
        return inertia('Clinic/Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $authUser = Auth::user();
        if ($authUser->role !== 'clinic_admin') {
            abort(403);
        }
        $clinic = $authUser->clinic;
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:dentist,staff,clinic_admin',
        ]);

        // Update user with correct user_type
        $user->update(array_merge($validated, [
            'user_type' => User::getUserTypeFromRole($validated['role'])
        ]));
        return redirect()->route('clinic.users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $authUser = Auth::user();
        if ($authUser->role !== 'clinic_admin') {
            abort(403);
        }
        $clinic = $authUser->clinic;
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }
        if ($user->id === Auth::id()) {
            return redirect()->route('clinic.users.index')->withErrors(['delete' => 'You cannot delete your own account.']);
        }
        $user->delete();
        return redirect()->route('clinic.users.index')->with('success', 'User deleted successfully.');
    }

    public function dentists(\App\Models\Clinic $clinic)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['clinic_admin', 'dentist', 'staff']) || $user->clinic_id !== $clinic->id) {
            abort(403);
        }
        $dentists = \App\Models\User::where('clinic_id', $clinic->id)
            ->where('role', 'dentist')
            ->get(['id', 'name', 'email', 'role']);
        return response()->json(['dentists' => $dentists]);
    }
}
