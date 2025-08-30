<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ClinicRegistrationRequest;
use App\Models\Clinic;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ClinicRegistrationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'clinic_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                function ($attribute, $value, $fail) {
                    // Check if email exists in clinic_registration_requests
                    $existingRequest = \App\Models\ClinicRegistrationRequest::where('email', $value)->latest()->first();

                    if ($existingRequest) {
                        // Allow re-registration if previous request was rejected, expired, or payment failed
                        if ($existingRequest->status === 'rejected' ||
                            $existingRequest->payment_status === 'payment_failed' ||
                            ($existingRequest->expires_at && $existingRequest->expires_at < now())) {
                            return; // Allow this email
                        }

                        // Block if there's an active pending or approved request
                        if ($existingRequest->status === 'pending' || $existingRequest->status === 'approved') {
                            $fail('This email address is already associated with an active registration request.');
                        }
                    }
                }
            ],
            'phone' => [
                'required',
                'string',
                'max:20',
                'regex:/^(\+63|0)9\d{9}$/', // Philippine mobile format
            ],
            'license_number' => [
                'required',
                'string',
                'max:50',
                'regex:/^[A-Z0-9-]+$/', // Only letters, numbers, and hyphens
                'unique:clinics,license_number',
                'unique:clinic_registration_requests,license_number'
            ],
            'description' => 'nullable|string',
            'message' => 'nullable|string',
            'subscription_plan' => 'required|string|in:basic,premium,enterprise',
        ]);

        // Calculate subscription amount based on plan
        // Basic plan has free trial, others require immediate payment
        $subscriptionAmount = match($validated['subscription_plan']) {
            'basic' => 0.00, // Free trial
            'premium' => 1999.00,
            'enterprise' => 2999.00,
            default => 0.00,
        };

        $registrationRequest = ClinicRegistrationRequest::create([
            ...$validated,
            'subscription_amount' => $subscriptionAmount,
            'payment_status' => 'pending', // Will be updated when payment is processed
            'status' => 'pending',
        ]);

        // In a real application, you would redirect to payment gateway here
        // For now, we'll just show a success message

        return redirect()->route('register.clinic.success', ['id' => $registrationRequest->id])
            ->with('success', 'Your clinic registration request has been submitted successfully. We will review it and get back to you within 24-48 hours.');
    }

    public function success($id)
    {
        $request = ClinicRegistrationRequest::findOrFail($id);

        return Inertia::render('Auth/ClinicRegisterSuccess', [
            'request' => $request
        ]);
    }

    public function setup($token)
    {
        $request = ClinicRegistrationRequest::where('approval_token', $token)
            ->where('status', 'approved')
            ->where('expires_at', '>', now())
            ->firstOrFail();

        return Inertia::render('Auth/ClinicSetup', [
            'request' => $request,
            'token' => $token
        ]);
    }

    public function setupSuccess()
    {
        return \Inertia\Inertia::render('Auth/ClinicSetupSuccess');
    }

    public function completeSetup(Request $request, $token)
    {
        $registrationRequest = ClinicRegistrationRequest::where('approval_token', $token)
            ->where('status', 'approved')
            ->where('expires_at', '>', now())
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                function ($attribute, $value, $fail) use ($registrationRequest) {
                    // Allow the email from the registration request
                    if ($value === $registrationRequest->email) {
                        return; // Allow this email
                    }

                    // Check if email exists in users table
                    if (\App\Models\User::where('email', $value)->exists()) {
                        $fail('This email address is already taken.');
                    }

                    // Check if email exists in clinics table
                    if (\App\Models\Clinic::where('email', $value)->exists()) {
                        $fail('This email address is already associated with another clinic.');
                    }
                }
            ],
            'password' => 'required|string|min:8|confirmed',
            'street_address' => 'nullable|string|max:255',
            'region_code' => 'nullable|string|max:10',
            'province_code' => 'nullable|string|max:10',
            'city_municipality_code' => 'nullable|string|max:10',
            'barangay_code' => 'nullable|string|max:10',
            'postal_code' => 'nullable|string|max:10',
            'address_details' => 'nullable|string',
        ]);

        DB::transaction(function () use ($registrationRequest, $validated) {
            // Generate a unique slug from the clinic name
            $baseSlug = Str::slug($registrationRequest->clinic_name);
            $slug = $baseSlug;
            $counter = 1;

            // Ensure slug uniqueness
            while (Clinic::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            // Determine subscription details based on plan
            $subscriptionStatus = $registrationRequest->subscription_plan === 'basic' ? 'trial' : 'active';
            $subscriptionEndDate = $registrationRequest->subscription_plan === 'basic'
                ? now()->addDays(14) // 14-day trial for Basic
                : now()->addDays(30); // 30-day billing cycle for others

            // Create the clinic
            $clinic = Clinic::create([
                'name' => $registrationRequest->clinic_name,
                'street_address' => $validated['street_address'] ?? null,
                'contact_number' => $registrationRequest->phone,
                'email' => $validated['email'], // Use the email from setup form, not registration request
                'license_number' => $registrationRequest->license_number,
                'description' => $registrationRequest->description,
                'slug' => $slug,
                'logo_url' => '/images/clinic-logo.png',
                'subscription_plan' => $registrationRequest->subscription_plan,
                'subscription_status' => $subscriptionStatus,
                'subscription_start_date' => now(),
                'subscription_end_date' => $subscriptionEndDate,
                'trial_ends_at' => $registrationRequest->subscription_plan === 'basic' ? now()->addDays(14) : null,
                'is_active' => true,
                'region_code' => $validated['region_code'] ?? null,
                'province_code' => $validated['province_code'] ?? null,
                'city_municipality_code' => $validated['city_municipality_code'] ?? null,
                'barangay_code' => $validated['barangay_code'] ?? null,
                'postal_code' => $validated['postal_code'] ?? null,
                'address_details' => $validated['address_details'] ?? null,
            ]);

            // Create the admin user for the clinic
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'clinic_admin',
                'user_type' => User::getUserTypeFromRole('clinic_admin'),
                'clinic_id' => $clinic->id,
                'email_verified_at' => now(), // Auto-verify since they came from approved request
            ]);

            // Mark the registration request as completed and link to clinic
            $registrationRequest->update([
                'status' => 'completed',
                'clinic_id' => $clinic->id,
            ]);
        });

        // Redirect to the dedicated success page
        return redirect()->route('clinic.setup.success');
    }
}
