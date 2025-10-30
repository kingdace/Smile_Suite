<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminNotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->middleware(['auth', 'verified', \App\Http\Middleware\CheckRole::class . ':admin']);
        $this->notificationService = $notificationService;
    }

    /**
     * Get admin notifications
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'notifications' => [],
                'unread_count' => 0,
            ]);
        }

        $limit = $request->get('limit', 10);
        $unreadOnly = $request->get('unread_only', false);

        // Get admin-specific notifications (target_roles contains 'admin')
        $query = Notification::whereJsonContains('target_roles', 'admin')
            ->notExpired()
            ->orderBy('created_at', 'desc');

        if ($unreadOnly) {
            $query->unread();
        }

        $notifications = $query->limit($limit)->get();
        $unreadCount = Notification::whereJsonContains('target_roles', 'admin')
            ->unread()
            ->notExpired()
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark admin notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['success' => false], 403);
        }

        $notification = Notification::whereJsonContains('target_roles', 'admin')
            ->find($id);

        if (!$notification) {
            return response()->json(['success' => false], 404);
        }

        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * Mark all admin notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['success' => false], 403);
        }

        $count = Notification::whereJsonContains('target_roles', 'admin')
            ->unread()
            ->notExpired()
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'count' => $count,
        ]);
    }

    /**
     * Show admin notifications page
     */
    public function page(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $notifications = Notification::whereJsonContains('target_roles', 'admin')
            ->notExpired()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $stats = [
            'total' => Notification::whereJsonContains('target_roles', 'admin')->notExpired()->count(),
            'unread' => Notification::whereJsonContains('target_roles', 'admin')->unread()->notExpired()->count(),
            'urgent' => Notification::whereJsonContains('target_roles', 'admin')->where('priority', 'urgent')->unread()->notExpired()->count(),
            'this_week' => Notification::whereJsonContains('target_roles', 'admin')->where('created_at', '>=', now()->subWeek())->count(),
        ];

        return Inertia::render('Admin/Notifications/Index', [
            'notifications' => $notifications,
            'stats' => $stats,
            'auth' => [
                'user' => $user
            ],
        ]);
    }
}
