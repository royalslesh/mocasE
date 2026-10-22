import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ThemeToggle from '@/Components/ThemeToggle';
import { ModernModalProvider } from '@/Components/ModernModal';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, school_name, theme_color, active_school_id, school_logo } = usePage().props;
    const user = auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    // Fermer le drawer mobile lors d'un redimensionnement écran
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileDrawerOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getNavGroups = () => {
        const groups = [];
        const hasSchoolContext = active_school_id || user.school_id;

        // Group: Dashboard
        groups.push({
            name: 'Vue d\'ensemble',
            items: [{ name: 'Tableau de Bord', href: route('dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' }]
        });

        if (hasSchoolContext) {
            // Group: Academique (Structure)
            const structureItems = [];
            if (['super_admin', 'proviseur', 'censeur', 'surveillant'].includes(user.role)) {
                structureItems.push({ name: 'Élèves', href: route('students.index'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' });
                if (['super_admin', 'proviseur', 'censeur'].includes(user.role)) {
                    structureItems.push({ name: 'Salles & Classes', href: route('classes.index'), icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2' });
                    structureItems.push({ name: 'Niveaux (1-7)', href: route('levels.index'), icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z' });
                    structureItems.push({ name: 'Matières', href: route('subjects.index'), icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13' });
                    structureItems.push({ name: 'Exports & Listes', href: route('exports.index'), icon: 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z' });
                }
            }
            if (structureItems.length > 0) {
                groups.push({ name: 'Académique', items: structureItems });
            }

            // Group: Pedagogie (Actions)
            const actionItems = [];
            if (['super_admin', 'proviseur', 'censeur', 'enseignant'].includes(user.role)) {
                if (user.role === 'enseignant') {
                    actionItems.push({ name: 'Saisir Notes', href: route('grades.create'), icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5' });
                } else {
                    actionItems.push({ name: 'Contrôle Notes', href: route('grades.create'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' });
                }
                actionItems.push({ name: 'Bulletins', href: route('students.index'), icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' });
            }
            if (['super_admin', 'proviseur', 'censeur', 'surveillant'].includes(user.role)) {
                actionItems.push({ name: 'Discipline', href: route('discipline.index'), icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z' });
            }
            if (actionItems.length > 0) {
                groups.push({ name: 'Pédagogie & Suivi', items: actionItems });
            }

            // Group: Gestion (Admin / Finances / RH)
            const adminItems = [];
            if (['super_admin', 'proviseur'].includes(user.role)) {
                adminItems.push({ name: 'Ressources Humaines', href: route('proviseur.staff.index'), icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7' });
                adminItems.push({ name: 'Identité École', href: route('school.branding.edit'), icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1' });
                adminItems.push({ name: 'Clôture & Délibérations', href: route('year.closure.index'), icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' });
            }
            if (['super_admin', 'proviseur', 'comptable'].includes(user.role)) {
                adminItems.push({ name: 'Finances & Scolarité', href: route('coming.soon'), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' });
            }
            if (adminItems.length > 0) {
                groups.push({ name: 'Gestion & Administration', items: adminItems });
            }
        }

        if (user.role === 'super_admin') {
            groups.push({
                name: 'Super Administration',
                items: [
                    { name: 'Réseau d\'Écoles', href: route('superadmin.schools.index'), icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16' },
                    { name: 'Paramètres Système', href: route('settings.edit'), icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0' },
                ]
            });
        }

        return groups;
    };

    const groups = getNavGroups();

    const getRoleLabel = (role) => {
        const labels = {
            super_admin: 'Super Admin',
            proviseur: 'Proviseur',
            censeur: 'Censeur',
            enseignant: 'Enseignant',
            surveillant: 'Surveillant Général',
            comptable: 'Comptable / Économe',
            etudiant: 'Élève',
            visiteur: 'Visiteur'
        };
        return labels[role] || 'Utilisateur';
    };

    // Raccourcis pour la barre de navigation mobile inférieure (3 onglets essentiels + 1 bouton Menu)
    const getMobileBottomNav = () => {
        const items = [
            {
                name: 'Accueil',
                href: route('dashboard'),
                active: route().current('dashboard'),
                icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
            }
        ];

        if (['super_admin', 'proviseur', 'censeur', 'surveillant'].includes(user.role)) {
            items.push({
                name: 'Élèves',
                href: route('students.index'),
                active: route().current('students.*'),
                icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197'
            });
        }

        if (['super_admin', 'proviseur', 'censeur', 'enseignant'].includes(user.role)) {
            items.push({
                name: 'Notes',
                href: route('grades.create'),
                active: route().current('grades.*'),
                icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
            });
        }

        if (user.role === 'enseignant' && items.length < 3) {
            items.push({
                name: 'Bulletins',
                href: route('students.index'),
                active: route().current('students.*'),
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            });
        }

        if (items.length < 3) {
            items.push({
                name: 'Profil',
                href: route('profile.edit'),
                active: route().current('profile.*'),
                icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            });
        }

        return items.slice(0, 3);
    };

    const bottomNavItems = getMobileBottomNav();

    return (
        <ModernModalProvider>
        <div className="min-h-screen bg-transparent transition-colors duration-300 relative overflow-x-hidden">

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 1. SIDEBAR DESKTOP (Affichée uniquement sur grands écrans >= lg) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <aside
                className={`hidden lg:flex fixed left-0 top-0 h-screen transition-all duration-300 z-50 flex-col bg-white dark:bg-[#0c120f] border-r border-gray-100 dark:border-white/10 ${
                    isSidebarOpen ? 'w-80' : 'w-24'
                }`}
            >
                <div className="p-6 flex items-center gap-4 h-24 overflow-hidden border-b border-gray-50 dark:border-white/5">
                    <div className="shrink-0 group relative">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 overflow-hidden"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                        >
                            {school_logo ? (
                                <img src={school_logo} className="w-full h-full object-cover" alt="School Logo" />
                            ) : (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            )}
                        </div>
                    </div>
                    {isSidebarOpen && (
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-black tracking-tighter text-gray-900 dark:text-white uppercase truncate">
                                {school_name || 'SLASH MOCAS'}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Établissement</span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-6 mt-4 overflow-y-auto py-4">
                    {groups.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-2">
                            {isSidebarOpen && (
                                <h3 className="px-4 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{group.name}</h3>
                            )}
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = route().current(item.href.split('://')[1]?.split('/')[1] + '.*') || route().current(item.name.toLowerCase());
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${isActive
                                                ? 'text-white shadow-lg'
                                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:opacity-100'
                                                }`}
                                            style={isActive ? {
                                                backgroundColor: 'var(--primary-color)',
                                                boxShadow: `0 8px 12px -3px var(--shadow-color)`
                                            } : {}}
                                        >
                                            <svg
                                                className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'group-hover:opacity-100'}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                style={!isActive ? { color: 'var(--primary-color)' } : {}}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                            </svg>
                                            {isSidebarOpen && <span className="font-bold text-xs truncate">{item.name}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-white/5">
                    <ThemeToggle showLabel={isSidebarOpen} />

                    <div className="mt-4 px-2 py-3 flex items-center justify-between gap-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-3 min-w-0 flex-1 group"
                            title="Mon profil & Paramètres"
                        >
                            <div
                                className="w-10 h-10 rounded-full text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md group-hover:scale-105 transition-transform"
                                style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                                {user.name.charAt(0)}
                            </div>
                            {isSidebarOpen && (
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-xs font-black text-gray-900 dark:text-white truncate group-hover:underline">{user.name}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest truncate">{getRoleLabel(user.role)}</p>
                                </div>
                            )}
                        </Link>
                        {isSidebarOpen && (
                            <div className="flex items-center gap-1">
                                <Link
                                    href={route('profile.edit')}
                                    className="p-1.5 text-gray-400 hover:text-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all"
                                    title="Mon Profil"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                                    title="Déconnexion"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 2. DRAWER MOBILE SLIDE-OVER (Menu latéral tactile pour téléphones) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {isMobileDrawerOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setIsMobileDrawerOpen(false)}
                />
            )}

            <div
                className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-[#0c120f] border-r border-gray-100 dark:border-white/10 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
                    isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header du Drawer Mobile */}
                <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-md overflow-hidden"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                        >
                            {school_logo ? (
                                <img src={school_logo} className="w-full h-full object-cover" alt="Logo" />
                            ) : (
                                user.name.charAt(0)
                            )}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xs font-black uppercase text-gray-900 dark:text-white truncate">
                                {school_name || 'SLASH MOCAS'}
                            </h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{getRoleLabel(user.role)}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Navigation Scrollable du Drawer */}
                <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
                    {groups.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-1.5">
                            <h3 className="px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">{group.name}</h3>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = route().current(item.href.split('://')[1]?.split('/')[1] + '.*') || route().current(item.name.toLowerCase());
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileDrawerOpen(false)}
                                            className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                                                isActive
                                                    ? 'text-white shadow-md'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                            }`}
                                            style={isActive ? { backgroundColor: 'var(--primary-color)' } : {}}
                                        >
                                            <svg
                                                className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                style={!isActive ? { color: 'var(--primary-color)' } : {}}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                            </svg>
                                            <span className="truncate">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer Drawer */}
                <div className="p-4 border-t border-gray-100 dark:border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500">Mode Sombre</span>
                        <ThemeToggle showLabel={false} />
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full py-2.5 px-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Déconnexion
                    </Link>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 3. MAIN CONTENT (Responsive avec largeur calibrée pour éviter tout débordement) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <main
                className={`transition-all duration-300 bg-gray-50 dark:bg-[#0c120f] min-h-screen flex flex-col min-w-0 w-full ${
                    isSidebarOpen
                        ? 'lg:ml-80 lg:w-[calc(100%-20rem)]'
                        : 'lg:ml-24 lg:w-[calc(100%-6rem)]'
                } max-w-full`}
            >
                {/* TOPBAR MOBILE (Écrans < lg) */}
                <header className="lg:hidden sticky top-0 bg-white/95 dark:bg-[#0c120f]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 h-16 px-4 flex items-center justify-between z-40">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setIsMobileDrawerOpen(true)}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/15 transition-all shrink-0"
                            aria-label="Ouvrir le menu"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </button>
                        <div className="min-w-0">
                            <span className="text-xs font-black tracking-tight text-gray-900 dark:text-white uppercase truncate block">
                                {school_name || 'SLASH MOCAS'}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest block">
                                {getRoleLabel(user.role)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <ThemeToggle showLabel={false} />
                        <Link
                            href={route('profile.edit')}
                            className="w-9 h-9 rounded-full text-white flex items-center justify-center font-black text-xs shadow-md"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                            title="Mon Profil"
                        >
                            {user.name.charAt(0)}
                        </Link>
                    </div>
                </header>

                {/* TOPBAR DESKTOP (Écrans >= lg) */}
                <header className="hidden lg:flex h-20 sticky top-0 bg-white/90 dark:bg-[#0c120f]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/10 items-center justify-between px-8 z-40">
                    <div className="flex items-center gap-6 min-w-0">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2.5 bg-gray-50 dark:bg-white/10 text-gray-500 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-white/15 transition-all"
                            style={{ color: 'var(--primary-color)' }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h12m-12 6h16" /></svg>
                        </button>
                        <div className="min-w-0 text-gray-900 dark:text-white">
                            {header}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <div className="flex flex-col text-right">
                            <span
                                className="text-[10px] font-black uppercase tracking-widest"
                                style={{ color: 'var(--primary-color)' }}
                            >
                                {school_name || 'Plateforme SLASH MOCAS'}
                            </span>
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase">Espace Sécurisé</span>
                        </div>
                    </div>
                </header>

                {/* Titre de page Mobile (si présent) */}
                {header && (
                    <div className="lg:hidden px-4 pt-3.5 pb-3 border-b border-gray-100 dark:border-white/10 bg-white/80 dark:bg-[#0c120f]/80 backdrop-blur-sm text-gray-900 dark:text-white">
                        {header}
                    </div>
                )}

                {/* Zone de contenu principale (avec padding adaptatif sur mobile et marge inférieure pour la barre mobile) */}
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-500 relative z-10 pb-28 lg:pb-12 flex-1">
                    {children}
                </div>

                {/* FOOTER AVEC CRÉDIT RAYAN NGOULA & LIEN WHATSAPP */}
                <footer className="mt-auto py-6 px-4 border-t border-gray-100 dark:border-white/5 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                        Fait par{' '}
                        <a
                            href="https://wa.me/237679543584"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-black text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1.5 transition-colors"
                        >
                            <span>Rayan Ngoula</span>
                            <svg className="w-3.5 h-3.5 text-emerald-500 fill-current inline" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                        </a>
                    </p>
                </footer>
            </main>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 4. BARRE DE NAVIGATION INFÉRIEURE MOBILE (Bottom App Bar)     */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c120f]/95 backdrop-blur-xl border-t border-gray-200/80 dark:border-white/10 px-2 py-1.5 grid grid-cols-4 items-center shadow-[0_-4px_25px_rgba(0,0,0,0.12)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.6)] safe-area-bottom">
                {bottomNavItems.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.href}
                        className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
                            item.active
                                ? 'text-gray-900 dark:text-white font-black'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold'
                        }`}
                    >
                        <div
                            className={`p-1.5 rounded-xl transition-transform ${
                                item.active ? 'scale-110 shadow-sm' : ''
                            }`}
                            style={item.active ? { backgroundColor: 'var(--primary-color)', color: '#ffffff' } : {}}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" d={item.icon} />
                            </svg>
                        </div>
                        <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">{item.name}</span>
                    </Link>
                ))}

                {/* Bouton "Menu" pour ouvrir le tiroir complet */}
                <button
                    type="button"
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold transition-all"
                >
                    <div className="p-1.5 rounded-xl bg-gray-100 dark:bg-white/10">
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                    <span className="text-[10px] mt-0.5 tracking-tight">Menu</span>
                </button>
            </div>

            {/* Toasts Container */}
            <div className="fixed top-20 right-4 sm:right-8 z-[100] flex flex-col gap-3 max-w-[90vw]">
                {usePage().props.flash?.success && (
                    <div className="bg-emerald-500 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500 text-xs sm:text-sm">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                        <span className="font-bold tracking-tight">{usePage().props.flash.success}</span>
                    </div>
                )}
                {usePage().props.flash?.error && (
                    <div className="bg-red-500 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500 text-xs sm:text-sm">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span className="font-bold tracking-tight">{usePage().props.flash.error}</span>
                    </div>
                )}
            </div>
        </div>
        </ModernModalProvider>
    );
}
