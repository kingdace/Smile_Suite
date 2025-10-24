<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    protected $activityLogService;

    public function __construct(ActivityLogService $activityLogService)
    {
        $this->activityLogService = $activityLogService;
    }

    /**
     * Display the activity logs index page.
     */
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only clinic admins can access activity logs
        if (!$user->isClinicAdmin()) {
            abort(403, 'Only clinic administrators can view activity logs');
        }

        $clinicId = $user->clinic_id;

        // Get filters from request
        $filters = $request->only([
            'user_id',
            'severity',
            'category',
            'action',
            'date_from',
            'date_to',
            'search',
            'per_page',
        ]);

        // Get per_page parameter, default to 1000 for terminal view
        $perPage = $request->get('per_page', 1000);

        // Get activity logs
        $logs = $this->activityLogService->getLogsForClinic($clinicId, $filters, $perPage);

        // Get statistics
        $stats = $this->activityLogService->getClinicStats($clinicId, 30);

        // Get filter options
        $filterOptions = $this->getFilterOptions($clinicId);

        return Inertia::render('Clinic/ActivityLogs/Index', [
            'logs' => $logs,
            'stats' => $stats,
            'filters' => $filters,
            'filterOptions' => $filterOptions,
            'severityOptions' => [
                ['value' => 'low', 'label' => 'Low'],
                ['value' => 'medium', 'label' => 'Medium'],
                ['value' => 'high', 'label' => 'High'],
                ['value' => 'critical', 'label' => 'Critical'],
            ],
            'categoryOptions' => [
                ['value' => 'patient_management', 'label' => 'Patient Management'],
                ['value' => 'payment_management', 'label' => 'Payment Management'],
                ['value' => 'treatment_management', 'label' => 'Treatment Management'],
                ['value' => 'inventory_management', 'label' => 'Inventory Management'],
                ['value' => 'appointment_management', 'label' => 'Appointment Management'],
                ['value' => 'user_management', 'label' => 'User Management'],
                ['value' => 'system_access', 'label' => 'System Access'],
            ],
            'actionOptions' => [
                ['value' => 'created', 'label' => 'Created'],
                ['value' => 'updated', 'label' => 'Updated'],
                ['value' => 'deleted', 'label' => 'Deleted'],
                ['value' => 'restored', 'label' => 'Restored'],
                ['value' => 'login', 'label' => 'Login'],
                ['value' => 'logout', 'label' => 'Logout'],
                ['value' => 'viewed', 'label' => 'Viewed'],
                ['value' => 'exported', 'label' => 'Exported'],
            ],
        ]);
    }

    /**
     * Show a specific activity log.
     */
    public function show(Request $request, ActivityLog $activityLog)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only clinic admins can access activity logs
        if (!$user->isClinicAdmin()) {
            abort(403, 'Only clinic administrators can view activity logs');
        }

        // Ensure the log belongs to the user's clinic
        if ($activityLog->clinic_id !== $user->clinic_id) {
            abort(403, 'You can only view logs for your own clinic');
        }

        // Load relationships
        $activityLog->load(['user', 'model']);

        return Inertia::render('Clinic/ActivityLogs/Show', [
            'log' => $activityLog,
        ]);
    }

    /**
     * Export activity logs.
     */
    public function export(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only clinic admins can export activity logs
        if (!$user->isClinicAdmin()) {
            abort(403, 'Only clinic administrators can export activity logs');
        }

        $clinicId = $user->clinic_id;
        $format = $request->get('format', 'csv');

        // Get filters
        $filters = $request->only([
            'user_id',
            'severity',
            'category',
            'action',
            'date_from',
            'date_to',
            'search',
        ]);

        // Get logs without pagination for export
        $logs = $this->activityLogService->getLogsForClinic($clinicId, $filters, 10000);

        // Log the export action
        $this->activityLogService->logCustom(
            action: 'exported',
            description: "Exported activity logs in {$format} format",
            category: ActivityLog::CATEGORY_SYSTEM_ACCESS,
            severity: ActivityLog::SEVERITY_MEDIUM
        );

        return $this->generateExport($logs->items(), $format);
    }

    /**
     * Get activity statistics.
     */
    public function stats(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Only clinic admins can view statistics
        if (!$user->isClinicAdmin()) {
            abort(403, 'Only clinic administrators can view activity statistics');
        }

        $clinicId = $user->clinic_id;
        $days = $request->get('days', 30);

        $stats = $this->activityLogService->getClinicStats($clinicId, $days);

        return response()->json($stats);
    }

    /**
     * Get filter options for the UI.
     */
    private function getFilterOptions(int $clinicId): array
    {
        // Get users for filter
        $users = \App\Models\User::where('clinic_id', $clinicId)
            ->select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'value' => $user->id,
                    'label' => "{$user->name} ({$user->role})",
                ];
            });

        return [
            'users' => $users,
        ];
    }

    /**
     * Generate export file.
     */
    private function generateExport(array $logs, string $format)
    {
        switch ($format) {
            case 'csv':
                return $this->exportToCsv($logs);
            case 'excel':
                return $this->exportToExcel($logs);
            default:
                abort(400, 'Unsupported export format');
        }
    }

    /**
     * Export to CSV.
     */
    private function exportToCsv(array $logs)
    {
        $filename = 'activity_logs_' . now()->format('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($logs) {
            $file = fopen('php://output', 'w');

            // CSV headers
            fputcsv($file, [
                'Date',
                'User',
                'Action',
                'Description',
                'Category',
                'Severity',
                'Model Type',
                'Model ID',
                'IP Address',
            ]);

            // CSV data
            foreach ($logs as $log) {
                fputcsv($file, [
                    $log->created_at->format('Y-m-d H:i:s'),
                    $log->user->name ?? 'Unknown',
                    $log->action,
                    $log->description,
                    $log->category,
                    $log->severity,
                    $log->model_type,
                    $log->model_id,
                    $log->ip_address,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export to Excel.
     */
    private function exportToExcel(array $logs)
    {
        // This would require Laravel Excel package
        // For now, return CSV
        return $this->exportToCsv($logs);
    }
}
