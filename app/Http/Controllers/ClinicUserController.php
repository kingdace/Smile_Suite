<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

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

        // Return updated users data for AJAX requests
        if (request()->expectsJson()) {
            $users = User::where('clinic_id', $clinic->id)->get();
            return inertia('Clinic/Users/Index', [
                'users' => $users,
                'limit' => $limit,
                'count' => $users->count(),
                'plan' => $plan,
                'success' => 'User created successfully.',
            ]);
        }

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
            'password' => 'nullable|string|min:8|confirmed',
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

        // Only update password if provided
        if (!empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user->update($userData);

        // Return updated users data for AJAX requests
        if (request()->expectsJson()) {
            $users = User::where('clinic_id', $clinic->id)->get();
            $plan = $clinic->subscription_plan ?? 'basic';
            $limit = $this->planLimits[$plan] ?? 5;
            return inertia('Clinic/Users/Index', [
                'users' => $users,
                'limit' => $limit,
                'count' => $users->count(),
                'plan' => $plan,
                'success' => 'User updated successfully.',
            ]);
        }

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

        // Return updated users data for AJAX requests
        if (request()->expectsJson()) {
            $users = User::where('clinic_id', $clinic->id)->get();
            $plan = $clinic->subscription_plan ?? 'basic';
            $limit = $this->planLimits[$plan] ?? 5;
            return inertia('Clinic/Users/Index', [
                'users' => $users,
                'limit' => $limit,
                'count' => $users->count(),
                'plan' => $plan,
                'success' => 'User deleted successfully.',
            ]);
        }

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

        // Return updated users data for AJAX requests
        if (request()->expectsJson()) {
            $users = User::where('clinic_id', $clinic->id)->get();
            $plan = $clinic->subscription_plan ?? 'basic';
            $limit = $this->planLimits[$plan] ?? 5;
            return inertia('Clinic/Users/Index', [
                'users' => $users,
                'limit' => $limit,
                'count' => $users->count(),
                'plan' => $plan,
                'success' => $user->is_active ? 'User activated successfully.' : 'User deactivated successfully.',
            ]);
        }

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
            'user' => $user,
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
            'user' => $user,
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


        // Base validation rules
        $validationRules = [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'phone_number' => 'nullable|string|max:20',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:8|confirmed',
        ];

        // Add dentist-specific validation rules only if user is a dentist
        if ($user->role === 'dentist') {
            $validationRules = array_merge($validationRules, [
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
        }

        $validated = $request->validate($validationRules);
        
        // Debug: Log all validated data to see what's being sent
        \Log::info('Profile update - All validated data: ', $validated);

        // Handle password change
        if (!empty($validated['new_password'])) {
            if (empty($validated['current_password']) || !Hash::check($validated['current_password'], $user->password)) {
                return back()->withErrors(['current_password' => 'Current password is incorrect.']);
            }
        }

        // Handle avatar upload
        $avatarUrl = $user->avatar_url;
        if ($request->hasFile('avatar')) {
            try {
                // Determine which disk to use based on environment
                $disk = config('app.env') === 'production' ? 's3' : 'public';
                
                \Log::info('Avatar upload - Environment: ' . config('app.env'));
                \Log::info('Avatar upload - Using disk: ' . $disk);
                
                // Delete old avatar if exists
                if ($user->avatar_url) {
                    try {
                        // Handle both S3 URLs and local paths
                        if ($disk === 's3') {
                            // For S3, extract the key from the URL
                            $s3BaseUrl = config('filesystems.disks.s3.url');
                            if (strpos($user->avatar_url, $s3BaseUrl) === 0) {
                                $oldKey = str_replace($s3BaseUrl . '/', '', $user->avatar_url);
                                \Log::info('Avatar upload - Old S3 key: ' . $oldKey);
                                if (Storage::disk('s3')->exists($oldKey)) {
                                    Storage::disk('s3')->delete($oldKey);
                                    \Log::info('Avatar upload - Old avatar deleted from S3');
                                }
                            } else {
                                \Log::info('Avatar upload - Old avatar URL does not match S3 base URL, skipping deletion');
                            }
                        } else {
                            // For local storage
                            if (Storage::disk('public')->exists($user->avatar_url)) {
                                Storage::disk('public')->delete($user->avatar_url);
                                \Log::info('Avatar upload - Old avatar deleted from local storage');
                            }
                        }
                    } catch (\Exception $e) {
                        \Log::warning('Avatar upload - Failed to delete old avatar: ' . $e->getMessage());
                        // Continue with upload even if old avatar deletion fails
                    }
                }
                
                // Store new avatar
                $avatarPath = $request->file('avatar')->store('user-avatars', $disk);
                \Log::info('Avatar upload - New avatar stored at: ' . $avatarPath);
                
                // Get the full URL for the stored file
                if ($disk === 's3') {
                    // For S3, construct the full URL manually
                    $s3Url = config('filesystems.disks.s3.url');
                    $avatarUrl = $s3Url . '/' . $avatarPath;
                    \Log::info('Avatar upload - S3 URL generated: ' . $avatarUrl);
                } else {
                    $avatarUrl = $avatarPath;
                    \Log::info('Avatar upload - Local path: ' . $avatarUrl);
                }
            } catch (\Exception $e) {
                \Log::error('Avatar upload error: ' . $e->getMessage());
                \Log::error('Avatar upload error trace: ' . $e->getTraceAsString());
                return back()->withErrors(['avatar' => 'Failed to upload avatar: ' . $e->getMessage()]);
            }
        }

        // Build user data array
        $userData = [
            'avatar_url' => $avatarUrl,
        ];

        // Handle name - only update if provided (not empty string)
        if (isset($validated['name']) && $validated['name'] !== '') {
            $userData['name'] = $validated['name'];
        }

        // Handle email - only update if provided (not empty string)
        if (isset($validated['email']) && $validated['email'] !== '') {
            $userData['email'] = $validated['email'];
        }

        // Handle phone number - only update if provided (not empty string)
        if (isset($validated['phone_number']) && $validated['phone_number'] !== '') {
            $userData['phone_number'] = $validated['phone_number'];
        }

        // Add password if changing
        if (!empty($validated['new_password'])) {
            $userData['password'] = Hash::make($validated['new_password']);
        }

        // Add dentist-specific fields if user is a dentist
        if ($user->role === 'dentist') {
            // Only update dentist fields if they are provided and not empty
            if (isset($validated['license_number']) && $validated['license_number'] !== '') {
                $userData['license_number'] = $validated['license_number'];
            }
            if (isset($validated['specialties']) && !empty($validated['specialties'])) {
                $userData['specialties'] = $validated['specialties'];
            }
            if (isset($validated['qualifications']) && !empty($validated['qualifications'])) {
                $userData['qualifications'] = $validated['qualifications'];
            }
            if (isset($validated['years_experience']) && $validated['years_experience'] !== '') {
                $userData['years_experience'] = $validated['years_experience'];
            }
            if (isset($validated['bio']) && $validated['bio'] !== '') {
                $userData['bio'] = $validated['bio'];
            }
            if (isset($validated['emergency_contact']) && $validated['emergency_contact'] !== '') {
                $userData['emergency_contact'] = $validated['emergency_contact'];
            }
            if (isset($validated['emergency_phone']) && $validated['emergency_phone'] !== '') {
                $userData['emergency_phone'] = $validated['emergency_phone'];
            }
            if (isset($validated['working_hours']) && !empty($validated['working_hours'])) {
                $userData['working_hours'] = $validated['working_hours'];
            }
            if (isset($validated['unavailable_dates']) && !empty($validated['unavailable_dates'])) {
                $userData['unavailable_dates'] = $validated['unavailable_dates'];
            }
        }

        \Log::info('Profile update - Final avatar URL to save: ' . $avatarUrl);
        \Log::info('Profile update - User data to update: ', $userData);
        
        try {
            $user->update($userData);
            
            \Log::info('Profile update - User updated successfully');
            \Log::info('Profile update - User avatar_url after update: ' . $user->fresh()->avatar_url);
            
            return redirect()->route('clinic.profile')->with('success', 'Profile updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Profile update error: ' . $e->getMessage());
            \Log::error('Profile update error trace: ' . $e->getTraceAsString());
            \Log::error('Profile update - User data that failed: ', $userData);
            
            return back()->withErrors(['general' => 'Failed to update profile: ' . $e->getMessage()]);
        }
    }
}
