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

        return [
            'total_appointments' => $totalAppointments,
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
     * Get patient satisfaction metrics
     */
    public function getPatientSatisfactionMetrics(Clinic $clinic, string $timeRange = 'week'): array
    {
        $dateRange = $this->getDateRange($timeRange);
        
        // Get average rating for the date range
        $averageRating = Review::where('clinic_id', $clinic->id)
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->approved()
            ->avg('rating') ?? 0;
        
        $totalReviews = Review::where('clinic_id', $clinic->id)
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->count();

        // Get rating distribution
        $ratingDistribution = Review::where('clinic_id', $clinic->id)
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
            ->whereBetween('created_at', [$previousRange['start'], $previousRange['end']])
            ->approved()
            ->avg('rating') ?? 0;
        $ratingTrend = $previousRating > 0 ? (($averageRating - $previousRating) / $previousRating) * 100 : 0;

        return [
            'average_rating' => round($averageRating, 2),
            'total_reviews' => $totalReviews,
            'rating_distribution' => $ratingDistribution,
            'rating_trend' => round($ratingTrend, 2),
            'satisfaction_percentage' => $this->calculateSatisfactionPercentage($ratingDistribution),
            'recent_reviews' => $this->getRecentReviews($clinic, 5)
        ];
    }

    /**
     * Get chart data for dashboard visualizations
     */
    public function getChartData(Clinic $clinic, string $timeRange = 'week'): array
    {
        $dateRange = $this->getDateRange($timeRange);
        
        return [
            'appointment_chart' => $this->getAppointmentChartData($clinic, $dateRange),
            'revenue_chart' => $this->getRevenueChartData($clinic, $dateRange),
            'satisfaction_chart' => $this->getSatisfactionChartData($clinic, $dateRange),
            'service_distribution' => $this->getServiceDistributionData($clinic, $dateRange)
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
            'charts' => $this->getChartData($clinic, $timeRange),
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
            ->select('category', \DB::raw('SUM(amount) as total_revenue'))
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
    private function getAppointmentChartData(Clinic $clinic, array $dateRange): array
    {
        return Appointment::where('clinic_id', $clinic->id)
            ->whereBetween('created_at', [$dateRange['start'], $dateRange['end']])
            ->select(
                \DB::raw('DATE(created_at) as date'),
                \DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
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

            // Convert to the expected format
            $result = [];
            foreach ($serviceDistribution as $name => $count) {
                $result[] = [
                    'name' => $name,
                    'value' => $count
                ];
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
    private function getRevenueChartData(Clinic $clinic, array $dateRange): array
    {
        return Payment::where('clinic_id', $clinic->id)
            ->where('status', 'completed')
            ->whereBetween('payment_date', [$dateRange['start'], $dateRange['end']])
            ->select(
                \DB::raw('DATE(payment_date) as date'),
                \DB::raw('SUM(amount) as revenue')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
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
                \DB::raw('DATE(created_at) as date'),
                \DB::raw('COUNT(*) as count')
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
     * Get recent reviews for the clinic
     */
    private function getRecentReviews(Clinic $clinic, int $limit = 5): array
    {
        return Review::where('clinic_id', $clinic->id)
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
