import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

// ─── Couleurs du thème ────────────────────────────────────────────────────────
const THEME_COLORS = {
    emerald: { main: '#059669', light: '#d1fae5', text: '#065f46', btn: 'bg-emerald-600 hover:bg-emerald-700' },
    blue:    { main: '#2563eb', light: '#dbeafe', text: '#1e3a8a', btn: 'bg-blue-600 hover:bg-blue-700' },
    violet:  { main: '#7c3aed', light: '#ede9fe', text: '#4c1d95', btn: 'bg-violet-600 hover:bg-violet-700' },
    red:     { main: '#dc2626', light: '#fee2e2', text: '#7f1d1d', btn: 'bg-red-600 hover:bg-red-700' },
    orange:  { main: '#ea580c', light: '#ffedd5', text: '#7c2d12', btn: 'bg-orange-600 hover:bg-orange-700' },
    teal:    { main: '#0d9488', light: '#ccfbf1', text: '#134e4a', btn: 'bg-teal-600 hover:bg-teal-700' },
    indigo:  { main: '#4f46e5', light: '#e0e7ff', text: '#312e81', btn: 'bg-indigo-600 hover:bg-indigo-700' },
    pink:    { main: '#db2777', light: '#fce7f3', text: '#831843', btn: 'bg-pink-600 hover:bg-pink-700' },
};

// ─── Badge mention ────────────────────────────────────────────────────────────
function MentionBadge({ moyenne }) {
    if (moyenne === null || moyenne === undefined) return <span className="text-gray-400 text-xs">En attente</span>;
    if (moyenne >= 16) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">🏅 Félicitations</span>;
    if (moyenne >= 14) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300">🌟 Tableau d'Honneur</span>;
    if (moyenne >= 12) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">👍 Encouragements</span>;
    if (moyenne >= 10) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-300">— Aucune</span>;
    if (moyenne >= 8)  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">⚠ Avertissement</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-300">🚫 Blâme</span>;
}

