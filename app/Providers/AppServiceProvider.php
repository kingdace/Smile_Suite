<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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
            \URL::forceScheme('https');
        }

        // Share flash success message with all Inertia responses
        Inertia::share([
            'success' => function () {
                return session('success');
            },
        ]);
    }
}
