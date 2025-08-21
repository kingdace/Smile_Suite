<?php

namespace App\Services;

use App\Models\Patient;
use App\Models\User;
use App\Models\Clinic;
use App\Mail\PatientRecordClaimingMail;
use App\Mail\PatientRegistrationVerificationMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PatientLinkingService
{
    /**
     * Handle patient registration from Smile Suite portal
     * This is called when a patient registers on the public website
     */
    public function handleSmileSuitePatientRegistration(array $userData): array
    {
        $email = $userData['email'];

        // Check if patient exists in any clinic
        $existingPatients = Patient::where('email', $email)->get();

        if ($existingPatients->isEmpty()) {
            // No existing patient records - return indication that new registration is needed
            return [
                'user' => null,
                'linked_patients' => collect(),
                'action' => 'needs_new_registration',
                'message' => 'No existing patient records found. Proceed with new registration.',
                'needs_new_registration' => true
            ];
        }

        // Check if any existing patient has a user account
        $patientsWithUser = $existingPatients->filter(function ($patient) {
            return $patient->hasUserAccount();
        });

        if ($patientsWithUser->isNotEmpty()) {
            // Patient already has a user account - return error
            return [
                'user' => null,
                'linked_patients' => $patientsWithUser,
                'action' => 'user_exists',
                'message' => 'A patient account with this email already exists.',
                'error' => true
            ];
        }

        // Check if there are unlinked patient records that need claiming
        $unlinkedPatients = $existingPatients->filter(function ($patient) {
            return !$patient->hasUserAccount();
        });

        if ($unlinkedPatients->isNotEmpty()) {
            // Generate verification tokens for claiming and send emails
            foreach ($unlinkedPatients as $patient) {
                $token = $patient->generateEmailVerificationToken();

                // Send verification email
                try {
                    Mail::to($email)->send(new PatientRecordClaimingMail(
                        $token,
                        $patient->name,
                        $patient->clinic->name ?? 'Dental Clinic'
                    ));
                } catch (\Exception $e) {
                    Log::error('Failed to send patient claiming email', [
                        'email' => $email,
                        'patient_id' => $patient->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            return [
                'user' => null,
                'unlinked_patients' => $unlinkedPatients,
                'action' => 'needs_claiming',
                'message' => 'We found existing patient records with this email. Please check your email for a verification code to claim these records.',
                'needs_verification' => true
            ];
        }

        // This should never happen - if we reach here, it means there are existing patients
        // but they don't need claiming, which means they already have user accounts
        // This is an error condition
        return [
            'user' => null,
            'linked_patients' => $existingPatients,
            'action' => 'error',
            'message' => 'Unexpected error: Existing patient records found but no claiming needed.',
            'error' => true
        ];
    }

    /**
     * Handle appointment booking from Smile Suite patient
     * This is called when a Smile Suite patient books an appointment
     */
    public function handleSmileSuiteAppointmentBooking(User $user, Clinic $clinic): array
    {
        $email = $user->email;

        // Check if patient exists in this specific clinic
        $existingPatient = Patient::findByEmailInClinic($email, $clinic->id);

        if ($existingPatient) {
            // Patient exists in clinic - link if not already linked
            if (!$existingPatient->hasUserAccount()) {
                $existingPatient->linkToUser($user);
            }

            return [
                'patient' => $existingPatient,
                'action' => 'linked_existing_patient',
                'message' => 'Linked to existing patient record in this clinic.'
            ];
        }

        // Patient doesn't exist in clinic - create new patient record
        $newPatient = Patient::create([
            'clinic_id' => $clinic->id,
            'user_id' => $user->id,
            'first_name' => explode(' ', $user->name)[0] ?? $user->name,
            'last_name' => explode(' ', $user->name)[1] ?? '',
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'email_verified' => true, // Since they have a verified user account
            'email_verified_at' => now(),
            'category' => Patient::CATEGORY_NEW,
            'last_dental_visit' => Patient::LAST_VISIT_NO_PREVIOUS,
        ]);

        return [
            'patient' => $newPatient,
            'action' => 'created_new_patient',
            'message' => 'New patient record created for this clinic.'
        ];
    }

    /**
     * Handle manual patient creation in clinic
     * This is called when clinic staff creates a patient manually
     */
    public function handleManualPatientCreation(array $patientData, Clinic $clinic): array
    {
        $email = $patientData['email'] ?? null;

        if (!$email) {
            // No email provided - create patient without user link
            $patient = Patient::create(array_merge($patientData, [
                'clinic_id' => $clinic->id,
                'user_id' => null,
            ]));

            return [
                'patient' => $patient,
                'action' => 'created_manual_patient',
                'message' => 'Patient created manually without user account.'
            ];
        }

        // Check if user account exists with this email
        $existingUser = User::where('email', $email)
                           ->where('user_type', User::TYPE_PATIENT)
                           ->first();

        if ($existingUser) {
            // User account exists - link to it
            $patient = Patient::create(array_merge($patientData, [
                'clinic_id' => $clinic->id,
                'user_id' => $existingUser->id,
                'email_verified' => true, // Since user account is verified
                'email_verified_at' => now(),
            ]));

            return [
                'patient' => $patient,
                'action' => 'linked_to_existing_user',
                'message' => 'Patient created and linked to existing Smile Suite account.',
                'user' => $existingUser
            ];
        }

        // Check if patient exists in this clinic
        $existingPatient = Patient::findByEmailInClinic($email, $clinic->id);

        if ($existingPatient) {
            return [
                'patient' => $existingPatient,
                'action' => 'patient_exists',
                'message' => 'Patient with this email already exists in this clinic.',
                'error' => true
            ];
        }

        // Create new patient without user link
        $patient = Patient::create(array_merge($patientData, [
            'clinic_id' => $clinic->id,
            'user_id' => null,
        ]));

        return [
            'patient' => $patient,
            'action' => 'created_manual_patient',
            'message' => 'Patient created manually. Can be linked later if they register on Smile Suite.'
        ];
    }

        /**
     * Allow patient to claim their manual record
     * This is called when a Smile Suite patient wants to link to existing manual records
     */
    public function claimManualPatientRecord(User $user, string $verificationToken): array
    {
        // Find patient with this verification token
        $patient = Patient::where('email_verification_token', $verificationToken)
                         ->where('email', $user->email)
                         ->first();

        if (!$patient) {
            return [
                'success' => false,
                'message' => 'Invalid verification token or email mismatch.'
            ];
        }

        if ($patient->email_verification_token_expires_at &&
            $patient->email_verification_token_expires_at->isPast()) {
            return [
                'success' => false,
                'message' => 'Verification token has expired.'
            ];
        }

        // Link patient to user account
        $patient->linkToUser($user);
        $patient->verifyEmail($verificationToken);

        return [
            'success' => true,
            'patient' => $patient,
            'message' => 'Patient record successfully linked to your account.'
        ];
    }

    /**
     * Handle new patient registration with email verification
     * This is called when a patient registers without existing records
     */
    public function handleNewPatientRegistration(array $userData): array
    {
        $email = $userData['email'];

        // Check if user already exists
        $existingUser = User::where('email', $email)->first();
        if ($existingUser) {
            return [
                'success' => false,
                'message' => 'A user with this email already exists.',
                'error' => true
            ];
        }

        // Create user with unverified status
        $user = User::create([
            'name' => $userData['name'],
            'email' => $email,
            'phone_number' => $userData['phone_number'],
            'password' => $userData['password'],
            'role' => 'patient',
            'user_type' => User::TYPE_PATIENT,
            'registration_verified' => false,
        ]);

        // Generate verification code and send email
        $verificationCode = $user->generateRegistrationVerificationCode();

        try {
            Mail::to($email)->send(new PatientRegistrationVerificationMail(
                $verificationCode,
                $user->name
            ));
        } catch (\Exception $e) {
            Log::error('Failed to send registration verification email', [
                'email' => $email,
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);

            // Delete the user if email fails
            $user->delete();

            return [
                'success' => false,
                'message' => 'Failed to send verification email. Please try again.',
                'error' => true
            ];
        }

        return [
            'success' => true,
            'user' => $user,
            'action' => 'needs_registration_verification',
            'message' => 'Please check your email for a verification code to complete your registration.',
            'needs_verification' => true
        ];
    }

    /**
     * Verify new patient registration
     */
    public function verifyNewPatientRegistration(string $email, string $verificationCode): array
    {
        $user = User::where('email', $email)
                   ->where('user_type', User::TYPE_PATIENT)
                   ->where('registration_verified', false)
                   ->first();

        if (!$user) {
            return [
                'success' => false,
                'message' => 'Invalid email or user not found.'
            ];
        }

        if ($user->verifyRegistration($verificationCode)) {
            return [
                'success' => true,
                'user' => $user,
                'message' => 'Registration verified successfully!'
            ];
        }

        return [
            'success' => false,
            'message' => 'Invalid or expired verification code.'
        ];
    }

    /**
     * Resend verification code for new patient registration
     */
    public function resendVerificationCode(string $email): array
    {
        $user = User::where('email', $email)
                   ->where('user_type', User::TYPE_PATIENT)
                   ->where('registration_verified', false)
                   ->first();

        if (!$user) {
            return [
                'success' => false,
                'message' => 'Invalid email or user not found.'
            ];
        }

        // Check if enough time has passed since last code generation (1 minute)
        if ($user->registration_verification_expires_at &&
            $user->registration_verification_expires_at->diffInMinutes(now()) < 1) {
            return [
                'success' => false,
                'message' => 'Please wait at least 1 minute before requesting a new code.'
            ];
        }

        // Generate new verification code and send email
        $verificationCode = $user->generateRegistrationVerificationCode();

        try {
            Mail::to($email)->send(new PatientRegistrationVerificationMail(
                $verificationCode,
                $user->name
            ));

            return [
                'success' => true,
                'message' => 'New verification code sent to your email.'
            ];
        } catch (\Exception $e) {
            Log::error('Failed to resend verification email', [
                'email' => $email,
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send verification email. Please try again.'
            ];
        }
    }

    /**
     * Handle patient registration with claiming process
     * This is called when a patient registers and needs to claim existing records
     */
    public function handlePatientRegistrationWithClaiming(array $userData, string $verificationToken): array
    {
        Log::info('=== CLAIMING SERVICE DEBUG ===');
        Log::info('User data:', $userData);
        Log::info('Verification token:', ['token' => $verificationToken]);

        $email = $userData['email'];

        // Find patient with this verification token
        $patient = Patient::where('email_verification_token', $verificationToken)
                         ->where('email', $email)
                         ->first();

        if (!$patient) {
            return [
                'success' => false,
                'message' => 'Invalid verification token or email mismatch.'
            ];
        }

        if ($patient->email_verification_token_expires_at &&
            $patient->email_verification_token_expires_at->isPast()) {
            return [
                'success' => false,
                'message' => 'Verification token has expired.'
            ];
        }

        // Create user account
        try {
            Log::info('Creating user account with data:', [
                'name' => $userData['name'],
                'email' => $email,
                'phone_number' => $userData['phone_number'],
                'role' => 'patient',
                'user_type' => User::TYPE_PATIENT,
            ]);

            $user = User::create([
                'name' => $userData['name'],
                'email' => $email,
                'phone_number' => $userData['phone_number'],
                'password' => $userData['password'],
                'role' => 'patient',
                'user_type' => User::TYPE_PATIENT,
                'registration_verified' => true, // User completed verification process
                'email_verified_at' => now(), // Mark email as verified
            ]);

            Log::info('User created successfully:', ['user_id' => $user->id]);
        } catch (\Exception $e) {
            Log::error('Failed to create user:', [
                'error' => $e->getMessage(),
                'user_data' => $userData
            ]);

            return [
                'success' => false,
                'message' => 'Failed to create user account: ' . $e->getMessage()
            ];
        }

        // Link all existing patient records with this email
        $allPatients = Patient::where('email', $email)->get();
        foreach ($allPatients as $patientRecord) {
            $patientRecord->linkToUser($user);
            if ($patientRecord->email_verification_token === $verificationToken) {
                $patientRecord->verifyEmail($verificationToken);
            }
        }

        return [
            'success' => true,
            'user' => $user,
            'linked_patients' => $allPatients,
            'message' => 'Account created and linked to existing patient records.'
        ];
    }

    /**
     * Get all clinic records for a Smile Suite patient
     */
    public function getPatientClinicRecords(User $user): array
    {
        // First, try to link any unlinked patient records with the same email
        $this->linkUnlinkedPatientRecords($user);

        $patients = $user->patients()->with('clinic')->get();

        $clinicRecords = [];
        foreach ($patients as $patient) {
            $clinicRecords[] = [
                'clinic' => $patient->clinic,
                'patient' => $patient,
                'appointments' => $patient->appointments()->latest()->take(5)->get(),
                'treatments' => $patient->treatments()->latest()->take(5)->get(),
                'payments' => $patient->payments()->latest()->take(5)->get(),
            ];
        }

        return $clinicRecords;
    }

    /**
     * Link any unlinked patient records for a user
     * This handles cases where patient records were created after user registration
     */
    private function linkUnlinkedPatientRecords(User $user): void
    {
        $unlinkedPatients = Patient::where('email', $user->email)
                                  ->whereNull('user_id')
                                  ->get();

        foreach ($unlinkedPatients as $patient) {
            $patient->linkToUser($user);
        }
    }
}
