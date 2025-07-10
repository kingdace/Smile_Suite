<?php

namespace App\Providers;

use App\Models\Inventory;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\Supplier;
use App\Models\Treatment;
use App\Policies\InventoryPolicy;
use App\Policies\PatientPolicy;
use App\Policies\PaymentPolicy;
use App\Policies\SupplierPolicy;
use App\Policies\TreatmentPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Patient::class => PatientPolicy::class,
        Treatment::class => TreatmentPolicy::class,
        Payment::class => PaymentPolicy::class,
        Inventory::class => InventoryPolicy::class,
        Supplier::class => SupplierPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
