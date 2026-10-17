<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="{{asset('build/assets/app-BMc_Keqd.css')}}">
    <script src="{{asset('build/assets/app-DZJ0XN6s.js')}}"></script>
    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased text-gray-900 dark:text-gray-100 bg-white dark:bg-[#0c120f]">
    @inertia
    <noscript>
        <div style="padding: 20px; text-align: center; background: #fee2e2; color: #b91c1c;">
            <strong>Erreur : JavaScript est désactivé ou n'a pas pu être chargé.</strong><br>
            Veuillez vous assurer que <code>npm run dev</code> est en cours d'exécution dans votre terminal.
        </div>
    </noscript>
</body>

</html>