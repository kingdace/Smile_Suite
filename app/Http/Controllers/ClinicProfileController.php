<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Clinic;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Models\ClinicGalleryImage;
use Illuminate\Support\Facades\Artisan;

class ClinicProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $clinic = $user->clinic;
        $users = [];
        $plan = $clinic ? $clinic->subscription_plan : null;
        $limit = null;
        if ($user->role === 'clinic_admin' && $clinic) {
            // For now, hardcode plan limits
            $planLimits = [
                'basic' => 5,
                'premium' => 10,
                'enterprise' => 25,
            ];
            $limit = $planLimits[$plan] ?? 5;
            $users = User::where('clinic_id', $clinic->id)->get();
            // Eager load gallery images
            $clinic->load('galleryImages');
        }
        return inertia('Clinic/Profile/Index', [
            'user' => $user,
            'clinic' => $clinic ? array_merge($clinic->toArray(), [
                'gallery_images' => $clinic->galleryImages ? $clinic->galleryImages->values()->toArray() : [],
            ]) : null,
            'users' => $users,
            'plan' => $plan,
            'limit' => $limit,
            'count' => $clinic ? $users ? count($users) : 0 : 0,
        ]);
    }

    public function update(Request $request)
    {
        Log::info('Clinic profile update request:', $request->all());
        $user = Auth::user();
        $clinic = $user->clinic;

        Log::info('User info:', ['id' => $user->id, 'role' => $user->role, 'name' => $user->name, 'email' => $user->email]);
        Log::info('Active tab check:', ['has_active_tab' => $request->has('active_tab'), 'active_tab_value' => $request->get('active_tab')]);

        // Check if this is a user account update by looking for the active_tab parameter
        if ($request->has('active_tab') && $request->get('active_tab') === 'user') {
            Log::info('Taking USER ACCOUNT UPDATE path');
            // This is a user account update
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'password' => 'nullable|string|min:8|confirmed',
            ]);
            Log::info('User account update validated:', $validated);
            Log::info('User before update:', ['id' => $user->id, 'name' => $user->name, 'email' => $user->email]);

            $user->name = $validated['name'];
            $user->email = $validated['email'];
            if (!empty($validated['password'])) {
                $user->password = bcrypt($validated['password']);
            }

            $result = $user->save();
            Log::info('User save result:', ['success' => $result]);
            Log::info('User after update:', ['id' => $user->id, 'name' => $user->name, 'email' => $user->email]);

            // Refresh the user from database to verify
            $user->refresh();
            Log::info('User after refresh:', ['id' => $user->id, 'name' => $user->name, 'email' => $user->email]);

            // Force refresh the auth session to ensure updated data is available
            Auth::setUser($user);

            // Preserve the active tab when redirecting
            $activeTab = $request->input('active_tab', 'clinic');
            return redirect()->route('clinic.profile.index', ['tab' => $activeTab])->with('success', 'Profile updated successfully.');
        }

        // This is a clinic profile update (only for clinic_admin)
        if ($user->role === 'clinic_admin' && $clinic) {
            Log::info('Taking CLINIC PROFILE UPDATE path');
            $validated = $request->validate([
                'clinic_name' => 'required|string|max:255',
                'contact_number' => 'nullable|string|max:30',
                'clinic_email' => 'required|email',
                'license_number' => 'nullable|string|max:100',
                'description' => 'nullable|string',
                'logo' => 'nullable|image|max:2048',
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',
                'operating_hours' => 'nullable', // Accept any type for debug
            ]);
            Log::info('Clinic profile validated:', $validated);
            $clinic->name = $validated['clinic_name'];
            $clinic->contact_number = $validated['contact_number'] ?? $clinic->contact_number;
            $clinic->email = $validated['clinic_email'];
            $clinic->license_number = $validated['license_number'] ?? $clinic->license_number;
            $clinic->description = $validated['description'] ?? $clinic->description;
            $clinic->latitude = $validated['latitude'] ?? null;
            $clinic->longitude = $validated['longitude'] ?? null;
            if (array_key_exists('operating_hours', $validated)) {
                $oh = $validated['operating_hours'];
                Log::info('Operating hours before processing:', ['raw' => $oh, 'type' => gettype($oh)]);
                if (is_string($oh)) {
                    $decoded = json_decode($oh, true);
                    Log::info('Decoded operating hours:', ['decoded' => $decoded]);
                    $clinic->operating_hours = $decoded ?: null;
                } else {
                    Log::info('Setting operating hours directly:', ['hours' => $oh]);
                    $clinic->operating_hours = $oh;
                }
                Log::info('Operating hours after setting:', ['final' => $clinic->operating_hours]);
            } else {
                $clinic->operating_hours = null;
            }
            if ($request->hasFile('logo')) {
                $path = $request->file('logo')->store('clinic-logos', 'public');
                $clinic->logo_url = '/storage/' . $path;
            }
            $clinic->save();

            // Log what was actually saved to database
            $clinic->refresh();
            Log::info('Operating hours after save and refresh:', ['saved' => $clinic->operating_hours]);

            // Preserve the active tab when redirecting
            $activeTab = $request->input('active_tab', 'clinic');
            return redirect()->route('clinic.profile.index', ['tab' => $activeTab])->with('success', 'Clinic profile updated successfully.');
        } else {
            Log::info('Taking STAFF/DENTIST UPDATE path');
            // Staff/dentist: only update their own user info
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'password' => 'nullable|string|min:8|confirmed',
            ]);
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            if (!empty($validated['password'])) {
                $user->password = bcrypt($validated['password']);
            }
            $user->save();
            // Preserve the active tab when redirecting
            $activeTab = $request->input('active_tab', 'clinic');
            return redirect()->route('clinic.profile.index', ['tab' => $activeTab])->with('success', 'Profile updated successfully.');
        }
    }

    public function clinicInfo()
    {
        $user = Auth::user();
        if ($user->role !== 'clinic_admin') {
            abort(403);
        }
        $clinic = $user->clinic;
        $plan = $clinic ? $clinic->subscription_plan : null;
        return inertia('Clinic/Profile/ClinicInfo', [
            'clinic' => $clinic,
            'plan' => $plan,
        ]);
    }

    /**
     * Upload a gallery image for the clinic.
     */
    public function uploadGalleryImage(Request $request)
    {
        // Log for debugging
        \Log::info('HIT uploadGalleryImage', [
            'user_id' => Auth::id(),
            'role' => Auth::user() ? Auth::user()->role : null,
            'has_clinic' => Auth::user() && Auth::user()->clinic ? true : false,
        ]);

        $user = Auth::user();
        $clinic = $user->clinic;

        if (!$user || $user->role !== 'clinic_admin' || !$clinic) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'image' => 'required|image|max:4096', // 4MB max
        ]);

        // Ensure storage is linked and writable
        if (!file_exists(public_path('storage'))) {
            \Artisan::call('storage:link');
        }

        $path = $request->file('image')->store('clinic-gallery', 'public');
        $imageUrl = '/storage/' . $path;

        // Double-check file exists
        if (!file_exists(public_path($imageUrl))) {
            return response()->json(['error' => 'File not saved!'], 500);
        }

        $image = \App\Models\ClinicGalleryImage::create([
            'clinic_id' => $clinic->id,
            'image_url' => $imageUrl,
        ]);

        return response()->json(['image' => $image], 201);
    }

    /**
     * Delete a gallery image for the clinic.
     */
    public function deleteGalleryImage(Request $request, $id)
    {
        $user = Auth::user();
        $clinic = $user->clinic;
        if ($user->role !== 'clinic_admin' || !$clinic) {
            abort(403);
        }
        $image = ClinicGalleryImage::where('id', $id)->where('clinic_id', $clinic->id)->firstOrFail();
        // Delete the file from storage
        if ($image->image_url && str_starts_with($image->image_url, '/storage/')) {
            $filePath = str_replace('/storage/', '', $image->image_url);
            Storage::disk('public')->delete($filePath);
        }
        $image->delete();
        return response()->json(['success' => true]);
    }
}
