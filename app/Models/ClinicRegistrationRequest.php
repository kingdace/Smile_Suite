<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ClinicRegistrationRequest extends Model
{
    use HasFactory;

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
    ];

    protected $casts = [
        'subscription_amount' => 'decimal:2',
        'approved_at' => 'datetime',
        'expires_at' => 'datetime',
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
            'paid' => 'bg-green-100 text-green-800',
            'failed' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get the associated clinic if this request has been completed.
     */
    public function clinic()
    {
        return $this->hasOne(Clinic::class, 'email', 'email');
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
}
