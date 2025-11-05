<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->middleware(['auth', 'verified']);
        $this->notificationService = $notificationService;
    }

    /**
     * Get notifications for the authenticated user
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->clinic_id) {
            Log::info('NotificationController: User or clinic_id missing', [
                'user_id' => $user->id ?? null,
                'clinic_id' => $user->clinic_id ?? null,
            ]);
            return response()->json([
                'notifications' => [],
                'unread_count' => 0,
            ]);
        }

        $limit = $request->get('limit', 10);
        $unreadOnly = $request->get('unread_only', false);

        // DEBUG: Check total notifications for clinic
        $totalForClinic = \App\Models\Notification::forClinic($user->clinic_id)->count();
        $totalForUser = \App\Models\Notification::forClinic($user->clinic_id)
            ->forUser($user)
            ->count();
        $totalNotExpired = \App\Models\Notification::forClinic($user->clinic_id)
            ->forUser($user)
            ->notExpired()
            ->count();

        Log::info('NotificationController: Query stats', [
            'user_id' => $user->id,
            'user_role' => $user->role,
            'clinic_id' => $user->clinic_id,
            'total_for_clinic' => $totalForClinic,
            'total_for_user' => $totalForUser,
            'total_not_expired' => $totalNotExpired,
        ]);

        $notifications = $this->notificationService->getNotificationsForUser($user, $limit, $unreadOnly);
        $unreadCount = $this->notificationService->getUnreadCountForUser($user);

        Log::info('NotificationController: Results', [
            'notifications_count' => $notifications->count(),
            'unread_count' => $unreadCount,
        ]);

        // Check queue worker status (if queue connection is database)
        $queueJobsPending = 0;
        $queueJobsFailed = 0;
        $failedJobsDetails = [];
        try {
            if (config('queue.default') === 'database') {
                $queueJobsPending = DB::table('jobs')->count();
                $queueJobsFailed = DB::table('failed_jobs')->where('failed_at', '>=', now()->subDay())->count();

                // Get details of recent failed jobs
                if ($queueJobsFailed > 0) {
                    $recentFailed = DB::table('failed_jobs')
                        ->where('failed_at', '>=', now()->subDay())
                        ->orderBy('failed_at', 'desc')
                        ->limit(3)
                        ->get(['uuid', 'queue', 'exception', 'failed_at']);

                    foreach ($recentFailed as $job) {
                        $failedJobsDetails[] = [
                            'uuid' => $job->uuid,
                            'queue' => $job->queue,
                            'failed_at' => $job->failed_at,
                            'exception_preview' => substr($job->exception, 0, 200), // First 200 chars
                        ];
                    }
                }
            }
        } catch (\Exception $e) {
            // Queue tables might not exist, ignore
            Log::debug('Queue status check failed (tables may not exist)', [
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
            '_debug' => [
                'total_for_clinic' => $totalForClinic,
                'total_for_user' => $totalForUser,
                'total_not_expired' => $totalNotExpired,
                'user_role' => $user->role,
                'queue_status' => [
                    'pending_jobs' => $queueJobsPending,
                    'failed_jobs_today' => $queueJobsFailed,
                    'queue_driver' => config('queue.default'),
                    'failed_jobs_details' => $failedJobsDetails,
                ],
            ],
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        $user = Auth::user();

        $success = $this->notificationService->markAsRead($id, $user);

        return response()->json([
            'success' => $success,
            'message' => $success ? 'Notification marked as read' : 'Notification not found or access denied',
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        $user = Auth::user();

        $count = $this->notificationService->markAllAsRead($user);

        return response()->json([
            'success' => true,
            'message' => "Marked {$count} notifications as read",
            'count' => $count,
        ]);
    }

    /**
     * Get notification statistics
     */
    public function stats(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->clinic_id) {
            return response()->json([
                'total' => 0,
                'unread' => 0,
                'by_type' => [],
                'by_priority' => [],
            ]);
        }

        $notifications = $this->notificationService->getNotificationsForUser($user, 1000);

        $stats = [
            'total' => $notifications->count(),
            'unread' => $notifications->where('is_read', false)->count(),
            'by_type' => $notifications->groupBy('type')->map->count(),
            'by_priority' => $notifications->groupBy('priority')->map->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Show the notifications page
     */
    public function page(Request $request, $clinic)
    {
        $user = Auth::user();

        if (!$user || !$user->clinic_id) {
            return redirect()->route('clinic.dashboard', ['clinic' => $user->clinic_id]);
        }

        // Get filters from request
        $filters = $request->only(['search', 'type', 'status', 'priority']);

        // Build query for notifications
        $query = Notification::forClinic($user->clinic_id)
            ->forUser($user)
            ->notExpired()
            ->orderBy('created_at', 'desc');

        // Apply filters
        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('message', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['type']) && $filters['type'] !== 'all') {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            if ($filters['status'] === 'read') {
                $query->where('is_read', true);
            } elseif ($filters['status'] === 'unread') {
                $query->where('is_read', false);
            }
        }

        if (!empty($filters['priority']) && $filters['priority'] !== 'all') {
            $query->where('priority', $filters['priority']);
        }

        // Get notifications
        $notifications = $query->limit(100)->get();
        $unreadCount = $this->notificationService->getUnreadCountForUser($user);

        // Calculate additional stats
        $totalCount = $notifications->count();
        $thisWeekCount = $notifications->where('created_at', '>=', now()->subWeek())->count();
        $urgentCount = $notifications->where('priority', 'urgent')->where('is_read', false)->count();

        $stats = [
            'total' => $totalCount,
            'unread' => $unreadCount,
            'this_week' => $thisWeekCount,
            'urgent' => $urgentCount,
        ];

        return Inertia::render('Clinic/Notifications/Index', [
            'clinic' => $user->clinic,
            'notifications' => $notifications,
            'filters' => $filters,
            'stats' => $stats,
        ]);
    }
}
