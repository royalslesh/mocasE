import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {
    const { school_name, school_logo } = usePage().props;

    const quickActions = [
        { name: 'Identité', href: route('school.branding.edit'), icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z', role: 'proviseur', color: 'indigo' },
        { name: 'Personnel', href: route('proviseur.staff.index'), icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', role: 'proviseur', color: 'rose' },
        { name: 'Délais Notes', href: route('proviseur.deadlines.index'), icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', role: 'proviseur', color: 'amber' },
        { name: 'Ouvrir Classe', href: route('levels.index'), icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', role: 'proviseur', color: 'emerald' },
        { name: 'Inscrire Élève', href: route('students.create'), icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', role: ['proviseur', 'censeur'], color: 'amber' },
        { name: 'Notes', href: route('grades.create'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', role: ['proviseur', 'censeur', 'enseignant'], color: 'indigo' },
        { name: 'Bulletins', href: route('students.index'), icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', role: ['proviseur', 'censeur'], color: 'rose' },
    ].filter(action => Array.isArray(action.role) ? action.role.includes(auth.user.role) : action.role === auth.user.role);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3 sm:gap-4">
                    {school_logo && <img src={school_logo} className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl object-cover shadow-sm ring-2 ring-black/5" alt="Logo" />}
                    <div>
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 sm:mb-1" style={{ color: 'var(--primary-color)' }}>Système Pilotage</p>
                        <h2 className="font-extrabold text-lg sm:text-2xl lg:text-3xl text-gray-900 dark:text-white leading-tight tracking-tight">Tableau de Bord</h2>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                {/* Master Hub Banner */}
                <div className="relative overflow-hidden dark:bg-[var(--dark-bg)] bg-gray-950 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl p-5 sm:p-8 lg:p-12 group">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full blur-[120px] opacity-20 group-hover:opacity-30 transition-all duration-700" style={{ backgroundColor: 'var(--primary-color)' }}></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                        <div className="space-y-3 sm:space-y-6">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[8px] sm:text-[9px] font-black text-white uppercase tracking-widest">Poste de Commandement</span>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight sm:leading-none">
                                Bonjour, <br />
                                <span style={{ color: 'var(--primary-color)' }}>{auth.user.role === 'proviseur' ? 'Directeur' : ''} {auth.user.name}</span>
                            </h1>
                            <p className="text-gray-400 text-xs sm:text-sm lg:text-base font-medium leading-relaxed max-w-md">
                                Bienvenue sur le centre de gestion de <span className="text-white font-bold">{school_name || 'votre établissement'}</span>.
                            </p>
                        </div>

                        {/* Quick Actions Grid Side */}
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                            {quickActions.map((action, i) => (
                                <Link
                                    key={i}
                                    href={action.href}
                                    className="p-3.5 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group flex flex-col gap-2.5 sm:gap-4 shadow-sm"
                                >
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: 'var(--primary-color)' }}>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={action.icon}></path></svg>
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider truncate">{action.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Key Performance Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Élèves', count: stats.students_count, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', route: 'students.index', title: 'Effectifs' },
                        { label: 'Disciplines', count: stats.subjects_count, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', route: 'subjects.index', title: 'Matières' },
                        { label: 'Logistique', count: stats.classes_count, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', route: 'levels.index', title: 'Classes' },
                        { label: 'Personnel', count: stats.staff_count, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', route: 'proviseur.staff.index', title: 'Personnel' }
                    ].map((stat, i) => (
                        <Link key={i} href={route(stat.route)} className="group bg-white dark:bg-[var(--dark-bg)] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-2xl transition-all relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 p-4 opacity-5 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary-color)' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                            </div>
                            <div className="relative z-10 space-y-4">
                                <p className="text-[10px] font-black text-gray-400 dark:opacity-40 uppercase tracking-[0.2em]">{stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <h4 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.count}</h4>
                                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-white/5" style={{ color: 'var(--primary-color)' }}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {auth.user.role === 'proviseur' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white dark:bg-[var(--dark-bg)] rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-sm">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Flux Financier</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Recettes & Scolarité</p>
                                </div>
                                <Link href={route('coming.soon')} className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Détail Complet</Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-8 rounded-[2rem] bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Recettes Journée</p>
                                    <h5 className="text-3xl font-black text-emerald-900 dark:text-emerald-400">{stats.finances_today} <span className="text-xs">FCFA</span></h5>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Total Annuel</p>
                                    <h5 className="text-3xl font-black text-blue-900 dark:text-blue-400">{stats.finances_total} <span className="text-xs">FCFA</span></h5>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Statut Système</p>
                            <h4 className="text-2xl font-black tracking-tighter mb-6 leading-tight">Mocas est parfaitement synchronisé.</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-xs font-bold text-gray-300">Base de données sécurisée</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-xs font-bold text-gray-300">7 Niveaux Académiques Actifs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* System Info */}
                <div className="rounded-3xl p-8 border" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 95%)', borderColor: 'color-mix(in srgb, var(--primary-color), transparent 90%)' }}>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white dark:bg-[var(--dark-bg)] rounded-xl shadow-sm" style={{ color: 'var(--primary-color)' }}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-tight mb-2" style={{ color: 'var(--primary-color)' }}>Note de mise à jour</h4>
                            <p className="text-sm font-medium leading-relaxed max-w-2xl text-gray-600 dark:text-gray-400">
                                L'interface de <span className="font-bold">SLASH MOCAS</span> a été réorganisée pour vous offrir un contrôle total sur votre établissement. Branding, personnel et effectifs sont désormais centralisés.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
