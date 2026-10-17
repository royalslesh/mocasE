import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import FloatingSupplies from '@/Components/FloatingSupplies';

export default function RootLayout({ children }) {
    const { theme_color } = usePage().props;

    const themes = {
        emerald: { primary: '#10b981', darkBg: '#020504', accent: 'rgba(16, 185, 129, 0.15)', glow: '0 0 30px rgba(16, 185, 129, 0.2)', speed: '25s' },
        blue: { primary: '#3b82f6', darkBg: '#020305', accent: 'rgba(59, 130, 246, 0.15)', glow: '0 0 40px rgba(59, 130, 246, 0.3)', speed: '40s' },
        indigo: { primary: '#6366f1', darkBg: '#020205', accent: 'rgba(99, 102, 241, 0.15)', glow: '0 0 35px rgba(99, 102, 241, 0.25)', speed: '30s' },
        purple: { primary: '#a855f7', darkBg: '#040205', accent: 'rgba(168, 85, 247, 0.15)', glow: '0 10px 50px rgba(168, 85, 247, 0.3)', speed: '35s' },
        rose: { primary: '#f43f5e', darkBg: '#050202', accent: 'rgba(244, 63, 94, 0.15)', glow: '0 0 25px rgba(244, 63, 94, 0.4)', speed: '20s' },
        amber: { primary: '#f59e0b', darkBg: '#040302', accent: 'rgba(245, 158, 11, 0.15)', glow: '0 5px 35px rgba(245, 158, 11, 0.2)', speed: '45s' },
        slate: { primary: '#475569', darkBg: '#030303', accent: 'rgba(71, 85, 105, 0.15)', glow: 'none', speed: '50s' },
        orange: { primary: '#f97316', darkBg: '#050302', accent: 'rgba(249, 115, 22, 0.15)', glow: '0 0 30px rgba(249, 115, 22, 0.3)', speed: '22s' },
        cyan: { primary: '#06b6d4', darkBg: '#020405', accent: 'rgba(6, 182, 212, 0.15)', glow: '0 0 40px rgba(6, 182, 212, 0.4)', speed: '28s' },
        teal: { primary: '#14b8a6', darkBg: '#020505', accent: 'rgba(20, 184, 166, 0.15)', glow: '0 0 35px rgba(20, 184, 166, 0.25)', speed: '32s' },
    };

    const activeTheme = themes[theme_color] || themes.emerald;

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', activeTheme.primary);
        root.style.setProperty('--dark-bg', activeTheme.darkBg);
        root.style.setProperty('--theme-accent', activeTheme.accent);
        root.style.setProperty('--theme-glow', activeTheme.glow);
        root.style.setProperty('--theme-speed', activeTheme.speed);
    }, [theme_color]);

    return (
        <div className="relative min-h-screen transition-colors duration-500 bg-white dark:bg-[var(--dark-bg)]">
            <style dangerouslySetInnerHTML={{ __html: `
                .dark select option {
                    background-color: #1a221f !important;
                    color: white !important;
                }
                .dark input::placeholder {
                    color: rgba(255, 255, 255, 0.3) !important;
                }
            `}} />
            <FloatingSupplies />
            {children}
        </div>
    );
}
