import { useState, useEffect } from 'react';

export default function ThemeToggle({ showLabel = false }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    return (
        <button
            onClick={toggleDarkMode}
            className={`flex items-center gap-4 transition-all group border border-transparent ${showLabel
                ? 'w-full px-4 py-3.5 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                : 'p-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
            style={!showLabel ? { borderColor: 'var(--theme-accent)' } : {}}
            title={isDarkMode ? 'Passer au mode clair' : 'Passer au mode nuit'}
        >
            <div className="shrink-0">
                {isDarkMode ? (
                    <svg className="w-5 h-5 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary-color)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 group-hover:-rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary-color)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </div>
            {showLabel && (
                <span className="font-bold text-sm tracking-tight">
                    {isDarkMode ? 'Mode Clair' : 'Mode Nuit'}
                </span>
            )}
        </button>
    );
}
