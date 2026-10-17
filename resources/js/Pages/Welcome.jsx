import { Head, Link, usePage } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';

export default function Welcome({ auth }) {
    const { school_name } = usePage().props;

    const features = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            ),
            label: 'Gestion des Élèves',
            desc: 'Inscriptions, matricules, suivi complet',
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            ),
            label: 'Notes & Bulletins',
            desc: 'Saisie en ligne, bulletins PDF automatiques',
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            ),
            label: 'Statistiques',
            desc: 'Taux de réussite, classements, analyses',
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            ),
            label: 'Multi-Rôles',
            desc: 'Proviseur, Censeur, Enseignant, Élève',
        },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#080c0a] text-gray-900 dark:text-white overflow-x-hidden">
            <style>{`
                ::selection { background-color: var(--primary-color); color: white; }
                .glow { box-shadow: 0 0 80px -20px var(--primary-color); }
                .card-hover { transition: transform 0.2s, box-shadow 0.2s; }
                .card-hover:hover { transform: translateY(-4px); }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                .float { animation: float 4s ease-in-out infinite; }
                @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
                .shimmer {
                    background: linear-gradient(90deg, var(--primary-color) 0%, color-mix(in srgb, var(--primary-color), white 40%) 50%, var(--primary-color) 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 4s linear infinite;
                }
            `}</style>

            <Head title={`Bienvenue — ${school_name || 'MOCAS'}`} />

            {/* Fond décoratif */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full blur-[120px] opacity-[0.07] dark:opacity-[0.12]" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.05] dark:opacity-[0.08]" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundColor: 'var(--primary-color)' }}></div>
            </div>

            {/* NAV */}
            <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 border-b border-gray-100 dark:border-white/5 backdrop-blur-sm bg-white/80 dark:bg-[#080c0a]/80 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--primary-color)' }}>
                        {usePage().props.school_logo ? (
                            <img src={usePage().props.school_logo} className="w-full h-full object-cover" alt="Logo" />
                        ) : (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        )}
                    </div>
                    <span className="text-lg font-black tracking-tight uppercase">{school_name || 'MOCAS'}</span>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link href={route('visitor.schools')} className="hidden md:inline-block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Explorer
                    </Link>
                    {!auth.user ? (
                        <Link href={route('login')} className="px-5 py-2.5 text-white text-xs font-black rounded-xl uppercase tracking-widest transition-all hover:opacity-90 active:scale-95" style={{ backgroundColor: 'var(--primary-color)' }}>
                            Connexion
                        </Link>
                    ) : (
                        <Link href={route('dashboard')} className="px-5 py-2.5 text-white text-xs font-black rounded-xl uppercase tracking-widest transition-all hover:opacity-90" style={{ backgroundColor: 'var(--primary-color)' }}>
                            Mon Espace
                        </Link>
                    )}
                </div>
            </nav>

            {/* HERO */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-16 lg:pt-28 lg:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Texte gauche */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 92%)', borderColor: 'color-mix(in srgb, var(--primary-color), transparent 70%)', color: 'var(--primary-color)' }}>
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary-color)' }}></span>
                            Plateforme Scolaire de Nouvelle Génération
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.92]">
                            Gérez votre<br />
                            école avec<br />
                            <span className="shimmer">précision.</span>
                        </h1>

                        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-lg">
                            Inscriptions, notes, bulletins, discipline, exports PDF — tout ce dont un établissement scolaire a besoin, dans une seule plateforme sécurisée.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href={route('visitor.schools')} className="group inline-flex items-center gap-3 px-8 py-4 text-white font-black rounded-2xl text-sm uppercase tracking-widest transition-all hover:opacity-90 hover:translate-y-[-2px] active:scale-95 shadow-xl" style={{ backgroundColor: 'var(--primary-color)', boxShadow: '0 20px 40px -12px var(--primary-color)' }}>
                                Explorer les Établissements
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                            <Link href={route('login')} className="inline-flex items-center gap-2 px-8 py-4 font-black rounded-2xl text-sm uppercase tracking-widest border-2 transition-all hover:translate-y-[-2px]" style={{ borderColor: 'color-mix(in srgb, var(--primary-color), transparent 60%)', color: 'var(--primary-color)' }}>
                                Espace Personnel
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="pt-4 flex items-center gap-8">
                            {[
                                { n: '500+', label: 'Établissements' },
                                { n: '50K+', label: 'Élèves gérés' },
                                { n: '99.9%', label: 'Disponibilité' },
                            ].map((s, i) => (
                                <div key={i}>
                                    <p className="text-2xl font-black" style={{ color: 'var(--primary-color)' }}>{s.n}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Carte décorative droite */}
                    <div className="relative float">
                        {/* Glow */}
                        <div className="absolute inset-0 rounded-[2.5rem] glow opacity-30 dark:opacity-50 blur-2xl scale-95" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 50%)' }}></div>

                        {/* Card principale */}
                        <div className="relative bg-white dark:bg-[#111614] border border-gray-100 dark:border-white/8 rounded-[2.5rem] p-6 shadow-2xl">

                            {/* Header card */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tableau de bord</p>
                                    <p className="font-black text-lg mt-0.5">Proviseur</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 85%)' }}>
                                    <svg className="w-5 h-5" style={{ color: 'var(--primary-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                </div>
                            </div>

                            {/* Mini stats */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[
                                    { val: '847', label: 'Élèves', color: 'var(--primary-color)' },
                                    { val: '34', label: 'Classes', color: '#f59e0b' },
                                    { val: '82%', label: 'Réussite', color: '#10b981' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 text-center">
                                        <p className="text-xl font-black" style={{ color: s.color }}>{s.val}</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Liste d'activité récente */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Activité récente</p>
                                {[
                                    { text: 'Notes Seq.2 saisies — Maths Tle C', time: 'Il y a 2min', dot: 'var(--primary-color)' },
                                    { text: 'Nouveau bulletin généré — 3ème Esp', time: 'Il y a 15min', dot: '#10b981' },
                                    { text: 'Inscription validée — KENGNE Paul', time: 'Il y a 1h', dot: '#f59e0b' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.dot }}></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{item.text}</p>
                                            <p className="text-[10px] text-gray-400">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Barre de progression */}
                            <div className="mt-6 space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bulletins générés</p>
                                    <p className="text-[10px] font-black" style={{ color: 'var(--primary-color)' }}>68%</p>
                                </div>
                                <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all" style={{ width: '68%', backgroundColor: 'var(--primary-color)' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Badge flottant */}
                        <div className="absolute -bottom-4 -left-4 bg-white dark:bg-[#111614] border border-gray-100 dark:border-white/10 rounded-2xl p-3 shadow-xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, #10b981, transparent 85%)' }}>
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-900 dark:text-white">Sécurisé</p>
                                <p className="text-[9px] text-gray-400">Isolation par école</p>
                            </div>
                        </div>

                        <div className="absolute -top-4 -right-4 bg-white dark:bg-[#111614] border border-gray-100 dark:border-white/10 rounded-2xl p-3 shadow-xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 85%)' }}>
                                <svg className="w-4 h-4" style={{ color: 'var(--primary-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-900 dark:text-white">Temps Réel</p>
                                <p className="text-[9px] text-gray-400">Données synchronisées</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="relative z-10 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0c110e]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white dark:bg-[#111614] border border-gray-100 dark:border-white/8 rounded-2xl p-6 card-hover cursor-default">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 88%)', color: 'var(--primary-color)' }}>
                                    {f.icon}
                                </div>
                                <h3 className="font-black text-sm uppercase tracking-tight mb-1">{f.label}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16">
                <div className="rounded-[2.5rem] p-10 md:p-14 text-white text-center relative overflow-hidden" style={{ backgroundColor: 'var(--primary-color)' }}>
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-white blur-2xl"></div>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase mb-4">Prêt à moderniser votre établissement ?</h2>
                        <p className="text-white/80 font-medium mb-8 max-w-xl mx-auto">Rejoignez des centaines d'établissements qui font confiance à MOCAS pour leur gestion quotidienne.</p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href={route('visitor.schools')} className="px-8 py-4 bg-white font-black rounded-2xl text-sm uppercase tracking-widest transition-all hover:opacity-90 active:scale-95" style={{ color: 'var(--primary-color)' }}>
                                Voir les établissements
                            </Link>
                            <Link href={route('login')} className="px-8 py-4 bg-white/10 border border-white/20 text-white font-black rounded-2xl text-sm uppercase tracking-widest transition-all hover:bg-white/20 backdrop-blur-sm">
                                Se connecter
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative z-10 border-t border-gray-100 dark:border-white/5 px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{school_name || 'MOCAS'} — Tous droits réservés</p>
                <p className="text-xs text-gray-400 font-medium">
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
            </footer>
        </div>
    );
}