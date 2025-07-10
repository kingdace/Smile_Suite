<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Http;

class HttpClientServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        Http::macro('psgc', function () {
            return Http::withOptions([
                'verify' => storage_path('app/certs/cacert.pem'),
                'timeout' => 30,
            ])->baseUrl('https://psgc.gitlab.io/api');
        });
    }
}
