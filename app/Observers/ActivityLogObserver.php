<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Services\ActivityLogService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class ActivityLogObserver
{
    protected $activityLogService;

    public function __construct(ActivityLogService $activityLogService)
    {
        $this->activityLogService = $activityLogService;
    }

    /**
     * Handle the model "created" event.
     */
    public function created(Model $model): void
    {
        try {
            $this->activityLogService->logCreated($model);
        } catch (\Exception $e) {
            // Log the error but don't break the main operation
            \Illuminate\Support\Facades\Log::error('Failed to log model creation', [
                'model' => get_class($model),
                'model_id' => $model->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle the model "updated" event.
     */
    public function updated(Model $model): void
    {
        try {
            // Get the original values before the update
            $oldValues = $model->getOriginal();

            // Only log if there are actual changes
            if ($model->wasChanged()) {
                $this->activityLogService->logUpdated($model, $oldValues);
            }
        } catch (\Exception $e) {
            // Log the error but don't break the main operation
            \Illuminate\Support\Facades\Log::error('Failed to log model update', [
                'model' => get_class($model),
                'model_id' => $model->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle the model "deleted" event.
     */
    public function deleted(Model $model): void
    {
        try {
            $this->activityLogService->logDeleted($model);
        } catch (\Exception $e) {
            // Log the error but don't break the main operation
            \Illuminate\Support\Facades\Log::error('Failed to log model deletion', [
                'model' => get_class($model),
                'model_id' => $model->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle the model "restored" event.
     */
    public function restored(Model $model): void
    {
        try {
            $this->activityLogService->logRestored($model);
        } catch (\Exception $e) {
            // Log the error but don't break the main operation
            \Illuminate\Support\Facades\Log::error('Failed to log model restoration', [
                'model' => get_class($model),
                'model_id' => $model->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle the model "force deleted" event.
     */
    public function forceDeleted(Model $model): void
    {
        try {
            $this->activityLogService->logCustom(
                action: 'force_deleted',
                description: "Permanently deleted {$this->getModelName($model)}",
                model: $model,
                category: $this->getModelCategory($model),
                severity: ActivityLog::SEVERITY_CRITICAL
            );
        } catch (\Exception $e) {
            // Log the error but don't break the main operation
            \Illuminate\Support\Facades\Log::error('Failed to log model force deletion', [
                'model' => get_class($model),
                'model_id' => $model->id,
                'error' => $e->getMessage(),
            ]);
        }
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
}
