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
use App\Services\ScheduleService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class ClinicDirectoryController extends Controller
{
    protected $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }
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
            'duration' => 'nullable|integer|min:15|max:240', // Duration in minutes
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
        $scheduledAt = Carbon::parse($validated['date'] . ' ' . $validated['time']);
        
        // Use the duration from request, default to 30 minutes (same as frontend)
        // This ensures consistency between slot availability and booking duration
        $duration = (int) ($validated['duration'] ?? 30);
        $endedAt = $scheduledAt->copy()->addMinutes($duration);
        
        Log::info('Booking appointment with duration', [
            'date' => $validated['date'],
            'time' => $validated['time'],
            'duration' => $duration,
            'scheduled_at' => $scheduledAt->format('Y-m-d H:i:s'),
            'ended_at' => $endedAt->format('Y-m-d H:i:s'),
        ]);

        // Validate against clinic business hours
        $appointmentService = app(\App\Services\AppointmentService::class);
        $businessHoursErrors = $appointmentService->validateBusinessHours([
            'scheduled_at' => $scheduledAt->format('Y-m-d H:i:s'),
            'duration' => $duration
        ], $clinic->id);

        if (!empty($businessHoursErrors)) {
            return back()
                ->withErrors([
                    'date' => $businessHoursErrors[0] ?? 'Selected time is unavailable.',
                    'booking' => 'Booking failed',
                ])
                ->withInput();
        }

        // Check if time slot is actually available
        // Use the same duration as what will be booked to ensure consistency
        $availableSlots = $this->scheduleService->getClinicAvailableSlots(
            $clinic->id,
            $validated['date'],
            $duration
        );

        $requestedTime = $scheduledAt->format('H:i');
        if (!in_array($requestedTime, $availableSlots)) {
            Log::warning('Booking attempt for unavailable time slot', [
                'clinic_id' => $clinic->id,
                'date' => $validated['date'],
                'time' => $requestedTime,
                'available_slots' => $availableSlots,
            ]);
            return back()
                ->withErrors([
                    'time' => 'The selected time slot is no longer available. Please select another time.',
                    'booking' => 'Booking failed',
                ])
                ->withInput();
        }

        // Check for duplicate bookings: same patient, same date, same time
        // Use a time range to account for any small time differences
        $timeStart = Carbon::parse($validated['date'] . ' ' . $requestedTime)->subMinutes(5);
        $timeEnd = Carbon::parse($validated['date'] . ' ' . $requestedTime)->addMinutes(5);
        
        $existingAppointment = Appointment::where('clinic_id', $clinic->id)
            ->where('patient_id', $patient->id)
            ->whereBetween('scheduled_at', [$timeStart, $timeEnd])
            ->where('appointment_status_id', '!=', 4) // Exclude cancelled
            ->whereNull('deleted_at')
            ->first();

        if ($existingAppointment) {
            Log::warning('Duplicate booking attempt detected', [
                'clinic_id' => $clinic->id,
                'patient_id' => $patient->id,
                'date' => $validated['date'],
                'time' => $requestedTime,
                'existing_appointment_id' => $existingAppointment->id,
            ]);
            return back()
                ->withErrors([
                    'time' => 'You already have an appointment at this time. Please select a different time.',
                    'booking' => 'Booking failed',
                ])
                ->withInput();
        }

        // Find an available dentist for this time slot
        $dentists = User::where('clinic_id', $clinic->id)
            ->where('role', 'dentist')
            ->where('is_active', true)
            ->get();

        $assignedDentist = null;
        foreach ($dentists as $dentist) {
            // Check if this dentist is available at this time
            $dentistSlots = $this->scheduleService->getAvailableSlots(
                $dentist->id,
                $validated['date'],
                $duration,
                $clinic->id
            );

            if (in_array($requestedTime, $dentistSlots)) {
                // Check for conflicts with existing appointments
                $hasConflict = $appointmentService->hasSchedulingConflict(
                    $dentist->id,
                    $scheduledAt->format('Y-m-d H:i:s'),
                    $duration
                );

                if (!$hasConflict) {
                    $assignedDentist = $dentist;
                    break;
                }
            }
        }

        if (!$assignedDentist) {
            Log::warning('No available dentist found for booking', [
                'clinic_id' => $clinic->id,
                'date' => $validated['date'],
                'time' => $requestedTime,
            ]);
            return back()
                ->withErrors([
                    'time' => 'No dentist is available at the selected time. Please choose another time slot.',
                    'booking' => 'Booking failed',
                ])
                ->withInput();
        }

        // Use database transaction with locking to prevent race conditions
        try {
            \DB::beginTransaction();

            // Lock the dentist's appointments row to prevent concurrent bookings
            // This ensures only one booking can proceed at a time for this dentist
            $lockedDentist = User::where('id', $assignedDentist->id)
                ->lockForUpdate()
                ->first();

            if (!$lockedDentist) {
                \DB::rollBack();
                return back()
                    ->withErrors([
                        'time' => 'Dentist is no longer available. Please select another time.',
                        'booking' => 'Booking failed',
                    ])
                    ->withInput();
            }

            // Double-check for conflicts within the transaction (race condition prevention)
            // Check for ANY appointments (different patients) that conflict with this time slot
            // Use a simpler, more reliable overlap check: two time periods overlap if:
            // new_start < existing_end AND new_end > existing_start
            $conflictingAppointment = Appointment::where('assigned_to', $assignedDentist->id)
                ->where('appointment_status_id', '!=', 4) // Exclude cancelled
                ->whereNull('deleted_at')
                ->whereRaw('(scheduled_at < ? AND ended_at > ?)', [
                    $endedAt->format('Y-m-d H:i:s'), // new_end
                    $scheduledAt->format('Y-m-d H:i:s') // new_start
                ])
                ->lockForUpdate() // Lock conflicting appointments
                ->first();

            if ($conflictingAppointment) {
                \DB::rollBack();
                Log::warning('Conflict detected during transaction (different patient)', [
                    'clinic_id' => $clinic->id,
                    'dentist_id' => $assignedDentist->id,
                    'date' => $validated['date'],
                    'time' => $requestedTime,
                    'conflicting_appointment_id' => $conflictingAppointment->id,
                    'conflicting_patient_id' => $conflictingAppointment->patient_id,
                ]);
                return back()
                    ->withErrors([
                        'time' => 'This time slot was just booked by another patient. Please select another time.',
                        'booking' => 'Booking failed',
                    ])
                    ->withInput();
            }

            // Create the appointment
            $appointment = Appointment::create([
                'clinic_id' => $clinic->id,
                'patient_id' => $patient->id,
                'assigned_to' => $assignedDentist->id,
                'scheduled_at' => $scheduledAt->format('Y-m-d H:i:s'),
                'ended_at' => $endedAt->format('Y-m-d H:i:s'),
                'duration' => $duration,
                'appointment_type_id' => $type ? $type->id : 1,
                'appointment_status_id' => $status ? $status->id : 1,
                'is_online_booking' => true,
                'reason' => $validated['reason'],
                'notes' => $validated['notes'] ?? null,
                'service_id' => $validated['service_id'] ?? null,
                'created_by' => $user->id,
                'payment_status' => 'pending',
            ]);

            \DB::commit();

            Log::info('Appointment booked successfully', [
                'appointment_id' => $appointment->id,
                'clinic_id' => $clinic->id,
                'patient_id' => $patient->id,
                'dentist_id' => $assignedDentist->id,
                'scheduled_at' => $scheduledAt->format('Y-m-d H:i:s'),
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            Log::error('Error creating appointment', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'clinic_id' => $clinic->id,
                'patient_id' => $patient->id,
            ]);
            return back()
                ->withErrors([
                    'booking' => 'An error occurred while booking your appointment. Please try again.',
                ])
                ->withInput();
        }

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

        // Return with success message
        // Use Inertia redirect to properly handle flash messages
        return redirect()
            ->route('public.clinics.profile', $clinic->slug)
            ->with('success', 'Appointment request submitted successfully! You will receive a confirmation email shortly.');
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

    /**
     * Get clinic availability status for a date range (for calendar display)
     * Returns availability status for each date: 'available', 'limited', 'full', 'closed'
     */
    public function getAvailabilityStatus(Request $request, Clinic $clinic)
    {
        // Ensure clinic is active and accessible
        if (!$clinic || !$clinic->is_active) {
            return response()->json([
                'success' => false,
                'error' => 'Clinic not available',
                'message' => 'This clinic is not currently accepting appointments.',
            ], 404);
        }

        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'duration' => 'nullable|integer|min:15|max:240',
        ]);

        try {
            $availabilityStatus = $this->scheduleService->getClinicAvailabilityStatus(
                $clinic->id,
                $validated['start_date'],
                $validated['end_date'],
                $validated['duration'] ?? null
            );

            return response()->json([
                'success' => true,
                'availability' => $availabilityStatus,
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting clinic availability status', [
                'error' => $e->getMessage(),
                'clinic_id' => $clinic->id,
                'request' => $validated,
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to get availability status',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get available time slots for a specific date
     * Returns array of available time slots in HH:mm format
     */
    public function getAvailableSlots(Request $request, Clinic $clinic)
    {
        try {
            // Ensure clinic is active and accessible
            if (!$clinic || !$clinic->is_active) {
                return response()->json([
                    'success' => false,
                    'error' => 'Clinic not available',
                    'message' => 'This clinic is not currently accepting appointments.',
                ], 404);
            }

            // Validate date - use more flexible validation for today's date
            $dateInput = $request->input('date');
            
            // Validate and normalize the date
            if (empty($dateInput)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Date is required',
                    'message' => 'Please provide a date.',
                ], 422);
            }

            try {
                // Parse the date input - assume it's in YYYY-MM-DD format
                // Use createFromFormat with explicit timezone to avoid timezone issues
                $appTimezone = config('app.timezone', 'UTC');
                
                // Create date in the app's timezone (Asia/Manila)
                $dateCarbon = Carbon::createFromFormat('Y-m-d', $dateInput, $appTimezone);
                
                if ($dateCarbon === false) {
                    // Fallback to parse if format doesn't match
                    $dateCarbon = Carbon::parse($dateInput)->setTimezone($appTimezone);
                }
                
                // Set to start of day to ensure we're comparing dates only (no time component)
                $dateCarbon = $dateCarbon->startOfDay();
                
                // Get today's date at start of day in the same timezone for comparison
                // Carbon::today() uses the app timezone by default
                $today = Carbon::today($appTimezone)->startOfDay();
                
                // Compare dates as strings to avoid any timezone issues
                // Only reject if date is strictly before today
                // Allow today and future dates (>= today)
                $dateString = $dateCarbon->format('Y-m-d');
                $todayString = $today->format('Y-m-d');
                
                // Log for debugging
                Log::info('Date validation check', [
                    'input' => $dateInput,
                    'parsed_date' => $dateString,
                    'today' => $todayString,
                    'timezone' => $appTimezone,
                    'comparison' => $dateString < $todayString ? 'rejected (past)' : ($dateString === $todayString ? 'today (allowed)' : 'future (allowed)'),
                ]);
                
                if ($dateString < $todayString) {
                    Log::warning('Past date rejected', [
                        'input' => $dateInput,
                        'parsed' => $dateString,
                        'today' => $todayString,
                        'timezone' => $appTimezone,
                    ]);
                    return response()->json([
                        'success' => false,
                        'error' => 'Invalid date',
                        'message' => 'Cannot book appointments for past dates.',
                    ], 422);
                }
                
                // Normalize date to YYYY-MM-DD format
                $normalizedDate = $dateString;
                
            } catch (\Exception $e) {
                Log::error('Date parsing error', [
                    'date_input' => $dateInput,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
                return response()->json([
                    'success' => false,
                    'error' => 'Invalid date format',
                    'message' => 'Please provide a valid date in YYYY-MM-DD format.',
                ], 422);
            }

            $validated = $request->validate([
                'duration' => 'nullable|integer|min:15|max:240',
            ]);
            
            // Use normalized date
            $validated['date'] = $normalizedDate;

            Log::info('Getting available slots', [
                'clinic_id' => $clinic->id,
                'date' => $validated['date'],
                'original_date_input' => $dateInput,
                'duration' => $validated['duration'] ?? null,
            ]);

            try {
                $availableSlots = $this->scheduleService->getClinicAvailableSlots(
                    $clinic->id,
                    $validated['date'],
                    $validated['duration'] ?? null
                );

                // Group slots by period (morning/afternoon) for better UX
                $groupedSlots = $this->groupSlotsByPeriod($availableSlots);

                Log::info('Available slots retrieved', [
                    'clinic_id' => $clinic->id,
                    'date' => $validated['date'],
                    'total_slots' => count($availableSlots),
                    'morning_slots' => count($groupedSlots['morning'] ?? []),
                    'afternoon_slots' => count($groupedSlots['afternoon'] ?? []),
                ]);

                return response()->json([
                    'success' => true,
                    'slots' => $groupedSlots,
                    'all_slots' => $availableSlots,
                    'total_slots' => count($availableSlots),
                ]);
            } catch (\Exception $serviceException) {
                Log::error('Error in scheduleService->getClinicAvailableSlots', [
                    'error' => $serviceException->getMessage(),
                    'trace' => $serviceException->getTraceAsString(),
                    'clinic_id' => $clinic->id,
                    'date' => $validated['date'],
                ]);
                throw $serviceException; // Re-throw to be caught by outer catch
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation error getting available slots', [
                'errors' => $e->errors(),
                'clinic_id' => $clinic->id,
                'request' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'message' => 'Invalid date or duration. Please select a valid date.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error getting available slots', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'clinic_id' => $clinic->id,
                'request' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to get available slots',
                'message' => $e->getMessage(),
                'debug' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null,
            ], 500);
        }
    }

    /**
     * Group time slots by period (morning/afternoon)
     * Morning: up to and including 12:00 PM
     * Afternoon: 1:00 PM and later (excludes lunch time 12:01-12:59)
     */
    private function groupSlotsByPeriod(array $slots): array
    {
        $morning = [];
        $afternoon = [];

        foreach ($slots as $slot) {
            $parts = explode(':', $slot);
            $hour = (int) $parts[0];
            $minute = (int) $parts[1];
            
            // Morning: 00:00 to 12:00 (inclusive)
            if ($hour < 12 || ($hour === 12 && $minute === 0)) {
                $morning[] = $slot;
            } 
            // Afternoon: 13:00 (1:00 PM) and later (lunch time 12:01-12:59 is excluded)
            elseif ($hour >= 13) {
                $afternoon[] = $slot;
            }
            // 12:01-12:59 is excluded (lunch time)
        }

        return [
            'morning' => $morning,
            'afternoon' => $afternoon,
        ];
    }
}
