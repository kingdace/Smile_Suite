<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\AppointmentType;
use App\Models\AppointmentStatus;
use App\Models\Review;
use App\Mail\AppointmentReceivedMail;
use App\Mail\ClinicNewBookingMail;

class ClinicDirectoryController extends Controller
{
    public function landing()
    {
        return Inertia::render('Public/Landing');
    }

    public function index()
    {
        // Optimized query with proper eager loading and indexed columns
        $clinics = Clinic::select(
            'clinics.id', 'clinics.name', 'clinics.slug', 'clinics.street_address',
            'clinics.barangay_code', 'clinics.city_municipality_code',
            'clinics.province_code', 'clinics.region_code', 'clinics.address_details',
            'clinics.logo_url', 'clinics.description',
            'clinics.contact_number', 'clinics.email'
        )
            ->where('clinics.is_active', true)
            // Use join instead of whereHas for better performance
            ->join('users', 'users.clinic_id', '=', 'clinics.id')
            ->where('users.role', 'clinic_admin')
            // Remove duplicate clinics if they have multiple admins
            ->distinct()
            // Order by most recently updated or by name for consistency
            ->orderBy('clinics.name', 'asc')
            ->paginate(12);

        return Inertia::render('Public/Clinics/Index', [
            'clinics' => $clinics,
        ]);
    }

    public function profile($slug)
    {
        $clinic = \App\Models\Clinic::where('slug', $slug)
            ->where('is_active', true)
            ->whereHas('users', function($query) {
                $query->where('role', 'clinic_admin');
            })
            ->select('id', 'name', 'slug', 'street_address', 'barangay_code', 'city_municipality_code', 'province_code', 'region_code', 'address_details', 'logo_url', 'description', 'contact_number', 'email', 'latitude', 'longitude', 'operating_hours')
            ->firstOrFail();
        $clinic->load(['galleryImages', 'services' => function($query) {
            $query->where('is_active', true)->orderBy('name');
        }, 'users' => function($query) {
            $query->whereIn('role', ['dentist', 'staff'])->orderBy('name');
        }, 'reviews' => function($query) {
            $query->with(['patient.user', 'staff'])->approved()->orderBy('created_at', 'desc')->limit(10);
        }]);

        // Get review statistics (clinic reviews only, not doctor reviews)
        $averageRating = Review::where('clinic_id', $clinic->id)
            ->clinicOnly()
            ->approved()
            ->avg('rating');
        $reviewCount = Review::where('clinic_id', $clinic->id)
            ->clinicOnly()
            ->approved()
            ->count();

        // Get doctor performance data
        $doctors = \App\Models\User::where('clinic_id', $clinic->id)
            ->where('role', 'dentist')
            ->get()
            ->map(function ($doctor) {
                $averageRating = Review::getDoctorAverageRating($doctor->id);
                $reviewCount = Review::getDoctorReviewCount($doctor->id);
                $categoryRatings = Review::getDoctorCategoryRatings($doctor->id);

                return [
                    'id' => $doctor->id,
                    'name' => $doctor->name,
                    'specialties' => $doctor->specialties,
                    'years_experience' => $doctor->years_experience,
                    'profile_photo' => $doctor->profile_photo,
                    'average_rating' => round($averageRating, 1),
                    'review_count' => $reviewCount,
                    'category_ratings' => $categoryRatings,
                ];
            });

        return Inertia::render('Public/Clinics/Profile', [
            'clinic' => array_merge($clinic->toArray(), [
                'gallery_images' => $clinic->galleryImages ? $clinic->galleryImages->values()->toArray() : [],
                'services' => $clinic->services ? $clinic->services->values()->toArray() : [],
                'staff' => $clinic->users ? $clinic->users->values()->toArray() : [],
                'reviews' => $clinic->reviews ? $clinic->reviews->values()->toArray() : [],
                'doctors' => $doctors->toArray(),
                'review_stats' => [
                    'average_rating' => round($averageRating, 1),
                    'review_count' => $reviewCount,
                ],
            ]),
        ]);
    }

