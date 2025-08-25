<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class Clinic extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'address',
        'street_address',
        'contact_number',
        'email',
        'license_number',
        'operating_hours',
        'timezone',
        'region_code',
        'province_code',
        'city_municipality_code',
        'barangay_code',
        'postal_code',
        'address_details',
        'slug',
        'logo_url',
        'description',
        'is_active',
        'subscription_plan',
        'subscription_status',
        'subscription_start_date',
        'subscription_end_date',
        'trial_ends_at',
        'last_payment_at',
        'next_payment_at',
        'stripe_customer_id',
        'stripe_subscription_id',
        'stripe_payment_method_id',
    ];

    protected $casts = [
        'operating_hours' => 'array',
        'is_active' => 'boolean',
        'subscription_start_date' => 'date',
        'subscription_end_date' => 'date',
        'trial_ends_at' => 'datetime',
        'last_payment_at' => 'datetime',
        'next_payment_at' => 'datetime',
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'id';
    }

    /**
     * Get the users associated with the clinic.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the patients associated with the clinic.
     */
    public function patients()
    {
        return $this->hasMany(Patient::class);
    }

    /**
     * Get the appointments associated with the clinic.
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Get the treatments associated with the clinic.
     */
    public function treatments()
    {
        return $this->hasMany(Treatment::class);
    }

    /**
     * Get the inventory items associated with the clinic.
     */
    public function inventory()
    {
        return $this->hasMany(Inventory::class);
    }

    /**
     * Get the suppliers associated with the clinic.
     */
    public function suppliers()
    {
        return $this->hasMany(Supplier::class);
    }

    /**
     * Get the gallery images associated with the clinic.
     */
    public function galleryImages()
    {
        return $this->hasMany(ClinicGalleryImage::class);
    }

    /**
     * Get the services associated with the clinic.
     */
    public function services()
    {
        return $this->hasMany(Service::class);
    }

    /**
     * Check if the clinic's subscription is active.
     */
    public function isSubscriptionActive()
    {
        return $this->is_active &&
               $this->subscription_status === 'active' &&
               $this->subscription_end_date > now();
    }

    // Subscription-related methods
    public function isOnTrial()
    {
        return $this->subscription_status === 'trial' &&
               $this->trial_ends_at &&
               $this->trial_ends_at->isFuture();
    }

    public function hasActiveSubscription()
    {
        return $this->subscription_status === 'active' &&
               $this->subscription_end_date &&
               $this->subscription_end_date->isFuture();
    }

    public function isSubscriptionExpired()
    {
        return $this->subscription_end_date &&
               $this->subscription_end_date->isPast();
    }

    public function startTrial()
    {
        $this->update([
            'subscription_status' => 'trial',
            'trial_ends_at' => now()->addDays(14),
            'subscription_start_date' => now(),
            'subscription_end_date' => now()->addDays(14),
        ]);
    }

    public function activateSubscription($plan, $durationInMonths = 1)
    {
        $this->update([
            'subscription_status' => 'active',
            'subscription_plan' => $plan,
            'subscription_start_date' => now(),
            'subscription_end_date' => now()->addMonths($durationInMonths),
            'last_payment_at' => now(),
            'next_payment_at' => now()->addMonths($durationInMonths),
        ]);
    }

    public function deactivateSubscription()
    {
        $this->update([
            'subscription_status' => 'inactive',
            'subscription_end_date' => now(),
        ]);
    }

    public function payments()
    {
        return $this->hasMany(\App\Models\Payment::class);
    }

    /**
     * Get the reviews associated with the clinic.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the waitlist entries associated with the clinic.
     */
    public function waitlist()
    {
        return $this->hasMany(Waitlist::class);
    }
}
