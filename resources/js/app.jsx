import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import RootLayout from '@/Layouts/RootLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const page = resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        );
        page.then((module) => {
            if (module.default.layout === undefined) {
                module.default.layout = (page) => <RootLayout children={page} />;
            } else {
                // Wrap existing layout with RootLayout
                const prevLayout = module.default.layout;
                module.default.layout = (page) => (
                    <RootLayout>{prevLayout(page)}</RootLayout>
                );
            }
        });
        return page;
    },
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#10b981',
    },
});
