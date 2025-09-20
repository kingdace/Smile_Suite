<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/png" sizes="16x16" href="/images/smile-suite-logo.png">
<link rel="icon" type="image/png" sizes="32x32" href="/images/smile-suite-logo.png">
<link rel="icon" type="image/png" sizes="48x48" href="/images/smile-suite-logo.png">
<link rel="icon" type="image/png" sizes="96x96" href="/images/smile-suite-logo.png">

        <link rel="shortcut icon" type="image/png" href="/images/smile-suite-logo.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Montserrat:wght@700&display=swap" rel="stylesheet">        <style>
            body, html { font-family: 'Inter', sans-serif; }
        </style>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
