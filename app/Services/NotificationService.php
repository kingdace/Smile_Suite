<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    // Notification types and their allowed roles
    const NOTIFICATION_TYPES = [
        'appointment' => ['clinic_admin', 'dentist', 'staff'],
        'inventory' => ['clinic_admin', 'staff'],
        'subscription' => ['clinic_admin'],
        'patient' => ['clinic_admin', 'dentist', 'staff'],
        'system' => ['clinic_admin', 'dentist', 'staff'],
        'support' => ['admin'], // Admin-only support notifications
        'clinic_registration' => ['admin'], // Admin-only clinic registration notifications
        'user_management' => ['admin'], // Admin-only user management notifications
    ];

    // Priority levels
    const PRIORITY_LOW = 'low';
    const PRIORITY_MEDIUM = 'medium';
    const PRIORITY_HIGH = 'high';
    const PRIORITY_URGENT = 'urgent';

    /**
     * Create a notification with role-based restrictions
     */
    public function createNotification(array $data): Notification
    {
        // Validate notification type and roles
        $this->validateNotificationData($data);

        return Notification::create([
            'clinic_id' => $data['clinic_id'],
            'user_id' => $data['user_id'] ?? null,
            'target_roles' => $data['target_roles'],
            'type' => $data['type'],
            'title' => $data['title'],
            'message' => $data['message'],
            'data' => $data['data'] ?? null,
            'priority' => $data['priority'] ?? self::PRIORITY_MEDIUM,
            'expires_at' => $data['expires_at'] ?? null,
        ]);
    }

    /**
     * Get notifications for a specific user (role-filtered)
     */
    public function getNotificationsForUser(User $user, int $limit = 10, bool $unreadOnly = false)
    {
        $query = Notification::forClinic($user->clinic_id)
            ->forUser($user)
            ->notExpired()
            ->orderBy('created_at', 'desc');

        if ($unreadOnly) {
            $query->unread();
        }

        return $query->limit($limit)->get();
    }

    /**
     * Get unread notification count for user
     */
    public function getUnreadCountForUser(User $user): int
    {
        return Notification::forClinic($user->clinic_id)
            ->forUser($user)
            ->unread()
            ->notExpired()
            ->count();
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(int $notificationId, User $user): bool
    {
        $notification = Notification::find($notificationId);

        if (!$notification) {
            return false;
        }

        // Security check: user can only mark their own notifications as read
        if (!$this->canUserAccessNotification($notification, $user)) {
            Log::warning('User attempted to access notification they cannot see', [
                'user_id' => $user->id,
                'notification_id' => $notificationId,
                'user_role' => $user->role,
                'target_roles' => $notification->target_roles,
            ]);
            return false;
        }

        $notification->markAsRead();
        return true;
    }

    /**
     * Mark all notifications as read for user
     */
    public function markAllAsRead(User $user): int
    {
        return Notification::forClinic($user->clinic_id)
            ->forUser($user)
            ->unread()
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    /**
     * Validate notification data
     */
    private function validateNotificationData(array $data): void
    {
        // Check required fields
        $requiredFields = ['clinic_id', 'type', 'target_roles', 'title', 'message'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                throw new \InvalidArgumentException("Missing required field: {$field}");
            }
        }

        $type = $data['type'];
        $targetRoles = $data['target_roles'];

        if (!isset(self::NOTIFICATION_TYPES[$type])) {
            throw new \InvalidArgumentException("Invalid notification type: {$type}");
        }

        $allowedRoles = self::NOTIFICATION_TYPES[$type];
        $invalidRoles = array_diff($targetRoles, $allowedRoles);

        if (!empty($invalidRoles)) {
            throw new \InvalidArgumentException(
                "Invalid roles for notification type '{$type}': " . implode(', ', $invalidRoles)
            );
        }
    }

    /**
     * Check if user can access notification
     */
    private function canUserAccessNotification(Notification $notification, User $user): bool
    {
        // Personal notification
        if ($notification->user_id === $user->id) {
            return true;
        }

        // Role-based notification
        return in_array($user->role, $notification->target_roles);
    }

    // Specific notification creation methods
    public function createAppointmentNotification(array $data): Notification
    {
        return $this->createNotification(array_merge($data, [
            'type' => 'appointment',
            'target_roles' => $data['target_roles'] ?? ['clinic_admin', 'staff'],
        ]));
    }

    public function createInventoryNotification(array $data): Notification
    {
        return $this->createNotification(array_merge($data, [
            'type' => 'inventory',
            'target_roles' => ['clinic_admin', 'staff'],
            'priority' => $data['priority'] ?? self::PRIORITY_HIGH,
        ]));
    }

    public function createSubscriptionNotification(array $data): Notification
    {
        return $this->createNotification(array_merge($data, [
            'type' => 'subscription',
            'target_roles' => ['clinic_admin'],
            'priority' => $data['priority'] ?? self::PRIORITY_URGENT,
        ]));
    }

    // Admin-specific notification creation methods
    public function createSupportNotification(array $data): Notification
    {
        return $this->createNotification(array_merge($data, [
            'type' => 'support',
            'target_roles' => ['admin'],
            'priority' => $data['priority'] ?? self::PRIORITY_MEDIUM,
        ]));
    }

    public function createClinicRegistrationNotification(array $data): Notification
    {
        return $this->createNotification(array_merge($data, [
            'type' => 'clinic_registration',
            'target_roles' => ['admin'],
            'priority' => $data['priority'] ?? self::PRIORITY_HIGH,
        ]));
    }

    public function createUserManagementNotification(array $data): Notification
    {
        return $this->createNotification(array_merge($data, [
            'type' => 'user_management',
            'target_roles' => ['admin'],
            'priority' => $data['priority'] ?? self::PRIORITY_MEDIUM,
        ]));
    }

    public function createTicketUpdateNotification(array $data): Notification
    {
        return $this->createNotification(array_merge($data, [
            'type' => 'system',
            'target_roles' => $data['target_roles'],
            'priority' => $data['priority'] ?? self::PRIORITY_MEDIUM,
        ]));
    }
}
