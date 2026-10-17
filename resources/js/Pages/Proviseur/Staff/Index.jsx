import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ staff, roles, levels, subjects, classes: schoolClasses = [] }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingStaff, setEditingStaff]       = useState(null);
    const [passwordModal, setPasswordModal]     = useState(null); // { id, name }

    const pwForm = useForm({ password: '', password_confirmation: '' });

    const openPasswordModal = (member) => {
        setPasswordModal({ id: member.id, name: member.name });
        pwForm.reset();
    };

    const submitPassword = (e) => {
        e.preventDefault();
        pwForm.put(route('proviseur.staff.password', passwordModal.id), {
            onSuccess: () => { setPasswordModal(null); pwForm.reset(); },
        });
    };

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: '',
        level_id: '',
        // Format: [{ subject_id: 1, classe_ids: [1, 2] }]
        assignments: [],
    });

    const handleEdit = (member) => {
        setEditingStaff(member);
        const memberLevel = levels.find(l => l.censeur_id === member.id);
        
        // Group assignments by subject
        const groupedAssignments = {};
        if (member.teacher_assignments) {
            member.teacher_assignments.forEach(a => {
                if (!groupedAssignments[a.subject_id]) {
                    groupedAssignments[a.subject_id] = { subject_id: a.subject_id, classe_ids: [] };
                }
                if (a.classe_id) {
                    groupedAssignments[a.subject_id].classe_ids.push(a.classe_id);
                }
            });
        }

        setData({
            name: member.name,
            email: member.email,
            role: member.role,
            level_id: memberLevel ? memberLevel.id : '',
            assignments: Object.values(groupedAssignments),
        });
        setShowCreateModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Supprimer ce membre du personnel ? Ses accès seront révoqués.')) {
            router.delete(route('proviseur.staff.destroy', id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingStaff) {
            put(route('proviseur.staff.update', editingStaff.id), {
                onSuccess: () => {
                    reset();
                    setEditingStaff(null);
                    setShowCreateModal(false);
                },
            });
        } else {
            post(route('proviseur.staff.store'), {
                onSuccess: () => {
                    reset();
                    setShowCreateModal(false);
                },
            });
        }
    };

    return (
        <>
        <AuthenticatedLayout
            header={<h2 className="font-black text-2xl uppercase tracking-tight" style={{ color: 'var(--primary-color)' }}>Gestion du Personnel</h2>}
        >
            <Head title="Gestion du Personnel" />

            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Annuaire de l'École</h1>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Gérez vos censeurs et vos enseignants</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.open(route('exports.staff'), '_blank')}
                            className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-6 py-4 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all shadow-sm active:scale-95 hover:bg-gray-50 dark:hover:bg-white/10 inline-flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" style={{ color: 'var(--primary-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            Exporter le Personnel (PDF)
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="text-white px-8 py-4 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 transform hover:-translate-y-1"
                            style={{ backgroundColor: 'var(--primary-color)', boxShadow: `0 10px 15px -3px var(--shadow-color)` }}
                        >
                            Ajouter un Membre
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {staff.map((member) => (
                        <div key={member.id} className="bg-white dark:bg-[var(--dark-bg)] p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 90%)', color: 'var(--primary-color)' }}>
                                    {member.name.charAt(0)}
                                </div>
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${member.role === 'proviseur' ? 'bg-blue-100 text-blue-700' : member.role === 'censeur' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/70'}`}>
                                    {member.role === 'enseignant' ? (
                                        <span style={{ color: 'var(--primary-color)' }}>{member.role}</span>
                                    ) : member.role}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1 tracking-tight truncate group-hover:opacity-80 transition-opacity" style={{ color: 'var(--primary-color)' }}>{member.name}</h3>
                            <p className="text-sm font-bold text-gray-400 truncate mb-6">{member.email}</p>

                            <div className="pt-6 border-t border-gray-50 dark:border-white/5">
                                {member.role === 'enseignant' && member.teacher_assignments?.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Enseignements</p>
                                        <div className="flex flex-wrap gap-2">
                                            {/* Get unique subjects */}
                                            {[...new Set(member.teacher_assignments.map(a => a.subject?.nom))].map((subjectNom, idx) => (
                                                <div key={idx} className="flex flex-col gap-1">
                                                    <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full bg-[color-mix(in_srgb,var(--primary-color),transparent_85%)] text-[var(--primary-color)]">
                                                        {subjectNom}
                                                    </span>
                                                    <div className="flex flex-wrap gap-1 px-1">
                                                        {member.teacher_assignments
                                                            .filter(a => a.subject?.nom === subjectNom && a.classe)
                                                            .map(a => (
                                                                <span key={a.id} className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase">{a.classe?.nom}</span>
                                                            ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Actif sur Mocas</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(member)}
                                            title="Modifier le profil"
                                            className="p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => openPasswordModal(member)}
                                            title="Changer le mot de passe"
                                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            title="Supprimer"
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[var(--dark-bg)] w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300 border border-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-4xl font-black dark:text-white tracking-tighter uppercase" style={{ color: 'var(--primary-color)' }}>
                                {editingStaff ? 'Réviser le Profil' : 'Nouveau Personnel'}
                            </h2>
                            <button onClick={() => { setShowCreateModal(false); setEditingStaff(null); reset(); }} className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l18 18" /></svg>
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-4 mb-4">
                                <div className="bg-blue-600 p-2 rounded-lg text-white mt-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-blue-900 dark:text-blue-100 uppercase tracking-tight">Sécurité Mocas</p>
                                    <p className="text-xs font-bold text-blue-600/80 dark:text-blue-400 leading-relaxed">
                                        Tout nouveau compte aura le mot de passe provisoire : <span className="bg-white dark:bg-[#0a0f0d] px-2 py-0.5 rounded-md text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800">Mocas2026</span>
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest px-2 text-gray-400 dark:text-emerald-500/80">Nom Complet</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-[#0a0f0d] border border-gray-100 dark:border-white/10 rounded-2xl p-5 font-bold text-gray-900 dark:text-white transition-all focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-[var(--dark-bg)]"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        placeholder="Ex: Jean Dupont"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs px-2 font-bold">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest px-2 text-gray-400 dark:text-emerald-500/80">Rôle au sein de l'école</label>
                                    <select
                                        value={data.role}
                                        onChange={e => setData('role', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-[#1a221f] border border-gray-100 dark:border-white/10 rounded-2xl p-5 font-bold text-gray-900 dark:text-white transition-all focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-[var(--dark-bg)]"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                    >
                                        <option value="" className="bg-white dark:bg-gray-900 text-gray-400">-- Choisir un Rôle --</option>
                                        <option value="censeur" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold">Censeur</option>
                                        <option value="enseignant" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold">Enseignant</option>
                                        <option value="surveillant" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold">Surveillant Général</option>
                                        <option value="comptable" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold">Comptable / Économe</option>
                                    </select>
                                    {errors.role && <p className="text-red-500 text-xs px-2 font-bold">{errors.role}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black uppercase tracking-widest px-2 text-gray-400 dark:text-emerald-500/80">Adresse Email Professionnelle</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-[#0a0f0d] border border-gray-100 dark:border-white/10 rounded-2xl p-5 font-bold text-gray-900 dark:text-white transition-all focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-[var(--dark-bg)]"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        placeholder="nom@mocas-school.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs px-2 font-bold">{errors.email}</p>}
                                </div>

                                {data.role === 'enseignant' && (
                                    <div className="space-y-4 md:col-span-2 animate-in slide-in-from-top-4 duration-300">
                                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                                            <p className="text-[10px] font-black text-emerald-800 dark:text-emerald-200 uppercase tracking-widest leading-loose">
                                                📚 Affectations Pédagogiques — Choisissez les matières et cochez les classes correspondantes.
                                            </p>
                                        </div>
                                        {subjects.length === 0 ? (
                                            <p className="text-xs font-bold text-red-500 px-2">⚠️ Aucune matière créée. Créez d'abord des matières.</p>
                                        ) : (
                                            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                                {subjects.map(subject => {
                                                    const currentAssignment = data.assignments.find(a => a.subject_id === subject.id);
                                                    const isSubjectChecked = !!currentAssignment;
                                                    
                                                    return (
                                                        <div key={subject.id} className={`p-6 rounded-[2rem] border-2 transition-all ${isSubjectChecked ? 'border-[var(--primary-color)] bg-[color-mix(in_srgb,var(--primary-color),transparent_95%)]' : 'border-gray-100 dark:border-white/5'}`}>
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center gap-4">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            if (isSubjectChecked) {
                                                                                setData('assignments', data.assignments.filter(a => a.subject_id !== subject.id));
                                                                            } else {
                                                                                setData('assignments', [...data.assignments, { subject_id: subject.id, classe_ids: [] }]);
                                                                            }
                                                                        }}
                                                                        className={`w-6 h-6 rounded-lg transition-all flex items-center justify-center ${isSubjectChecked ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-200 dark:bg-white/10 text-transparent'}`}
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                                    </button>
                                                                    <span className="text-sm font-black dark:text-white uppercase tracking-tight">{subject.nom}</span>
                                                                </div>
                                                                {isSubjectChecked && (
                                                                    <span className="text-[10px] font-black text-[var(--primary-color)] uppercase tracking-widest">
                                                                        {currentAssignment.classe_ids.length} Classe(s) active(s)
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {isSubjectChecked && schoolClasses.length > 0 && (
                                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                    {schoolClasses.map(classe => {
                                                                        const isClassChecked = currentAssignment.classe_ids.includes(classe.id);
                                                                        return (
                                                                            <button
                                                                                key={classe.id}
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const updatedAssignments = data.assignments.map(a => {
                                                                                        if (a.subject_id === subject.id) {
                                                                                            const isCurrentlyChecked = a.classe_ids.includes(classe.id);
                                                                                            return {
                                                                                                ...a,
                                                                                                classe_ids: isCurrentlyChecked 
                                                                                                    ? a.classe_ids.filter(id => id !== classe.id)
                                                                                                    : [...a.classe_ids, classe.id]
                                                                                            };
                                                                                        }
                                                                                        return a;
                                                                                    });
                                                                                    setData('assignments', updatedAssignments);
                                                                                }}
                                                                                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border-2 text-center ${isClassChecked
                                                                                    ? 'border-[var(--primary-color)] bg-[var(--primary-color)] text-white'
                                                                                    : 'border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-white/10'
                                                                                }`}
                                                                            >
                                                                                {classe.nom}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {errors.assignments && <p className="text-red-500 text-xs px-2 font-bold">{errors.assignments}</p>}
                                    </div>
                                )}

                                {data.role === 'censeur' && (
                                    <div className="space-y-4 md:col-span-2 animate-in slide-in-from-top-4 duration-300">
                                        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                                            <p className="text-[10px] font-black text-amber-800 dark:text-amber-200 uppercase tracking-widest leading-loose">
                                                💡 Mission : Un censeur est le garant d'un niveau. Sélectionnez ci-dessous le niveau (encore libre) dont il sera responsable.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest px-2 text-amber-600/80">Niveau de Responsabilité</label>
                                            <select
                                                value={data.level_id}
                                                onChange={e => setData('level_id', e.target.value)}
                                                className="w-full bg-amber-50/50 dark:bg-[#1a221f] border border-amber-100 dark:border-white/10 rounded-2xl p-5 font-bold text-gray-900 dark:text-white transition-all focus:ring-4 focus:ring-amber-500"
                                                required
                                            >
                                                <option value="" className="dark:bg-[#0a0f0d]">Choisir un niveau (1-7)...</option>
                                                {levels
                                                    .filter(l => !l.censeur_id || (editingStaff && l.censeur_id === editingStaff.id))
                                                    .sort((a, b) => a.order - b.order)
                                                    .map(l => (
                                                        <option key={l.id} value={l.id} className="dark:bg-[#0a0f0d]">Niveau {l.order} : {l.name}</option>
                                                    ))}
                                            </select>
                                        </div>
                                        {errors.level_id && <p className="text-red-500 text-xs px-2 font-bold">{errors.level_id}</p>}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full text-white p-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl transition-all disabled:opacity-50 transform hover:-translate-y-1 active:scale-95"
                                style={{ backgroundColor: 'var(--primary-color)', boxShadow: `0 10px 15px -3px var(--shadow-color)` }}
                            >
                                {processing ? 'Traitement...' : (editingStaff ? 'Enregistrer les Modifications' : 'Valider le Profil Personnel')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>

        {/* Modal Mot de passe */}
        {passwordModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
                <div className="bg-white dark:bg-[var(--dark-bg)] w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Changer le mot de passe</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{passwordModal.name}</p>
                        </div>
                    </div>
                    <form onSubmit={submitPassword} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nouveau mot de passe</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold focus:ring-2 placeholder:text-gray-300"
                                style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                placeholder="Min. 6 caracteres"
                                value={pwForm.data.password}
                                onChange={(e) => pwForm.setData('password', e.target.value)}
                                required
                            />
                            {pwForm.errors.password && <p className="mt-1 text-xs text-red-500 font-bold">{pwForm.errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold focus:ring-2 placeholder:text-gray-300"
                                style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                placeholder="Retapez le mot de passe"
                                value={pwForm.data.password_confirmation}
                                onChange={(e) => pwForm.setData('password_confirmation', e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setPasswordModal(null)} className="flex-1 py-3 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-black rounded-2xl hover:bg-gray-200 transition-all">
                                Annuler
                            </button>
                            <button type="submit" disabled={pwForm.processing} className="flex-1 py-3 text-white font-black rounded-2xl shadow-lg transition-all disabled:opacity-50" style={{ backgroundColor: 'var(--primary-color)' }}>
                                {pwForm.processing ? 'Mise a jour...' : 'Confirmer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </>
    );
}
