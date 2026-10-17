import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, students, classes = [] }) {
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportClasse, setExportClasse] = useState('');
    const [exportFiltre, setExportFiltre] = useState('tous');
    const [exportSequence, setExportSequence] = useState(1);

    const handleDelete = (id) => {
        if (confirm('Voulez-vous vraiment retirer cet élève du registre ?')) {
            router.delete(route('students.destroy', id));
        }
    };

    const handlePrintExport = () => {
        const params = new URLSearchParams();
        if (exportClasse) params.append('classe_id', exportClasse);
        if (exportFiltre) params.append('filtre', exportFiltre);
        window.open(`${route('exports.students')}?${params.toString()}`, '_blank');
        setShowExportModal(false);
    };

    const handlePrintCards = () => {
        const params = new URLSearchParams();
        if (exportClasse) params.append('classe_id', exportClasse);
        window.open(`${route('exports.id_cards')}?${params.toString()}`, '_blank');
        setShowExportModal(false);
    };

    const handlePrintClassBulletins = () => {
        if (!exportClasse) {
            alert('Veuillez sélectionner une classe spécifique pour imprimer tous les bulletins.');
            return;
        }
        window.open(`/reports/class/${exportClasse}/sequence/${exportSequence}`, '_blank');
        setShowExportModal(false);
    };

    const handlePrintClassHonors = () => {
        if (!exportClasse) {
            alert('Veuillez sélectionner une classe spécifique pour imprimer les Tableaux d\'Honneur.');
            return;
        }
        window.open(`/reports/class/${exportClasse}/tableau-honneur/seq/${exportSequence}`, '_blank');
        setShowExportModal(false);
    };

    const handleReinstate = (id, name) => {
        if (confirm(`Confirmez-vous la réintégration de l'élève ${name} ?`)) {
            router.post(route('students.reinstate', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--primary-color)' }}>Base de Données</p>
                        <h2 className="font-extrabold text-xl sm:text-3xl text-gray-900 dark:text-white leading-tight tracking-tight">Registre des Élèves</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {['super_admin', 'proviseur', 'censeur'].includes(auth.user.role) && (
                            <button
                                onClick={() => setShowExportModal(true)}
                                className="inline-flex items-center px-3.5 sm:px-6 py-2.5 sm:py-4 bg-white dark:bg-white/5 text-gray-900 dark:text-white font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95"
                            >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" style={{ color: 'var(--primary-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                Exporter / Badges
                            </button>
                        )}
                        <Link
                            href={route('students.create')}
                            className="inline-flex items-center px-4 sm:px-8 py-2.5 sm:py-4 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-xl transition-all active:scale-95 hover:translate-y-[-2px]"
                            style={{ backgroundColor: 'var(--primary-color)', boxShadow: `0 10px 15px -3px var(--shadow-color)` }}
                        >
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                            Nouvel Élève
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Liste des Élèves" />

            <div className="py-6 sm:py-12 bg-transparent min-h-screen">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-[var(--dark-bg)] overflow-hidden shadow-2xl rounded-2xl sm:rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                        
                        {/* Vue Cartes Responsive pour Mobile */}
                        <div className="block md:hidden divide-y divide-gray-100 dark:divide-white/5">
                            {students.map((student) => (
                                <div key={student.id} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {student.photo_path ? (
                                                <img
                                                    src={`/storage/${student.photo_path}`}
                                                    alt={`${student.nom} ${student.prenom}`}
                                                    className="h-12 w-12 rounded-xl object-cover border border-gray-200 dark:border-white/10 shrink-0 shadow-sm"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 90%)', color: 'var(--primary-color)' }}>
                                                    {student.nom.charAt(0)}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-extrabold text-gray-900 dark:text-white truncate">
                                                    {student.nom} {student.prenom}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                                        {student.MATRICULE}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-400">
                                                        • {student.classe?.nom || 'Sans classe'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-xs font-black px-2.5 py-1 rounded-lg block" style={{ color: 'var(--primary-color)', backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 90%)' }}>
                                                {student.moy1 || '0.00'}
                                            </span>
                                            {/* Statut Pill Mobile */}
                                            <div className="mt-1">
                                                {student.statut === 'exclu' && (
                                                    <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 uppercase tracking-wider">Exclu</span>
                                                )}
                                                {student.statut === 'redoublant' && (
                                                    <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 uppercase tracking-wider">Redoublant</span>
                                                )}
                                                {student.statut === 'nouveau' && (
                                                    <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 uppercase tracking-wider">Nouveau</span>
                                                )}
                                                {student.statut === 'ancien' && (
                                                    <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 uppercase tracking-wider">Ancien</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Mobile */}
                                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-gray-50 dark:border-white/5">
                                        {/* Bouton Tableau d'Honneur si moyenne >= 14 */}
                                        {parseFloat(student.moy1 || 0) >= 14 && (
                                            <a
                                                href={`/reports/${student.id}/tableau-honneur/seq/1`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-2.5 py-1.5 text-xs font-black text-amber-800 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 rounded-lg flex items-center gap-1.5 active:scale-95 transition-all"
                                                title="Télécharger le Tableau d'Honneur"
                                            >
                                                <svg className="w-3.5 h-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                                T. d'Honneur
                                            </a>
                                        )}

                                        {/* Action Réintégrer pour Proviseur si exclu */}
                                        {student.statut === 'exclu' && ['super_admin', 'proviseur'].includes(auth.user.role) && (
                                            <button
                                                onClick={() => handleReinstate(student.id, `${student.nom} ${student.prenom}`)}
                                                className="px-2.5 py-1.5 text-xs font-black text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg active:scale-95 transition-all"
                                                title="Réintégrer cet élève"
                                            >
                                                Réintégrer
                                            </button>
                                        )}

                                        <Link
                                            href={route('reports.show', student.id)}
                                            className="px-2.5 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center gap-1.5 active:scale-95 transition-all"
                                            title="Voir le Bulletin"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            Bulletin
                                        </Link>
                                        <a
                                            href={`${route('exports.id_cards')}?student_id=${student.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-2.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg flex items-center gap-1.5 active:scale-95 transition-all"
                                            title="Imprimer le Badge Scolaire"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                                            Badge
                                        </a>
                                        <Link
                                            href={route('students.edit', student.id)}
                                            className="p-2 text-gray-500 hover:text-[var(--primary-color)] bg-gray-50 dark:bg-white/5 rounded-lg active:scale-95 transition-all"
                                            title="Modifier"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(student.id)}
                                            className="p-2 text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-950/20 rounded-lg active:scale-95 transition-all"
                                            title="Supprimer"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {students.length === 0 && (
                                <div className="p-8 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Aucun élève enregistré pour le moment
                                </div>
                            )}
                        </div>

                        {/* Vue Tableau pour Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100 dark:divide-white/5">
                                <thead className="bg-gray-50/50 dark:bg-white/5">
                                    <tr>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Matricule</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom Complet</th>
                                        <th className="px-6 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Classe</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Moyenne G.</th>
                                        <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-transparent divide-y divide-gray-50 dark:divide-white/5">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <span className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-xs font-black rounded-lg uppercase tracking-wider group-hover:bg-white dark:group-hover:bg-white/10 transition-colors">{student.MATRICULE}</span>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {student.photo_path ? (
                                                        <img
                                                            src={`/storage/${student.photo_path}`}
                                                            alt={`${student.nom} ${student.prenom}`}
                                                            className="h-10 w-10 flex-shrink-0 rounded-xl object-cover mr-4 border border-gray-200 dark:border-white/10 shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center font-black text-xs mr-4" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 90%)', color: 'var(--primary-color)' }}>
                                                            {student.nom.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-extrabold text-gray-900 dark:text-white transition-colors group-hover:text-[var(--primary-color)]">{student.nom} {student.prenom}</div>
                                                        {student.parent_phone && (
                                                            <div className="text-[10px] font-semibold text-gray-400 mt-0.5">Parent : {student.parent_name ? `${student.parent_name} • ` : ''}{student.parent_phone}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 whitespace-nowrap">
                                                {student.statut === 'exclu' && (
                                                    <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 uppercase tracking-wider inline-flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                                        Exclu
                                                    </span>
                                                )}
                                                {student.statut === 'redoublant' && (
                                                    <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 uppercase tracking-wider">
                                                        Redoublant
                                                    </span>
                                                )}
                                                {student.statut === 'nouveau' && (
                                                    <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 uppercase tracking-wider">
                                                        Nouveau
                                                    </span>
                                                )}
                                                {student.statut === 'ancien' && (
                                                    <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 uppercase tracking-wider">
                                                        Ancien
                                                    </span>
                                                )}
                                                {!student.statut && (
                                                    <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 uppercase tracking-wider">
                                                        Actif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-gray-500 dark:text-gray-400 uppercase italic">
                                                {student.classe?.nom || 'Non assigné'}
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-sm font-black px-3 py-1 rounded-lg w-fit" style={{ color: 'var(--primary-color)', backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 90%)' }}>
                                                    {student.moy1 || '0.00'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-right text-sm">
                                                <div className="flex justify-end gap-2.5 items-center">
                                                    {/* Tableau d'Honneur pour moyenne >= 14 */}
                                                    {parseFloat(student.moy1 || 0) >= 14 && (
                                                        <a
                                                            href={`/reports/${student.id}/tableau-honneur/seq/1`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-amber-600 hover:text-amber-800 bg-amber-50 dark:bg-amber-950/30 rounded-lg transition-all active:scale-95"
                                                            title="Imprimer le Tableau d'Honneur (Moyenne ≥ 14)"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                                        </a>
                                                    )}

                                                    {/* Réintégrer un élève exclu (Proviseur / SuperAdmin) */}
                                                    {student.statut === 'exclu' && ['super_admin', 'proviseur'].includes(auth.user.role) && (
                                                        <button
                                                            onClick={() => handleReinstate(student.id, `${student.nom} ${student.prenom}`)}
                                                            className="px-2.5 py-1 text-[11px] font-black text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg active:scale-95 transition-all"
                                                            title="Réintégrer cet élève exclu"
                                                        >
                                                            Réintégrer
                                                        </button>
                                                    )}

                                                    <Link
                                                        href={route('reports.show', student.id)}
                                                        className="p-2 text-gray-400 hover:bg-white/5 rounded-lg transition-all"
                                                        style={{ '--hover-color': 'var(--primary-color)' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156 163 175)'}
                                                        title="Voir le Bulletin"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                    </Link>
                                                    <a
                                                        href={`${route('exports.id_cards')}?student_id=${student.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg transition-all"
                                                        title="Imprimer le Badge Scolaire"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                                                    </a>
                                                    <Link
                                                        href={route('students.edit', student.id)}
                                                        className="p-2 text-gray-400 hover:text-[var(--primary-color)] transition-all"
                                                        title="Modifier le Profil"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(student.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-200 dark:border-white/10">
                                                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09a10.116 10.116 0 001.033-5.064c0-5.592-4.529-10.121-10.121-10.121H1c.365 0 .717.154.966.425a1.442 1.442 0 010 2.05L1 7.293V1h6.293L8.586 2.293a1 1 0 01.707-.293H12c5.523 0 10 4.477 10 10s-4.477 10-10 10z"></path></svg>
                                                    </div>
                                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Aucun élève enregistré pour le moment</p>
                                                    <Link href={route('students.create')} className="mt-6 font-black hover:underline" style={{ color: 'var(--primary-color)' }}>Inscrire le premier élève →</Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Exportation PDF */}
            {showExportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111614] rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-white/5">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Export Liste Élèves</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Format officiel pour impression & PDF</p>
                            </div>
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-6 py-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Classe à exporter</label>
                                <select
                                    value={exportClasse}
                                    onChange={(e) => setExportClasse(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                                >
                                    <option value="" className="dark:bg-[#111614]">Toutes les classes</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id} className="dark:bg-[#111614]">
                                            {cls.nom} {cls.section ? `(${cls.section.toUpperCase()})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Filtre du Statut</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'tous', label: 'Tous' },
                                        { id: 'nouveaux', label: 'Nouveaux' },
                                        { id: 'redoublants', label: 'Redoublants' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setExportFiltre(opt.id)}
                                            className={`py-3 px-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all text-center ${
                                                exportFiltre === opt.id
                                                    ? 'text-white border-transparent shadow-md'
                                                    : 'bg-gray-50 dark:bg-white/5 text-gray-500 border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                                            }`}
                                            style={exportFiltre === opt.id ? { backgroundColor: 'var(--primary-color)' } : {}}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Séquence (pour les bulletins)</label>
                                <select
                                    value={exportSequence}
                                    onChange={(e) => setExportSequence(Number(e.target.value))}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                                >
                                    {[1, 2, 3, 4, 5, 6].map((seq) => (
                                        <option key={seq} value={seq} className="dark:bg-[#111614]">
                                            Séquence {seq} (Trimestre {Math.ceil(seq / 2)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                <p className="font-bold text-gray-900 dark:text-white">Documents officiels disponibles :</p>
                                <p>• <strong>Bulletins de la Classe :</strong> 1 bulletin complet par page A4 pour chaque élève</p>
                                <p>• <strong>Badges Élèves :</strong> Planche A4 de 8 cartes d'identité prêtes à découper</p>
                                <p>• <strong>Liste d'Appel :</strong> Liste officielle avec émargement</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5 pt-4 border-t border-gray-100 dark:border-white/5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <button
                                    onClick={handlePrintClassBulletins}
                                    className="py-3 px-4 text-xs font-black uppercase tracking-wider text-white rounded-xl sm:rounded-2xl shadow-lg transition-all hover:opacity-90 active:scale-95 bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    Bulletins de la Classe
                                </button>
                                <button
                                    onClick={handlePrintClassHonors}
                                    className="py-3 px-4 text-xs font-black uppercase tracking-wider text-amber-950 rounded-xl sm:rounded-2xl shadow-lg transition-all hover:opacity-90 active:scale-95 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                    Tableaux d'Honneur (≥14)
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <button
                                    onClick={handlePrintCards}
                                    className="py-3 px-4 text-xs font-black uppercase tracking-wider text-white rounded-xl sm:rounded-2xl shadow-lg transition-all hover:opacity-90 active:scale-95 bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                                    Badges Élèves (A4)
                                </button>
                                <button
                                    onClick={handlePrintExport}
                                    className="py-3 px-4 text-xs font-black uppercase tracking-wider text-white rounded-xl sm:rounded-2xl shadow-lg transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                                    style={{ backgroundColor: 'var(--primary-color)' }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                    Liste d'Appel (PDF)
                                </button>
                            </div>
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="py-2.5 px-4 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors text-center"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
