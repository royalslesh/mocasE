import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, school, classes = [], students = [], histories = [], stats }) {
    const [activeTab, setActiveTab] = useState('deliberations'); // 'deliberations' | 'classes' | 'history'
    const [selectedClasseId, setSelectedClasseId] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'admis' | 'redouble' | 'exclu'
    const [showConfirmCloseModal, setShowConfirmCloseModal] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [closing, setClosing] = useState(false);

    // Formulaire de configuration des seuils
    const { data: thresholdData, setData: setThresholdData, post: postThresholds, processing: savingThresholds } = useForm({
        passing_grade: school.passing_grade || 10.00,
        repeat_grade: school.repeat_grade || 8.50,
        academic_year: school.academic_year || '2025-2026',
    });

    const handleSaveThresholds = (e) => {
        e.preventDefault();
        postThresholds(route('year.closure.thresholds'));
    };

    const handleCalculate = () => {
        if (confirm('Voulez-vous lancer le calcul automatique des moyennes annuelles et des propositions de passage pour tous les élèves ?')) {
            setCalculating(true);
            router.post(route('year.closure.calculate'), {}, {
                onFinish: () => setCalculating(false),
            });
        }
    };

    const handleUpdateStudentDecision = (studentId, decision, nextClasseId) => {
        router.put(route('year.closure.students.update', studentId), {
            decision_passage: decision,
            next_classe_id: nextClasseId,
        }, {
            preserveScroll: true,
        });
    };

    const handleUpdateClassProgression = (classeId, nextClasseId) => {
        router.put(route('year.closure.classes.progression', classeId), {
            next_classe_id: nextClasseId,
        }, {
            preserveScroll: true,
        });
    };

    const handleConfirmCloseYear = () => {
        setClosing(true);
        router.post(route('year.closure.close'), {}, {
            onFinish: () => {
                setClosing(false);
                setShowConfirmCloseModal(false);
            },
        });
    };

    // Filtrage des élèves
    const filteredStudents = students.filter((s) => {
        if (selectedClasseId && String(s.classe_id) !== String(selectedClasseId)) {
            return false;
        }
        if (selectedFilter === 'admis' && !['admis', 'diplome'].includes(s.decision_passage)) {
            return false;
        }
        if (selectedFilter === 'redouble' && s.decision_passage !== 'redouble') {
            return false;
        }
        if (selectedFilter === 'exclu' && s.decision_passage !== 'exclu') {
            return false;
        }
        return true;
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--primary-color)' }}>
                            Direction &amp; Conseil des Maîtres
                        </p>
                        <h2 className="font-extrabold text-3xl text-gray-900 dark:text-white leading-tight tracking-tight">
                            Clôture d'Année &amp; Délibérations
                        </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleCalculate}
                            disabled={calculating}
                            className="px-6 py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition-all inline-flex items-center gap-2"
                        >
                            <svg className={`w-4 h-4 ${calculating ? 'animate-spin' : ''}`} style={{ color: 'var(--primary-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            {calculating ? 'Calcul en cours...' : 'Calculer les Délibérations'}
                        </button>
                        <button
                            onClick={() => setShowConfirmCloseModal(true)}
                            className="px-6 py-3.5 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 hover:opacity-95 inline-flex items-center gap-2"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Clôturer &amp; Basculer vers {school.academic_year ? parseInt(school.academic_year.split('-')[1]) + '-' + (parseInt(school.academic_year.split('-')[1]) + 1) : 'Suivant'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Clôture d'Année & Délibérations" />

            <div className="py-8 bg-transparent min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Cartes statistiques globales */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white dark:bg-[var(--dark-bg)] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Année Active</span>
                            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{school.academic_year}</p>
                            <span className="text-xs text-gray-400">{stats.total_students} élèves inscrits</span>
                        </div>
                        <div className="bg-white dark:bg-[var(--dark-bg)] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Taux Réussite</span>
                            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.success_rate}%</p>
                            <span className="text-xs text-gray-400">{stats.passed_count} admis / diplômés</span>
                        </div>
                        <div className="bg-white dark:bg-[var(--dark-bg)] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Admis / Diplômés</span>
                            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{stats.passed_count}</p>
                            <span className="text-xs text-gray-400">Passage supérieur</span>
                        </div>
                        <div className="bg-white dark:bg-[var(--dark-bg)] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Redoublants</span>
                            <p className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">{stats.repeated_count}</p>
                            <span className="text-xs text-gray-400">Reprennent la classe</span>
                        </div>
                        <div className="bg-white dark:bg-[var(--dark-bg)] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Exclusions</span>
                            <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{stats.excluded_count}</p>
                            <span className="text-xs text-gray-400">Non réinscrits</span>
                        </div>
                    </div>

                    {/* Onglets de navigation */}
                    <div className="flex border-b border-gray-200 dark:border-white/10 gap-8">
                        <button
                            onClick={() => setActiveTab('deliberations')}
                            className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
                                activeTab === 'deliberations'
                                    ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                                    : 'border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            Tableau des Délibérations Élèves
                        </button>
                        <button
                            onClick={() => setActiveTab('classes')}
                            className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
                                activeTab === 'classes'
                                    ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                                    : 'border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            Configuration des Progressions par Classe
                        </button>
                        <button
                            onClick={() => setActiveTab('thresholds')}
                            className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
                                activeTab === 'thresholds'
                                    ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                                    : 'border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            Seuils &amp; Paramètres
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
                                activeTab === 'history'
                                    ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                                    : 'border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            Historique des Années Clôturées ({histories.length})
                        </button>
                    </div>

                    {/* CONTENU 1 : Tableau des Délibérations */}
                    {activeTab === 'deliberations' && (
                        <div className="space-y-6">
                            {/* Filtres */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[var(--dark-bg)] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 shrink-0">Classe :</label>
                                    <select
                                        value={selectedClasseId}
                                        onChange={(e) => setSelectedClasseId(e.target.value)}
                                        className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 dark:text-white"
                                    >
                                        <option value="" className="dark:bg-[#111614]">Toutes les classes ({students.length})</option>
                                        {classes.map((c) => (
                                            <option key={c.id} value={c.id} className="dark:bg-[#111614]">
                                                {c.nom} {c.section ? `(${c.section.toUpperCase()})` : ''} — {c.eleves_count} élève(s)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    {[
                                        { id: 'all', label: 'Tous' },
                                        { id: 'admis', label: 'Admis' },
                                        { id: 'redouble', label: 'Redoublants' },
                                        { id: 'exclu', label: 'Exclus' },
                                    ].map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => setSelectedFilter(f.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                                selectedFilter === f.id
                                                    ? 'bg-[var(--primary-color)] text-white shadow'
                                                    : 'bg-gray-50 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Table des élèves */}
                            <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100 dark:divide-white/5 text-xs">
                                        <thead className="bg-gray-50/50 dark:bg-white/5">
                                            <tr>
                                                <th className="px-6 py-4 text-left font-black text-gray-400 uppercase tracking-widest">Élève</th>
                                                <th className="px-6 py-4 text-left font-black text-gray-400 uppercase tracking-widest">Classe Actuelle</th>
                                                <th className="px-6 py-4 text-center font-black text-gray-400 uppercase tracking-widest">T1 / T2 / T3</th>
                                                <th className="px-6 py-4 text-center font-black text-gray-400 uppercase tracking-widest">Moyenne Annuelle</th>
                                                <th className="px-6 py-4 text-center font-black text-gray-400 uppercase tracking-widest">Rang</th>
                                                <th className="px-6 py-4 text-left font-black text-gray-400 uppercase tracking-widest">Décision de Passage</th>
                                                <th className="px-6 py-4 text-left font-black text-gray-400 uppercase tracking-widest">Classe Affectée N+1</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                            {filteredStudents.map((s) => (
                                                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-extrabold text-gray-900 dark:text-white uppercase">{s.nom} {s.prenom}</div>
                                                        <div className="text-[10px] text-gray-400 font-mono">{s.MATRICULE}</div>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-gray-500 uppercase">
                                                        {s.classe?.nom || '—'}
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-mono text-gray-400">
                                                        {s.moy1 ?? '—'} / {s.moy2 ?? '—'} / {s.moy3 ?? '—'}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-2.5 py-1 rounded-lg font-black text-sm ${
                                                            s.moy_annuelle !== null
                                                                ? s.moy_annuelle >= school.passing_grade
                                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                                    : s.moy_annuelle >= school.repeat_grade
                                                                        ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300'
                                                                        : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                                                                : 'text-gray-400'
                                                        }`}>
                                                            {s.moy_annuelle !== null ? parseFloat(s.moy_annuelle).toFixed(2) + '/20' : 'Non calculée'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-extrabold text-gray-700 dark:text-gray-300">
                                                        {s.rang_annuel ? `${s.rang_annuel}e` : '—'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={s.decision_passage || ''}
                                                            onChange={(e) => handleUpdateStudentDecision(s.id, e.target.value, s.next_classe_id)}
                                                            className={`border rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wider ${
                                                                s.decision_passage === 'admis' || s.decision_passage === 'diplome'
                                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                                    : s.decision_passage === 'redouble'
                                                                        ? 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300'
                                                                        : s.decision_passage === 'exclu'
                                                                            ? 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950/40 dark:text-red-300'
                                                                            : 'bg-gray-50 text-gray-500 border-gray-200'
                                                            }`}
                                                        >
                                                            <option value="" disabled className="dark:bg-[#111614]">En attente</option>
                                                            <option value="admis" className="dark:bg-[#111614]">Passage (Admis)</option>
                                                            <option value="diplome" className="dark:bg-[#111614]">Diplômé / Lauréat</option>
                                                            <option value="redouble" className="dark:bg-[#111614]">Redoublement</option>
                                                            <option value="exclu" className="dark:bg-[#111614]">Exclusion Définitive</option>
                                                        </select>
                                                        {s.decision_override && (
                                                            <span className="block text-[9px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">Décision modifiée manuellement</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {['admis', 'redouble'].includes(s.decision_passage) ? (
                                                            <select
                                                                value={s.next_classe_id || ''}
                                                                onChange={(e) => handleUpdateStudentDecision(s.id, s.decision_passage, e.target.value || null)}
                                                                className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white"
                                                            >
                                                                <option value="" className="dark:bg-[#111614]">Non définie</option>
                                                                {classes.map((c) => (
                                                                    <option key={c.id} value={c.id} className="dark:bg-[#111614]">
                                                                        {c.nom} {c.section ? `(${c.section.toUpperCase()})` : ''}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <span className="text-gray-400 font-bold">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredStudents.length === 0 && (
                                                <tr>
                                                    <td colSpan="7" className="px-8 py-16 text-center text-gray-400 font-bold">
                                                        Aucun élève trouvé pour cette sélection.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTENU 2 : Configuration des progressions par classe */}
                    {activeTab === 'classes' && (
                        <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 shadow-xl space-y-6">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Progression Automatique des Classes</h3>
                                <p className="text-xs text-gray-400 mt-1">Définissez vers quelle classe supérieure les élèves admis de chaque classe monteront automatiquement.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {classes.map((classe) => (
                                    <div key={classe.id} className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="font-extrabold text-gray-900 dark:text-white uppercase text-sm">{classe.nom}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{classe.level?.name || 'Niveau ' + classe.level_id} • {classe.eleves_count} élève(s)</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-xs font-bold">→</span>
                                            <select
                                                value={classe.next_classe_id || ''}
                                                onChange={(e) => handleUpdateClassProgression(classe.id, e.target.value || null)}
                                                className="bg-white dark:bg-[#111614] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white"
                                            >
                                                <option value="">Automatique (Niveau supérieur)</option>
                                                {classes.filter(c => c.id !== classe.id).map((target) => (
                                                    <option key={target.id} value={target.id}>
                                                        {target.nom} {target.section ? `(${target.section.toUpperCase()})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CONTENU 3 : Seuils & Paramètres */}
                    {activeTab === 'thresholds' && (
                        <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 shadow-xl max-w-2xl space-y-6">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Paramètres de Délibération</h3>
                                <p className="text-xs text-gray-400 mt-1">Configurez les règles de passage et redoublement appliquées à l'école.</p>
                            </div>

                            <form onSubmit={handleSaveThresholds} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Année Académique Active</label>
                                    <input
                                        type="text"
                                        value={thresholdData.academic_year}
                                        onChange={(e) => setThresholdData('academic_year', e.target.value)}
                                        placeholder="Ex: 2025-2026"
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Seuil d'Admission / Passage (/20)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="20"
                                            value={thresholdData.passing_grade}
                                            onChange={(e) => setThresholdData('passing_grade', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-black text-gray-900 dark:text-white"
                                        />
                                        <span className="text-[10px] text-gray-400 mt-1 block">Notes &gt;= à ce seuil = Admis</span>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2">Seuil de Redoublement (/20)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="20"
                                            value={thresholdData.repeat_grade}
                                            onChange={(e) => setThresholdData('repeat_grade', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-black text-gray-900 dark:text-white"
                                        />
                                        <span className="text-[10px] text-gray-400 mt-1 block">Notes &lt; à ce seuil = Exclu</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={savingThresholds}
                                    className="px-8 py-3.5 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all hover:opacity-90 active:scale-95"
                                    style={{ backgroundColor: 'var(--primary-color)' }}
                                >
                                    {savingThresholds ? 'Enregistrement...' : 'Enregistrer les Seuils'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* CONTENU 4 : Historique des Années Clôturées */}
                    {activeTab === 'history' && (
                        <div className="space-y-6">
                            {histories.map((h) => (
                                <div key={h.id} className="bg-white dark:bg-[var(--dark-bg)] rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 shadow-xl space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 dark:border-white/5 gap-4">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--primary-color)' }}>Archive Officielle</span>
                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Année Scolaire {h.academic_year}</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">Clôturée le {new Date(h.closed_at).toLocaleDateString('fr-FR')} par {h.closed_by?.name || 'Le Proviseur'}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{h.success_rate}%</p>
                                                <p className="text-[9px] font-black uppercase text-gray-400">Taux Réussite</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-gray-900 dark:text-white">{h.total_students}</p>
                                                <p className="text-[9px] font-black uppercase text-gray-400">Total Élèves</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tableau des stats par classe pour cette année */}
                                    {h.classes_stats && h.classes_stats.length > 0 && (
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Performances par Classe</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {h.classes_stats.map((cs, idx) => (
                                                    <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="font-extrabold text-sm uppercase text-gray-900 dark:text-white">{cs.classe_nom}</span>
                                                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{cs.success_rate}%</span>
                                                        </div>
                                                        <div className="text-[11px] text-gray-500 space-y-0.5">
                                                            <p>Effectif : {cs.total} | Admis : {cs.passed} | Redouble : {cs.repeated}</p>
                                                            <p>Major : <strong>{cs.top_student}</strong> ({cs.top_avg ? cs.top_avg + '/20' : '—'})</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {histories.length === 0 && (
                                <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-16 text-center shadow-xl">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Aucune année archivée pour le moment.</p>
                                    <p className="text-gray-300 dark:text-gray-600 text-xs mt-1">Les archives apparaîtront ici automatiquement dès votre première clôture d'année.</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* MODAL DE CONFIRMATION DE CLÔTURE DÉFINITIVE */}
            {showConfirmCloseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111614] rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Confirmer la Clôture de l'Année</h3>
                                <p className="text-xs text-gray-400">Action irréversible de fin d'année scolaire</p>
                            </div>
                        </div>

                        <div className="space-y-4 py-6 text-xs text-gray-600 dark:text-gray-300">
                            <p className="font-bold text-gray-900 dark:text-white">Cette opération va exécuter automatiquement :</p>
                            <ul className="space-y-2 list-disc pl-4">
                                <li><strong>Archivage</strong> des taux de réussite de chaque classe et de l'école pour l'année {school.academic_year}.</li>
                                <li><strong>Promotion</strong> des élèves admis vers leur classe supérieure pour la rentrée.</li>
                                <li><strong>Maintien</strong> des redoublants dans leur classe avec statut redoublant activé.</li>
                                <li><strong>Archivage</strong> des diplômés de Terminale et des exclus.</li>
                                <li><strong>Avancement automatique</strong> vers l'année scolaire suivante.</li>
                                <li><strong>Remise à zéro</strong> des registres de notes pour accueillir la nouvelle année.</li>
                            </ul>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                            <button
                                type="button"
                                onClick={() => setShowConfirmCloseModal(false)}
                                disabled={closing}
                                className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmCloseYear}
                                disabled={closing}
                                className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-white rounded-2xl shadow-xl bg-red-600 hover:bg-red-700 active:scale-95 transition-all"
                            >
                                {closing ? 'Traitement en cours...' : 'Confirmer la Clôture'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
