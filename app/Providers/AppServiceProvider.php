<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

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
    }
}
