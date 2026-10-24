import React, { useState, useMemo, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SchoolDetails({ school, stats, levels = [], matieres = [], academic_histories = [], auth }) {
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    // Search bulletin state
    const [matriculeInput, setMatriculeInput] = useState('');
    const [searchError, setSearchError] = useState('');

    // Lightbox modal state for gallery
    const [activeImageIndex, setActiveImageIndex] = useState(null);

    // Modal state for selected class details
    const [selectedClass, setSelectedClass] = useState(null);

    // Filtre des matières
    const [subjectSearch, setSubjectSearch] = useState('');
    const [selectedLevelFilter, setSelectedLevelFilter] = useState('ALL');

    // Navigation d'onglets rapides
    const [activeTab, setActiveTab] = useState('overview');

    const handleSearchBulletin = (e) => {
        e.preventDefault();
        const trimmed = matriculeInput.trim().toUpperCase();
        if (!trimmed) {
            setSearchError('Veuillez renseigner un matricule élève.');
            return;
        }
        setSearchError('');
        router.visit(route('visitor.bulletin', trimmed));
    };

    // Helper to extract embed video URL
    const getVideoEmbed = (url) => {
        if (!url) return null;
        try {
            const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
            if (ytMatch && ytMatch[1]) {
                return {
                    type: 'iframe',
                    src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`
                };
            }
            const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
            if (vimeoMatch && vimeoMatch[1]) {
                return {
                    type: 'iframe',
                    src: `https://player.vimeo.com/video/${vimeoMatch[1]}`
                };
            }
            if (url.match(/\.(mp4|webm|ogg)($|\?)/i) || url.includes('/video/upload/')) {
                return {
                    type: 'video',
                    src: url
                };
            }
            return {
                type: 'iframe',
                src: url
            };
        } catch {
            return null;
        }
    };

    const videoEmbed = getVideoEmbed(school.video_url);
    const gallery = Array.isArray(school.gallery_images) ? school.gallery_images : [];

    const coverUrl = school.cover_image_url || (school.cover_image_path ? (school.cover_image_path.startsWith('http') ? school.cover_image_path : `/storage/${school.cover_image_path}`) : null);
    const logoUrl = school.logo_url || (school.logo_path ? (school.logo_path.startsWith('http') ? school.logo_path : `/storage/${school.logo_path}`) : null);

    // Groupement des matières (SANS COEFFICIENTS)
    const categorizedSubjects = useMemo(() => {
        const filtered = matieres.filter(m => !subjectSearch || m.nom.toLowerCase().includes(subjectSearch.toLowerCase()));
        const groups = {};
        filtered.forEach(m => {
            const groupName = m.groupe || 'Enseignements Généraux';
            if (!groups[groupName]) groups[groupName] = [];
            groups[groupName].push(m);
        });
        return groups;
    }, [matieres, subjectSearch]);

    // Filtrage des classes selon le niveau
    const filteredLevels = useMemo(() => {
        if (selectedLevelFilter === 'ALL') return levels;
        return levels.filter(lvl => String(lvl.id) === String(selectedLevelFilter));
    }, [levels, selectedLevelFilter]);

    return (
        <Layout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/10" style={{ backgroundColor: 'var(--primary-color)' }}>
                            {logoUrl ? (
                                <img src={logoUrl} className="w-full h-full object-cover" alt="Logo" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-white text-xs">
                                    {school.name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <h2 className="font-black text-base sm:text-xl uppercase tracking-tight truncate text-gray-900 dark:text-white">
                            {school.name}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {school.code && (
                            <span className="hidden md:inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                Code : {school.code}
                            </span>
                        )}
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                            {school.city || 'Cameroun'}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title={`${school.name} — Présentation & Vie Scolaire`} />

            <div className="space-y-10 sm:space-y-12 max-w-[100rem] mx-auto py-4 sm:py-8 px-3 sm:px-6">

                {/* ── HERO BANNER 3D PRESTIGE & LIGHTING ─────────────────────────── */}
                <div className="relative rounded-3xl sm:rounded-[3.2rem] text-white shadow-2xl overflow-hidden border border-white/15 bg-slate-950">
                    {/* Image de couverture en arrière-plan */}
                    {coverUrl ? (
                        <div className="absolute inset-0">
                            <img
                                src={coverUrl}
                                alt={`Campus ${school.name}`}
                                className="w-full h-full object-cover filter brightness-[0.38] contrast-105 scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
                        </div>
                    ) : (
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--primary-color) 40%, transparent), black 75%)`
                            }}
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/60" />
                        </div>
                    )}

                    {/* Halo de lumière ambiant 3D */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-35"
                        style={{ backgroundColor: 'var(--primary-color)' }}
                    />

                    <div className="relative z-10 p-6 sm:p-10 md:p-14 space-y-8">
                        {/* Badges d'état et accréditation */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {school.is_active ? 'Établissement Homologué MINESEC' : 'Établissement Enregistré'}
                            </span>

                            {school.code && (
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-200 border border-white/10">
                                    Matricule : {school.code}
                                </span>
                            )}

                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white/90">
                                {school.city || 'Cameroun'}
                            </span>

                            {school.academic_year && (
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white/70">
                                    Année Scolaire {school.academic_year}
                                </span>
                            )}
                        </div>

                        {/* Identité Établissement & Devise 3D Shield */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left">
                            {/* Shield du Logo en 3D */}
                            <div
                                className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border-2 border-white/25 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] shrink-0 p-2 relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                                {logoUrl ? (
                                    <img src={logoUrl} className="w-full h-full object-cover rounded-2xl drop-shadow" alt="Logo officiel" />
                                ) : (
                                    <svg className="w-14 h-14 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m0 0h10" />
                                    </svg>
                                )}
                            </div>

                            <div className="space-y-3 max-w-4xl">
                                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-[1.08] drop-shadow-md text-white">
                                    {school.name}
                                </h1>

                                {school.motto && (
                                    <p className="text-base sm:text-2xl font-bold italic tracking-wide text-white/95 drop-shadow font-serif">
                                        « {school.motto} »
                                    </p>
                                )}

                                {school.description && (
                                    <p className="text-xs sm:text-sm text-gray-200/95 leading-relaxed font-medium max-w-3xl">
                                        {school.description}
                                    </p>
                                )}

                                {(school.region || school.departement) && (
                                    <p className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
                                        <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                                        {school.region && `Région : ${school.region}`} {school.departement && `• Département : ${school.departement}`}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Grille des KPIs en verre 3D */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-white/10">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center hover:bg-white/15 transition-colors shadow-lg">
                                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-300 mb-1">Taux de Réussite</p>
                                <p className="text-2xl sm:text-4xl font-black text-white">{stats.success_rate}%</p>
                                <span className="text-[9px] text-white/60 font-medium">Moyennes ≥ 10/20</span>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center hover:bg-white/15 transition-colors shadow-lg">
                                <p className="text-[10px] font-black uppercase tracking-wider text-white/80 mb-1">Élèves Inscrits</p>
                                <p className="text-2xl sm:text-4xl font-black text-white">{stats.student_count}</p>
                                <span className="text-[9px] text-white/60 font-medium">Effectif Officiel</span>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center hover:bg-white/15 transition-colors shadow-lg">
                                <p className="text-[10px] font-black uppercase tracking-wider text-white/80 mb-1">Salles de Classe</p>
                                <p className="text-2xl sm:text-4xl font-black text-white">{stats.class_count}</p>
                                <span className="text-[9px] text-white/60 font-medium">Divisions Actives</span>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center hover:bg-white/15 transition-colors shadow-lg">
                                <p className="text-[10px] font-black uppercase tracking-wider text-white/80 mb-1">Corps Professoral</p>
                                <p className="text-2xl sm:text-4xl font-black text-white">{stats.teacher_count || stats.subject_count}</p>
                                <span className="text-[9px] text-white/60 font-medium">Enseignants Qualifiés</span>
                            </div>
                        </div>

                        {/* Boutons d'Action Rapide */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <a
                                href="#espace-bulletins"
                                className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/30 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                Espace Bulletins Scolaires
                            </a>

                            {videoEmbed && (
                                <a
                                    href="#video-presentation"
                                    className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-black text-xs uppercase tracking-wider border border-white/20 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                                    Vidéo de Présentation
                                </a>
                            )}

                            {gallery.length > 0 && (
                                <a
                                    href="#galerie-photos"
                                    className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-black text-xs uppercase tracking-wider border border-white/20 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    Galerie Campus ({gallery.length})
                                </a>
                            )}

                            {school.contacts && (
                                <span className="text-xs text-white/80 font-bold ml-auto hidden lg:inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                    {school.contacts}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── ESPACE BULLETINS SCOLAIRES (ACCÈS DIRECT PARENTS & ÉLÈVES) ──── */}
                <div id="espace-bulletins" className="scroll-mt-8">
                    <div className="p-6 sm:p-10 rounded-3xl sm:rounded-[2.8rem] bg-gradient-to-br from-white via-white to-gray-50 dark:from-[var(--dark-bg)] dark:via-[var(--dark-bg)] dark:to-white/5 border-2 border-emerald-500/25 shadow-2xl space-y-6 relative overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                        Espace Parents &amp; Visiteurs
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                        Consulter un Bulletin Scolaire Officiel
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Recherchez et téléchargez en direct le relevé de notes certifié d'un élève inscrit dans cet établissement.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm ${school.is_report_cards_visible ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-500/30'}`}>
                                    {school.is_report_cards_visible ? '● Bulletins Publiés en Ligne' : '○ Délibérations en cours'}
                                </span>
                            </div>
                        </div>

                        {school.is_report_cards_visible ? (
                            <form onSubmit={handleSearchBulletin} className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={matriculeInput}
                                            onChange={(e) => setMatriculeInput(e.target.value)}
                                            placeholder="Saisissez le matricule officiel (ex: MC-002-2026-00001)..."
                                            className="w-full px-5 py-4 pl-12 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
                                    >
                                        <span>Consulter le Bulletin</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                    </button>
                                </div>

                                {searchError && (
                                    <p className="text-xs text-rose-500 font-bold">{searchError}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-400 pt-1">
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                                        Consultation instantanée par Séquence ou Trimestre
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                                        Téléchargement PDF officiel sécurisé
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                                        Grille d'évaluation conforme MINESEC
                                    </span>
                                </div>
                            </form>
                        ) : (
                            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-bold space-y-2">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                    <span className="font-black uppercase tracking-tight">Délibérations en cours de validation</span>
                                </div>
                                <p className="opacity-90 leading-relaxed font-normal">
                                    Les bulletins de notes de cet établissement ne sont pas encore ouverts à la consultation publique. La direction et le conseil des professeurs procèdent actuellement à la validation des moyennes et des rangs. Merci de vous reconnecter prochainement.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── SHOWCASE VIDÉO DE PRÉSENTATION & CAMPUS CINEMA ─────────────── */}
                {videoEmbed && (
                    <div id="video-presentation" className="scroll-mt-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Multimédia &amp; Immersion</span>
                                <h3 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mt-0.5">
                                    Visite Virtuelle &amp; Vidéo de Présentation
                                </h3>
                            </div>
                        </div>

                        <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl bg-black border border-white/10 aspect-video max-w-5xl mx-auto">
                            {videoEmbed.type === 'iframe' ? (
                                <iframe
                                    src={videoEmbed.src}
                                    title="Vidéo de présentation"
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <video
                                    src={videoEmbed.src}
                                    controls
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* ── GALERIE PHOTOS DU CAMPUS ───────────────────────────────────── */}
                {gallery.length > 0 && (
                    <div id="galerie-photos" className="scroll-mt-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-sky-500">Campus &amp; Cadre de Vie</span>
                                <h3 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mt-0.5">
                                    Galerie Photos des Infrastructures &amp; Activités
                                </h3>
                                <p className="text-xs text-gray-400">Cliquez sur une photo pour l'agrandir en plein écran.</p>
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full">
                                {gallery.length} clichés
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {gallery.map((imgUrl, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-md bg-black/40 border border-gray-100 dark:border-white/5 hover:border-[var(--primary-color)] transition-all"
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`Campus ${idx + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md flex items-center justify-center text-gray-900 dark:text-white shadow-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── LIGHTBOX PLEIN ÉCRAN POUR LA GALERIE ───────────────────────── */}
                {activeImageIndex !== null && gallery[activeImageIndex] && (
                    <div
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200"
                        onClick={() => setActiveImageIndex(null)}
                    >
                        <button
                            onClick={() => setActiveImageIndex(null)}
                            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
                            aria-label="Fermer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>

                        <div className="relative max-w-5xl max-h-[85vh]" onClick={e => e.stopPropagation()}>
                            <img
                                src={gallery[activeImageIndex]}
                                alt="Agrandissement"
                                className="max-w-full max-h-[85vh] rounded-3xl object-contain shadow-2xl border border-white/10"
                            />

                            {gallery.length > 1 && (
                                <div className="absolute inset-y-0 -inset-x-12 sm:-inset-x-16 flex items-center justify-between pointer-events-none">
                                    <button
                                        onClick={() => setActiveImageIndex((activeImageIndex - 1 + gallery.length) % gallery.length)}
                                        className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all pointer-events-auto"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                                    </button>
                                    <button
                                        onClick={() => setActiveImageIndex((activeImageIndex + 1) % gallery.length)}
                                        className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all pointer-events-auto"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                                    </button>
                                </div>
                            )}

                            <p className="text-center text-white/70 text-xs font-bold mt-4">
                                Photographie {activeImageIndex + 1} sur {gallery.length}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── STRUCTURE ACADÉMIQUE : NIVEAUX, CLASSES CLIQUABLES & MATIÈRES ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Colonne Gauche (2/3) : Niveaux & Classes Cliquables */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        <div className="bg-white dark:bg-[var(--dark-bg)] rounded-3xl sm:rounded-[2.8rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                            <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Cycles &amp; Organisation</span>
                                    <h3 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                        Niveaux &amp; Salles de Classe
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Cliquez sur une classe pour afficher sa fiche publique (professeur principal, meilleurs élèves, effectif).
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 90%)', color: 'var(--primary-color)' }}>
                                        {stats.class_count} Classes ouvertes
                                    </span>
                                </div>
                            </div>

                            {/* Filtre par Niveau */}
                            {levels.length > 1 && (
                                <div className="px-6 sm:px-8 py-3 bg-gray-50/70 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 flex flex-wrap items-center gap-1.5">
                                    <button
                                        onClick={() => setSelectedLevelFilter('ALL')}
                                        className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${selectedLevelFilter === 'ALL'
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'bg-white dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/5'
                                        }`}
                                    >
                                        Tous ({levels.length})
                                    </button>
                                    {levels.map(lvl => (
                                        <button
                                            key={lvl.id}
                                            onClick={() => setSelectedLevelFilter(lvl.id)}
                                            className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${String(selectedLevelFilter) === String(lvl.id)
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : 'bg-white dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/5'
                                            }`}
                                        >
                                            {lvl.name} ({lvl.classes?.length || 0})
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Liste des Niveaux et Classes */}
                            <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-[70vh] overflow-y-auto custom-scrollbar p-3 sm:p-5">
                                {filteredLevels.length > 0 ? filteredLevels.map((level) => (
                                    <div key={level.id} className="p-4 sm:p-6 rounded-2xl hover:bg-gray-50/70 dark:hover:bg-white/[0.02] transition-all">
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <h4 className="text-base sm:text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }} />
                                                    {level.name}
                                                </h4>
                                                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider ml-4.5">
                                                    Section {level.section || 'Générale'} • {level.classes?.length || 0} division(s)
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                            {level.classes?.map(classe => (
                                                <div
                                                    key={classe.id}
                                                    onClick={() => setSelectedClass(classe)}
                                                    className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-gray-100 dark:border-white/5 hover:border-[var(--primary-color)] hover:shadow-lg cursor-pointer group transition-all active:scale-[0.98]"
                                                >
                                                    <div className="min-w-0 pr-2">
                                                        <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase group-hover:text-[var(--primary-color)] transition-colors truncate">
                                                            {classe.nom}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5 flex items-center gap-1">
                                                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                            {classe.eleves_count} Élève(s)
                                                        </p>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-black/40 group-hover:bg-[var(--primary-color)] group-hover:text-white flex items-center justify-center font-black text-xs text-gray-700 dark:text-gray-300 shadow-sm transition-all shrink-0">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center text-gray-400 text-xs font-bold uppercase tracking-wider">
                                        Aucune classe enregistrée pour ce niveau
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Colonne Droite (1/3) : Matières Enseignées (SANS COEFFICIENTS) */}
                    <div className="space-y-6 sm:space-y-8">
                        <div className="bg-white dark:bg-[var(--dark-bg)] p-6 sm:p-8 rounded-3xl sm:rounded-[2.8rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-5">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Programme Pédagogique</span>
                                <h3 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mt-0.5">
                                    Matières Enseignées
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">Disciplines fondamentales et d'éveil dispensées au sein de l'établissement.</p>
                            </div>

                            {/* Recherche rapide de matière */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={subjectSearch}
                                    onChange={(e) => setSubjectSearch(e.target.value)}
                                    placeholder="Rechercher une matière..."
                                    className="w-full px-4 py-2.5 pl-9 rounded-xl text-xs font-bold bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                </div>
                            </div>

                            {/* Wall de Badges de Matières Groupées (Sans Coefs) */}
                            <div className="space-y-5 max-h-[55vh] overflow-y-auto custom-scrollbar pr-1">
                                {Object.keys(categorizedSubjects).length > 0 ? (
                                    Object.entries(categorizedSubjects).map(([groupName, groupMatieres]) => (
                                        <div key={groupName} className="space-y-2">
                                            <div className="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-white/5">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                                                    {groupName}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400">
                                                    {groupMatieres.length}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {groupMatieres.map((subject) => (
                                                    <div
                                                        key={subject.id}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-[var(--primary-color)] transition-colors shadow-2xs"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }} />
                                                        <span className="text-xs font-black uppercase text-gray-800 dark:text-gray-200">
                                                            {subject.nom}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 font-bold uppercase text-xs text-center py-8">
                                        Aucune matière trouvée
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── MODAL FICHE PUBLIQUE DE LA CLASSE CLIQUÉE ───────────────────── */}
                {selectedClass && (
                    <div
                        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
                        onClick={() => setSelectedClass(null)}
                    >
                        <div
                            className="bg-white dark:bg-[#101713] rounded-3xl sm:rounded-[2.8rem] border border-gray-100 dark:border-white/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-white/5 dark:to-transparent">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                        Fiche Publique de la Salle
                                    </span>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mt-0.5">
                                        Classe : {selectedClass.nom} {selectedClass.section ? `(${selectedClass.section.toUpperCase()})` : ''}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedClass(null)}
                                    className="p-2.5 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-white transition-all"
                                    aria-label="Fermer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>

                            {/* Modal Content Scrollable */}
                            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                                {/* Cartes d'infos principales */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Effectif de la classe</p>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white">{selectedClass.eleves_count} Élèves</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Professeur Principal</p>
                                        <p className="text-sm font-black text-gray-900 dark:text-white truncate">
                                            {selectedClass.professeur_principal?.name || 'Non attribué'}
                                        </p>
                                    </div>
                                </div>

                                {/* Top Élèves (Tableau d'Honneur sommaire) */}
                                {selectedClass.eleves && selectedClass.eleves.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-amber-500">🏆</span>
                                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                                                Tableau d'Honneur (Meilleures Moyennes)
                                            </h4>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedClass.eleves.map((st, i) => (
                                                <div key={st.id} className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-between border border-gray-100 dark:border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center ${
                                                            i === 0 ? 'bg-amber-400/20 text-amber-500 border border-amber-400/30' :
                                                            i === 1 ? 'bg-slate-300/20 text-slate-400 border border-slate-300/30' :
                                                            'bg-amber-700/20 text-amber-700 border border-amber-700/30'
                                                        }`}>
                                                            {i === 0 ? '1er' : i === 1 ? '2e' : '3e'}
                                                        </span>
                                                        <span className="text-xs font-black uppercase text-gray-900 dark:text-white">
                                                            {st.nom} {st.prenom}
                                                        </span>
                                                    </div>
                                                    {st.moy1 !== null && (
                                                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                                            {Number(st.moy1).toFixed(2)}/20
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Matières de la classe (SANS COEFFICIENTS) */}
                                {selectedClass.matieres && selectedClass.matieres.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                                            Matières dispensées ({selectedClass.matieres.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedClass.matieres.map((m) => (
                                                <span key={m.id} className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200">
                                                    {m.nom}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                                <span className="text-xs text-gray-400">Établissement {school.name}</span>
                                <button
                                    onClick={() => setSelectedClass(null)}
                                    className="px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-white dark:text-black text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── SECTION HISTORIQUE DES RÉUSSITES ────────────────────────────── */}
                {academic_histories && academic_histories.length > 0 && (
                    <div className="bg-white dark:bg-[var(--dark-bg)] rounded-3xl sm:rounded-[3rem] border border-gray-100 dark:border-white/5 p-6 sm:p-10 md:p-12 shadow-sm space-y-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Bilan &amp; Transparence</span>
                            <h3 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mt-1">
                                Historique des Taux de Réussite
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">Consultez les résultats officiels des promotions passées de l'établissement.</p>
                        </div>

                        <div className="space-y-6">
                            {academic_histories.map((h) => (
                                <div key={h.id} className="p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200/50 dark:border-white/5 gap-3">
                                        <div>
                                            <h4 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                                Promotion {h.academic_year}
                                            </h4>
                                            <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                                                {h.total_students} élèves inscrits • {h.total_passed} admis
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 shadow-sm w-fit">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Taux Global :</span>
                                            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{h.success_rate}%</span>
                                        </div>
                                    </div>

                                    {h.classes_stats && h.classes_stats.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-3">
                                                Résultats Détaillés par Classe :
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                {h.classes_stats.map((cs, idx) => (
                                                    <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-[#111614] border border-gray-100 dark:border-white/5">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-extrabold text-xs uppercase text-gray-900 dark:text-white truncate">{cs.classe_nom}</span>
                                                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 shrink-0 ml-2">{cs.success_rate}%</span>
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 space-y-0.5">
                                                            <p>{cs.passed} admis sur {cs.total} ({cs.repeated} redoublants)</p>
                                                            {cs.top_student && cs.top_student !== '—' && (
                                                                <p className="text-gray-500 font-semibold truncate">Major : {cs.top_student} {cs.top_avg ? `(${cs.top_avg}/20)` : ''}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
