import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, classes = [], selectedClasse, slots = [], matieres = [], teachers = [], userRole }) {
    const [activeDay, setActiveDay] = useState('lundi');
    const [showAddModal, setShowAddModal] = useState(false);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

    const days = [
        { key: 'lundi', label: 'Lundi' },
        { key: 'mardi', label: 'Mardi' },
        { key: 'mercredi', label: 'Mercredi' },
        { key: 'jeudi', label: 'Jeudi' },
        { key: 'vendredi', label: 'Vendredi' },
        { key: 'samedi', label: 'Samedi' },
    ];

    const { data, setData, post, processing, reset, errors } = useForm({
        classe_id: selectedClasse?.id || '',
        matiere_id: '',
        teacher_id: '',
        jour: 'lundi',
        heure_debut: '07:30',
        heure_fin: '08:30',
        salle: '',
        order: 1,
    });

    const handleClassChange = (classeId) => {
        router.get(route('timetables.index'), { classe_id: classeId }, { preserveState: false });
    };

    const handleAddSlot = (e) => {
        e.preventDefault();
        post(route('timetables.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddModal(false);
                reset('matiere_id', 'teacher_id', 'salle');
            }
        });
    };

    const handleDeleteSlot = (id) => {
        if (!confirm('Supprimer ce créneau d\'emploi du temps ?')) return;
        router.delete(route('timetables.destroy', id), { preserveScroll: true });
    };

    const handleGenerateTemplate = () => {
        if (!selectedClasse) return;
        if (!confirm(`Générer automatiquement une grille d'emploi du temps standard (7h30-15h15) pour la classe ${selectedClasse.nom} ?`)) return;
        router.post(route('timetables.template'), { classe_id: selectedClasse.id }, { preserveScroll: true });
    };

    const handlePrintDailySheet = () => {
        if (!selectedClasse) return;
        const url = `${route('attendance.daily_sheet')}?classe_id=${selectedClasse.id}&date=${attendanceDate}`;
        window.open(url, '_blank');
    };

    // Filter slots for the active day
    const daySlots = slots.filter(s => s.jour.toLowerCase() === activeDay.toLowerCase());

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--primary-color)' }}>
                            Organisation Pédagogique &amp; Présences
                        </p>
                        <h2 className="font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white leading-tight tracking-tight">
                            Emplois du Temps &amp; Feuilles d'Appel
                        </h2>
                    </div>

                    {selectedClasse && (
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={attendanceDate}
                                onChange={(e) => setAttendanceDate(e.target.value)}
                                className="px-3 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-800 dark:text-white"
                            />
                            <button
                                onClick={handlePrintDailySheet}
                                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 shrink-0 active:scale-95"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                                Imprimer l'Appel du Jour
                            </button>
                        </div>
                    )}
                </div>
            }
        >
            <Head title="Gestion des Emplois du Temps" />

            <div className="max-w-7xl mx-auto space-y-8 pb-16">
                {/* Top Control Bar: Class Selector & Actions */}
                <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white dark:bg-[var(--dark-bg)] border border-gray-100 dark:border-white/5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="flex-1 max-w-md">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                            Sélectionner une Classe :
                        </label>
                        <select
                            value={selectedClasse?.id || ''}
                            onChange={(e) => handleClassChange(e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-extrabold text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                        >
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id} className="dark:bg-[#111614]">
                                    {cls.nom} {cls.section ? `(${cls.section.toUpperCase()})` : ''} — {cls.eleves_count || 0} élève(s)
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedClasse && in_array(userRole, ['super_admin', 'proviseur', 'censeur']) && (
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={handleGenerateTemplate}
                                className="px-5 py-3 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-800 dark:text-white font-extrabold text-xs uppercase tracking-wider transition-all"
                                title="Remplir automatiquement les créneaux standards pour toute la semaine"
                            >
                                ⚡ Générer Grille Standard
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setData({
                                        ...data,
                                        classe_id: selectedClasse.id,
                                        jour: activeDay,
                                    });
                                    setShowAddModal(true);
                                }}
                                className="px-6 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center gap-2"
                                style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                                Ajouter un Créneau
                            </button>
                        </div>
                    )}
                </div>

                {/* Days Navigation Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                    {days.map((day) => {
                        const count = slots.filter(s => s.jour.toLowerCase() === day.key).length;
                        const isActive = activeDay === day.key;
                        return (
                            <button
                                key={day.key}
                                onClick={() => setActiveDay(day.key)}
                                className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2.5 ${isActive
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                                    : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 border border-gray-100 dark:border-white/5'
                                }`}
                            >
                                <span>{day.label}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 dark:bg-black/20' : 'bg-gray-100 dark:bg-white/10 text-gray-500'}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Slots Grid for Active Day */}
                <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-6 sm:p-10 shadow-xl space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></span>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                Cours du {days.find(d => d.key === activeDay)?.label} — {selectedClasse?.nom}
                            </h3>
                        </div>
                        <span className="text-xs font-bold text-gray-400">
                            {daySlots.length} créneau(x) programmé(s)
                        </span>
                    </div>

                    {daySlots.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {daySlots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col justify-between hover:border-[var(--primary-color)] transition-all group"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="px-3 py-1 rounded-xl bg-white dark:bg-black/30 font-black text-xs text-gray-900 dark:text-white shadow-2xs border border-gray-200/50 dark:border-white/5">
                                                {slot.heure_debut} - {slot.heure_fin}
                                            </span>
                                            {in_array(userRole, ['super_admin', 'proviseur', 'censeur']) && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteSlot(slot.id)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all opacity-0 group-hover:opacity-100"
                                                    title="Supprimer ce créneau"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                </button>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-sm font-black uppercase text-gray-900 dark:text-white tracking-tight">
                                                {slot.matiere?.nom || 'Matière inconnue'}
                                            </p>
                                            <p className="text-xs text-gray-400 font-bold mt-0.5">
                                                Enseignant : {slot.teacher?.name || 'Non assigné'}
                                            </p>
                                        </div>
                                    </div>

                                    {slot.salle && (
                                        <div className="pt-3 mt-3 border-t border-gray-200/50 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-bold">
                                            <span>Salle : {slot.salle}</span>
                                            <span>Période {slot.order}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Aucun cours programmé pour le {days.find(d => d.key === activeDay)?.label}.
                            </p>
                            {in_array(userRole, ['super_admin', 'proviseur', 'censeur']) && (
                                <button
                                    onClick={handleGenerateTemplate}
                                    className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-xs font-black uppercase tracking-wider"
                                >
                                    Générer automatiquement les cours
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* MODAL AJOUT CRÉNEAU */}
                {showAddModal && (
                    <div
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
                        onClick={() => setShowAddModal(false)}
                    >
                        <div
                            className="bg-white dark:bg-[#111614] rounded-3xl border border-gray-100 dark:border-white/10 shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    Nouveau Créneau — {selectedClasse?.nom}
                                </h3>
                                <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>

                            <form onSubmit={handleAddSlot} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Jour</label>
                                        <select
                                            value={data.jour}
                                            onChange={e => setData('jour', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                                        >
                                            {days.map(d => (
                                                <option key={d.key} value={d.key} className="dark:bg-[#111614]">{d.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Matière *</label>
                                        <select
                                            value={data.matiere_id}
                                            onChange={e => setData('matiere_id', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                                        >
                                            <option value="">Sélectionner une matière</option>
                                            {matieres.map(m => (
                                                <option key={m.id} value={m.id} className="dark:bg-[#111614]">{m.nom}</option>
                                            ))}
                                        </select>
                                        {errors.matiere_id && <p className="text-xs text-red-500 font-bold mt-1">{errors.matiere_id}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Heure de Début</label>
                                        <input
                                            type="text"
                                            placeholder="07:30"
                                            value={data.heure_debut}
                                            onChange={e => setData('heure_debut', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Heure de Fin</label>
                                        <input
                                            type="text"
                                            placeholder="08:30"
                                            value={data.heure_fin}
                                            onChange={e => setData('heure_fin', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Enseignant Responsable</label>
                                    <select
                                        value={data.teacher_id}
                                        onChange={e => setData('teacher_id', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                                    >
                                        <option value="">Sélectionner un enseignant (optionnel)</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id} className="dark:bg-[#111614]">{t.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Salle (Optionnel)</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Salle 10"
                                            value={data.salle}
                                            onChange={e => setData('salle', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Numéro de Période (1, 2...)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={data.order}
                                            onChange={e => setData('order', parseInt(e.target.value) || 1)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-xs font-bold"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider disabled:opacity-50"
                                    >
                                        {processing ? 'Ajout...' : 'Enregistrer le Créneau'}
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

function in_array(needle, haystack) {
    return Array.isArray(haystack) && haystack.includes(needle);
}
