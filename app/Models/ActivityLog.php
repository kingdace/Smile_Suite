<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'clinic_id',
        'user_id',
        'action',
        'model_type',
        'model_id',
        'description',
        'old_values',
        'new_values',
        'change_metadata',
        'ip_address',
        'user_agent',
        'severity',
        'category',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'change_metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Severity constants
    const SEVERITY_LOW = 'low';
    const SEVERITY_MEDIUM = 'medium';
    const SEVERITY_HIGH = 'high';
    const SEVERITY_CRITICAL = 'critical';

    // Category constants
    const CATEGORY_PATIENT_MANAGEMENT = 'patient_management';
    const CATEGORY_PAYMENT_MANAGEMENT = 'payment_management';
    const CATEGORY_TREATMENT_MANAGEMENT = 'treatment_management';
    const CATEGORY_INVENTORY_MANAGEMENT = 'inventory_management';
    const CATEGORY_APPOINTMENT_MANAGEMENT = 'appointment_management';
    const CATEGORY_USER_MANAGEMENT = 'user_management';
    const CATEGORY_SYSTEM_ACCESS = 'system_access';

    // Action constants
    const ACTION_CREATED = 'created';
    const ACTION_UPDATED = 'updated';
    const ACTION_DELETED = 'deleted';
    const ACTION_RESTORED = 'restored';
    const ACTION_LOGIN = 'login';
    const ACTION_LOGOUT = 'logout';
    const ACTION_VIEWED = 'viewed';
    const ACTION_EXPORTED = 'exported';

    /**
     * Get the clinic that owns the activity log.
     */
    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    /**
     * Get the user that performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the model that was affected.
     */
    public function model()
    {
        return $this->morphTo();
    }

    /**
     * Scope to filter by clinic.
     */
    public function scopeForClinic($query, $clinicId)
    {
        return $query->where('clinic_id', $clinicId);
    }

    /**
     * Scope to filter by user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by severity.
     */
    public function scopeBySeverity($query, $severity)
    {
        return $query->where('severity', $severity);
    }

    /**
     * Scope to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Scope to filter by action.
     */
    public function scopeByAction($query, $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope to get recent logs.
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Get severity color for UI.
     */
    public function getSeverityColorAttribute(): string
    {
        return match ($this->severity) {
            self::SEVERITY_LOW => 'green',
            self::SEVERITY_MEDIUM => 'yellow',
            self::SEVERITY_HIGH => 'orange',
            self::SEVERITY_CRITICAL => 'red',
            default => 'gray',
        };
    }

    /**
     * Get severity badge class for UI.
     */
    public function getSeverityBadgeClassAttribute(): string
    {
        return match ($this->severity) {
            self::SEVERITY_LOW => 'bg-green-100 text-green-800',
            self::SEVERITY_MEDIUM => 'bg-yellow-100 text-yellow-800',
            self::SEVERITY_HIGH => 'bg-orange-100 text-orange-800',
            self::SEVERITY_CRITICAL => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get formatted description with context.
     */
    public function getFormattedDescriptionAttribute(): string
    {
        $description = $this->description;

        if ($this->model_type && $this->model_id) {
            $modelClass = $this->model_type;
            $model = $modelClass::find($this->model_id);

            if ($model) {
                $modelName = $model->name ?? $model->title ?? "ID: {$this->model_id}";
                $description = str_replace('{model}', $modelName, $description);
            }
        }

        return $description;
    }

    /**
     * Get changes summary for display.
     */
    public function getChangesSummaryAttribute(): string
    {
        if (!$this->old_values || !$this->new_values) {
            return 'No changes recorded';
        }

        $changes = [];
        foreach ($this->new_values as $key => $newValue) {
            $oldValue = $this->old_values[$key] ?? null;
            if ($oldValue !== $newValue) {
                $changes[] = "{$key}: {$oldValue} → {$newValue}";
            }
        }

        return implode(', ', $changes);
    }

    /**
     * Check if this is a sensitive action.
     */
    public function isSensitiveAction(): bool
    {
        $sensitiveActions = [
            self::ACTION_DELETED,
            'password_changed',
            'permission_granted',
            'permission_revoked',
            'role_changed',
        ];

        $sensitiveCategories = [
            self::CATEGORY_PAYMENT_MANAGEMENT,
            self::CATEGORY_USER_MANAGEMENT,
            self::CATEGORY_SYSTEM_ACCESS,
        ];

        return in_array($this->action, $sensitiveActions) ||
               in_array($this->category, $sensitiveCategories);
    }

    /**
     * Get masked values for sensitive data.
     */
    public function getMaskedValuesAttribute(): array
    {
        $maskedOld = $this->old_values ?? [];
        $maskedNew = $this->new_values ?? [];

        $sensitiveFields = ['password', 'ssn', 'credit_card', 'bank_account'];

        foreach ($sensitiveFields as $field) {
            if (isset($maskedOld[$field])) {
                $maskedOld[$field] = '***MASKED***';
            }
            if (isset($maskedNew[$field])) {
                $maskedNew[$field] = '***MASKED***';
            }
        }

        return [
            'old_values' => $maskedOld,
            'new_values' => $maskedNew,
        ];
    }
}
