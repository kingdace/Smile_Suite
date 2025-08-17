<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\AppointmentType;
use App\Models\AppointmentStatus;
use App\Models\Review;

class ClinicDirectoryController extends Controller
{
    public function landing()
    {
        return Inertia::render('Public/Landing');
    }

    public function index()
    {
        $clinics = Clinic::select(
            'id', 'name', 'slug', 'street_address', 'barangay_code', 'city_municipality_code',
            'province_code', 'region_code', 'address_details', 'logo_url', 'description',
            'contact_number', 'email'
        )
            ->where('is_active', true)
            ->whereHas('users', function($query) {
                $query->where('role', 'clinic_admin');
            })
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
            $query->with(['patient.user'])->approved()->orderBy('created_at', 'desc')->limit(5);
        }]);

        // Get review statistics
        $averageRating = Review::getAverageRating($clinic->id);
        $reviewCount = Review::getReviewCount($clinic->id);

        return Inertia::render('Public/Clinics/Profile', [
            'clinic' => array_merge($clinic->toArray(), [
                'gallery_images' => $clinic->galleryImages ? $clinic->galleryImages->values()->toArray() : [],
                'services' => $clinic->services ? $clinic->services->values()->toArray() : [],
                'staff' => $clinic->users ? $clinic->users->values()->toArray() : [],
                'reviews' => $clinic->reviews ? $clinic->reviews->values()->toArray() : [],
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
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required',
            'reason' => 'required|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Find or create patient record for this user at this clinic
        $patient = Patient::firstOrCreate(
            [
                'user_id' => $user->id,
                'clinic_id' => $clinic->id,
            ],
            [
                'first_name' => $user->name,
                'last_name' => '',
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
            'created_by' => $user->id,
            'payment_status' => 'pending',
        ]);

        return response()->json(['message' => 'Appointment request submitted successfully.'], 201);
    }
}
