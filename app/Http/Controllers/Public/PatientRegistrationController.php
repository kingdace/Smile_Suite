<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\PatientLinkingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Inertia\Inertia;

class PatientRegistrationController extends Controller
{
    protected $patientLinkingService;

    public function __construct(PatientLinkingService $patientLinkingService)
    {
        $this->patientLinkingService = $patientLinkingService;
    }

    /**
     * Show the patient registration form
     */
    public function showRegistrationForm()
    {
        return Inertia::render('Public/PatientRegistration');
    }

    /**
     * Handle patient registration
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'phone_number' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'password' => Hash::make($request->password),
            ];

            $result = $this->patientLinkingService->handleSmileSuitePatientRegistration($userData);

            if (isset($result['error'])) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 400);
            }

            // Check if claiming is needed
            if (isset($result['needs_verification']) && $result['needs_verification']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'],
                    'needs_verification' => true,
                    'action' => 'needs_claiming',
                    'unlinked_patients_count' => $result['unlinked_patients']->count()
                ], 200);
            }

            // Auto-login the user
            Auth::login($result['user']);

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'user' => $result['user'],
                'linked_patients_count' => $result['linked_patients']->count(),
                'redirect' => route('patient.dashboard')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.'
            ], 200); // Changed from 500 to 200 to prevent Inertia redirect
        }
    }

    /**
     * Show patient dashboard
     */
    public function dashboard()
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== \App\Models\User::TYPE_PATIENT) {
            return redirect()->route('login');
        }

        // Check if patient registration is verified - put logic directly in controller
        if (!$user->registration_verified) {
            return redirect()->route('register')->with([
                'needs_verification' => true,
                'verification_type' => 'registration',
                'message' => 'Please verify your email to complete your registration.',
                'registration_email' => $user->email
            ]);
        }

        $clinicRecords = $this->patientLinkingService->getPatientClinicRecords($user);

        return Inertia::render('Patient/Dashboard', [
            'user' => $user,
            'clinicRecords' => $clinicRecords,
        ]);
    }

    /**
     * Handle patient record claiming
     */
    public function claimRecord(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'verification_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();

        if (!$user || $user->user_type !== \App\Models\User::TYPE_PATIENT) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access.'
            ], 401);
        }

        $result = $this->patientLinkingService->claimManualPatientRecord(
            $user,
            $request->verification_token
        );

        Log::info('Claiming result:', $result);
        return response()->json($result);
    }

        /**
     * Handle patient registration with claiming
     */
    public function registerWithClaiming(Request $request)
    {
        Log::info('=== CLAIMING DEBUG ===');
        Log::info('Request data:', $request->all());

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone_number' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'verification_token' => 'required|string',
        ]);

        Log::info('Validation rules checked');

        if ($validator->fails()) {
            Log::info('Validation failed:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        Log::info('Validation passed');

        try {
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'password' => Hash::make($request->password),
            ];

            Log::info('Calling patient linking service with data:', $userData);
            Log::info('Verification token:', ['token' => $request->verification_token]);

            $result = $this->patientLinkingService->handlePatientRegistrationWithClaiming(
                $userData,
                $request->verification_token
            );

            Log::info('Patient linking service result:', $result);

            if (!$result['success']) {
                Log::info('Claiming failed, returning error response');
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 200); // Changed from 400 to 200 to prevent Inertia redirect
            }

            // Auto-login the user
            Auth::login($result['user']);

            $response = [
                'success' => true,
                'message' => $result['message'],
                'user' => $result['user'],
                'linked_patients_count' => $result['linked_patients']->count(),
                'redirect' => route('patient.dashboard')
            ];

            Log::info('Claiming successful, sending response:', $response);
            return response()->json($response);

        } catch (\Exception $e) {
            Log::error('Registration failed:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.'
            ], 500);
        }
    }

    /**
     * Handle new patient registration verification
     */
    public function verifyRegistration(Request $request)
    {
        Log::info('=== VERIFICATION DEBUG ===');
        Log::info('Request received at: ' . now());
        Log::info('Request data:', $request->all());
        Log::info('Request input data:', $request->input());
        Log::info('Request json data:', $request->json()->all());
        Log::info('Request headers:', $request->headers->all());
        Log::info('Raw request content: ' . $request->getContent());
        Log::info('Request method: ' . $request->method());
        Log::info('Request URL: ' . $request->url());

        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'verification_code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $result = $this->patientLinkingService->verifyNewPatientRegistration(
                $request->email,
                $request->verification_code
            );

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 200); // Changed from 400 to 200 to prevent Inertia redirect
            }

            // Auto-login the user
            Auth::login($result['user']);

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'user' => $result['user'],
                'redirect' => route('patient.dashboard')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Verification failed. Please try again.'
            ], 200); // Changed from 500 to 200 to prevent Inertia redirect
        }
    }

    /**
     * Resend verification code
     */
    public function resendVerification(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $result = $this->patientLinkingService->resendVerificationCode($request->email);

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to resend verification code. Please try again.'
            ], 200); // Changed from 500 to 200 to prevent Inertia redirect
        }
    }
}
