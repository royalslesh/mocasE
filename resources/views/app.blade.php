<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light dark">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Initialisation Immédiate du Thème (Évite le flash blanc) -->
    <script>
        (function() {
            try {
                var theme = localStorage.getItem('theme');
                var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } catch (e) {}
        })();
    </script>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts & Styles via Vite -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased text-gray-900 dark:text-gray-100 bg-white dark:bg-[#0c120f]">
    @inertia
    <noscript>
        <div style="padding: 20px; text-align: center; background: #fee2e2; color: #b91c1c;">
            <strong>JavaScript est requis pour utiliser la plateforme MocasE.</strong><br>
            Veuillez activer JavaScript dans les paramètres de votre navigateur pour continuer.
        </div>
    </noscript>
</body>

</html>
