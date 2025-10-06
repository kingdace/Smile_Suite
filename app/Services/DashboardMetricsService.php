<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Payment;
use App\Models\Review;
use App\Models\Clinic;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardMetricsService
{
    /**
     * Get comprehensive revenue metrics for a clinic within a time range
     */
    public function getRevenueMetrics(Clinic $clinic, string $timeRange = 'week'): array
    {
        $dateRange = $this->getDateRange($timeRange);

        // Get current period revenue
        $currentRevenue = Payment::where('clinic_id', $clinic->id)
            ->where('status', 'completed')
            ->whereBetween('payment_date', [$dateRange['start'], $dateRange['end']])
            ->sum('amount');

        // Get previous period for comparison
        $previousRange = $this->getPreviousDateRange($timeRange);
        $previousRevenue = Payment::where('clinic_id', $clinic->id)
            ->where('status', 'completed')
            ->whereBetween('payment_date', [$previousRange['start'], $previousRange['end']])
            ->sum('amount');

        // Calculate trend
        $trend = $previousRevenue > 0
            ? (($currentRevenue - $previousRevenue) / $previousRevenue) * 100
            : 0;

        // Get payment trends using existing method
        $days = $dateRange['start']->diffInDays($dateRange['end']);
        $paymentTrends = Payment::getPaymentTrends($clinic->id, $days);

        return [
            'current_revenue' => $currentRevenue,
            'previous_revenue' => $previousRevenue,
            'trend_percentage' => round($trend, 2),
            'trend_direction' => $trend >= 0 ? 'up' : 'down',
            'payment_trends' => $paymentTrends,
            'average_transaction' => $this->getAverageTransactionValue($clinic, $dateRange),
            'revenue_by_service' => $this->getRevenueByService($clinic, $dateRange)
        ];
    }

    /**
     * Get appointment efficiency metrics
     */
    public function getAppointmentEfficiency(Clinic $clinic, string $timeRange = 'week'): array
    {
        $dateRange = $this->getDateRange($timeRange);

        $totalAppointments = Appointment::where('clinic_id', $clinic->id)
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->count();

        $confirmedAppointments = Appointment::where('clinic_id', $clinic->id)
            ->whereHas('status', function($query) {
                $query->where('name', 'Confirmed');
            })
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->count();

        $completedAppointments = Appointment::where('clinic_id', $clinic->id)
            ->whereHas('status', function($query) {
                $query->where('name', 'Completed');
            })
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->count();

        $cancelledAppointments = Appointment::where('clinic_id', $clinic->id)
            ->whereHas('status', function($query) {
                $query->where('name', 'Cancelled');
            })
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->count();

        // Calculate efficiency metrics
        $confirmationRate = $totalAppointments > 0 ? ($confirmedAppointments / $totalAppointments) * 100 : 0;
        $completionRate = $totalAppointments > 0 ? ($completedAppointments / $totalAppointments) * 100 : 0;
        $cancellationRate = $totalAppointments > 0 ? ($cancelledAppointments / $totalAppointments) * 100 : 0;

        // Get average wait time (assuming appointments have scheduled_at and actual_start_time)
        $averageWaitTime = $this->getAverageWaitTime($clinic, $dateRange);

        // Get previous period data for comparison
        $previousRange = $this->getPreviousDateRange($timeRange);
        $previousTotalAppointments = Appointment::where('clinic_id', $clinic->id)
            ->whereBetween('created_at', [$previousRange['start'], $previousRange['end']])
            ->count();

        // Calculate trend
        $trend = $previousTotalAppointments > 0
            ? (($totalAppointments - $previousTotalAppointments) / $previousTotalAppointments) * 100
            : 0;

        return [
            'total_appointments' => $totalAppointments,
            'previous_appointments' => $previousTotalAppointments,
            'trend_percentage' => round($trend, 2),
            'trend_direction' => $trend >= 0 ? 'up' : 'down',
            'confirmed_appointments' => $confirmedAppointments,
            'completed_appointments' => $completedAppointments,
            'cancelled_appointments' => $cancelledAppointments,
            'confirmation_rate' => round($confirmationRate, 2),
            'completion_rate' => round($completionRate, 2),
            'cancellation_rate' => round($cancellationRate, 2),
            'average_wait_time' => $averageWaitTime,
            'appointment_trends' => $this->getAppointmentTrends($clinic, $dateRange)
        ];
    }

    /**
     * Get patient satisfaction metrics (clinic reviews only)
     */
public function getPatientSatisfactionMetrics(Clinic $clinic, string $timeRange = 'week'): array
    {
        $dateRange = $this->getDateRange($timeRange);

        // Get average rating for clinic reviews only (staff_id is null)
        $averageRating = Review::where('clinic_id', $clinic->id)
            ->whereNull('staff_id') // Only clinic reviews
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->approved()
            ->avg('rating') ?? 0;

        $totalReviews = Review::where('clinic_id', $clinic->id)
            ->whereNull('staff_id') // Only clinic reviews
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->count();

        // Get rating distribution for clinic reviews only
        $ratingDistribution = Review::where('clinic_id', $clinic->id)
            ->whereNull('staff_id') // Only clinic reviews
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->select('rating', DB::raw('count(*) as count'))
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->get()
            ->pluck('count', 'rating')
            ->toArray();

        // Calculate satisfaction trend
        $previousRange = $this->getPreviousDateRange($timeRange);
        $previousRating = Review::where('clinic_id', $clinic->id)
            ->whereNull('staff_id') // Only clinic reviews
            ->whereBetween('created_at', [$previousRange['start'], $previousRange['end']])
            ->approved()
            ->avg('rating') ?? 0;
        $ratingTrend = $previousRating > 0 ? (($averageRating - $previousRating) / $previousRating) * 100 : 0;

        return [
            'average_rating' => round($averageRating, 2),
            'previous_rating' => round($previousRating, 2),
            'trend_percentage' => round($ratingTrend, 2),
            'trend_direction' => $ratingTrend >= 0 ? 'up' : 'down',
            'total_reviews' => $totalReviews,
            'rating_distribution' => $ratingDistribution,
            'rating_trend' => round($ratingTrend, 2),
            'satisfaction_percentage' => $this->calculateSatisfactionPercentage($ratingDistribution),
            'recent_reviews' => $this->getRecentClinicReviews($clinic, 5)
        ];
    }

    /**
     * Get chart data for dashboard visualizations
     */
    public function getChartData(Clinic $clinic, string $timeRange = 'week'): array
    {
        $dateRange = $this->getDateRange($timeRange);

        return [
            'appointment_chart' => $this->getAppointmentChartData($clinic, $dateRange, $timeRange),
            'revenue_chart' => $this->getRevenueChartData($clinic, $dateRange, $timeRange),
            'satisfaction_chart' => $this->getSatisfactionChartData($clinic, $dateRange),
            'service_distribution' => $this->getServiceDistributionData($clinic, $dateRange)
        ];
    }

    /**
     * Get staff performance metrics (doctor reviews only)
     */
    public function getStaffPerformanceMetrics(Clinic $clinic, string $timeRange = 'week'): array
    {
        $dateRange = $this->getDateRange($timeRange);

        // Get all doctors for this clinic
        $doctors = \App\Models\User::where('clinic_id', $clinic->id)
            ->where('role', 'dentist')
            ->get();

        $staffPerformance = [];
        $totalDoctorRating = 0;
        $totalDoctorReviews = 0;

        foreach ($doctors as $doctor) {
            // Get doctor's average rating
            $doctorRating = Review::where('clinic_id', $clinic->id)
                ->where('staff_id', $doctor->id)
                ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
                ->approved()
                ->avg('rating') ?? 0;

            $doctorReviewCount = Review::where('clinic_id', $clinic->id)
                ->where('staff_id', $doctor->id)
                ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
                ->count();

            if ($doctorReviewCount > 0) {
                $totalDoctorRating += $doctorRating * $doctorReviewCount;
                $totalDoctorReviews += $doctorReviewCount;
            }

            $staffPerformance[] = [
                'id' => $doctor->id,
                'name' => $doctor->name,
                'average_rating' => round($doctorRating, 2),
                'review_count' => $doctorReviewCount,
                'profile_photo' => $doctor->profile_photo,
                'specialties' => $doctor->specialties ?? []
            ];
        }

        // Calculate overall average for all doctors
        $overallAverage = $totalDoctorReviews > 0 ? $totalDoctorRating / $totalDoctorReviews : 0;

        // Sort by rating (highest first)
        usort($staffPerformance, function($a, $b) {
            return $b['average_rating'] <=> $a['average_rating'];
        });

        return [
            'overall_average_rating' => round($overallAverage, 2),
            'total_doctor_reviews' => $totalDoctorReviews,
            'staff_performance' => $staffPerformance,
            'top_performers' => array_slice($staffPerformance, 0, 3) // Top 3 doctors
        ];
    }

    /**
     * Get comprehensive dashboard metrics
     */
    public function getAllMetrics(Clinic $clinic, string $timeRange = 'week'): array
    {
        return [
            'revenue' => $this->getRevenueMetrics($clinic, $timeRange),
            'appointments' => $this->getAppointmentEfficiency($clinic, $timeRange),
            'satisfaction' => $this->getPatientSatisfactionMetrics($clinic, $timeRange),
            'staff_performance' => $this->getStaffPerformanceMetrics($clinic, $timeRange),
            'charts' => $this->getChartData($clinic, $timeRange),
            'patient_demographics' => $this->getPatientDemographics($clinic),
            'treatment_success' => $this->getTreatmentSuccessMetrics($clinic),
            'peak_hours' => $this->getPeakHoursAnalysis($clinic),
            'time_range' => $timeRange,
            'date_range' => $this->getDateRange($timeRange)
        ];
    }

    /**
     * Get date range based on time range string
     */
    private function getDateRange(string $timeRange): array
    {
        $end = Carbon::now();

        switch ($timeRange) {
            case 'today':
                $start = Carbon::today();
                break;
            case 'week':
                $start = Carbon::now()->startOfWeek();
                break;
            case 'month':
                $start = Carbon::now()->startOfMonth();
                break;
            case 'quarter':
                $start = Carbon::now()->startOfQuarter();
                break;
            case 'year':
                $start = Carbon::now()->startOfYear();
                break;
            default:
                $start = Carbon::now()->startOfWeek();
        }

        return ['start' => $start, 'end' => $end];
    }

    /**
     * Get previous date range for comparison
     */
    private function getPreviousDateRange(string $timeRange): array
    {
        $current = $this->getDateRange($timeRange);
        $diff = $current['end']->diffInDays($current['start']);

        return [
            'start' => $current['start']->copy()->subDays($diff + 1),
            'end' => $current['start']->copy()->subDay()
        ];
    }

    /**
     * Get patient demographics data
     */
    private function getPatientDemographics(Clinic $clinic): array
    {
        try {
            $patients = \App\Models\Patient::where('clinic_id', $clinic->id)
                ->whereNotNull('date_of_birth')
                ->get();

            $totalPatients = $patients->count();

            if ($totalPatients === 0) {
                return [
                    'age_0_18' => ['count' => 0, 'percentage' => 0],
                    'age_19_35' => ['count' => 0, 'percentage' => 0],
                    'age_36_50' => ['count' => 0, 'percentage' => 0],
                    'age_51_65' => ['count' => 0, 'percentage' => 0],
                    'age_65_plus' => ['count' => 0, 'percentage' => 0],
                    'total_patients' => 0
                ];
            }

            $ageGroups = [
                'age_0_18' => 0,
                'age_19_35' => 0,
                'age_36_50' => 0,
                'age_51_65' => 0,
                'age_65_plus' => 0
            ];

            foreach ($patients as $patient) {
                $age = Carbon::parse($patient->date_of_birth)->age;

                if ($age <= 18) {
                    $ageGroups['age_0_18']++;
                } elseif ($age <= 35) {
                    $ageGroups['age_19_35']++;
                } elseif ($age <= 50) {
                    $ageGroups['age_36_50']++;
                } elseif ($age <= 65) {
                    $ageGroups['age_51_65']++;
                } else {
                    $ageGroups['age_65_plus']++;
                }
            }

            return [
                'age_0_18' => [
                    'count' => $ageGroups['age_0_18'],
                    'percentage' => round(($ageGroups['age_0_18'] / $totalPatients) * 100, 1)
                ],
                'age_19_35' => [
                    'count' => $ageGroups['age_19_35'],
                    'percentage' => round(($ageGroups['age_19_35'] / $totalPatients) * 100, 1)
                ],
                'age_36_50' => [
                    'count' => $ageGroups['age_36_50'],
                    'percentage' => round(($ageGroups['age_36_50'] / $totalPatients) * 100, 1)
                ],
                'age_51_65' => [
                    'count' => $ageGroups['age_51_65'],
                    'percentage' => round(($ageGroups['age_51_65'] / $totalPatients) * 100, 1)
                ],
                'age_65_plus' => [
                    'count' => $ageGroups['age_65_plus'],
                    'percentage' => round(($ageGroups['age_65_plus'] / $totalPatients) * 100, 1)
                ],
                'total_patients' => $totalPatients
            ];
        } catch (\Exception $e) {
            return [
                'age_0_18' => ['count' => 0, 'percentage' => 0],
                'age_19_35' => ['count' => 0, 'percentage' => 0],
                'age_36_50' => ['count' => 0, 'percentage' => 0],
                'age_51_65' => ['count' => 0, 'percentage' => 0],
                'age_65_plus' => ['count' => 0, 'percentage' => 0],
                'total_patients' => 0
            ];
        }
    }

    /**
     * Get treatment success metrics
     */
    private function getTreatmentSuccessMetrics(Clinic $clinic): array
    {
        try {
            $totalAppointments = Appointment::where('clinic_id', $clinic->id)->count();
            $completedAppointments = Appointment::where('clinic_id', $clinic->id)
                ->where('appointment_status_id', 3) // 3 = Completed
                ->count();
            $cancelledAppointments = Appointment::where('clinic_id', $clinic->id)
                ->where('appointment_status_id', 4) // 4 = Cancelled
                ->count();
            $noShowAppointments = Appointment::where('clinic_id', $clinic->id)
                ->where('appointment_status_id', 5) // 5 = No Show
                ->count();

            $successRate = $totalAppointments > 0 ? round(($completedAppointments / $totalAppointments) * 100, 1) : 0;

            return [
                'total_appointments' => $totalAppointments,
                'completed_appointments' => $completedAppointments,
                'cancelled_appointments' => $cancelledAppointments,
                'no_show_appointments' => $noShowAppointments,
                'success_rate' => $successRate,
                'completion_rate' => $totalAppointments > 0 ? round(($completedAppointments / $totalAppointments) * 100, 1) : 0,
                'cancellation_rate' => $totalAppointments > 0 ? round(($cancelledAppointments / $totalAppointments) * 100, 1) : 0,
                'no_show_rate' => $totalAppointments > 0 ? round(($noShowAppointments / $totalAppointments) * 100, 1) : 0
            ];
        } catch (\Exception $e) {
            return [
                'total_appointments' => 0,
                'completed_appointments' => 0,
                'cancelled_appointments' => 0,
                'no_show_appointments' => 0,
                'success_rate' => 0,
                'completion_rate' => 0,
                'cancellation_rate' => 0,
                'no_show_rate' => 0
            ];
        }
    }

    /**
     * Get peak hours analysis
     */
    private function getPeakHoursAnalysis(Clinic $clinic): array
    {
        try {
            $appointments = Appointment::where('clinic_id', $clinic->id)
                ->whereNotNull('scheduled_at')
                ->get();

            $hourlyData = [];
            for ($hour = 0; $hour < 24; $hour++) {
                $hourlyData[$hour] = 0;
            }

            foreach ($appointments as $appointment) {
                $hour = Carbon::parse($appointment->scheduled_at)->hour;
                $hourlyData[$hour]++;
            }

            // Find peak hour
            $peakHour = array_keys($hourlyData, max($hourlyData))[0];
            $peakCount = max($hourlyData);

            // Find top 3 busiest hours
            arsort($hourlyData);
            $topHours = array_slice($hourlyData, 0, 3, true);

            $topHoursFormatted = [];
            foreach ($topHours as $hour => $count) {
                $timeRange = $hour . ':00-' . ($hour + 1) . ':00';
                $topHoursFormatted[] = [
                    'time' => $timeRange,
                    'count' => $count,
                    'percentage' => $appointments->count() > 0 ? round(($count / $appointments->count()) * 100, 1) : 0
                ];
            }

            return [
                'peak_hour' => $peakHour,
                'peak_hour_formatted' => $peakHour . ':00-' . ($peakHour + 1) . ':00',
                'peak_count' => $peakCount,
                'total_appointments' => $appointments->count(),
                'top_hours' => $topHoursFormatted,
                'average_per_hour' => $appointments->count() > 0 ? round($appointments->count() / 24, 1) : 0
            ];
        } catch (\Exception $e) {
            return [
                'peak_hour' => 9,
                'peak_hour_formatted' => '9:00-10:00',
                'peak_count' => 0,
                'total_appointments' => 0,
                'top_hours' => [],
                'average_per_hour' => 0
            ];
        }
    }

    /**
     * Get average transaction value
     */
    private function getAverageTransactionValue(Clinic $clinic, array $dateRange): float
    {
        return Payment::where('clinic_id', $clinic->id)
            ->where('status', 'completed')
            ->whereBetween('payment_date', [$dateRange['start'], $dateRange['end']])
            ->avg('amount') ?? 0;
    }

    /**
     * Get revenue breakdown by service
     */
    private function getRevenueByService(Clinic $clinic, array $dateRange): array
    {
        return Payment::where('clinic_id', $clinic->id)
            ->where('status', 'completed')
            ->whereBetween('payment_date', [$dateRange['start'], $dateRange['end']])
            ->select('category', DB::raw('SUM(amount) as total_revenue'))
            ->groupBy('category')
            ->get()
            ->toArray();
    }

    /**
     * Get satisfaction chart data
     */
    private function getSatisfactionChartData(Clinic $clinic, array $dateRange): array
    {
        return Review::where('clinic_id', $clinic->id)
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('AVG(rating) as avg_rating')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'rating' => round((float) $item->avg_rating, 2)
                ];
            })
            ->toArray();
    }

    /**
     * Get appointment chart data
     */
    private function getAppointmentChartData(Clinic $clinic, array $dateRange, string $timeRange = 'week'): array
    {
        $query = Appointment::where('clinic_id', $clinic->id)
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']]);

        // For year range, group by months for better visualization
        if ($timeRange === 'year') {
            $data = $query->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                $monthName = Carbon::create()->month($item->month)->format('M');
                return [
                    'x' => $monthName,
                    'y' => $item->count
                ];
            })
            ->toArray();
        } else {
            // For other ranges, group by days
            $data = $query->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'x' => Carbon::parse($item->date)->format('M j'),
                    'y' => $item->count
                ];
            })
            ->toArray();
        }

        return [
            [
                'id' => 'appointments',
                'data' => $data
            ]
        ];
    }

    /**
     * Get service distribution data
     */
    private function getServiceDistributionData(Clinic $clinic, array $dateRange): array
    {
        try {
            $appointments = Appointment::where('clinic_id', $clinic->id)
                ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
                ->whereNotNull('service_id')
                ->with('service')
                ->get();

            $serviceDistribution = [];
            foreach ($appointments as $appointment) {
                if ($appointment->service) {
                    $serviceName = $appointment->service->name;
                    if (!isset($serviceDistribution[$serviceName])) {
                        $serviceDistribution[$serviceName] = 0;
                    }
                    $serviceDistribution[$serviceName]++;
                }
            }

            // Convert to the expected format for pie chart
            $result = [];
            $colors = ['#3B82F6', '#1D4ED8', '#1E40AF', '#1E3A8A', '#1E3A8A', '#1E3A8A'];
            $colorIndex = 0;

            foreach ($serviceDistribution as $name => $count) {
                $result[] = [
                    'id' => $name,
                    'value' => $count,
                    'color' => $colors[$colorIndex % count($colors)]
                ];
                $colorIndex++;
            }

            // Sort by count descending
            usort($result, function ($a, $b) {
                return $b['value'] - $a['value'];
            });

            return $result;
        } catch (\Exception $e) {
            // Return empty array if there's an error
            return [];
        }
    }

    /**
     * Get revenue chart data
     */
    private function getRevenueChartData(Clinic $clinic, array $dateRange, string $timeRange = 'week'): array
    {
        $query = Payment::where('clinic_id', $clinic->id)
            ->where('status', 'completed')
            ->whereBetween('payment_date', [$dateRange['start'], $dateRange['end']]);

        // For year range, group by months for better visualization
        if ($timeRange === 'year') {
            $data = $query->select(
                DB::raw('YEAR(payment_date) as year'),
                DB::raw('MONTH(payment_date) as month'),
                DB::raw('SUM(amount) as revenue')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                $monthName = Carbon::create()->month($item->month)->format('M');
                return [
                    'x' => $monthName,
                    'y' => (float) $item->revenue
                ];
            })
            ->toArray();
        } else {
            // For other ranges, group by days
            $data = $query->select(
                DB::raw('DATE(payment_date) as date'),
                DB::raw('SUM(amount) as revenue')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'x' => Carbon::parse($item->date)->format('M j'),
                    'y' => (float) $item->revenue
                ];
            })
            ->toArray();
        }

        return [
            [
                'id' => 'revenue',
                'data' => $data
            ]
        ];
    }

    /**
     * Get average wait time for appointments
     */
    private function getAverageWaitTime(Clinic $clinic, array $dateRange): float
    {
        // Since we don't have actual_start_time, we'll return 0 for now
        // This can be enhanced when actual wait time tracking is implemented
        return 0.0;
    }

    /**
     * Get appointment trends data
     */
    private function getAppointmentTrends(Clinic $clinic, array $dateRange): array
    {
        return Appointment::where('clinic_id', $clinic->id)
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
    }

    /**
     * Calculate satisfaction percentage from rating distribution
     */
    private function calculateSatisfactionPercentage(array $ratingDistribution): float
    {
        $totalReviews = array_sum($ratingDistribution);
        if ($totalReviews === 0) return 0;

        // Consider ratings 4 and 5 as satisfied
        $satisfiedReviews = ($ratingDistribution[4] ?? 0) + ($ratingDistribution[5] ?? 0);
        return round(($satisfiedReviews / $totalReviews) * 100, 2);
    }

    /**
     * Get recent clinic reviews (clinic reviews only)
     */
    private function getRecentClinicReviews(Clinic $clinic, int $limit = 5): array
    {
        return Review::where('clinic_id', $clinic->id)
            ->whereNull('staff_id') // Only clinic reviews
            ->with('patient:id,first_name,last_name')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'patient_name' => $review->patient ? $review->patient->first_name . ' ' . $review->patient->last_name : 'Anonymous',
                    'created_at' => $review->created_at->format('M d, Y')
                ];
            })
            ->toArray();
    }
}
