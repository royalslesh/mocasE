import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';

export default function Create({ auth, classes = [], existingNotes = [], isSubmissionOpen = true, userRole, deadlines = [], extensions = [] }) {
    const { data, setData, post, processing } = useForm({
        classe_id: '',
        matiere_id: '',
        sequence: 1,
        notes: [], // [{ student_id: 1, score: 14.5 }]
    });

    const [selectedClass, setSelectedClass] = useState(null);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [extensionReason, setExtensionReason] = useState("");
    const [showExtensionModal, setShowExtensionModal] = useState(false);
    
    // Mode d'affichage : 'cards' (tactile/mobile) ou 'table' (tableau desktop)
    const [viewMode, setViewMode] = useState('cards');

    // Suivi de l'état de sauvegarde par élève: { [student_id]: 'idle' | 'saving' | 'saved' | 'error' }
    const [saveStatus, setSaveStatus] = useState({});

    // Références vers les champs input pour le saut automatique de focus
    const inputRefs = useRef({});
    // Debounce timers pour la sauvegarde automatique
    const saveTimers = useRef({});

    // Initialisation
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const cid = params.get('classe_id');
        if (cid) {
            handleClassChange(cid);
        }
    }, []);

    // Quand la classe change
    const handleClassChange = (classId) => {
        const found = classes.find(c => c.id === parseInt(classId));
        setSelectedClass(found || null);
        
        const subjectsForClass = found ? (found.matieres || []) : [];
        setAvailableSubjects(subjectsForClass);

        setData(prev => ({
            ...prev,
            classe_id: classId,
            matiere_id: '',
            notes: [],
        }));
        setSaveStatus({});
    };

    // Vérification des délais et autorisations
    const checkAuthorization = () => {
        if (!selectedClass || !data.matiere_id) return { isLocked: true, message: "Veuillez sélectionner une classe et une matière." };
        
        if (!isSubmissionOpen && !['super_admin', 'proviseur'].includes(userRole)) {
            return { isLocked: true, message: "La saisie des notes a été fermée par la direction à l'échelle de l'établissement." };
        }

        if (['super_admin', 'proviseur'].includes(userRole)) return { isLocked: false };

        const seqKey = `seq${data.sequence}_auth`;
        if (!selectedClass[seqKey]) {
            return { isLocked: true, message: `Le Censeur responsable n'a pas encore ouvert les autorisations pour la Séquence ${data.sequence}.` };
        }

        // Vérification Deadline
        const seqDeadline = deadlines.find(d => d.sequence === parseInt(data.sequence));
        if (seqDeadline && (seqDeadline.start_date || seqDeadline.end_date)) {
            const now = new Date();
            let isOpen = true;
            if (seqDeadline.start_date && now < new Date(seqDeadline.start_date)) isOpen = false;
            if (seqDeadline.end_date) {
                const end = new Date(seqDeadline.end_date);
                end.setHours(23, 59, 59, 999);
                if (now > end) isOpen = false;
            }

            if (!isOpen) {
                const ext = extensions.find(e => 
                    e.classe_id === parseInt(data.classe_id) && 
                    e.subject_id === parseInt(data.matiere_id) && 
                    e.sequence === parseInt(data.sequence)
                );

                if (ext && ext.status === 'approved') return { isLocked: false };
                
                if (ext && ext.status === 'pending') {
                    return { isLocked: true, isDeadline: true, hasPendingExt: true, message: "Le délai est expiré. Votre demande de dérogation est en attente d'approbation." };
                }

                return { isLocked: true, isDeadline: true, message: "Le délai officiel de saisie pour cette séquence est expiré." };
            }
        }

        return { isLocked: false };
    };

    const authStatus = checkAuthorization();
    const isLocked = authStatus.isLocked;

    // Charger les notes des élèves quand classe, matière ou séquence change
    useEffect(() => {
        if (selectedClass && data.matiere_id && data.sequence) {
            const initialNotes = (selectedClass.eleves || []).map(student => {
                const existing = existingNotes.find(
                    n => n.eleve_id === student.id &&
                         n.matiere_id === parseInt(data.matiere_id) &&
                         n.sequence === parseInt(data.sequence)
                );
                return {
                    student_id: student.id,
                    score: existing ? existing.note : '',
                };
            });
            setData('notes', initialNotes);
            setSaveStatus({});
        }
    }, [data.classe_id, data.matiere_id, data.sequence]);

    // SAUVEGARDE AUTOMATIQUE INSTANTANÉE (Par élève)
    const triggerAutoSave = (studentId, rawValue) => {
        if (isLocked || !data.classe_id || !data.matiere_id) return;

        // Nettoyer les caractères virgule en point
        const cleanVal = typeof rawValue === 'string' ? rawValue.replace(',', '.') : rawValue;
        const numVal = parseFloat(cleanVal);

        if (cleanVal !== '' && (isNaN(numVal) || numVal < 0 || numVal > 20)) {
            setSaveStatus(prev => ({ ...prev, [studentId]: 'error' }));
            return;
        }

        setSaveStatus(prev => ({ ...prev, [studentId]: 'saving' }));

        if (saveTimers.current[studentId]) {
            clearTimeout(saveTimers.current[studentId]);
        }

        saveTimers.current[studentId] = setTimeout(() => {
            axios.post(route('grades.single'), {
                classe_id: data.classe_id,
                matiere_id: data.matiere_id,
                sequence: data.sequence,
                student_id: studentId,
                score: cleanVal === '' ? null : numVal,
            })
            .then(() => {
                setSaveStatus(prev => ({ ...prev, [studentId]: 'saved' }));
            })
            .catch(() => {
                setSaveStatus(prev => ({ ...prev, [studentId]: 'error' }));
            });
        }, 350); // 350ms debounce pour une réactivité instantanée
    };

    // Changement de note
    const handleScoreChange = (studentId, value) => {
        // Remplacer virgule par point pour saisie fluide
        const formatted = value.replace(',', '.');

        const updatedNotes = data.notes.map(n => {
            if (n.student_id === studentId) return { ...n, score: formatted };
            return n;
        });
        setData('notes', updatedNotes);

        triggerAutoSave(studentId, formatted);
    };

    // Passer au champ suivant avec animation douce
    const focusNextStudent = (currentIndex) => {
        const nextIndex = currentIndex + 1;
        const eleves = selectedClass?.eleves || [];
        if (nextIndex < eleves.length) {
            const nextStudent = eleves[nextIndex];
            const nextInput = inputRefs.current[nextStudent.id];
            if (nextInput) {
                nextInput.focus();
                nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    // Passer au champ précédent
    const focusPrevStudent = (currentIndex) => {
        const prevIndex = currentIndex - 1;
        const eleves = selectedClass?.eleves || [];
        if (prevIndex >= 0) {
            const prevStudent = eleves[prevIndex];
            const prevInput = inputRefs.current[prevStudent.id];
            if (prevInput) {
                prevInput.focus();
                prevInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    // Gestion du clavier : Entrée = élève suivant, Flèche bas = suivant, Flèche haut = précédent
    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            focusNextStudent(index);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusNextStudent(index);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusPrevStudent(index);
        }
    };

    // Statistiques en temps réel
    const stats = useMemo(() => {
        const validScores = data.notes.map(n => parseFloat(n.score)).filter(s => !isNaN(s) && s >= 0 && s <= 20);
        const total = selectedClass?.eleves?.length || 0;
        const gradedCount = validScores.length;
        const progressPercent = total > 0 ? Math.round((gradedCount / total) * 100) : 0;
        const classAvg = gradedCount ? (validScores.reduce((a, b) => a + b, 0) / gradedCount).toFixed(2) : '--';
        const passRate = gradedCount ? ((validScores.filter(s => s >= 10).length / gradedCount) * 100).toFixed(0) : '--';
        const maxScore = gradedCount ? Math.max(...validScores).toFixed(2) : '--';
        const minScore = gradedCount ? Math.min(...validScores).toFixed(2) : '--';

        return { total, gradedCount, progressPercent, classAvg, passRate, maxScore, minScore };
    }, [data.notes, selectedClass]);

    const submit = (e) => {
        e.preventDefault();
        if (isLocked) return;
        post(route('grades.store'));
    };

    const submitExtensionRequest = (e) => {
        e.preventDefault();
        router.post(route('extensions.request'), {
            classe_id: data.classe_id,
            subject_id: data.matiere_id,
            sequence: data.sequence,
            reason: extensionReason
        }, {
            onSuccess: () => setShowExtensionModal(false)
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 sm:p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl sm:rounded-2xl shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Espace Enseignant</p>
                            <h2 className="font-black text-xl sm:text-2xl text-gray-900 dark:text-white uppercase tracking-tight">
                                Saisie Rapide des Notes
                            </h2>
                        </div>
                    </div>

                    {/* Mode Toggle (Fiches / Tableau) */}
                    {data.classe_id && data.matiere_id && (
                        <div className="inline-flex items-center p-1 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 self-start sm:self-auto">
                            <button
                                type="button"
                                onClick={() => setViewMode('cards')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                    viewMode === 'cards'
                                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                Fiches Tactiles
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                    viewMode === 'table'
                                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Tableau
                            </button>
                        </div>
                    )}
                </div>
            }
        >
            <Head title="Saisie des Notes" />

            <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 px-2 sm:px-4 pb-20">
                <form onSubmit={submit} className="space-y-5 sm:space-y-6">
                    
                    {/* Control Panel: Classe, Matière, Séquence */}
                    <div className="bg-white dark:bg-[var(--dark-bg)] rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 shadow-sm border border-gray-100 dark:border-white/5 space-y-5 sm:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            {/* 1. CLASSE */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                    1. Classe / Salle
                                </label>
                                <select
                                    value={data.classe_id}
                                    onChange={(e) => handleClassChange(e.target.value)}
                                    className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl sm:rounded-2xl text-gray-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                                >
                                    <option value="" className="bg-white dark:bg-gray-900 text-gray-400">Choisir la classe...</option>
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold">
                                            {c.nom} {c.section ? `(${c.section.toUpperCase()})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 2. MATIERE */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                    2. Matière Évaluée
                                </label>
                                <select
                                    value={data.matiere_id}
                                    onChange={(e) => setData('matiere_id', e.target.value)}
                                    className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl sm:rounded-2xl text-gray-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                                    disabled={!selectedClass}
                                >
                                    <option value="" className="bg-white dark:bg-gray-900 text-gray-400">
                                        {!selectedClass ? 'Choisissez d\'abord une classe...' : availableSubjects.length === 0 ? 'Aucune matière' : 'Choisir la matière...'}
                                    </option>
                                    {availableSubjects.map((s) => (
                                        <option key={s.id} value={s.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold">
                                            {s.nom} (Coef {s.coefficient})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 3. SEQUENCE */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                    3. Séquence
                                </label>
                                <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
                                    {[1, 2, 3, 4, 5, 6].map(seq => {
                                        const isSelected = data.sequence === seq;
                                        const isAuth = selectedClass ? Boolean(selectedClass[`seq${seq}_auth`]) : true;
                                        return (
                                            <button
                                                key={seq}
                                                type="button"
                                                onClick={() => setData('sequence', seq)}
                                                className={`py-2 sm:py-2.5 rounded-xl font-black text-xs transition-all border flex flex-col items-center justify-center ${
                                                    isSelected 
                                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105' 
                                                        : isAuth
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-500'
                                                            : 'bg-white dark:bg-[#1a221f] text-gray-400 dark:text-gray-500 border-gray-200 dark:border-white/10 hover:border-gray-400 opacity-75'
                                                }`}
                                            >
                                                <span>S{seq}</span>
                                                <span className={`text-[8px] font-black uppercase tracking-tighter ${
                                                    isSelected ? 'text-white/90' : isAuth ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'
                                                }`}>
                                                    {isAuth ? 'Ouverte' : 'Fermée'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Banner d'Autorisation & Sécurité */}
                        {selectedClass && data.matiere_id && (
                            <div>
                                {isLocked ? (
                                    <div className="bg-red-50 dark:bg-red-950/30 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-red-200 dark:border-red-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-600 text-white p-2 rounded-xl shrink-0">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-red-900 dark:text-red-200 uppercase tracking-wide">
                                                    🔒 Saisie Verrouillée
                                                </p>
                                                <p className="text-[11px] font-bold text-red-700 dark:text-red-400 mt-0.5">
                                                    {authStatus.message}
                                                </p>
                                            </div>
                                        </div>
                                        {authStatus.isDeadline && !authStatus.hasPendingExt && userRole === 'enseignant' && (
                                            <button 
                                                type="button"
                                                onClick={() => setShowExtensionModal(true)}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all self-start sm:self-auto shrink-0"
                                            >
                                                Demander dérogation
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-emerald-600 text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-wide">
                                                    🔓 Saisie Ouverte &amp; Sauvegarde Automatique
                                                </p>
                                                <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                                                    Chaque note saisie est enregistrée automatiquement en arrière-plan. Appuyez sur <span className="font-black">Entrée</span> pour passer à l'élève suivant.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* STATS & PROGRESS BAR EN DIRECT */}
                    {data.classe_id && data.matiere_id && (
                        <div className="bg-white dark:bg-[var(--dark-bg)] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-white/5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                                        Progression de Saisie :
                                    </span>
                                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                                        {stats.gradedCount} / {stats.total} notés ({stats.progressPercent}%)
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                                    <span>Moy : <strong className="text-gray-900 dark:text-white">{stats.classAvg}/20</strong></span>
                                    <span>•</span>
                                    <span>Max : <strong className="text-emerald-600">{stats.maxScore}</strong></span>
                                    <span>•</span>
                                    <span>Min : <strong className="text-rose-600">{stats.minScore}</strong></span>
                                    <span>•</span>
                                    <span>Réussite : <strong className="text-emerald-600">{stats.passRate}%</strong></span>
                                </div>
                            </div>

                            {/* Barre de progression */}
                            <div className="w-full h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                    style={{ width: `${stats.progressPercent}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* LISTE DES CANDIDATS & SAISIE */}
                    {data.classe_id && data.matiere_id && (
                        <div>
                            {/* MODE 1 : FICHES TACTILES (Mobile-First / Confortable) */}
                            {viewMode === 'cards' ? (
                                <div className="space-y-3">
                                    {(selectedClass?.eleves || []).map((student, index) => {
                                        const noteData = data.notes.find(n => n.student_id === student.id) || { score: '' };
                                        const scoreNum = parseFloat(noteData.score);
                                        const hasValidScore = !isNaN(scoreNum);
                                        const isPassing = hasValidScore && scoreNum >= 10;
                                        const status = saveStatus[student.id];

                                        return (
                                            <div 
                                                key={student.id} 
                                                className={`p-3.5 sm:p-5 rounded-2xl border transition-all duration-200 bg-white dark:bg-[var(--dark-bg)] flex items-center justify-between gap-3 ${
                                                    hasValidScore 
                                                        ? (isPassing ? 'border-emerald-300 dark:border-emerald-900/50 shadow-sm' : 'border-rose-300 dark:border-rose-900/50 shadow-sm')
                                                        : 'border-gray-100 dark:border-white/5'
                                                }`}
                                            >
                                                {/* Identité Élève */}
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    {/* Numéro séquentiel */}
                                                    <span className="w-6 text-center text-xs font-black text-gray-300 dark:text-gray-600 shrink-0">
                                                        {index + 1}
                                                    </span>

                                                    {/* Photo ou avatar */}
                                                    {(student.photo_url || student.photo_path) ? (
                                                        <img 
                                                            src={student.photo_url || (student.photo_path?.startsWith("http") ? student.photo_path : `/storage/${student.photo_path}`)}
                                                            alt={student.nom}
                                                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-white/10"
                                                        />
                                                    ) : (
                                                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center font-black text-xs text-gray-600 dark:text-gray-300 shrink-0">
                                                            {student.nom.charAt(0)}{student.prenom?.charAt(0)}
                                                        </div>
                                                    )}

                                                    {/* Nom & Matricule */}
                                                    <div className="min-w-0">
                                                        <p className="font-black text-gray-900 dark:text-white text-sm sm:text-base uppercase tracking-tight truncate">
                                                            {student.nom} {student.prenom}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                                {student.MATRICULE || 'N/A'}
                                                            </span>
                                                            {/* Statut de sauvegarde instantané */}
                                                            {status === 'saving' && (
                                                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-500 animate-pulse">
                                                                    ● Sauvegarde...
                                                                </span>
                                                            )}
                                                            {status === 'saved' && (
                                                                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400">
                                                                    ✓ Enregistré
                                                                </span>
                                                            )}
                                                            {status === 'error' && (
                                                                <span className="text-[9px] font-black text-rose-500">
                                                                    ⚠ Erreur (0 à 20)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Champ Note & Bouton Suivant */}
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <div className="relative">
                                                        <input
                                                            ref={el => (inputRefs.current[student.id] = el)}
                                                            type="text"
                                                            inputMode="decimal"
                                                            pattern="[0-9]*[.,]?[0-9]*"
                                                            disabled={isLocked}
                                                            value={noteData.score}
                                                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                                            placeholder="--"
                                                            className={`w-20 sm:w-24 h-12 sm:h-14 text-center font-black text-lg sm:text-xl rounded-xl sm:rounded-2xl border-2 transition-all focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-50 ${
                                                                hasValidScore
                                                                    ? (isPassing 
                                                                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-400 dark:border-emerald-600' 
                                                                        : 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border-rose-400 dark:border-rose-600')
                                                                    : 'bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border-transparent focus:border-emerald-500'
                                                            }`}
                                                        />
                                                        <span className="absolute -bottom-3.5 right-1 text-[8px] font-black text-gray-400">/20</span>
                                                    </div>

                                                    {/* Bouton Suivant pour tactile */}
                                                    <button
                                                        type="button"
                                                        onClick={() => focusNextStudent(index)}
                                                        className="w-10 h-12 sm:w-11 sm:h-14 rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-emerald-100 dark:hover:bg-emerald-950/30 text-gray-500 hover:text-emerald-600 flex items-center justify-center transition-all active:scale-95"
                                                        title="Élève suivant (ou appuyez sur Entrée)"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                /* MODE 2 : TABLEAU CLASSIQUE DESKTOP */
                                <div className="bg-white dark:bg-[var(--dark-bg)] rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[500px]">
                                        <thead>
                                            <tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-16">N°</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Matricule &amp; Candidat</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right w-44">Note (/20)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                            {(selectedClass?.eleves || []).map((student, index) => {
                                                const noteData = data.notes.find(n => n.student_id === student.id) || { score: '' };
                                                const scoreNum = parseFloat(noteData.score);
                                                const hasValidScore = !isNaN(scoreNum);
                                                const isPassing = hasValidScore && scoreNum >= 10;
                                                const status = saveStatus[student.id];

                                                return (
                                                    <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-6 py-4 text-xs font-black text-gray-400">{index + 1}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                {(student.photo_url || student.photo_path) ? (
                                                                    <img 
                                                                        src={student.photo_url || (student.photo_path?.startsWith("http") ? student.photo_path : `/storage/${student.photo_path}`)}
                                                                        alt={student.nom}
                                                                        className="w-9 h-9 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-white/10"
                                                                    />
                                                                ) : (
                                                                    <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center font-black text-xs text-gray-600 dark:text-gray-300 shrink-0">
                                                                        {student.nom.charAt(0)}{student.prenom?.charAt(0)}
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight">{student.nom} {student.prenom}</p>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{student.MATRICULE || 'N/A'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="inline-flex items-center gap-2">
                                                                {status === 'saving' && <span className="text-[9px] text-blue-500 animate-pulse font-bold">Sauvegarde...</span>}
                                                                {status === 'saved' && <span className="text-[9px] text-emerald-600 font-bold">✓</span>}
                                                                <input
                                                                    ref={el => (inputRefs.current[student.id] = el)}
                                                                    type="text"
                                                                    inputMode="decimal"
                                                                    disabled={isLocked}
                                                                    value={noteData.score}
                                                                    onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                                    className={`w-24 px-4 py-2 text-center font-black text-base rounded-xl border-2 transition-all focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 ${
                                                                        hasValidScore 
                                                                            ? (isPassing ? 'bg-emerald-50 text-emerald-700 border-emerald-400' : 'bg-rose-50 text-rose-700 border-rose-400')
                                                                            : 'bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border-transparent'
                                                                    }`}
                                                                    placeholder="--"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* BARRE D'ACTION INFÉRIEURE / SÉCURITÉ */}
                            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-xs font-semibold text-gray-400 text-center sm:text-left">
                                    💡 <em>Toutes vos modifications sont sauvegardées en temps réel. Le bouton ci-contre permet une validation générale.</em>
                                </div>
                                {!isLocked && (
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {processing ? 'Validation en cours...' : 'Valider & Verrouiller la Saisie'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </form>

                {/* Modal Dérogation */}
                {showExtensionModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-in fade-in">
                        <div className="bg-white dark:bg-[var(--dark-bg)] w-full max-w-md rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-white/5">
                            <h3 className="font-black text-lg sm:text-xl text-gray-900 dark:text-white uppercase tracking-tight mb-2">
                                Demander une dérogation
                            </h3>
                            <p className="text-xs text-gray-500 font-medium mb-6">
                                Expliquez brièvement pourquoi vous n'avez pas pu saisir vos notes dans les délais officiels.
                            </p>
                            
                            <form onSubmit={submitExtensionRequest}>
                                <textarea 
                                    className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 resize-none mb-6"
                                    placeholder="Motif de la demande..."
                                    value={extensionReason}
                                    onChange={e => setExtensionReason(e.target.value)}
                                    required
                                />
                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowExtensionModal(false)} 
                                        className="flex-1 py-3 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-black rounded-xl text-xs uppercase tracking-wider"
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 py-3 bg-red-600 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md hover:bg-red-700 active:scale-95 transition-all"
                                    >
                                        Envoyer au Censeur
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
