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
            'is_active' => 'boolean',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'user_type' => User::getUserTypeFromRole($validated['role']),
            'clinic_id' => $clinic->id,
            'is_active' => $validated['is_active'] ?? true,
        ];

        // Set default working hours for dentists
        if ($validated['role'] === 'dentist') {
            $userData['working_hours'] = $this->getDefaultWorkingHours();
        }

        User::create($userData);
        return redirect()->route('clinic.users.index')->with('success', 'User created successfully.');
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
            'is_active' => 'boolean',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'user_type' => User::getUserTypeFromRole($validated['role']),
            'is_active' => $validated['is_active'] ?? $user->is_active,
        ];

        $user->update($userData);
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
            ->where('is_active', true)
            ->get(['id', 'name', 'email', 'role', 'specialties', 'license_number']);
        return response()->json(['dentists' => $dentists]);
    }



    /**
     * Get available time slots for a dentist
     */
    public function getAvailableSlots(Request $request, User $user)
    {
        $authUser = Auth::user();
        if (!in_array($authUser->role, ['clinic_admin', 'dentist', 'staff'])) {
            abort(403);
        }

        $validated = $request->validate([
            'date' => 'required|date|after:today',
        ]);

        $slots = $user->getAvailableTimeSlots($validated['date']);

        return response()->json([
            'slots' => $slots,
            'date' => $validated['date'],
            'dentist' => $user->name,
        ]);
    }

    /**
     * Toggle user active status
     */
    public function toggleStatus(User $user)
    {
        $authUser = Auth::user();
        if ($authUser->role !== 'clinic_admin') {
            abort(403);
        }
        $clinic = $authUser->clinic;
        if ($user->clinic_id !== $clinic->id) {
            abort(403);
        }

        $user->update(['is_active' => !$user->is_active]);

        return redirect()->back()->with('success',
            $user->is_active ? 'User activated successfully.' : 'User deactivated successfully.'
        );
    }

    /**
     * Get default working hours for new dentists
     */
    private function getDefaultWorkingHours(): array
    {
        return [
            'monday' => ['start' => '09:00', 'end' => '17:00'],
            'tuesday' => ['start' => '09:00', 'end' => '17:00'],
            'wednesday' => ['start' => '09:00', 'end' => '17:00'],
            'thursday' => ['start' => '09:00', 'end' => '17:00'],
            'friday' => ['start' => '09:00', 'end' => '17:00'],
            'saturday' => ['start' => '09:00', 'end' => '15:00'],
            'sunday' => null, // No work on Sunday
        ];
    }

    /**
     * Show user's own profile (for dentists/staff)
     */
    public function profile()
    {
        $user = Auth::user();
        if (!in_array($user->role, ['dentist', 'staff'])) {
            abort(403);
        }

        return inertia('Clinic/Profile/Show', [
            'user' => $user->load('clinic'),
        ]);
    }

    /**
     * Show edit profile form (for dentists/staff)
     */
    public function editProfile()
    {
        $user = Auth::user();
        if (!in_array($user->role, ['dentist', 'staff'])) {
            abort(403);
        }

        return inertia('Clinic/Profile/Edit', [
            'user' => $user->load('clinic'),
        ]);
    }

    /**
     * Update user's own profile (for dentists/staff)
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['dentist', 'staff'])) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone_number' => 'nullable|string|max:20',
            // Dentist-specific fields
            'license_number' => 'nullable|string|max:255',
            'specialties' => 'nullable|array',
            'qualifications' => 'nullable|array',
            'years_experience' => 'nullable|integer|min:0|max:50',
            'bio' => 'nullable|string|max:1000',
            'emergency_contact' => 'nullable|string|max:255',
            'emergency_phone' => 'nullable|string|max:20',
            'working_hours' => 'nullable|array',
            'unavailable_dates' => 'nullable|array',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'] ?? $user->phone_number,
        ];

        // Add dentist-specific fields if user is a dentist
        if ($user->role === 'dentist') {
            $userData = array_merge($userData, [
                'license_number' => $validated['license_number'] ?? $user->license_number,
                'specialties' => $validated['specialties'] ?? $user->specialties,
                'qualifications' => $validated['qualifications'] ?? $user->qualifications,
                'years_experience' => $validated['years_experience'] ?? $user->years_experience,
                'bio' => $validated['bio'] ?? $user->bio,
                'emergency_contact' => $validated['emergency_contact'] ?? $user->emergency_contact,
                'emergency_phone' => $validated['emergency_phone'] ?? $user->emergency_phone,
                'working_hours' => $validated['working_hours'] ?? $user->working_hours,
                'unavailable_dates' => $validated['unavailable_dates'] ?? $user->unavailable_dates,
            ]);
        }

        $user->update($userData);
        return redirect()->route('clinic.profile')->with('success', 'Profile updated successfully.');
    }
}
