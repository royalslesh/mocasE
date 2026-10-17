import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const LANGUES_LV2 = [
    { code: 'ESPAGNOLE', nom: 'Espagnol' },
    { code: 'ALLEMANDE', nom: 'Allemand' },
    { code: 'ITALIENNE', nom: 'Italien' },
    { code: 'CHINOISE', nom: 'Chinois' },
    { code: 'ARABE', nom: 'Arabe' },
];

const SERIES_BY_LEVEL = {
    5: [{ code: 'A4', nom: 'Série A4 (Littéraire)' }, { code: 'C', nom: 'Série C (Scientifique)' }],
    6: [{ code: 'A4', nom: 'Série A4 (Littéraire)' }, { code: 'C', nom: 'Série C (Maths/Physique)' }, { code: 'D', nom: 'Série D (SVT)' }],
    7: [{ code: 'A4', nom: 'Série A4 (Littéraire)' }, { code: 'C', nom: 'Série C (Maths/Physique)' }, { code: 'D', nom: 'Série D (SVT)' }],
};

const ANGLOPHONE_LEVEL_NAMES = {
    1: 'FORM 1',
    2: 'FORM 2',
    3: 'FORM 3',
    4: 'FORM 4',
    5: 'FORM 5',
    6: 'LOWER SIXTH',
    7: 'UPPER SIXTH',
};

const FRANCOPHONE_LEVEL_NAMES = {
    1: 'SIXIEME',
    2: 'CINQUIEME',
    3: 'QUATRIEME',
    4: 'TROISIEME',
    5: 'SECONDE',
    6: 'PREMIERE',
    7: 'TERMINALE',
};

