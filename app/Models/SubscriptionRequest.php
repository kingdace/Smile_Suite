<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'clinic_id',
        'request_type',
        'current_plan',
        'requested_plan',
        'duration_months',
        'message',
        'status',
        'admin_notes',
        'calculated_amount',
        'payment_token',
        'payment_deadline',
        'processed_at',
        'processed_by',
        'payment_method',
        'payment_details',
        'reference_number',
        'sender_name',
        'sender_number',
        'amount_sent',
        'payment_received_at',
        'payment_status',
        'payment_verification_notes',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
        'payment_deadline' => 'datetime',
        'calculated_amount' => 'decimal:2',
        'amount_sent' => 'decimal:2',
        'payment_received_at' => 'datetime',
        'payment_details' => 'array',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function processedBy()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeUpgrades($query)
    {
        return $query->where('request_type', 'upgrade');
    }

    public function scopeRenewals($query)
    {
        return $query->where('request_type', 'renewal');
    }
}
