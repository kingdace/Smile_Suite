<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\Review;
use App\Models\Patient;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Check if the authenticated user has an appointment with this clinic.
     */
    public function checkAppointment(Clinic $clinic)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'patient') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Find patient record for this user at this clinic
        $patient = Patient::where('user_id', $user->id)
            ->where('clinic_id', $clinic->id)
            ->first();

        if (!$patient) {
            return response()->json(['has_appointment' => false]);
        }

        // Check if patient has any appointments with this clinic
        $hasAppointment = Appointment::where('patient_id', $patient->id)
            ->where('clinic_id', $clinic->id)
            ->exists();

        return response()->json(['has_appointment' => $hasAppointment]);
    }

    /**
     * Store a new review for a clinic.
     */
    public function store(Request $request, Clinic $clinic)
    {
        // Only allow logged-in patients
        $user = Auth::user();
        if (!$user || $user->role !== 'patient') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|between:1,5',
            'title' => 'nullable|string|max:255',
            'content' => 'required|string|min:10|max:1000',
            'staff_id' => 'nullable|exists:users,id',
            'professionalism_rating' => 'nullable|integer|between:1,5',
            'communication_rating' => 'nullable|integer|between:1,5',
            'treatment_quality_rating' => 'nullable|integer|between:1,5',
            'bedside_manner_rating' => 'nullable|integer|between:1,5',
            'comment' => 'nullable|string|max:200',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

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

        // Validate staff_id if provided (must be a dentist from this clinic)
        if ($request->staff_id) {
            $staff = \App\Models\User::where('id', $request->staff_id)
                ->where('clinic_id', $clinic->id)
                ->where('role', 'dentist')
                ->first();

            if (!$staff) {
                return response()->json(['message' => 'Invalid doctor selected.'], 400);
            }
        }

        // Check if patient has already reviewed this clinic or doctor
        if ($request->staff_id) {
            if (Review::hasPatientReviewedDoctor($clinic->id, $patient->id, $request->staff_id)) {
                return response()->json(['message' => 'You have already reviewed this doctor.'], 400);
            }
        } else {
            if (Review::hasPatientReviewed($clinic->id, $patient->id)) {
                return response()->json(['message' => 'You have already reviewed this clinic.'], 400);
            }
        }

        // Create the review
        $review = Review::create([
            'clinic_id' => $clinic->id,
            'patient_id' => $patient->id,
            'staff_id' => $request->staff_id,
            'title' => $request->title,
            'content' => $request->content,
            'rating' => $request->rating,
            'professionalism_rating' => $request->professionalism_rating,
            'communication_rating' => $request->communication_rating,
            'treatment_quality_rating' => $request->treatment_quality_rating,
            'bedside_manner_rating' => $request->bedside_manner_rating,
            'comment' => $request->comment,
            'source' => 'internal',
            'status' => 'approved', // Auto-approve for now
            'review_date' => now(),
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'review' => $review->load('patient.user')
        ], 201);
    }

    /**
     * Get reviews for a clinic.
     */
    public function index(Clinic $clinic)
    {
        $reviews = $clinic->reviews()
            ->with(['patient.user'])
            ->approved()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $averageRating = Review::getAverageRating($clinic->id);
        $reviewCount = Review::getReviewCount($clinic->id);
        $ratingDistribution = Review::getRatingDistribution($clinic->id);

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => round($averageRating, 1),
            'review_count' => $reviewCount,
            'rating_distribution' => $ratingDistribution,
        ]);
    }

    /**
     * Get reviews for a specific doctor.
     */
    public function getDoctorReviews(Clinic $clinic, $doctorId)
    {
        // Validate that the doctor belongs to this clinic
        $doctor = \App\Models\User::where('id', $doctorId)
            ->where('clinic_id', $clinic->id)
            ->where('role', 'dentist')
            ->first();

        if (!$doctor) {
            return response()->json(['message' => 'Doctor not found.'], 404);
        }

        $reviews = Review::where('clinic_id', $clinic->id)
            ->where('staff_id', $doctorId)
            ->with(['patient.user'])
            ->approved()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $averageRating = Review::getDoctorAverageRating($doctorId);
        $reviewCount = Review::getDoctorReviewCount($doctorId);
        $categoryRatings = Review::getDoctorCategoryRatings($doctorId);

        return response()->json([
            'doctor' => $doctor,
            'reviews' => $reviews,
            'average_rating' => round($averageRating, 1),
            'review_count' => $reviewCount,
            'category_ratings' => $categoryRatings,
        ]);
    }

    /**
     * Get all doctors for a clinic with their review stats.
     */
    public function getClinicDoctors(Clinic $clinic)
    {
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

        return response()->json([
            'doctors' => $doctors
        ]);
    }

    /**
     * Mark a review as helpful.
     */
    public function markHelpful(Review $review)
    {
        $review->increment('helpful_count');

        return response()->json([
            'message' => 'Review marked as helpful.',
            'helpful_count' => $review->helpful_count
        ]);
    }

    /**
     * Report a review.
     */
    public function report(Review $review)
    {
        $review->increment('reported_count');

        // If review gets too many reports, mark for review
        if ($review->reported_count >= 5) {
            $review->update(['status' => 'pending']);
        }

        return response()->json([
            'message' => 'Review reported successfully.'
        ]);
    }
}
