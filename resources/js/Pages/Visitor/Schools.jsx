import React, { useState, useMemo, useRef } from 'react';
import { Link, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Palette de thèmes pour les établissements
const THEME_COLORS = {
    emerald: { primary: '#10b981', light: 'rgba(16, 185, 129, 0.15)', glow: 'rgba(16, 185, 129, 0.35)', gradient: 'from-emerald-500 to-teal-600' },
    blue:    { primary: '#3b82f6', light: 'rgba(59, 130, 246, 0.15)', glow: 'rgba(59, 130, 246, 0.35)', gradient: 'from-blue-500 to-indigo-600' },
    indigo:  { primary: '#6366f1', light: 'rgba(99, 102, 241, 0.15)', glow: 'rgba(99, 102, 241, 0.35)', gradient: 'from-indigo-500 to-purple-600' },
    purple:  { primary: '#a855f7', light: 'rgba(168, 85, 247, 0.15)', glow: 'rgba(168, 85, 247, 0.35)', gradient: 'from-purple-500 to-pink-600' },
    rose:    { primary: '#f43f5e', light: 'rgba(244, 63, 94, 0.15)', glow: 'rgba(244, 63, 94, 0.35)', gradient: 'from-rose-500 to-red-600' },
    amber:   { primary: '#f59e0b', light: 'rgba(245, 158, 11, 0.15)', glow: 'rgba(245, 158, 11, 0.35)', gradient: 'from-amber-500 to-orange-600' },
    slate:   { primary: '#475569', light: 'rgba(71, 85, 105, 0.15)', glow: 'rgba(71, 85, 105, 0.25)', gradient: 'from-slate-600 to-gray-800' },
    orange:  { primary: '#f97316', light: 'rgba(249, 115, 22, 0.15)', glow: 'rgba(249, 115, 22, 0.35)', gradient: 'from-orange-500 to-amber-600' },
    cyan:    { primary: '#06b6d4', light: 'rgba(6, 182, 212, 0.15)', glow: 'rgba(6, 182, 212, 0.35)', gradient: 'from-cyan-500 to-blue-600' },
    teal:    { primary: '#14b8a6', light: 'rgba(20, 184, 166, 0.15)', glow: 'rgba(20, 184, 166, 0.35)', gradient: 'from-teal-500 to-emerald-600' },
};

// Carte interactive avec effet de profondeur 3D, inclinaison dynamique et reflet spéculaire
function School3DCard({ school }) {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const theme = THEME_COLORS[school.theme_color] || THEME_COLORS.emerald;

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calcul du tilt : rotation max +/- 9 degrés
        const rotX = ((mouseY / rect.height) - 0.5) * -16;
        const rotY = ((mouseX / rect.width) - 0.5) * 16;

        setTilt({ x: rotX, y: rotY });
        setGlare({
            x: (mouseX / rect.width) * 100,
            y: (mouseY / rect.height) * 100,
            opacity: 0.25,
        });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
        setGlare(prev => ({ ...prev, opacity: 0 }));
    };

    const coverUrl = school.cover_image_url || (school.cover_image_path ? (school.cover_image_path.startsWith('http') ? school.cover_image_path : `/storage/${school.cover_image_path}`) : null);
    const logoUrl = school.logo_url || (school.logo_path ? (school.logo_path.startsWith('http') ? school.logo_path : `/storage/${school.logo_path}`) : null);

    return (
        <div
            style={{ perspective: '1200px' }}
            className="w-full h-full"
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: isHovered
                        ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.025, 1.025, 1.025)`
                        : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                    transformStyle: 'preserve-3d',
                    transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                    boxShadow: isHovered
                        ? `0 30px 60px -15px ${theme.glow}, 0 0 35px -5px ${theme.light}`
                        : '0 10px 30px -10px rgba(0,0,0,0.06)',
                }}
                className="group relative h-full flex flex-col rounded-[2.2rem] bg-white/95 dark:bg-[#0c120e]/95 backdrop-blur-2xl border border-gray-100/80 dark:border-white/[0.08] overflow-hidden transition-all duration-300 select-none"
            >
                {/* Reflet spéculaire 3D suivant la souris */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
                    style={{
                        opacity: glare.opacity,
                        background: `radial-gradient(circle 320px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.35), transparent 70%)`,
                    }}
                />

                {/* ── BANNIÈRE VISUELLE DU HAUT (COVER OU DÉGRADÉ 3D) ───────────── */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden shrink-0 bg-slate-900">
                    {coverUrl ? (
                        <img
                            src={coverUrl}
                            alt={`Campus ${school.name}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 contrast-105"
                        />
                    ) : (
                        <div
                            className={`w-full h-full bg-gradient-to-tr ${theme.gradient} opacity-90 relative`}
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/40" />
                            {/* Motifs géométriques décoratifs */}
                            <svg className="absolute -bottom-8 -right-8 w-44 h-44 text-white/10" viewBox="0 0 200 200" fill="currentColor">
                                <circle cx="100" cy="100" r="80" />
                            </svg>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                    {/* Badges Flottants 3D sur la bannière */}
                    <div
                        style={{ transform: 'translateZ(25px)' }}
                        className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10"
                    >
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md bg-black/50 text-white/95 border border-white/15 flex items-center gap-1.5 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
                            {school.city || 'Cameroun'}
                        </span>

                        {school.code && (
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-sm">
                                {school.code}
                            </span>
                        )}
                    </div>

                    {/* Logo flottant en relief 3D (chevauchant la bannière) */}
                    <div
                        style={{ transform: 'translateZ(45px)' }}
                        className="absolute -bottom-6 left-6 z-20"
                    >
                        <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1.5 bg-white dark:bg-[#0c120e] shadow-xl border-2 border-white dark:border-white/10 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105"
                            style={{ boxShadow: `0 12px 28px -6px ${theme.glow}` }}
                        >
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={`Logo ${school.name}`}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                <div
                                    className="w-full h-full rounded-xl flex items-center justify-center font-black text-white text-lg uppercase"
                                    style={{ backgroundColor: theme.primary }}
                                >
                                    {school.name.substring(0, 2)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── CORPS DE LA CARTE AVEC PROFONDEUR ─────────────────────────── */}
                <div className="pt-9 p-6 flex-1 flex flex-col justify-between space-y-5">
                    {/* Nom & Devise */}
                    <div style={{ transform: 'translateZ(20px)' }} className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ backgroundColor: theme.light, color: theme.primary }}>
                                {school.academic_year ? `Année ${school.academic_year}` : 'Session Active'}
                            </span>
                            {school.is_active && (
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                    Homologué
                                </span>
                            )}
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1 group-hover:text-[var(--primary-color)] transition-colors">
                            {school.name}
                        </h3>

                        {school.motto ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic line-clamp-1 font-serif">
                                « {school.motto} »
                            </p>
                        ) : (
                            <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">
                                {school.description || 'Établissement d\'enseignement secondaire d\'excellence.'}
                            </p>
                        )}
                    </div>

                    {/* Métriques / Indicateurs clés en relief */}
                    <div
                        style={{ transform: 'translateZ(28px)' }}
                        className="grid grid-cols-2 gap-2.5 pt-2"
                    >
                        <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: theme.light, color: theme.primary }}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m0 0h10" /></svg>
                            </div>
                            <div className="min-w-0">
                                <span className="block text-[9px] font-black uppercase tracking-wider text-gray-400">Classes</span>
                                <span className="block text-sm font-black text-gray-900 dark:text-white truncate">
                                    {school.classes_count !== undefined ? `${school.classes_count} classes` : 'Ouvertes'}
                                </span>
                            </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: theme.light, color: theme.primary }}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <div className="min-w-0">
                                <span className="block text-[9px] font-black uppercase tracking-wider text-gray-400">Effectif</span>
                                <span className="block text-sm font-black text-gray-900 dark:text-white truncate">
                                    {school.eleves_count !== undefined ? `${school.eleves_count} élèves` : 'Inscrits'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Statut Bulletins & Action */}
                    <div
                        style={{ transform: 'translateZ(35px)' }}
                        className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-3"
                    >
                        <div className="flex items-center gap-1.5 text-[11px] font-bold">
                            {school.is_report_cards_visible ? (
                                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                                    Bulletins en ligne
                                </span>
                            ) : (
                                <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700 shrink-0" />
                                    Délibérations
                                </span>
                            )}
                        </div>

                        <Link
                            href={route('visitor.schoolDetails', school.id)}
                            className="px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md flex items-center gap-2 group/btn transition-all active:scale-95"
                            style={{
                                backgroundColor: theme.primary,
                                boxShadow: `0 8px 20px -4px ${theme.glow}`,
                            }}
                        >
                            <span>Visiter</span>
                            <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Schools({ schools = [], auth = {} }) {
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    // Filtres & Recherche interactifs
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('ALL');
    const [sortBy, setSortBy] = useState('name'); // 'name', 'classes', 'students'

    // Extraction dynamique des villes uniques
    const cities = useMemo(() => {
        const unique = Array.from(new Set(schools.map(s => s.city).filter(Boolean)));
        return unique.sort();
    }, [schools]);

    // Filtrage et tri
    const filteredSchools = useMemo(() => {
        return schools
            .filter((s) => {
                const matchCity = selectedCity === 'ALL' || s.city === selectedCity;
                const query = searchQuery.toLowerCase().trim();
                if (!query) return matchCity;
                const matchName = s.name?.toLowerCase().includes(query);
                const matchCityText = s.city?.toLowerCase().includes(query);
                const matchMotto = s.motto?.toLowerCase().includes(query);
                const matchCode = s.code?.toLowerCase().includes(query);
                return matchCity && (matchName || matchCityText || matchMotto || matchCode);
            })
            .sort((a, b) => {
                if (sortBy === 'classes') {
                    return (b.classes_count || 0) - (a.classes_count || 0);
                }
                if (sortBy === 'students') {
                    return (b.eleves_count || 0) - (a.eleves_count || 0);
                }
                return (a.name || '').localeCompare(b.name || '');
            });
    }, [schools, searchQuery, selectedCity, sortBy]);

    return (
        <Layout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-black text-lg sm:text-2xl uppercase tracking-tight" style={{ color: 'var(--primary-color)' }}>
                        Catalogue des Établissements
                    </h2>
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                        {schools.length} Campus Homologué(s)
                    </span>
                </div>
            }
        >
            <Head title="Catalogue des Établissements — Portail Officiel" />

            <div className="max-w-[95rem] mx-auto py-8 sm:py-16 px-4 sm:px-8 space-y-12">

                {/* ── HERO BANNER AVEC PROFONDEUR ET LUMIÈRE 3D ─────────────────── */}
                <div className="relative text-center max-w-4xl mx-auto space-y-6">
                    {/* Badge 3D pulsé */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                            Portail National MINESEC &amp; Partenaires
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                        Découvrez les Campus Scolaires d’Excellence
                    </h1>

                    <p className="text-xs sm:text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Explorez les présentations détaillées, les cycles d'enseignement, les visites virtuelles et accédez instantanément à l'espace des bulletins scolaires officiels.
                    </p>

                    {/* ── BARRE DE RECHERCHE & FILTRES INTELLIGENTS ─────────────── */}
                    <div className="pt-4 max-w-3xl mx-auto">
                        <div className="p-2 sm:p-2.5 bg-white/95 dark:bg-[#0c1410]/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-gray-200/80 dark:border-white/10 shadow-xl flex flex-col sm:flex-row items-center gap-2.5">
                            <div className="relative flex-1 w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher un lycée, collège, ville, code..."
                                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-transparent border-0 text-xs sm:text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                </div>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                    <option value="name">Trier par Nom</option>
                                    <option value="classes">Plus de Classes</option>
                                    <option value="students">Plus d'Élèves</option>
                                </select>
                            </div>
                        </div>

                        {/* Filtres par ville (Pills) */}
                        {cities.length > 0 && (
                            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
                                <button
                                    onClick={() => setSelectedCity('ALL')}
                                    className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${selectedCity === 'ALL'
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25 scale-105'
                                        : 'bg-white/60 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200/60 dark:border-white/5'
                                    }`}
                                >
                                    Tous ({schools.length})
                                </button>
                                {cities.map((city) => {
                                    const count = schools.filter(s => s.city === city).length;
                                    const isSelected = selectedCity === city;
                                    return (
                                        <button
                                            key={city}
                                            onClick={() => setSelectedCity(city)}
                                            className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${isSelected
                                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25 scale-105'
                                                : 'bg-white/60 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200/60 dark:border-white/5'
                                            }`}
                                        >
                                            {city} ({count})
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── GRILLE DES ÉTABLISSEMENTS 3D ──────────────────────────────── */}
                {filteredSchools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 sm:gap-10">
                        {filteredSchools.map((school) => (
                            <School3DCard key={school.id} school={school} />
                        ))}
                    </div>
                ) : (
                    <div className="p-16 text-center rounded-[2.5rem] bg-white/50 dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/5 max-w-xl mx-auto space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            Aucun établissement trouvé
                        </h3>
                        <p className="text-xs text-gray-400">
                            Aucun campus ne correspond aux critères de recherche « {searchQuery} ».
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCity('ALL'); }}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-emerald-700 transition-colors"
                        >
                            Réinitialiser la recherche
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}