// ─── Tableau des notes (séquentiel) ──────────────────────────────────────────
function TableauNotes({ notes, theme }) {
    if (!notes || notes.length === 0) return <p className="text-gray-400 text-sm py-4 text-center">Aucune note disponible pour cette période.</p>;
    const totalCoef = notes.filter(n => n.note !== null).reduce((a, n) => a + n.coef, 0);
    const totalNoteCoef = notes.filter(n => n.note !== null).reduce((a, n) => a + n.note_coef, 0);
    const moy = totalCoef > 0 ? (totalNoteCoef / totalCoef).toFixed(2) : null;

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
                <thead style={{ backgroundColor: theme.main }}>
                    <tr>
                        <th className="text-left py-2 px-3 text-white font-semibold text-xs uppercase tracking-wide w-2/5">Matière</th>
                        <th className="py-2 px-2 text-white font-semibold text-xs uppercase text-center">Coef.</th>
                        <th className="py-2 px-2 text-white font-semibold text-xs uppercase text-center">Note /20</th>
                        <th className="py-2 px-2 text-white font-semibold text-xs uppercase text-center">Note×Coef</th>
                        <th className="py-2 px-2 text-white font-semibold text-xs uppercase text-center">Appréciation</th>
                    </tr>
                </thead>
                <tbody>
                    {notes.map((n, i) => (
                        <tr key={n.matiere_id} className={`border-t border-gray-100 dark:border-gray-700 ${n.critique ? 'bg-red-50 dark:bg-red-950/20' : i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/40'}`}>
                            <td className="py-2 px-3 font-medium text-gray-800 dark:text-gray-200">
                                {n.nom}
                                {n.critique && <span className="ml-1 text-red-500 text-xs">⚠</span>}
                            </td>
                            <td className="py-2 px-2 text-center text-gray-600 dark:text-gray-400">{n.coef}</td>
                            <td className={`py-2 px-2 text-center font-bold ${n.note === null ? 'text-gray-400' : n.critique ? 'text-red-600' : 'text-emerald-600'}`}>
                                {n.note !== null ? n.note.toFixed(2) : '—'}
                            </td>
                            <td className="py-2 px-2 text-center text-gray-600 dark:text-gray-400">
                                {n.note_coef !== null ? n.note_coef.toFixed(2) : '—'}
                            </td>
                            <td className="py-2 px-2 text-center text-xs text-gray-600 dark:text-gray-400">{n.appreciation ?? '—'}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{ backgroundColor: theme.light }}>
                        <td className="py-2 px-3 font-bold text-sm" style={{ color: theme.text }}>TOTAL / MOYENNE</td>
                        <td className="py-2 px-2 text-center font-bold text-sm" style={{ color: theme.text }}>{totalCoef}</td>
                        <td className={`py-2 px-2 text-center font-bold text-sm ${moy !== null ? (parseFloat(moy) >= 10 ? 'text-emerald-700' : 'text-red-700') : ''}`}>
                            {moy !== null ? `${moy}/20` : '—'}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-sm" style={{ color: theme.text }}>{totalNoteCoef.toFixed(2)}</td>
                        <td className="py-2 px-2 text-center">
                            {moy !== null && <MentionBadge moyenne={parseFloat(moy)} />}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

// ─── Tableau notes trimestriel (2 colonnes seq) ───────────────────────────────
function TableauNotesTrimestre({ notes, seq1, seq2, theme }) {
    if (!notes || notes.length === 0) return <p className="text-gray-400 text-sm py-4 text-center">Aucune note disponible.</p>;
    const totalCoef = notes.filter(n => n.note !== null).reduce((a, n) => a + n.coef, 0);
    const totalNoteCoef = notes.filter(n => n.note !== null).reduce((a, n) => a + (n.note * n.coef), 0);
    const moy = totalCoef > 0 ? (totalNoteCoef / totalCoef).toFixed(2) : null;

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
                <thead style={{ backgroundColor: theme.main }}>
                    <tr>
                        <th className="text-left py-2 px-3 text-white font-semibold text-xs uppercase tracking-wide w-2/5">Matière</th>
                        <th className="py-2 px-2 text-white font-semibold text-xs uppercase text-center">Coef.</th>
                        <th className="py-2 px-2 text-white font-semibold text-xs uppercase text-center">Séq {seq1}</th>
                        <th className="py-2 px-2 text-white font-semibold text-xs uppercase text-center">Séq {seq2}</th>
                        <th className="py-2 px-2 text-white font-semibold text-xs uppercase text-center">Moy./20</th>
                        <th className="py-2 px-2 text-white font-semibold text-xs uppercase text-center">×Coef</th>
                    </tr>
                </thead>
                <tbody>
                    {notes.map((n, i) => (
                        <tr key={n.matiere_id} className={`border-t border-gray-100 dark:border-gray-700 ${n.critique ? 'bg-red-50 dark:bg-red-950/20' : i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/40'}`}>
                            <td className="py-2 px-3 font-medium text-gray-800 dark:text-gray-200">
                                {n.nom} {n.critique && <span className="ml-1 text-red-500 text-xs">⚠</span>}
                            </td>
                            <td className="py-2 px-2 text-center text-gray-600 dark:text-gray-400">{n.coef}</td>
                            <td className={`py-2 px-2 text-center font-semibold ${n.note_seq1 === null ? 'text-gray-400' : n.note_seq1 < 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                                {n.note_seq1 !== null ? n.note_seq1.toFixed(2) : '—'}
                            </td>
                            <td className={`py-2 px-2 text-center font-semibold ${n.note_seq2 === null ? 'text-gray-400' : n.note_seq2 < 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                                {n.note_seq2 !== null ? n.note_seq2.toFixed(2) : '—'}
                            </td>
                            <td className={`py-2 px-2 text-center font-bold ${n.note === null ? 'text-gray-400' : n.critique ? 'text-red-600' : 'text-emerald-700'}`}>
                                {n.note !== null ? n.note.toFixed(2) : '—'}
                            </td>
                            <td className="py-2 px-2 text-center text-gray-600 dark:text-gray-400">
                                {n.note !== null ? (n.note * n.coef).toFixed(2) : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{ backgroundColor: theme.light }}>
                        <td className="py-2 px-3 font-bold text-sm" style={{ color: theme.text }}>MOY. TRIMESTRIELLE</td>
                        <td className="py-2 px-2 text-center font-bold" style={{ color: theme.text }}>{totalCoef}</td>
                        <td colSpan={2} className="py-2 px-2 text-center text-xs italic text-gray-500">Moy. des 2 séquences</td>
                        <td className={`py-2 px-2 text-center font-bold text-sm ${moy !== null ? (parseFloat(moy) >= 10 ? 'text-emerald-700' : 'text-red-700') : ''}`}>
                            {moy !== null ? `${moy}/20` : '—'}
                        </td>
                        <td className="py-2 px-2 text-center font-bold" style={{ color: theme.text }}>{totalNoteCoef.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

// ─── Carte statistiques ───────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
    return (
        <div className="flex flex-col items-center justify-center p-3 rounded-xl border-2" style={{ borderColor: color }}>
            <span className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color }}>{label}</span>
            <span className="text-2xl font-black" style={{ color }}>{value}</span>
            {sub && <span className="text-xs text-gray-400 mt-0.5">{sub}</span>}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════════════════════════════
export default function Show({ auth, student, seq_data, trim_data, current_seq, available_seqs, is_signed, can_sign, can_print, is_published = true, message }) {
    const { school_name } = usePage().props;
    const [activeTab, setActiveTab] = useState('seq'); // 'seq' | 'tri'
    const [signing, setSigning] = useState(false);

    // Thème selon l'école
    const themeKey = seq_data?.school?.theme_color ?? 'emerald';
    const theme = THEME_COLORS[themeKey] ?? THEME_COLORS.emerald;

    // ── Bulletin non publié ──────────────────────────────────────────────────
    if (!is_published) {
        return (
            <AuthenticatedLayout user={auth.user}
                header={<h2 className="font-extrabold text-2xl text-gray-900 dark:text-white">Bulletin en Préparation</h2>}>
                <Head title="Bulletin en attente" />
                <div className="max-w-4xl mx-auto mt-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white">Un peu de patience...</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">{message}</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    const seqData  = seq_data  ?? {};
    const trimData = trim_data ?? {};
    const data     = activeTab === 'seq' ? seqData : trimData;
    const trimestre = Math.ceil((current_seq ?? 1) / 2);
    const seq1 = (trimestre * 2) - 1;
    const seq2 = trimestre * 2;

    // Numéros de séquences disponibles (au moins 1-6)
    const allSeqs = available_seqs ?? [1, 2, 3, 4, 5, 6];

    const handleSeqChange = (seq) => {
        router.get(route('reports.show', student.id), { seq }, { preserveState: false });
    };

    const handleSign = () => {
        setSigning(true);
        router.post(route('reports.sign', student.id), { sequence: current_seq }, {
            onFinish: () => setSigning(false),
        });
    };

    const downloadPdfSeq = () => {
        window.open(route('reports.pdf.seq', { id: student.id, sequence: current_seq }), '_blank');
    };

    const downloadPdfTri = () => {
        window.open(route('reports.pdf.tri', { id: student.id, trimestre }), '_blank');
    };

    return (
        <AuthenticatedLayout user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: theme.main }}>Bulletin de Notes</p>
                        <h2 className="font-extrabold text-2xl text-gray-900 dark:text-white leading-tight">
                            {student.nom} <span className="font-light">{student.prenom}</span>
                        </h2>
                    </div>
                </div>
            }>
            <Head title={`Bulletin — ${student.nom} ${student.prenom}`} />

            <div className="max-w-5xl mx-auto py-6 px-4 space-y-5">

                {/* ── Sélection Séquence ──────────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-400 mr-2">Séquence :</span>
                    {[1,2,3,4,5,6].map(seq => (
                        <button key={seq}
                            onClick={() => handleSeqChange(seq)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${
                                current_seq === seq
                                    ? 'text-white border-transparent shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                            }`}
                            style={current_seq === seq ? { backgroundColor: theme.main, borderColor: theme.main } : {}}
                        >
                            Séq {seq}
                            {!allSeqs.includes(seq) && <span className="ml-1 text-xs opacity-60">○</span>}
                        </button>
                    ))}
                    <span className="ml-3 text-xs text-gray-400">|</span>
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-400 ml-1">Trimestre {trimestre}</span>
                    <span className="text-xs text-gray-400">(Séq {seq1} & {seq2})</span>
                </div>

                {/* ── Tabs : Séquentiel / Trimestriel ────────────────────── */}
                <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 divide-x divide-gray-200 dark:divide-gray-700">
                    {[
                        { key: 'seq', label: `📋 Bulletin Séquentiel (Séq ${current_seq})` },
                        { key: 'tri', label: `📊 Bulletin Trimestriel (T${trimestre})` },
                    ].map(tab => (
                        <button key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 py-2.5 text-sm font-bold transition-all ${
                                activeTab === tab.key ? 'text-white' : 'bg-white dark:bg-gray-900 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                            style={activeTab === tab.key ? { backgroundColor: theme.main } : {}}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── En-tête Établissement (aperçu) ─────────────────────── */}
                <div className="rounded-xl overflow-hidden border-2 shadow-sm" style={{ borderColor: theme.main }}>
                    <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: theme.main }}>
                        <div className="text-white">
                            <div className="text-xs font-bold">RÉPUBLIQUE DU CAMEROUN — Paix Travail Patrie</div>
                        </div>
                        <div className="text-white text-right">
                            <div className="text-xs font-bold">REPUBLIC OF CAMEROON — Peace Work Fatherland</div>
                        </div>
                    </div>
                    <div className="px-5 py-3 text-center" style={{ backgroundColor: theme.light }}>
                        <div className="text-base font-extrabold uppercase tracking-wider" style={{ color: theme.text }}>
                            {data?.school?.name ?? school_name ?? 'Établissement'}
                        </div>
                        {data?.school?.city && <div className="text-xs text-gray-500 mt-0.5">{data.school.city}{data.school.contacts ? ` | Tél: ${data.school.contacts}` : ''}</div>}
                    </div>
                    <div className="px-5 py-2 text-center text-white text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: theme.main }}>
                        {activeTab === 'seq'
                            ? `BULLETIN DE NOTES — SÉQUENCE ${current_seq} — Année ${data?.classe_info?.annee_academique ?? ''}`
                            : `BULLETIN TRIMESTRIEL — ${['PREMIER','DEUXIÈME','TROISIÈME'][trimestre-1] ?? trimestre} TRIMESTRE (Séq ${seq1} & ${seq2})`
                        }
                    </div>
                </div>

                {/* ── Identité Élève ──────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-0 rounded-xl overflow-hidden border-2" style={{ borderColor: theme.main }}>
                    <div className="p-4 space-y-2 border-r" style={{ borderColor: theme.main }}>
                        <div><span className="text-xs font-bold uppercase tracking-wide text-gray-400">Nom & Prénom</span>
                            <p className="font-extrabold text-gray-900 dark:text-white mt-0.5">{student.nom?.toUpperCase()} {student.prenom}</p></div>
                        <div><span className="text-xs font-bold uppercase tracking-wide text-gray-400">Matricule</span>
                            <p className="font-mono font-bold text-gray-800 dark:text-gray-200 mt-0.5">{student.MATRICULE ?? '—'}</p></div>
                        <div><span className="text-xs font-bold uppercase tracking-wide text-gray-400">Sexe</span>
                            <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{student.sexe === 'M' ? 'Masculin' : student.sexe === 'F' ? 'Féminin' : '—'}</p></div>
                    </div>
                    <div className="p-4 space-y-2">
                        <div><span className="text-xs font-bold uppercase tracking-wide text-gray-400">Classe</span>
                            <p className="font-extrabold text-gray-900 dark:text-white mt-0.5">{data?.classe_info?.nom ?? student.classe?.nom ?? '—'}</p></div>
                        <div><span className="text-xs font-bold uppercase tracking-wide text-gray-400">Date & Lieu de Naissance</span>
                            <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                                {student.date_naissance ? new Date(student.date_naissance).toLocaleDateString('fr-FR') : '—'}
                                {student.lieu_naissance ? ` à ${student.lieu_naissance}` : ''}
                            </p></div>
                        <div><span className="text-xs font-bold uppercase tracking-wide text-gray-400">Professeur Principal</span>
                            <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{data?.prof_principal?.name ?? 'Non assigné'}</p></div>
                    </div>
                </div>

                {/* ── Stats rapides de classe ──────────────────────────────── */}
                <div className="grid grid-cols-5 gap-2">
                    <StatCard label="Moyenne" value={data.moyenne_eleve !== null && data.moyenne_eleve !== undefined ? `${parseFloat(data.moyenne_eleve).toFixed(2)}/20` : '—'} sub="de l'élève" color={data.moyenne_eleve >= 10 ? '#059669' : '#dc2626'} />
                    <StatCard label="Rang" value={data.rang ?? '—'} sub={`/ ${data.effectif_total ?? '—'} élèves`} color={theme.main} />
                    <StatCard label="1er de classe" value={data.moyenne_premier !== null && data.moyenne_premier !== undefined ? parseFloat(data.moyenne_premier).toFixed(2) : '—'} sub="/20" color={theme.main} />
                    <StatCard label="Dernier" value={data.moyenne_dernier !== null && data.moyenne_dernier !== undefined ? parseFloat(data.moyenne_dernier).toFixed(2) : '—'} sub="/20" color="#6b7280" />
                    <StatCard label="Moy. Classe" value={data.moyenne_classe !== null && data.moyenne_classe !== undefined ? parseFloat(data.moyenne_classe).toFixed(2) : '—'} sub={`Réussite ${data.taux_reussite ?? 0}%`} color={theme.main} />
                </div>

                {/* ── Tableau des notes ────────────────────────────────────── */}
                <div>
                    <h3 className="text-sm font-black uppercase tracking-wide mb-2" style={{ color: theme.text }}>
                        {activeTab === 'seq' ? `📋 Notes — Séquence ${current_seq}` : `📊 Notes — Trimestre ${trimestre} (Séq ${seq1} & ${seq2})`}
                    </h3>
                    {activeTab === 'seq'
                        ? <TableauNotes notes={seqData.notes} theme={theme} />
                        : <TableauNotesTrimestre notes={trimData.notes} seq1={seq1} seq2={seq2} theme={theme} />
                    }
                </div>

                {/* ── Matières critiques ───────────────────────────────────── */}
                {data.matieres_critiques && data.matieres_critiques.length > 0 && (
                    <div className="rounded-xl border-2 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-4">
                        <h3 className="text-sm font-black uppercase tracking-wide text-red-700 dark:text-red-400 mb-2">⚠ Matières Critiques (note &lt; 10/20)</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.matieres_critiques.map(m => (
                                <span key={m.matiere_id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-bold">
                                    {m.nom}
                                    <span className="font-black">{m.note !== null ? m.note.toFixed(2) : '—'}/20</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Discipline & Assiduité ────────────────────────────── */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                    <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
                        <h3 className="text-sm font-black uppercase tracking-wide" style={{ color: theme.text }}>
                            Discipline &amp; Assiduité {activeTab === 'seq' ? `— Séquence ${current_seq}` : `— Trimestre ${trimestre}`}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                            ['Mauvaise', 'Passable'].includes(data.discipline?.conduite)
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        }`}>
                            Conduite : {data.discipline?.conduite || 'Bonne'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
                            <span className="text-[10px] font-bold uppercase text-gray-400">Absences</span>
                            <p className={`text-base font-black mt-0.5 ${(data.discipline?.absences || 0) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                {data.discipline?.absences || 0} h
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
                            <span className="text-[10px] font-bold uppercase text-gray-400">Retards</span>
                            <p className="text-base font-black mt-0.5 text-gray-700 dark:text-gray-200">
                                {data.discipline?.retards || 0}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
                            <span className="text-[10px] font-bold uppercase text-gray-400">Avertissements</span>
                            <p className={`text-base font-black mt-0.5 ${(data.discipline?.avertissements || 0) > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                                {data.discipline?.avertissements || 0}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
                            <span className="text-[10px] font-bold uppercase text-gray-400">Blâmes</span>
                            <p className={`text-base font-black mt-0.5 ${(data.discipline?.blames || 0) > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                {data.discipline?.blames || 0}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center col-span-2 sm:col-span-1">
                            <span className="text-[10px] font-bold uppercase text-gray-400">Exclusions</span>
                            <p className={`text-base font-black mt-0.5 ${(data.discipline?.exclusions || 0) > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                {data.discipline?.exclusions || 0} j
                            </p>
                        </div>
                    </div>

                    {data.discipline?.records && data.discipline.records.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-[10px] font-bold uppercase text-gray-400 mb-1.5">Historique des faits disciplinaires :</p>
                            <div className="space-y-1">
                                {data.discipline.records.map((rec, idx) => (
                                    <div key={idx} className="text-xs text-gray-600 dark:text-gray-300 flex items-center justify-between">
                                        <span>• <strong className="capitalize">{rec.type}</strong> : {rec.motif || 'Aucun motif renseigné'}</span>
                                        <span className="text-gray-400 text-[11px]">{rec.date_incident || ''}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Mention + Actions ────────────────────────────────────── */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Mention :</span>
                        <MentionBadge moyenne={data.moyenne_eleve} />
                        {is_signed && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">✅ Signé</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {/* Signature numérique */}
                        {can_sign && !is_signed && (
                            <button onClick={handleSign} disabled={signing}
                                className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all disabled:opacity-50"
                                style={{ backgroundColor: theme.main }}>
                                {signing ? '⏳ Signature...' : '✍️ Signer le Bulletin'}
                            </button>
                        )}
                        {/* Télécharger PDF séquentiel */}
                        {can_print && (
                            <button onClick={downloadPdfSeq}
                                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gray-700 hover:bg-gray-800 transition-all flex items-center gap-1.5">
                                📄 PDF Séquence {current_seq}
                            </button>
                        )}
                        {/* Télécharger PDF trimestriel */}
                        {can_print && (
                            <button onClick={downloadPdfTri}
                                className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all flex items-center gap-1.5"
                                style={{ backgroundColor: theme.main }}>
                                📊 PDF Trimestre {trimestre}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
