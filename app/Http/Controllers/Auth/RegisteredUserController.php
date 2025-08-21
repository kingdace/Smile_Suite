<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PatientLinkingService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    protected $patientLinkingService;

    public function __construct(PatientLinkingService $patientLinkingService)
    {
        $this->patientLinkingService = $patientLinkingService;
    }

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'phone_number' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

                try {
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'password' => Hash::make($request->password),
            ];

            // Check if there are existing patient records to claim
            $result = $this->patientLinkingService->handleSmileSuitePatientRegistration($userData);

            if (isset($result['error'])) {
                return redirect()->back()
                    ->withErrors(['email' => $result['message']])
                    ->withInput();
            }

            // Check if claiming is needed (existing patient records found)
            if (isset($result['needs_verification']) && $result['needs_verification']) {
                // Store the registration data in session for claiming process
                $request->session()->put('pending_registration', $userData);
                $request->session()->put('unlinked_patients', $result['unlinked_patients']);

                // Return Inertia response for better frontend handling
                return redirect()->route('register')->with([
                    'needs_verification' => true,
                    'verification_type' => 'claiming',
                    'message' => $result['message'],
                    'registration_email' => $request->email,
                    'unlinked_patients_count' => $result['unlinked_patients']->count()
                ]);
            }

            // Check if new registration is needed (no existing records)
            if (isset($result['needs_new_registration']) && $result['needs_new_registration']) {
                // Proceed with new registration verification
                $newRegistrationResult = $this->patientLinkingService->handleNewPatientRegistration($userData);

                if (isset($newRegistrationResult['error'])) {
                    return redirect()->back()
                        ->withErrors(['email' => $newRegistrationResult['message']])
                        ->withInput();
                }

                // Store registration data for verification
                $request->session()->put('pending_registration', $userData);

                // Return Inertia response for better frontend handling
                return redirect()->route('register')->with([
                    'needs_verification' => true,
                    'verification_type' => 'registration',
                    'message' => $newRegistrationResult['message'],
                    'registration_email' => $request->email
                ]);
            }

            // Check if user was created and linked to existing records (this should not happen anymore)
            if (isset($result['user']) && $result['user']) {
                // Auto-login the user
                Auth::login($result['user']);
                event(new Registered($result['user']));

                return redirect()->route('patient.dashboard')->with('success', $result['message']);
            }

            // Fallback - this should not happen
            return redirect()->back()
                ->withErrors(['email' => 'Registration failed. Please try again.'])
                ->withInput();

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['email' => 'Registration failed. Please try again.'])
                ->withInput();
        }
    }
}
