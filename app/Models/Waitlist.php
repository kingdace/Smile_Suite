<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Waitlist extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'waitlist';

    protected $fillable = [
        'clinic_id',
        'patient_id',
        'created_by',
        'preferred_dentist_id',
        'service_id',
        'reason',
        'notes',
        'priority',
        'status',
        'preferred_start_date',
        'preferred_end_date',
        'preferred_days',
        'preferred_start_time',
        'preferred_end_time',
        'contact_method',
        'contact_notes',
        'estimated_duration',
        'appointment_type_id',
        'contacted_at',
        'scheduled_at',
        'expires_at',
        'contact_attempts',
        'last_contact_attempt',
    ];

    protected $casts = [
        'preferred_start_date' => 'date',
        'preferred_end_date' => 'date',
        'preferred_days' => 'array',
        'preferred_start_time' => 'datetime',
        'preferred_end_time' => 'datetime',
        'contacted_at' => 'datetime',
        'scheduled_at' => 'datetime',
        'expires_at' => 'datetime',
        'last_contact_attempt' => 'datetime',
        'contact_attempts' => 'integer',
        'estimated_duration' => 'integer',
    ];

    // Relationships
    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function preferredDentist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'preferred_dentist_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function appointmentType(): BelongsTo
    {
        return $this->belongsTo(AppointmentType::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeByDentist($query, $dentistId)
    {
        return $query->where('preferred_dentist_id', $dentistId);
    }

    public function scopeByService($query, $serviceId)
    {
        return $query->where('service_id', $serviceId);
    }

    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', now());
        });
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }

    // Methods
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && !$this->isExpired();
    }

    public function canBeContacted(): bool
    {
        return $this->isActive() && $this->contact_attempts < 3;
    }

    public function markAsContacted(): void
    {
        $this->update([
            'status' => 'contacted',
            'contacted_at' => now(),
            'contact_attempts' => $this->contact_attempts + 1,
            'last_contact_attempt' => now(),
        ]);
    }

    public function markAsScheduled(): void
    {
        $this->update([
            'status' => 'scheduled',
            'scheduled_at' => now(),
        ]);
    }

    public function markAsCancelled(): void
    {
        $this->update([
            'status' => 'cancelled',
        ]);
    }

    public function markAsExpired(): void
    {
        $this->update([
            'status' => 'expired',
        ]);
    }

    public function setExpirationDate(int $days = 30): void
    {
        $this->update([
            'expires_at' => now()->addDays($days),
        ]);
    }

    public function getPriorityColor(): string
    {
        return match($this->priority) {
            'urgent' => 'text-red-600 bg-red-100 border-red-300',
            'high' => 'text-orange-600 bg-orange-100 border-orange-300',
            'normal' => 'text-blue-600 bg-blue-100 border-blue-300',
            'low' => 'text-gray-600 bg-gray-100 border-gray-300',
            default => 'text-gray-600 bg-gray-100 border-gray-300',
        };
    }

    public function getStatusColor(): string
    {
        return match($this->status) {
            'active' => 'text-green-600 bg-green-100 border-green-300',
            'contacted' => 'text-blue-600 bg-blue-100 border-blue-300',
            'scheduled' => 'text-purple-600 bg-purple-100 border-purple-300',
            'cancelled' => 'text-red-600 bg-red-100 border-red-300',
            'expired' => 'text-gray-600 bg-gray-100 border-gray-300',
            default => 'text-gray-600 bg-gray-100 border-gray-300',
        };
    }

    public function getPreferredDaysText(): string
    {
        if (!$this->preferred_days) {
            return 'Any day';
        }

        $dayNames = [
            1 => 'Monday',
            2 => 'Tuesday', 
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday',
            0 => 'Sunday'
        ];

        $days = collect($this->preferred_days)
            ->map(fn($day) => $dayNames[$day] ?? $day)
            ->join(', ');

        return $days ?: 'Any day';
    }

    public function getPreferredTimeText(): string
    {
        if (!$this->preferred_start_time && !$this->preferred_end_time) {
            return 'Any time';
        }

        $start = $this->preferred_start_time ? $this->preferred_start_time->format('g:i A') : '';
        $end = $this->preferred_end_time ? $this->preferred_end_time->format('g:i A') : '';

        if ($start && $end) {
            return "{$start} - {$end}";
        }

        return $start ?: $end ?: 'Any time';
    }

    // Static methods
    public static function getPriorityOptions(): array
    {
        return [
            'low' => 'Low',
            'normal' => 'Normal',
            'high' => 'High',
            'urgent' => 'Urgent',
        ];
    }

    public static function getStatusOptions(): array
    {
        return [
            'active' => 'Active',
            'contacted' => 'Contacted',
            'scheduled' => 'Scheduled',
            'cancelled' => 'Cancelled',
            'expired' => 'Expired',
        ];
    }

    public static function getContactMethodOptions(): array
    {
        return [
            'phone' => 'Phone',
            'email' => 'Email',
            'sms' => 'SMS',
            'any' => 'Any Method',
        ];
    }
}
