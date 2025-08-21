<?php

namespace App\Http\Requests\Clinic;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PatientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone_number' => 'required|string|max:20',
            'date_of_birth' => 'required|date|before:today',
            'gender' => 'required|in:male,female,other',
            'street_address' => 'nullable|string|max:255',
            'region_code' => 'nullable|string|max:10',
            'province_code' => 'nullable|string|max:10',
            'city_municipality_code' => 'nullable|string|max:10',
            'barangay_code' => 'nullable|string|max:10',
            'postal_code' => 'nullable|string|max:10',
            'address_details' => 'nullable|string',
            'medical_history' => 'nullable|string|max:2000',
            'allergies' => 'nullable|string|max:1000',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_number' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:50',
            'insurance_provider' => 'nullable|string|max:255',
            'insurance_policy_number' => 'nullable|string|max:50',
            'blood_type' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-,unknown',
            'occupation' => 'nullable|string|max:255',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'last_dental_visit' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:1000',
            'category' => 'nullable|in:regular,vip,emergency,pediatric,senior,new,returning,none',
            'tags' => 'nullable|json',
        ];

        // Add unique email validation for create requests
        if ($this->isMethod('POST')) {
            $rules['email'] = 'nullable|email|max:255';
        }

        // Add unique email validation for update requests (excluding current patient)
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $patientId = $this->route('patient');
            $rules['email'] = 'nullable|email|max:255';
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required.',
            'last_name.required' => 'Last name is required.',
            'phone_number.required' => 'Phone number is required.',
            'date_of_birth.required' => 'Date of birth is required.',
            'date_of_birth.before' => 'Date of birth must be in the past.',
            'gender.required' => 'Gender is required.',
            'gender.in' => 'Gender must be male, female, or other.',
            'blood_type.in' => 'Blood type must be a valid type.',
            'marital_status.in' => 'Marital status must be a valid option.',
            'category.in' => 'Category must be a valid option.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'first_name' => 'first name',
            'last_name' => 'last name',
            'phone_number' => 'phone number',
            'date_of_birth' => 'date of birth',
            'emergency_contact_name' => 'emergency contact name',
            'emergency_contact_number' => 'emergency contact number',
            'emergency_contact_relationship' => 'emergency contact relationship',
            'insurance_provider' => 'insurance provider',
            'insurance_policy_number' => 'insurance policy number',
            'blood_type' => 'blood type',
            'marital_status' => 'marital status',
            'last_dental_visit' => 'last dental visit',
        ];
    }

            /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Check for unique email within the same clinic
            if ($this->has('email') && !empty($this->email)) {
                $query = \App\Models\Patient::where('email', $this->email)
                    ->where('clinic_id', Auth::user()->clinic_id);

                // Exclude current patient for updates
                if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
                    $patientId = $this->route('patient');

                    // Debug logging
                    Log::info('Patient validation debug', [
                        'method' => $this->method(),
                        'patient_id_from_route' => $patientId,
                        'patient_id_type' => gettype($patientId),
                        'email_being_validated' => $this->email,
                        'clinic_id' => Auth::user()->clinic_id
                    ]);

                    if ($patientId) {
                        // Handle both model instance and ID
                        $patientIdValue = is_object($patientId) ? $patientId->id : $patientId;
                        $query->where('id', '!=', $patientIdValue);
                    }
                }

                if ($query->exists()) {
                    $validator->errors()->add('email', 'This email is already registered for another patient in this clinic.');
                }
            }
        });
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Clean up phone number format
        if ($this->has('phone_number')) {
            $this->merge([
                'phone_number' => preg_replace('/[^0-9+\-\s()]/', '', $this->phone_number)
            ]);
        }

        // Clean up emergency contact phone number
        if ($this->has('emergency_contact_number')) {
            $this->merge([
                'emergency_contact_number' => preg_replace('/[^0-9+\-\s()]/', '', $this->emergency_contact_number)
            ]);
        }

        // Set default values
        if (!$this->has('blood_type') || empty($this->blood_type)) {
            $this->merge(['blood_type' => 'unknown']);
        }

        if (!$this->has('last_dental_visit') || empty($this->last_dental_visit)) {
            $this->merge(['last_dental_visit' => 'No previous visit']);
        }

        if (!$this->has('category') || empty($this->category)) {
            $this->merge(['category' => 'none']);
        }
    }
}
