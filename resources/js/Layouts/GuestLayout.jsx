import ThemeToggle from '@/Components/ThemeToggle';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ header, children, variant = 'wide' }) {
    const { school_name } = usePage().props;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#070b09] text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
            {/* Navbar */}
            <nav className="relative z-50 bg-white/90 dark:bg-[#0c120f]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Link href="/" className="flex items-center gap-2 group min-w-0">
                            <div
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 overflow-hidden shrink-0"
                                style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                                {usePage().props.school_logo ? (
                                    <img src={usePage().props.school_logo} className="w-full h-full object-cover" alt="Logo" />
                                ) : (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                )}
                            </div>
                            <span className="text-sm sm:text-base lg:text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase truncate max-w-[120px] sm:max-w-[220px] lg:max-w-none">
                                {school_name || 'SLASH MOCAS'}
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <Link
                            href={route('visitor.schools')}
                            className="text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors hidden sm:inline-block"
                            style={{ color: 'var(--primary-color)' }}
                        >
                            Catalogue
                        </Link>

                        <div className="h-5 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

                        <ThemeToggle />

                        <Link
                            href={route('login')}
                            className="px-3 sm:px-6 py-2 sm:py-3 text-white text-[10px] sm:text-xs font-black rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                        >
                            Connexion
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Header if provided */}
            {header && (
                <header className="bg-white dark:bg-[#0c120f] border-b border-gray-100 dark:border-white/10">
                    <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-10 px-4 sm:px-6 lg:px-10">
                        {header}
                    </div>
                </header>
            )}

            {/* Page Content */}
            <main className="relative z-10 flex flex-col items-center justify-center py-6 sm:py-10 lg:py-12">
                {variant === 'card' ? (
                    <div className="w-full sm:max-w-md px-4 sm:px-8 py-8 sm:py-10 bg-white dark:bg-[#111714] border border-gray-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-2xl rounded-[1.5rem] sm:rounded-[2.5rem]">
                        {children}
                    </div>
                ) : (
                    <div className="w-full max-w-7xl px-3 sm:px-6 lg:px-10">
                        {children}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="px-4 sm:px-8 lg:px-10 py-8 sm:py-12 lg:py-16 border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0c120f]/50 mt-10 sm:mt-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-10">
                    <div className="text-center md:text-left">
                        <span className="text-sm sm:text-xl font-bold tracking-tighter text-gray-900 dark:text-white/90 uppercase">{school_name || 'SLASH MOCAS'}</span>
                        <p className="text-xs text-gray-400 font-bold mt-1 italic">Plateforme de Consultation Publique.</p>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                            Fait par{' '}
                            <a
                                href="https://wa.me/237679543584"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                                Rayan Ngoula
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
