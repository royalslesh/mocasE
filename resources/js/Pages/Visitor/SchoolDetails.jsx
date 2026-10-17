import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SchoolDetails({ school, stats, levels, matieres, academic_histories = [], auth }) {
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout
            header={
                <h2 className="font-black text-lg sm:text-2xl uppercase tracking-tight truncate" style={{ color: 'var(--primary-color)' }}>
                    {school.name} - Aperçu
                </h2>
            }
        >
            <Head title={school.name} />

            <div className="space-y-6 sm:space-y-8 max-w-[100rem] mx-auto py-4 sm:py-8 px-3 sm:px-6">
                {/* Header Section */}
                <div
                    className="rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] p-5 sm:p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), black 40%)' }}
                >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 sm:gap-6 relative z-10 w-full md:w-auto text-center sm:text-left">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
                            {school.logo_path ? (
                                <img src={`/storage/${school.logo_path}`} className="w-full h-full object-cover" alt="Logo" />
                            ) : (
                                <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m0 0h10" />
                                </svg>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight uppercase mb-2 leading-tight break-words">
                                {school.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/10 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                                    {school.city || 'Ville non définie'}
                                </span>
                                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--primary-color)' }}>
                                    {school.is_active ? 'Établissement Agréé' : 'Établissement Suspendu'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10 w-full md:w-auto">
                        <div className="bg-white/5 backdrop-blur-md p-3.5 sm:p-6 rounded-xl sm:rounded-[2rem] border border-white/10 text-center">
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: 'var(--primary-color)' }}>
                                Succès Global
                            </p>
                            <p className="text-2xl sm:text-4xl font-black text-white">{stats.success_rate}%</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-3.5 sm:p-6 rounded-xl sm:rounded-[2rem] border border-white/10 text-center">
                            <p className="text-[9px] sm:text-[10px] font-black text-white/60 uppercase tracking-wider mb-1">
                                Total Élèves
                            </p>
                            <p className="text-2xl sm:text-4xl font-black text-white">{stats.student_count}</p>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-30 pointer-events-none" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left Column: Levels and Classes */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        <div className="bg-white dark:bg-[var(--dark-bg)] rounded-2xl sm:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                            <div className="p-4 sm:p-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                                <h3 className="text-base sm:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    Structure Académique
                                </h3>
                                <span className="px-3 sm:px-4 py-1 rounded-full text-[10px] font-black uppercase" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 90%)', color: 'var(--primary-color)' }}>
                                    {stats.class_count} Classes
                                </span>
                            </div>

                            <div className="divide-y divide-gray-50 dark:divide-white/5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
                                {levels.length > 0 ? levels.map((level) => (
                                    <div key={level.id} className="p-4 sm:p-8 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                                            <div>
                                                <h4 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                                                    {level.name}
                                                </h4>
                                                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    Section {level.section || 'Générale'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                                            {level.classes.map(classe => (
                                                <div key={classe.id} className="bg-gray-50 dark:bg-white/5 p-4 sm:p-5 rounded-xl sm:rounded-2xl flex justify-between items-center group border border-transparent hover:border-[var(--primary-color)] transition-colors">
                                                    <div>
                                                        <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase">{classe.nom}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{classe.eleves_count} Élèves</p>
                                                    </div>
                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-black/20 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary-color)' }}>
                                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-10 sm:p-20 text-center">
                                        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-gray-400">
                                            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        </div>
                                        <p className="text-gray-400 font-bold uppercase text-[10px] sm:text-xs tracking-wider">Aucune classe enregistrée</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Subjects and Extras */}
                    <div className="space-y-6 sm:space-y-8">
                        <div className="bg-white dark:bg-[var(--dark-bg)] p-4 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
                            <h3 className="text-base sm:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4 sm:mb-8">
                                Matières Enseignées
                            </h3>
                            <div className="space-y-2.5 sm:space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
                                {matieres.length > 0 ? matieres.map((subject) => (
                                    <div key={subject.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 95%)' }}>
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-white/5 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm font-black text-xs shrink-0" style={{ color: 'var(--primary-color)' }}>
                                            {subject.coef}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase leading-snug truncate">{subject.nom}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Coeff: {subject.coef}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider text-center py-8">Données non disponibles</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Historique des Réussites par Année et par Classe */}
                {academic_histories && academic_histories.length > 0 && (
                    <div className="bg-white dark:bg-[var(--dark-bg)] rounded-2xl sm:rounded-[3rem] border border-gray-100 dark:border-white/5 p-4 sm:p-8 md:p-12 shadow-sm space-y-6 sm:space-y-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--primary-color)' }}>Bilan &amp; Transparence</span>
                            <h3 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mt-1">
                                Historique des Taux de Réussite
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">Consultez les résultats officiels des promotions passées de l'établissement.</p>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            {academic_histories.map((h) => (
                                <div key={h.id} className="p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-4 sm:space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-gray-200/50 dark:border-white/5 gap-3 sm:gap-4">
                                        <div>
                                            <h4 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                                Promotion {h.academic_year}
                                            </h4>
                                            <p className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                                                {h.total_students} élèves inscrits • {h.total_passed} admis
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 shadow-sm w-fit">
                                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400">Taux Global :</span>
                                            <span className="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400">{h.success_rate}%</span>
                                        </div>
                                    </div>

                                    {h.classes_stats && h.classes_stats.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2.5 sm:mb-3">
                                                Résultats Détaillés par Classe :
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                                                {h.classes_stats.map((cs, idx) => (
                                                    <div key={idx} className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#111614] border border-gray-100 dark:border-white/5">
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