export default function Index({ auth, classes, levels, filieres, teachers = [] }) {
    const defaultAnnee = new Date().getFullYear() + '-' + (new Date().getFullYear() + 1);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nom: '',
        section: 'francophone',
        level_id: '',
        lv2: '',
        serie: '',
        filiere_id: '',
        code: '',
        principal_teacher_id: '',
        annee_academique: defaultAnnee,
        auto_subjects: true,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const selectedLevel = levels.find(l => l.id == data.level_id);
    const levelOrder = selectedLevel ? selectedLevel.order : null;

    // Helper pour générer automatiquement le nom de la classe selon la sélection
    const getSuggestedName = (section, levelOrder, serie, lv2) => {
        if (!levelOrder) return '';
        if (section === 'anglophone') {
            return ANGLOPHONE_LEVEL_NAMES[levelOrder] || `FORM ${levelOrder}`;
        }
        
        let baseName = FRANCOPHONE_LEVEL_NAMES[levelOrder] || `NIVEAU ${levelOrder}`;
        if (section === 'bilingue') {
            baseName += ' BILINGUE';
        }
        
        // Quatrième (3) & Troisième (4)
        if (levelOrder === 3 || levelOrder === 4) {
            if (lv2) baseName += ` ${lv2}`;
        } 
        // Seconde (5), Première (6), Terminale (7)
        else if (levelOrder >= 5 && section === 'francophone') {
            if (serie) {
                baseName += ` ${serie}`;
                if (serie === 'A4' && lv2) {
                    baseName += ` ${lv2}`;
                }
            }
        }
        return baseName;
    };

    const handleLevelChange = (levelId) => {
        const lvl = levels.find(l => l.id == levelId);
        const lOrder = lvl ? lvl.order : null;
        const suggested = getSuggestedName(data.section, lOrder, data.serie, data.lv2);
        setData(prev => ({
            ...prev,
            level_id: levelId,
            nom: suggested || prev.nom,
        }));
    };

    const handleSectionChange = (section) => {
        const suggested = getSuggestedName(section, levelOrder, data.serie, data.lv2);
        setData(prev => ({
            ...prev,
            section,
            nom: suggested || prev.nom,
        }));
    };

    const handleSerieChange = (serie) => {
        // Si la série n'est pas littéraire (A), on réinitialise la LV2
        const isLiterary = serie && serie.startsWith('A');
        const newLv2 = isLiterary ? data.lv2 : '';
        const suggested = getSuggestedName(data.section, levelOrder, serie, newLv2);
        setData(prev => ({
            ...prev,
            serie,
            lv2: newLv2,
            nom: suggested || prev.nom,
        }));
    };

    const handleLv2Change = (lv2) => {
        const suggested = getSuggestedName(data.section, levelOrder, data.serie, lv2);
        setData(prev => ({
            ...prev,
            lv2,
            nom: suggested || prev.nom,
        }));
    };

    const handleEdit = (classe) => {
        setIsEditing(true);
        setEditId(classe.id);
        setData({
            nom: classe.nom,
            section: 'francophone',
            level_id: classe.level_id,
            lv2: '',
            serie: '',
            filiere_id: classe.filiere_id || '',
            code: classe.code || '',
            principal_teacher_id: classe.principal_teacher_id || '',
            annee_academique: classe.annee_academique || defaultAnnee,
        });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        reset();
    };

    const handleDelete = (id) => {
        if (confirm('Supprimer cette classe définitivement ?')) {
            router.delete(route('classes.destroy', id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('classes.update', editId), {
                onSuccess: () => cancelEdit(),
            });
        } else {
            post(route('classes.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const toggleSequence = (classeId, sequence) => {
        post(route('classes.sequence.auth', { classe: classeId }), {
            data: { sequence },
            preserveScroll: true
        });
    };

    const toggleAllClassesSequence = (sequence) => {
        post(route('classes.sequence.auth.all'), {
            data: { sequence },
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--primary-color)' }}>Infrastructure</p>
                    <h2 className="font-extrabold text-3xl text-gray-900 dark:text-white leading-tight tracking-tight">Gestion des Classes</h2>
                </div>
            }
        >
            <Head title="Classes" />

            <div className="space-y-10">
                {/* Form Card */}
                <div className="bg-white dark:bg-[var(--dark-bg)] p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 px-1">
                        {isEditing ? 'Réviser la Classe' : 'Ouvrir une Nouvelle Salle / Classe'}
                    </h3>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* 1. SECTION (Francophone / Anglophone / Bilingue) */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">
                                    1. Sub-système / Section
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleSectionChange('francophone')}
                                        className={`py-3 px-3 rounded-2xl font-bold text-xs transition-all border ${data.section === 'francophone'
                                            ? 'bg-[var(--primary-color)] text-white border-transparent shadow-lg'
                                            : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-white/5'
                                            }`}
                                    >
                                        Francophone
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSectionChange('bilingue')}
                                        className={`py-3 px-3 rounded-2xl font-bold text-xs transition-all border ${data.section === 'bilingue'
                                            ? 'bg-[var(--primary-color)] text-white border-transparent shadow-lg'
                                            : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-white/5'
                                            }`}
                                    >
                                        Bilingue
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSectionChange('anglophone')}
                                        className={`py-3 px-3 rounded-2xl font-bold text-xs transition-all border ${data.section === 'anglophone'
                                            ? 'bg-[var(--primary-color)] text-white border-transparent shadow-lg'
                                            : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-white/5'
                                            }`}
                                    >
                                        Anglophone
                                    </button>
                                </div>
                            </div>

                            {/* 2. NIVEAU ACADÉMIQUE */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">
                                    2. Niveau Académique
                                </label>
                                <select
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                    style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                    value={data.level_id}
                                    onChange={(e) => handleLevelChange(e.target.value)}
                                    required
                                >
                                    <option value="" className="bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-400">Choisir un niveau...</option>
                                    {levels.sort((a, b) => a.order - b.order).map(level => (
                                        <option key={level.id} value={level.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium">
                                            {data.section === 'anglophone'
                                                ? `Level ${level.order} : ${ANGLOPHONE_LEVEL_NAMES[level.order] || level.name}`
                                                : `Niveau ${level.order} : ${FRANCOPHONE_LEVEL_NAMES[level.order] || level.name}`}
                                        </option>
                                    ))}
                                </select>
                                {errors.level_id && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-tighter italic">{errors.level_id}</p>}
                            </div>

                            {/* 3. SÉRIE (Pour Seconde, Première, Terminale en Francophone) */}
                            {data.section === 'francophone' && levelOrder >= 5 && (
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">
                                        3. Série / Spécialité
                                    </label>
                                    <select
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        value={data.serie}
                                        onChange={(e) => handleSerieChange(e.target.value)}
                                        required
                                    >
                                        <option value="" className="bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-400">Choisir la série...</option>
                                        {(SERIES_BY_LEVEL[levelOrder] || []).map(s => (
                                            <option key={s.code} value={s.code} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium">
                                                {s.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* 4. LANGUE VIVANTE 2 (Pour 4ème, 3ème ou Séries A / Littéraire) */}
                            {(data.section === 'francophone' || data.section === 'bilingue') && (
                                (levelOrder === 3 || levelOrder === 4 || (levelOrder >= 5 && data.serie && data.serie.startsWith('A')))
                            ) && (
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">
                                        {levelOrder >= 5 ? `4. 2ème Langue (LV2) - Requis pour ${data.serie}` : '3. 2ème Langue (LV2)'}
                                    </label>
                                    <select
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        value={data.lv2}
                                        onChange={(e) => handleLv2Change(e.target.value)}
                                        required
                                    >
                                        <option value="" className="bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-400">Choisir la LV2...</option>
                                        {LANGUES_LV2.map(langue => (
                                            <option key={langue.code} value={langue.code} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium">
                                                {langue.nom} ({langue.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* 5. NOM FINAL DE LA CLASSE (Pré-rempli & Éditable) */}
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">
                                    Racine / Nom suggéré (L'incrémentation 1, 2... ou A, B... se fera automatiquement à la sauvegarde)
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-black transition-all placeholder:text-gray-300 focus:ring-2 text-lg tracking-wide"
                                    style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    placeholder="Ex: SIXIEME, QUATRIEME ESPAGNOLE, SECONDE C"
                                    required
                                />
                                {errors.nom && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-tighter italic">{errors.nom}</p>}
                            </div>

                            {/* 6. PROFESSEUR PRINCIPAL & ANNÉE ACADÉMIQUE */}
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">
                                    Professeur Principal (Optionnel)
                                </label>
                                <select
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                    style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                    value={data.principal_teacher_id}
                                    onChange={(e) => setData('principal_teacher_id', e.target.value)}
                                >
                                    <option value="" className="bg-white dark:bg-gray-900 text-gray-400">Aucun prof. principal</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                                            {teacher.name} ({teacher.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">
                                    Année Académique
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2 placeholder:text-gray-300"
                                    style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                    value={data.annee_academique}
                                    onChange={(e) => setData('annee_academique', e.target.value)}
                                    placeholder="Ex: 2025-2026"
                                />
                            </div>

                            {!isEditing && (
                                <div className="md:col-span-3 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="auto_subjects"
                                            checked={data.auto_subjects}
                                            onChange={(e) => setData('auto_subjects', e.target.checked)}
                                            className="w-5 h-5 text-[var(--primary-color)] rounded-md border-gray-300 dark:border-white/10 focus:ring-emerald-500 cursor-pointer"
                                        />
                                        <label htmlFor="auto_subjects" className="text-xs font-bold text-gray-700 dark:text-gray-200 cursor-pointer select-none">
                                            📚 Pré-remplir automatiquement les matières et coefficients officiels du niveau à la création
                                        </label>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                        {data.auto_subjects ? 'Activé (Recommandé)' : 'Salle Vierge (Manuelle)'}
                                    </span>
                                </div>
                            )}

                        </div>

                        {/* Note Censeur & Action Buttons */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-100 dark:border-white/5">
                            <div className="w-full md:w-auto flex-1">
                                {data.level_id && !selectedLevel?.censeur_id ? (
                                    <p className="text-[11px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 p-3.5 rounded-xl border border-red-100 dark:border-red-500/20">
                                        <span className="font-black uppercase">Attention :</span> Ce niveau n'a pas encore de Censeur. Assignez un Censeur à ce niveau dans la gestion RH.
                                    </p>
                                ) : (
                                    <p className="text-[11px] font-bold text-gray-400 bg-gray-50 dark:bg-white/5 p-3.5 rounded-xl border border-gray-100 dark:border-white/5">
                                        <span className="text-[var(--primary-color)] font-black">Information :</span> Le système numérotera automatiquement la classe (ex: <span className="font-black text-gray-700 dark:text-gray-200">{data.nom || 'CLASSE'} 1</span>, <span className="font-black text-gray-700 dark:text-gray-200">{data.nom || 'CLASSE'} 2</span>).
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 w-full md:w-auto justify-end">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="px-6 py-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-black rounded-2xl hover:bg-gray-200 transition-all"
                                    >
                                        Annuler
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-10 py-4 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 hover:translate-y-[-2px]"
                                    style={{ backgroundColor: 'var(--primary-color)', boxShadow: `0 10px 15px -3px var(--shadow-color)` }}
                                >
                                    {isEditing ? 'Mettre à jour' : 'Générer & Créer la Classe'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Panneau de Verrouillage / Déverrouillage Exclusif des Séquences */}
                {(auth.user.role === 'proviseur' || auth.user.role === 'super_admin') && (
                    <div className="bg-white dark:bg-[#111915] p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-emerald-100 dark:border-emerald-900/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    Déverrouillage Séquentiel Exclusif (Établissement Entier)
                                </h4>
                            </div>
                            <p className="text-xs text-gray-400 font-medium max-w-xl">
                                Règle stricte : Le Directeur débloque <span className="font-bold text-emerald-600 dark:text-emerald-400">une seule séquence à la fois</span>. Débloquer une séquence verrouille immédiatement toutes les autres. Cliquer sur la séquence active la reverrouille.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {[1, 2, 3, 4, 5, 6].map(seq => {
                                const isSeqActive = classes.some(c => Boolean(c[`seq${seq}_auth`]));
                                return (
                                    <button
                                        key={seq}
                                        type="button"
                                        onClick={() => toggleAllClassesSequence(seq)}
                                        className={`px-3.5 py-2 rounded-xl font-black text-xs transition-all border flex items-center gap-1.5 ${
                                            isSeqActive
                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                                                : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-emerald-500'
                                        }`}
                                        title={isSeqActive ? `Séquence ${seq} ouverte. Cliquer pour verrouiller.` : `Cliquer pour ouvrir Séquence ${seq} exclusivement.`}
                                    >
                                        <span>S{seq}</span>
                                        <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${
                                            isSeqActive ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500'
                                        }`}>
                                            {isSeqActive ? 'Ouverte' : 'Fermée'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Classes Table */}
                <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[640px]">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Désignation</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Niveau & Censeur</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Prof. Principal</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                                    Autorisations Séquences (1-6)
                                    <span className="block text-[8px] font-bold text-emerald-600 dark:text-emerald-400 tracking-normal capitalize">1 seule active à la fois</span>
                                </th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {classes.map((classe) => (
                                <tr key={classe.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{classe.nom}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter" style={{ color: 'var(--primary-color)' }}>{classe.filiere?.nom || 'GÉNÉRALE'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{classe.level?.name}</span>
                                            <span className="text-[10px] font-medium text-gray-400">Responsable: {classe.level?.censeur?.name || 'En attente'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                                                {classe.professeur_principal?.name || <span className="text-gray-400 italic">Non assigné</span>}
                                            </span>
                                            {classe.annee_academique && (
                                                <span className="text-[10px] font-medium text-gray-400">Année: {classe.annee_academique}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center gap-2">
                                            {[1, 2, 3, 4, 5, 6].map(seq => (
                                                <button
                                                    key={seq}
                                                    onClick={() => toggleSequence(classe.id, seq)}
                                                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border flex items-center justify-center ${classe[`seq${seq}_auth`]
                                                        ? 'text-white border-transparent'
                                                        : 'bg-transparent text-gray-300 border-gray-100 dark:border-white/10'
                                                        }`}
                                                    style={classe[`seq${seq}_auth`] ? { backgroundColor: 'var(--primary-color)', boxShadow: `0 4px 6px -1px var(--shadow-color)` } : {}}
                                                    title={`Séquence ${seq}: ${classe[`seq${seq}_auth`] ? 'Authentifiée' : 'Verrouillée'}`}
                                                >
                                                    S{seq}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(classe)}
                                                className="p-2 text-gray-300 hover:text-[var(--primary-color)] transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(classe.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
