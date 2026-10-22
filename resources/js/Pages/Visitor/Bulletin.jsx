import { Head, Link, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';

function Appreciation({ note }) {
    if (note === null || note === undefined) return <span className="text-gray-400">—</span>;
    if (note >= 18) return <span className="text-emerald-600 font-bold">Très Bien</span>;
    if (note >= 16) return <span className="text-green-600 font-bold">Bien</span>;
    if (note >= 14) return <span className="text-blue-600 font-bold">Assez Bien</span>;
    if (note >= 12) return <span className="text-sky-600 font-bold">Passable</span>;
    if (note >= 10) return <span className="text-orange-500 font-bold">Insuffisant</span>;
    return <span className="text-red-600 font-bold">Très Insuffisant</span>;
}

function NoteCell({ note }) {
    if (note === null || note === undefined) return <span className="text-gray-400 text-xs">—</span>;
    const color = note >= 10 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600';
    return <span className={`font-black text-sm ${color}`}>{note.toFixed(2)}</span>;
}

export default function Bulletin({ eleve, school, notes = [], sequences = [], currentSeq, moyenneEleve, classe, error, searched }) {
    const [matriculeInput, setMatriculeInput] = useState(searched || '');

    const handleSearch = (e) => {
        e.preventDefault();
        if (matriculeInput.trim()) {
            router.get(route('visitor.bulletin', matriculeInput.trim().toUpperCase()));
        }
    };

    const handleSeqChange = (seq) => {
        if (eleve) {
            router.get(route('visitor.bulletin', eleve.MATRICULE), { seq });
        }
    };

    // Grouper les notes par groupe de matières
    const groupes = {};
    notes.forEach(n => {
        const g = n.groupe || 'Matières';
        if (!groupes[g]) groupes[g] = [];
        groupes[g].push(n);
    });

    const themeColor = school?.theme_color || 'emerald';
    const themeMap = {
        emerald: '#10b981', blue: '#3b82f6', indigo: '#6366f1',
        purple: '#a855f7', rose: '#f43f5e', amber: '#f59e0b',
        teal: '#14b8a6', orange: '#f97316',
    };
    const color = themeMap[themeColor] || themeMap.emerald;

    const mention = (() => {
        if (moyenneEleve === null || moyenneEleve === undefined) return null;
        if (moyenneEleve >= 16) return { label: '🏅 Félicitations', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
        if (moyenneEleve >= 14) return { label: '⭐ Tableau d\'Honneur', cls: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
        if (moyenneEleve >= 12) return { label: '👏 Encouragements', cls: 'bg-blue-100 text-blue-800 border-blue-300' };
        if (moyenneEleve >= 10) return { label: 'Admis(e)', cls: 'bg-gray-100 text-gray-600 border-gray-300' };
        return { label: '⚠ En difficulté', cls: 'bg-red-100 text-red-700 border-red-300' };
    })();

    return (
        <GuestLayout>
            <Head title="Consultation Bulletin" />

            <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6">

                {/* Titre & recherche */}
                <div className="text-center space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-1" style={{ color }}>
                        Portail Parents
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        Bulletin de Notes
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Saisissez le matricule de votre enfant pour consulter son bulletin.
                    </p>
                </div>

                {/* Barre de recherche */}
                <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
                    <input
                        type="text"
                        value={matriculeInput}
                        onChange={e => setMatriculeInput(e.target.value.toUpperCase())}
                        placeholder="Ex: CM-2025-00123"
                        className="flex-1 px-4 py-3 bg-white dark:bg-[#0c120f] border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white text-sm font-bold tracking-widest focus:ring-2 focus:border-transparent outline-none transition-all placeholder:font-normal placeholder:tracking-normal uppercase"
                        style={{ '--tw-ring-color': color }}
                        required
                    />
                    <button
                        type="submit"
                        className="px-5 py-3 text-white font-black rounded-2xl text-sm uppercase tracking-wider transition-all hover:opacity-90 active:scale-95 shadow-lg"
                        style={{ backgroundColor: color }}
                    >
                        Chercher
                    </button>
                </form>

                {/* Message d'erreur */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-center">
                        <p className="text-red-700 dark:text-red-300 font-bold text-sm">{error}</p>
                    </div>
                )}

                {/* Bulletin affiché */}
                {eleve && (
                    <div className="space-y-5">

                        {/* En-tête élève */}
                        <div className="bg-white dark:bg-[#111614] border border-gray-100 dark:border-white/8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
                            {/* Bandeau couleur */}
                            <div className="h-2 w-full" style={{ backgroundColor: color }} />

                            <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                {/* Photo */}
                                <div
                                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 flex items-center justify-center shrink-0"
                                    style={{ borderColor: color + '40', backgroundColor: color + '10' }}
                                >
                                    {eleve.photo_url ? (
                                        <img src={eleve.photo_url} alt="Photo élève" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    )}
                                </div>

                                {/* Identité */}
                                <div className="flex-1 min-w-0 space-y-3">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Nom & Prénom</p>
                                        <p className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                                            {eleve.nom?.toUpperCase()} <span className="font-light">{eleve.prenom}</span>
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">Matricule</p>
                                            <p className="font-black text-sm text-gray-800 dark:text-gray-200 font-mono tracking-wider">{eleve.MATRICULE}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">Classe</p>
                                            <p className="font-black text-sm text-gray-800 dark:text-gray-200">{classe?.nom || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">Sexe</p>
                                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{eleve.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                                        </div>
                                        {eleve.date_naissance && (
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">Né(e) le</p>
                                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                                                    {new Date(eleve.date_naissance).toLocaleDateString('fr-FR')}
                                                    {eleve.lieu_naissance ? ` à ${eleve.lieu_naissance}` : ''}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">École</p>
                                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">{school?.name || '—'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sélecteur de séquence */}
                        {sequences.length > 1 && (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {sequences.map(seq => (
                                    <button
                                        key={seq}
                                        onClick={() => handleSeqChange(seq)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                            seq === currentSeq
                                                ? 'text-white shadow-md'
                                                : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:opacity-80'
                                        }`}
                                        style={seq === currentSeq ? { backgroundColor: color } : {}}
                                    >
                                        Séquence {seq}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Récapitulatif */}
                        {moyenneEleve !== null && moyenneEleve !== undefined && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white dark:bg-[#111614] border border-gray-100 dark:border-white/8 rounded-2xl p-4 text-center">
                                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">Moyenne Générale</p>
                                    <p className="text-3xl font-black" style={{ color: moyenneEleve >= 10 ? '#059669' : '#dc2626' }}>
                                        {moyenneEleve.toFixed(2)}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-medium">/20 — Séquence {currentSeq}</p>
                                </div>
                                <div className="bg-white dark:bg-[#111614] border border-gray-100 dark:border-white/8 rounded-2xl p-4 text-center flex flex-col items-center justify-center">
                                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Mention</p>
                                    {mention && (
                                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black border ${mention.cls}`}>
                                            {mention.label}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notes par groupe de matières */}
                        <div className="space-y-4">
                            {Object.keys(groupes).length === 0 && (
                                <div className="bg-white dark:bg-[#111614] border border-gray-100 dark:border-white/8 rounded-2xl p-8 text-center">
                                    <p className="text-gray-400 text-sm">Aucune note disponible pour cette séquence.</p>
                                </div>
                            )}

                            {Object.entries(groupes).map(([groupe, matieresGrp]) => {
                                const coefGrp = matieresGrp.filter(n => n.note !== null).reduce((s, n) => s + n.coef, 0);
                                const noteCoefGrp = matieresGrp.filter(n => n.note !== null).reduce((s, n) => s + n.note_coef, 0);
                                const moyGrp = coefGrp > 0 ? (noteCoefGrp / coefGrp).toFixed(2) : null;

                                return (
                                    <div key={groupe} className="bg-white dark:bg-[#111614] border border-gray-100 dark:border-white/8 rounded-2xl sm:rounded-3xl overflow-hidden">
                                        {/* En-tête groupe */}
                                        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: color + '18' }}>
                                            <h3 className="text-xs font-black uppercase tracking-wider" style={{ color }}>{groupe}</h3>
                                            {moyGrp && (
                                                <span className="text-xs font-black" style={{ color }}>Moy. {moyGrp}/20</span>
                                            )}
                                        </div>

                                        {/* Table */}
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-gray-100 dark:border-white/5">
                                                        <th className="text-left py-2 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Matière</th>
                                                        <th className="text-center py-2 px-3 text-[10px] font-black text-gray-400 uppercase">Coef.</th>
                                                        <th className="text-center py-2 px-3 text-[10px] font-black text-gray-400 uppercase">Note /20</th>
                                                        <th className="text-center py-2 px-3 text-[10px] font-black text-gray-400 uppercase hidden sm:table-cell">Note×Coef</th>
                                                        <th className="text-center py-2 px-3 text-[10px] font-black text-gray-400 uppercase hidden sm:table-cell">Appréciation</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {matieresGrp.map((n, i) => (
                                                        <tr
                                                            key={n.matiere_id}
                                                            className={`border-b border-gray-50 dark:border-white/5 ${n.critique ? 'bg-red-50 dark:bg-red-950/20' : i % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-white/2'}`}
                                                        >
                                                            <td className="py-2.5 px-4 font-semibold text-gray-800 dark:text-gray-200">
                                                                {n.nom}
                                                                {n.critique && <span className="ml-1 text-red-500 text-xs">⚠</span>}
                                                            </td>
                                                            <td className="py-2.5 px-3 text-center text-gray-500 dark:text-gray-400 font-medium">{n.coef}</td>
                                                            <td className="py-2.5 px-3 text-center">
                                                                <NoteCell note={n.note} />
                                                            </td>
                                                            <td className="py-2.5 px-3 text-center text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                                                                {n.note_coef !== null ? n.note_coef.toFixed(2) : '—'}
                                                            </td>
                                                            <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                                                                <Appreciation note={n.note} />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Lien vers détail complet */}
                        <div className="text-center pt-2">
                            <p className="text-xs text-gray-400 font-medium">
                                Pour accéder au bulletin complet avec discipline et classement, contactez l'établissement.
                            </p>
                        </div>
                    </div>
                )}

                {/* Lien retour */}
                <div className="text-center">
                    <Link href={route('visitor.schools')} className="text-xs font-black uppercase tracking-wider text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                        ← Retour aux établissements
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
