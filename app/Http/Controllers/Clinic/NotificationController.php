<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        // 🔍 ALWAYS LOG FOR DEBUGGING ON PRODUCTION
        \Log::info('Notification API Called', [
            'has_user' => $user !== null,
            'user_id' => $user ? $user->id : null,
            'user_email' => $user ? $user->email : null,
            'user_role' => $user ? $user->role : null,
            'user_clinic_id' => $user ? $user->clinic_id : null,
            'request_path' => $request->path(),
            'session_id' => $request->session()->getId(),
            'has_session' => $request->hasSession(),
        ]);

        // 🔍 DIRECT DEBUG OUTPUT (temporary)
        if ($request->get('debug') === 'true') {
            return response()->json([
                'DEBUG' => [
                    'user_id' => $user ? $user->id : null,
                    'user_email' => $user ? $user->email : null,
                    'user_role' => $user ? $user->role : null,
                    'user_clinic_id' => $user ? $user->clinic_id : null,
                    'has_user' => $user !== null,
                    'has_clinic_id' => $user && $user->clinic_id !== null,
                    'raw_notifications_count' => $user && $user->clinic_id ?
                        \DB::table('notifications')->where('clinic_id', $user->clinic_id)->count() : 0,
                    'notifications_with_role_filter' => $user && $user->role ?
                        \DB::table('notifications')
                            ->where('clinic_id', $user->clinic_id)
                            ->whereRaw("JSON_CONTAINS(target_roles, ?)", [json_encode($user->role)])
                            ->count() : 0,
                ]
            ]);
        }

        if (!$user || !$user->clinic_id) {
            \Log::warning('Notification API: No user or clinic', [
                'has_user' => $user !== null,
                'has_clinic_id' => $user && $user->clinic_id,
            ]);
            return response()->json([
                'notifications' => [],
                'unread_count' => 0,
                'debug' => 'no_user_or_clinic',
            ]);
        }

        $limit = $request->get('limit', 10);
        $unreadOnly = $request->get('unread_only', false);

        // 🔍 BYPASS SERVICE - Query directly to test
        $directQuery = Notification::forClinic($user->clinic_id)
            ->forUser($user)
            ->notExpired()
            ->orderBy('created_at', 'desc')
            ->limit($limit);
        
        $directResults = $directQuery->get();
        $directCount = $directResults->count();
        
        // Now also try the service
        $notifications = $this->notificationService->getNotificationsForUser($user, $limit, $unreadOnly);
        $unreadCount = $this->notificationService->getUnreadCountForUser($user);

        // 🔍 DETAILED DEBUG - COUNT BEFORE RETURN
        $count = $notifications->count();
        $notifArray = $notifications->toArray();

        \Log::info('Notification API - Before JSON Response', [
            'user_id' => $user->id,
            'collection_count' => $count,
            'array_count' => count($notifArray),
            'first_notif_id' => $count > 0 ? $notifications->first()->id : null,
        ]);

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
            'debug_user_id' => $user->id,
            'debug_role' => $user->role,
            'debug_clinic' => $user->clinic_id,
            'debug_count_before_json' => $count,
            'debug_direct_count' => $directCount,
            'debug_sql' => $notifications->debug_sql ?? 'N/A',
            'debug_bindings' => $notifications->debug_bindings ?? [],
            'debug_service_user' => $notifications->debug_user_id ?? null,
            'debug_db_name' => $notifications->debug_db_name ?? 'N/A',
            'debug_db_host' => $notifications->debug_db_host ?? 'N/A',
            'debug_connection' => $notifications->debug_connection_name ?? 'N/A',
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
