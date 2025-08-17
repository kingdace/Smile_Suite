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

        // Check if patient has already reviewed this clinic
        if (Review::hasPatientReviewed($clinic->id, $patient->id)) {
            return response()->json(['message' => 'You have already reviewed this clinic.'], 400);
        }

        // Create the review
        $review = Review::create([
            'clinic_id' => $clinic->id,
            'patient_id' => $patient->id,
            'title' => $request->title,
            'content' => $request->content,
            'rating' => $request->rating,
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
