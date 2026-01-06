<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ActivityLogService
{
    /**
     * Log an activity.
     */
    public function log(
        string $action,
        string $description,
        ?Model $model = null,
        array $oldValues = [],
        array $newValues = [],
        string $category = ActivityLog::CATEGORY_SYSTEM_ACCESS,
        string $severity = ActivityLog::SEVERITY_MEDIUM,
        ?Request $request = null
    ): ?ActivityLog {
        $user = Auth::user();

        // Skip logging if user is not authenticated (e.g., during registration)
        if (!$user) {
            Log::debug('Skipping activity log - no authenticated user', [
                'action' => $action,
                'model' => $model ? get_class($model) : null,
            ]);
            return null;
        }

        $clinicId = $user->clinic_id;
        if (!$clinicId) {
            // For admin users or users without clinic_id, try to get clinic_id from the model being logged
            if ($model && isset($model->clinic_id)) {
                $clinicId = $model->clinic_id;
            } else {
                // Skip logging if no clinic context
                Log::debug('Skipping activity log - no clinic context', [
                    'user_id' => $user->id,
                    'action' => $action,
                ]);
                return null;
            }
        }

        // Get request information
        $ipAddress = $request?->ip() ?? request()->ip();
        $userAgent = $request?->userAgent() ?? request()->userAgent();

        // Create the activity log
        $activityLog = ActivityLog::create([
            'clinic_id' => $clinicId,
            'user_id' => $user->id,
            'action' => $action,
            'model_type' => $model ? get_class($model) : null,
            'model_id' => $model?->id,
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'change_metadata' => $this->generateChangeMetadata($model, $oldValues, $newValues),
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'severity' => $severity,
            'category' => $category,
        ]);

        // Log to Laravel log for debugging
        Log::info('Activity logged', [
            'activity_id' => $activityLog->id,
            'user_id' => $user->id,
            'clinic_id' => $clinicId,
            'action' => $action,
            'category' => $category,
            'severity' => $severity,
        ]);

        return $activityLog;
    }

    /**
     * Log a model creation.
     */
    public function logCreated(Model $model, string $description = null): ?ActivityLog
    {
        $description = $description ?? "Created new {$this->getModelName($model)}";

        return $this->log(
            action: ActivityLog::ACTION_CREATED,
            description: $description,
            model: $model,
            newValues: $this->getModelValues($model),
            category: $this->getModelCategory($model),
            severity: $this->getModelSeverity($model, ActivityLog::ACTION_CREATED)
        );
    }

    /**
     * Log a model update with detailed field changes.
     */
    public function logUpdated(Model $model, array $oldValues, string $description = null): ?ActivityLog
    {
        // Get detailed field changes
        $fieldChanges = $this->getFieldChanges($model, $oldValues);

        // Generate human-readable description
        $detailedDescription = $this->generateChangeDescription($model, $fieldChanges, $description);

        // Determine severity based on field changes
        $severity = $this->calculateChangeSeverity($model, $fieldChanges);

        return $this->log(
            action: ActivityLog::ACTION_UPDATED,
            description: $detailedDescription,
            model: $model,
            oldValues: $this->maskSensitiveFields($oldValues, $model),
            newValues: $this->maskSensitiveFields($this->getModelValues($model), $model),
            category: $this->getModelCategory($model),
            severity: $severity,
            request: request()
        );
    }

    /**
     * Log a model deletion.
     */
    public function logDeleted(Model $model, string $description = null): ?ActivityLog
    {
        $description = $description ?? "Deleted {$this->getModelName($model)}";

        return $this->log(
            action: ActivityLog::ACTION_DELETED,
            description: $description,
            model: $model,
            oldValues: $this->getModelValues($model),
            category: $this->getModelCategory($model),
            severity: ActivityLog::SEVERITY_HIGH // Deletions are always high severity
        );
    }

    /**
     * Log a model restoration.
     */
    public function logRestored(Model $model, string $description = null): ?ActivityLog
    {
        $description = $description ?? "Restored {$this->getModelName($model)}";

        return $this->log(
            action: ActivityLog::ACTION_RESTORED,
            description: $description,
            model: $model,
            newValues: $this->getModelValues($model),
            category: $this->getModelCategory($model),
            severity: ActivityLog::SEVERITY_HIGH // Restorations are high severity
        );
    }

    /**
     * Log user login.
     */
    public function logLogin(User $user): ?ActivityLog
    {
        return $this->log(
            action: ActivityLog::ACTION_LOGIN,
            description: "User logged in",
            model: $user,
            category: ActivityLog::CATEGORY_SYSTEM_ACCESS,
            severity: ActivityLog::SEVERITY_LOW
        );
    }

    /**
     * Log user logout.
     */
    public function logLogout(User $user): ?ActivityLog
    {
        return $this->log(
            action: ActivityLog::ACTION_LOGOUT,
            description: "User logged out",
            model: $user,
            category: ActivityLog::CATEGORY_SYSTEM_ACCESS,
            severity: ActivityLog::SEVERITY_LOW
        );
    }

    /**
     * Log a custom action.
     */
    public function logCustom(
        string $action,
        string $description,
        ?Model $model = null,
        array $data = [],
        string $category = ActivityLog::CATEGORY_SYSTEM_ACCESS,
        string $severity = ActivityLog::SEVERITY_MEDIUM
    ): ?ActivityLog {
        return $this->log(
            action: $action,
            description: $description,
            model: $model,
            newValues: $data,
            category: $category,
            severity: $severity
        );
    }

    /**
     * Get activity logs for a clinic with filters.
     */
    public function getLogsForClinic(
        int $clinicId,
        array $filters = [],
        int $perPage = 25
    ) {
        $query = ActivityLog::forClinic($clinicId)
            ->with(['user', 'model'])
            ->orderBy('created_at', 'asc');

        // Apply filters
        if (isset($filters['user_id'])) {
            $query->forUser($filters['user_id']);
        }

        if (isset($filters['severity'])) {
            $query->bySeverity($filters['severity']);
        }

        if (isset($filters['category'])) {
            $query->byCategory($filters['category']);
        }

        if (isset($filters['action'])) {
            $query->byAction($filters['action']);
        }

        if (isset($filters['date_from']) && isset($filters['date_to'])) {
            $query->byDateRange($filters['date_from'], $filters['date_to']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        return $query->paginate($perPage);
    }

    /**
     * Get activity statistics for a clinic.
     */
    public function getClinicStats(int $clinicId, int $days = 30): array
    {
        $startDate = now()->subDays($days);

        $stats = ActivityLog::forClinic($clinicId)
            ->where('created_at', '>=', $startDate)
            ->selectRaw('
                COUNT(*) as total_activities,
                COUNT(DISTINCT user_id) as active_users,
                COUNT(CASE WHEN severity = "critical" THEN 1 END) as critical_activities,
                COUNT(CASE WHEN severity = "high" THEN 1 END) as high_activities,
                COUNT(CASE WHEN action = "created" THEN 1 END) as created_items,
                COUNT(CASE WHEN action = "updated" THEN 1 END) as updated_items,
                COUNT(CASE WHEN action = "deleted" THEN 1 END) as deleted_items
            ')
            ->first();

        // Get top users by activity
        $topUsers = ActivityLog::forClinic($clinicId)
            ->where('created_at', '>=', $startDate)
            ->with('user')
            ->selectRaw('user_id, COUNT(*) as activity_count')
            ->groupBy('user_id')
            ->orderBy('activity_count', 'desc')
            ->limit(5)
            ->get();

        // Get activities by category
        $activitiesByCategory = ActivityLog::forClinic($clinicId)
            ->where('created_at', '>=', $startDate)
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get();

        return [
            'summary' => $stats,
            'top_users' => $topUsers,
            'activities_by_category' => $activitiesByCategory,
            'period_days' => $days,
        ];
    }

    /**
     * Get model name for display.
     */
    private function getModelName(Model $model): string
    {
        $className = class_basename($model);
        return strtolower(preg_replace('/([a-z])([A-Z])/', '$1 $2', $className));
    }

    /**
     * Get model values for logging.
     */
    private function getModelValues(Model $model): array
    {
        // Only log fillable attributes to avoid sensitive data
        $fillable = $model->getFillable();
        $values = [];

        foreach ($fillable as $attribute) {
            if (isset($model->attributes[$attribute])) {
                $values[$attribute] = $model->attributes[$attribute];
            }
        }

        return $values;
    }

    /**
     * Get category based on model type.
     */
    private function getModelCategory(Model $model): string
    {
        $className = class_basename($model);

        return match ($className) {
            'Patient' => ActivityLog::CATEGORY_PATIENT_MANAGEMENT,
            'Payment' => ActivityLog::CATEGORY_PAYMENT_MANAGEMENT,
            'Treatment' => ActivityLog::CATEGORY_TREATMENT_MANAGEMENT,
            'Inventory', 'Supplier', 'PurchaseOrder' => ActivityLog::CATEGORY_INVENTORY_MANAGEMENT,
            'Appointment', 'DentistSchedule', 'Waitlist' => ActivityLog::CATEGORY_APPOINTMENT_MANAGEMENT,
            'User' => ActivityLog::CATEGORY_USER_MANAGEMENT,
            default => ActivityLog::CATEGORY_SYSTEM_ACCESS,
        };
    }

    /**
     * Get severity based on model and action.
     */
    private function getModelSeverity(Model $model, string $action): string
    {
        $className = class_basename($model);

        // High severity for financial and user management
        if (in_array($className, ['Payment', 'User']) || $action === ActivityLog::ACTION_DELETED) {
            return ActivityLog::SEVERITY_HIGH;
        }

        // Medium severity for most other operations
        return ActivityLog::SEVERITY_MEDIUM;
    }

    /**
     * Clean up old logs based on retention policy.
     */
    public function cleanupOldLogs(int $retentionDays = 90): int
    {
        $cutoffDate = now()->subDays($retentionDays);

        return ActivityLog::where('created_at', '<', $cutoffDate)
            ->where('severity', '!=', ActivityLog::SEVERITY_CRITICAL) // Keep critical logs longer
            ->delete();
    }

    /**
     * Get detailed field changes between old and new values (optimized).
     */
    private function getFieldChanges(Model $model, array $oldValues): array
    {
        $changes = [];
        $currentValues = $model->getAttributes();
        $modelClass = get_class($model);

        // Pre-cache field configurations for better performance
        $criticalFields = $this->getCriticalFields($modelClass);
        $highRiskFields = $this->getHighRiskFields($modelClass);
        $sensitiveFields = $this->getSensitiveFields($modelClass);

        // Only process fillable fields to avoid sensitive data
        $fillableFields = $model->getFillable();

        foreach ($fillableFields as $field) {
            if (!isset($currentValues[$field])) {
                continue;
            }

            $newValue = $currentValues[$field];
            $oldValue = $oldValues[$field] ?? null;

            // Skip unchanged fields
            if ($oldValue === $newValue) {
                continue;
            }

            // Skip system fields
            if (in_array($field, ['created_at', 'updated_at', 'id', 'deleted_at'])) {
                continue;
            }

            // Determine field importance for better categorization
            $importance = 'low';
            if (in_array($field, $criticalFields)) {
                $importance = 'critical';
            } elseif (in_array($field, $highRiskFields)) {
                $importance = 'high';
            } elseif (in_array($field, $sensitiveFields)) {
                $importance = 'sensitive';
            }

            $changes[$field] = [
                'old' => $oldValue,
                'new' => $newValue,
                'field_name' => $this->getFieldDisplayName($field, $model),
                'field_type' => $this->getFieldType($field, $model),
                'importance' => $importance,
                'is_sensitive' => in_array($field, $sensitiveFields)
            ];
        }

        return $changes;
    }

    /**
     * Generate human-readable change description (optimized).
     */
    private function generateChangeDescription(Model $model, array $fieldChanges, ?string $customDescription = null): string
    {
        if ($customDescription) {
            return $customDescription;
        }

        if (empty($fieldChanges)) {
            return "Updated {$this->getModelName($model)} (no visible changes)";
        }

        $modelName = $this->getModelName($model);

        // Group changes by importance for better readability
        $criticalChanges = [];
        $highChanges = [];
        $mediumChanges = [];
        $lowChanges = [];

        foreach ($fieldChanges as $field => $change) {
            switch ($change['importance']) {
                case 'critical':
                    $criticalChanges[] = $this->formatChangeDescription($change);
                    break;
                case 'high':
                    $highChanges[] = $this->formatChangeDescription($change);
                    break;
                case 'sensitive':
                    $mediumChanges[] = $this->formatChangeDescription($change);
                    break;
                default:
                    $lowChanges[] = $this->formatChangeDescription($change);
            }
        }

        // Build description prioritizing critical changes
        $allChanges = array_merge($criticalChanges, $highChanges, $mediumChanges, $lowChanges);

        if (count($allChanges) === 1) {
            return "Updated {$modelName} - {$allChanges[0]}";
        } elseif (count($allChanges) <= 3) {
            $lastChange = array_pop($allChanges);
            $otherChanges = implode(', ', $allChanges);
            return "Updated {$modelName} - {$otherChanges} and {$lastChange}";
        } else {
            // For many changes, show most important ones and count the rest
            $importantChanges = array_slice($allChanges, 0, 2);
            $remainingCount = count($allChanges) - 2;
            $importantText = implode(', ', $importantChanges);
            return "Updated {$modelName} - {$importantText} and {$remainingCount} other changes";
        }
    }

    /**
     * Format individual change description.
     */
    private function formatChangeDescription(array $change): string
    {
        $fieldName = $change['field_name'];
        $oldValue = $this->formatFieldValue($change['old'], $change['field_type']);
        $newValue = $this->formatFieldValue($change['new'], $change['field_type']);

        // Mask sensitive values
        if ($change['is_sensitive']) {
            $oldValue = $this->maskValue($oldValue);
            $newValue = $this->maskValue($newValue);
        }

        if ($oldValue === null || $oldValue === '') {
            return "Added {$fieldName}: {$newValue}";
        } elseif ($newValue === null || $newValue === '') {
            return "Removed {$fieldName}: {$oldValue}";
        } else {
            return "Changed {$fieldName} from {$oldValue} to {$newValue}";
        }
    }

    /**
     * Calculate severity based on field changes.
     */
    private function calculateChangeSeverity(Model $model, array $fieldChanges): string
    {
        $modelClass = get_class($model);
        $criticalFields = $this->getCriticalFields($modelClass);
        $highRiskFields = $this->getHighRiskFields($modelClass);

        foreach ($fieldChanges as $field => $change) {
            if (in_array($field, $criticalFields)) {
                return ActivityLog::SEVERITY_CRITICAL;
            }
            if (in_array($field, $highRiskFields)) {
                return ActivityLog::SEVERITY_HIGH;
            }
        }

        return ActivityLog::SEVERITY_MEDIUM;
    }

    /**
     * Mask sensitive fields in values.
     */
    private function maskSensitiveFields(array $values, Model $model): array
    {
        $sensitiveFields = $this->getSensitiveFields(get_class($model));

        foreach ($sensitiveFields as $field) {
            if (isset($values[$field]) && $values[$field] !== null) {
                $values[$field] = $this->maskValue($values[$field]);
            }
        }

        return $values;
    }

    /**
     * Get critical fields for a model class.
     */
    private function getCriticalFields(string $modelClass): array
    {
        $criticalFields = [
            'App\Models\Payment' => ['amount', 'status', 'transaction_id'],
            'App\Models\Patient' => ['medical_history', 'allergies'],
            'App\Models\User' => ['role', 'email', 'phone_number'],
            'App\Models\Treatment' => ['cost', 'diagnosis', 'prescriptions'],
        ];

        return $criticalFields[$modelClass] ?? [];
    }

    /**
     * Get high-risk fields for a model class.
     */
    private function getHighRiskFields(string $modelClass): array
    {
        $highRiskFields = [
            'App\Models\Payment' => ['payment_method', 'reference_number'],
            'App\Models\Patient' => ['first_name', 'last_name', 'phone_number', 'insurance_info'],
            'App\Models\User' => ['name', 'permissions'],
            'App\Models\Treatment' => ['status', 'notes', 'procedures_details'],
            'App\Models\Appointment' => ['date', 'time', 'status'],
        ];

        return $highRiskFields[$modelClass] ?? [];
    }

    /**
     * Get sensitive fields for a model class.
     */
    private function getSensitiveFields(string $modelClass): array
    {
        $sensitiveFields = [
            'App\Models\User' => ['password', 'remember_token', 'email_verification_token'],
            'App\Models\Patient' => ['email_verification_token'],
        ];

        return $sensitiveFields[$modelClass] ?? [];
    }

    /**
     * Get display name for a field.
     */
    private function getFieldDisplayName(string $field, Model $model): string
    {
        $fieldNames = [
            'first_name' => 'first name',
            'last_name' => 'last name',
            'phone_number' => 'phone number',
            'date_of_birth' => 'date of birth',
            'medical_history' => 'medical history',
            'emergency_contact_name' => 'emergency contact name',
            'emergency_contact_number' => 'emergency contact number',
            'insurance_provider' => 'insurance provider',
            'insurance_policy_number' => 'insurance policy number',
            'payment_method' => 'payment method',
            'transaction_id' => 'transaction ID',
            'reference_number' => 'reference number',
            'procedures_details' => 'procedures details',
            'follow_up_notes' => 'follow-up notes',
            'materials_used' => 'materials used',
            'vital_signs' => 'vital signs',
            'consent_forms' => 'consent forms',
            'treatment_phase' => 'treatment phase',
            'next_appointment_date' => 'next appointment date',
            'estimated_duration_minutes' => 'estimated duration',
        ];

        return $fieldNames[$field] ?? str_replace('_', ' ', $field);
    }

    /**
     * Get field type for formatting.
     */
    private function getFieldType(string $field, Model $model): string
    {
        $casts = $model->getCasts();

        if (isset($casts[$field])) {
            return $casts[$field];
        }

        // Determine type based on field name
        if (str_contains($field, 'amount') || str_contains($field, 'cost') || str_contains($field, 'price')) {
            return 'decimal';
        }

        if (str_contains($field, 'date') || str_contains($field, 'time')) {
            return 'datetime';
        }

        if (str_contains($field, 'phone') || str_contains($field, 'number')) {
            return 'phone';
        }

        return 'string';
    }

    /**
     * Format field value for display.
     */
    private function formatFieldValue($value, string $type): string
    {
        if ($value === null) {
            return 'null';
        }

        switch ($type) {
            case 'decimal':
                return '₱' . number_format($value, 2);
            case 'datetime':
            case 'date':
                return $value instanceof \DateTime ? $value->format('M d, Y') : $value;
            case 'phone':
                return $this->formatPhoneNumber($value);
            case 'array':
                return is_array($value) ? json_encode($value) : $value;
            default:
                return (string) $value;
        }
    }

    /**
     * Format phone number for display.
     */
    private function formatPhoneNumber(string $phone): string
    {
        // Mask phone numbers for privacy
        if (strlen($phone) > 4) {
            return substr($phone, 0, 3) . '***' . substr($phone, -2);
        }
        return '***';
    }

    /**
     * Mask sensitive values.
     */
    private function maskValue($value): string
    {
        if (is_string($value)) {
            return str_repeat('*', min(strlen($value), 8));
        }
        return '***';
    }

    /**
     * Generate change metadata for UI optimization.
     */
    private function generateChangeMetadata(?Model $model, array $oldValues, array $newValues): ?array
    {
        if (!$model) {
            return null;
        }

        $fieldChanges = $this->getFieldChanges($model, $oldValues);

        if (empty($fieldChanges)) {
            return null;
        }

        $metadata = [
            'total_changes' => count($fieldChanges),
            'critical_changes' => 0,
            'high_changes' => 0,
            'medium_changes' => 0,
            'low_changes' => 0,
            'changed_fields' => [],
            'impact_score' => 0,
        ];

        foreach ($fieldChanges as $field => $change) {
            $metadata['changed_fields'][] = [
                'field' => $field,
                'field_name' => $change['field_name'],
                'importance' => $change['importance'],
                'is_sensitive' => $change['is_sensitive'],
                'old_value' => $change['old'],
                'new_value' => $change['new'],
            ];

            // Count changes by importance
            switch ($change['importance']) {
                case 'critical':
                    $metadata['critical_changes']++;
                    $metadata['impact_score'] += 10;
                    break;
                case 'high':
                    $metadata['high_changes']++;
                    $metadata['impact_score'] += 5;
                    break;
                case 'sensitive':
                    $metadata['medium_changes']++;
                    $metadata['impact_score'] += 3;
                    break;
                default:
                    $metadata['low_changes']++;
                    $metadata['impact_score'] += 1;
            }
        }

        return $metadata;
    }
}
