<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- other head elements -->
        <link rel="icon" href="{{ asset('img/logo.png') }}" type="image/x-icon">
        <!-- For different sizes or types of favicons, you might add more link tags -->
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('img/logo.png') }}">
        <!-- other head elements -->

        <!-- Scripts -->
        {{-- <script src="http://localhost:8097"></script> --}}
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        {{-- @vite('resources/js/app.jsx') --}}
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
