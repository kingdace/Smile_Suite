<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Treatment;
use App\Models\Payment;
use App\Models\Inventory;
use App\Models\Supplier;
use App\Models\Service;
use App\Models\Waitlist;
use App\Models\DentistSchedule;
use App\Models\PurchaseOrder;
use App\Observers\ActivityLogObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        Vite::prefetch(concurrency: 3);

        // Force HTTPS in production
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }

        // Resend mail transport is auto-registered by resend/resend-laravel package
        // No manual registration needed

        // Share flash success message with all Inertia responses
        Inertia::share([
            'success' => function () {
                return session('success');
            },
        ]);

        // Register Activity Log Observers
        $this->registerActivityLogObservers();
    }

    /**
     * Register activity log observers for automatic logging.
     */
    private function registerActivityLogObservers(): void
    {
        // Only register observers if ActivityLogObserver exists
        if (class_exists(ActivityLogObserver::class)) {
            User::observe(ActivityLogObserver::class);
            Patient::observe(ActivityLogObserver::class);
            Appointment::observe(ActivityLogObserver::class);
            Treatment::observe(ActivityLogObserver::class);
            Payment::observe(ActivityLogObserver::class);
            Inventory::observe(ActivityLogObserver::class);
            Supplier::observe(ActivityLogObserver::class);
            Service::observe(ActivityLogObserver::class);
            Waitlist::observe(ActivityLogObserver::class);
            DentistSchedule::observe(ActivityLogObserver::class);
            PurchaseOrder::observe(ActivityLogObserver::class);
        }
    }
}