    public function bookAppointment(Request $request, Clinic $clinic)
    {
        // Only allow logged-in patients
        $user = Auth::user();
        if (!$user || $user->role !== 'patient') {
            return redirect()->route('login')
                ->with('error', 'Please log in as a patient to book an appointment.');
        }

        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required',
            'reason' => 'required|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'service_id' => 'nullable|exists:services,id',
        ]);

        // Find or create patient record for this user at this clinic
        $patient = Patient::firstOrCreate(
            [
                'user_id' => $user->id,
                'clinic_id' => $clinic->id,
            ],
            [
                'first_name' => $this->parseFullName($user->name)['first_name'],
                'last_name' => $this->parseFullName($user->name)['last_name'],
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'date_of_birth' => now()->subYears(18), // Placeholder
                'gender' => 'other', // Placeholder
            ]
        );

        // Get Online Booking type and Pending status
        $type = AppointmentType::where('name', 'Online Booking')->first();
        $status = AppointmentStatus::where('name', 'Pending')->first();

        // Combine date and time for scheduled_at
        $scheduledAt = date('Y-m-d H:i:s', strtotime($validated['date'] . ' ' . $validated['time']));
        $endedAt = date('Y-m-d H:i:s', strtotime($scheduledAt . ' +1 hour'));

        // Validate against clinic business hours
        $appointmentService = app(\App\Services\AppointmentService::class);
        $businessHoursErrors = $appointmentService->validateBusinessHours([
            'scheduled_at' => $scheduledAt,
            'duration' => 60 // Default 1 hour for online bookings
        ], $clinic->id);

        if (!empty($businessHoursErrors)) {
            // Redirect back with validation-style errors so Inertia can handle them
            // Attach to a sensible key (e.g., 'date') and a general message
            return back()
                ->withErrors([
                    'date' => $businessHoursErrors[0] ?? 'Selected time is unavailable.',
                    'booking' => 'Booking failed',
                ])
                ->withInput();
        }

        $appointment = Appointment::create([
            'clinic_id' => $clinic->id,
            'patient_id' => $patient->id,
            'scheduled_at' => $scheduledAt,
            'ended_at' => $endedAt,
            'appointment_type_id' => $type ? $type->id : 1,
            'appointment_status_id' => $status ? $status->id : 1,
            'is_online_booking' => true,
            'reason' => $validated['reason'],
            'notes' => $validated['notes'] ?? null,
            'service_id' => $validated['service_id'] ?? null,
            'created_by' => $user->id,
            'payment_status' => 'pending',
        ]);

        // Load relationships for email
        $appointment->load(['service', 'clinic', 'patient']);

        // Get the loaded clinic and patient from the appointment
        $loadedClinic = $appointment->clinic;
        $loadedPatient = $appointment->patient;

        // Send confirmation email to patient
        try {
            Mail::to($loadedPatient->email)->send(new AppointmentReceivedMail($appointment, $loadedPatient, $loadedClinic));
        } catch (\Exception $e) {
            Log::error('Failed to send appointment received email: ' . $e->getMessage());
        }

        // Send notification email to clinic staff
        try {
            $clinicAdmins = $loadedClinic->users()->where('role', 'clinic_admin')->get();
            foreach ($clinicAdmins as $admin) {
                Mail::to($admin->email)->send(new ClinicNewBookingMail($appointment, $loadedPatient, $loadedClinic));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send clinic notification email: ' . $e->getMessage());
        }

        return back()->with('success', 'Appointment request submitted successfully! You will receive a confirmation email shortly.');
    }

    /**
     * Parse full name into first name and last name
     * Uses intelligent parsing: last word = last name, everything else = first name
     *
     * Examples:
     * - "John" → first_name: "John", last_name: ""
     * - "John Doe" → first_name: "John", last_name: "Doe"
     * - "Kram Yd Gales" → first_name: "Kram Yd", last_name: "Gales"
     * - "Maria Elena Rodriguez" → first_name: "Maria Elena", last_name: "Rodriguez"
     */
    private function parseFullName(string $fullName): array
    {
        $fullName = trim($fullName);
        $parts = explode(' ', $fullName);

        if (count($parts) === 1) {
            // Single name - put in first_name
            return [
                'first_name' => $parts[0],
                'last_name' => ''
            ];
        } elseif (count($parts) === 2) {
            // Two names - standard first/last
            return [
                'first_name' => $parts[0],
                'last_name' => $parts[1]
            ];
        } else {
            // Multiple names - everything except last word = first_name, last word = last_name
            $lastName = array_pop($parts); // Remove and get the last element
            $firstName = implode(' ', $parts); // Join remaining parts

            return [
                'first_name' => $firstName,
                'last_name' => $lastName
            ];
        }
    }
}
