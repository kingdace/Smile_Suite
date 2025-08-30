<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class ClinicRegistrationRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'clinic_name',
        'contact_person',
        'email',
        'phone',
        'address',
        'license_number',
        'description',
        'message',
        'subscription_plan',
        'subscription_amount',
        'payment_status',
        'status',
        'admin_notes',
        'approval_token',
        'approved_at',
        'expires_at',
        'payment_deadline',
        'payment_duration_days',
        'stripe_customer_id',
        'stripe_payment_intent_id',
        'payment_details',
        'clinic_id',
        'deleted_at',
    ];

    protected $casts = [
        'subscription_amount' => 'decimal:2',
        'approved_at' => 'datetime',
        'expires_at' => 'datetime',
        'payment_deadline' => 'datetime',
        'payment_details' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($request) {
            $request->approval_token = Str::random(64);
            $request->expires_at = now()->addDays(7); // Token expires in 7 days
        });
    }

    public function isExpired()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isPaymentExpired()
    {
        return $this->payment_deadline && $this->payment_deadline->isPast();
    }

    public function getPaymentRemainingDaysAttribute()
    {
        if (!$this->payment_deadline) {
            return null;
        }

        $remaining = now()->diffInDays($this->payment_deadline, false);
        return $remaining > 0 ? $remaining : 0;
    }

    public function getPaymentRemainingHoursAttribute()
    {
        if (!$this->payment_deadline) {
            return null;
        }

        $remaining = now()->diffInHours($this->payment_deadline, false);
        return $remaining > 0 ? $remaining : 0;
    }

    public function getPaymentStatusTextAttribute()
    {
        if ($this->payment_status === 'paid') {
            return 'Paid';
        }

        if ($this->payment_status === 'pending_verification') {
            return 'Pending Verification';
        }

        if ($this->payment_status === 'trial') {
            return 'Free Trial';
        }

        if ($this->isPaymentExpired()) {
            return 'Payment Expired';
        }

        if ($this->payment_deadline) {
            $days = $this->payment_remaining_days;
            $hours = $this->payment_remaining_hours;

            if ($days > 0) {
                return "Due in {$days} day" . ($days > 1 ? 's' : '');
            } elseif ($hours > 0) {
                return "Due in {$hours} hour" . ($hours > 1 ? 's' : '');
            } else {
                return 'Due Today';
            }
        }

        return 'Pending Payment';
    }

    public function isApproved()
    {
        return $this->status === 'approved';
    }

    public function isPaid()
    {
        return $this->payment_status === 'paid';
    }

    public function canBeApproved()
    {
        return $this->status === 'pending' && !$this->isExpired();
    }

    public function getSubscriptionPlanNameAttribute()
    {
        return ucfirst($this->subscription_plan);
    }

    public function getStatusBadgeAttribute()
    {
        return match($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'approved' => 'bg-green-100 text-green-800',
            'rejected' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    public function getPaymentStatusBadgeAttribute()
    {
        return match($this->payment_status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'pending_verification' => 'bg-orange-100 text-orange-800',
            'paid' => 'bg-green-100 text-green-800',
            'trial' => 'bg-blue-100 text-blue-800',
            'failed', 'payment_failed' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get the associated clinic if this request has been completed.
     */
    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    /**
     * Get the full address by building it from the associated clinic data.
     */
    public function getFullAddressAttribute()
    {
        // If we have a direct address field, use it
        if ($this->address) {
            return $this->address;
        }

        // Try to get address from associated clinic
        $clinic = $this->clinic;
        if ($clinic) {
            $addressParts = [];

            if ($clinic->street_address) {
                $addressParts[] = $clinic->street_address;
            }

            if ($clinic->address_details) {
                $addressParts[] = $clinic->address_details;
            }

            // Add PSGC codes as text (since PSGC tables may not exist)
            if ($clinic->barangay_code) {
                $addressParts[] = $clinic->barangay_code;
            }

            if ($clinic->city_municipality_code) {
                $addressParts[] = $clinic->city_municipality_code;
            }

            if ($clinic->province_code) {
                $addressParts[] = $clinic->province_code;
            }

            if ($clinic->region_code) {
                $addressParts[] = $clinic->region_code;
            }

            if ($clinic->postal_code) {
                $addressParts[] = $clinic->postal_code;
            }

            return implode(', ', array_filter($addressParts));
        }

        // Fallback to a generic message
        return 'Address information not available';
    }

    /**
     * Get formatted payment details for display
     */
    public function getFormattedPaymentDetailsAttribute()
    {
        if (!$this->payment_details) {
            return null;
        }

        $details = $this->payment_details;
        $formatted = [];

        if (isset($details['sender_name'])) {
            $formatted['Sender Name'] = $details['sender_name'];
        }

        if (isset($details['sender_phone'])) {
            $formatted['Sender Phone'] = $details['sender_phone'];
        }

        if (isset($details['transaction_reference'])) {
            $formatted['Transaction Reference'] = $details['transaction_reference'];
        }

        if (isset($details['payment_amount'])) {
            $formatted['Payment Amount'] = '₱' . number_format($details['payment_amount'], 2);
        }

        return $formatted;
    }
}
