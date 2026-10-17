import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, levels, available_censeurs, available_surveillants = [] }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        section: '',
        order: 1,
        censeur_id: '',
        surveillant_id: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleEdit = (level) => {
        setIsEditing(true);
        setEditId(level.id);
        setData({
            name: level.name,
            section: level.section || '',
            order: level.order,
            censeur_id: level.censeur_id || '',
            surveillant_id: level.surveillant_id || '',
        });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        reset();
    };

    const handleDelete = (id) => {
        if (confirm('Voulez-vous vraiment supprimer ce niveau ? Cela supprimera également toutes les classes associées.')) {
            router.delete(route('levels.destroy', id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('levels.update', editId), {
                onSuccess: () => cancelEdit(),
            });
        } else {
            post(route('levels.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--primary-color)' }}>Configuration</p>
                    <h2 className="font-extrabold text-3xl text-gray-900 dark:text-white leading-tight tracking-tight">Gestion des Niveaux</h2>
                </div>
            }
        >
            <Head title="Niveaux" />

            <div className="space-y-10">
                {/* Edit Form Card (Visible only when editing) */}
                {isEditing && (
                    <div className="bg-white dark:bg-[var(--dark-bg)] p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 animate-in fade-in slide-in-from-top duration-500">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-1.5 h-8 bg-[var(--primary-color)] rounded-full"></div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Configuration : {data.name}</h3>
                        </div>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">Nom du Niveau</label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold transition-all placeholder:text-gray-300 focus:ring-2"
                                    style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nom du niveau..."
                                    required
                                />
                                {errors.name && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-tighter italic">{errors.name}</p>}
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">Ordre Hiérarchique</label>
                                <div className="w-full px-6 py-4 bg-gray-100 dark:bg-white/10 rounded-2xl text-gray-400 font-black">
                                    Niveau {data.order}
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">Assigner un Censeur Responsable</label>
                                <select
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                    style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                    value={data.censeur_id}
                                    onChange={(e) => setData('censeur_id', e.target.value)}
                                    required
                                >
                                    <option value="" className="dark:bg-gray-900 text-gray-400">Choisir un censeur...</option>
                                    {available_censeurs.map(censeur => (
                                        <option key={censeur.id} value={censeur.id} className="dark:bg-gray-900">{censeur.name}</option>
                                    ))}
                                </select>
                                {errors.censeur_id && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-tighter italic">{errors.censeur_id}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">🛡️ Surveillant(s) Général(aux) (Optionnel)</label>
                                <select
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                    style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                    value={data.surveillant_id}
                                    onChange={(e) => setData('surveillant_id', e.target.value)}
                                >
                                    <option value="" className="dark:bg-gray-900 text-gray-400">Aucun SG assigné</option>
                                    {available_surveillants.map(sg => (
                                        <option key={sg.id} value={sg.id} className="dark:bg-gray-900">{sg.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-4 flex justify-end gap-3 pt-4 border-t border-gray-50 dark:border-white/5">
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-6 py-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-black rounded-2xl hover:bg-gray-200 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-4 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 hover:translate-y-[-2px]"
                                    style={{ backgroundColor: 'var(--primary-color)', boxShadow: `0 10px 15px -3px var(--shadow-color)` }}
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Levels Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {levels.map((level) => (
                        <div key={level.id} className="relative group overflow-hidden bg-white dark:bg-[var(--dark-bg)] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300">
                            {/* Accent line */}
                            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-tighter" style={{ backgroundColor: 'var(--primary-color)' }}>Niveau {level.order}</span>
                                        <h4 className="text-2xl font-black text-gray-900 dark:text-white transition-colors uppercase tracking-tight group-hover:opacity-80" style={{ color: 'var(--primary-color)' }}>{level.name}</h4>
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Censeur : <span className="text-gray-900 dark:text-white not-italic">{level.censeur?.name || 'Non assigné'}</span>
                                    </p>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic flex items-center gap-2 mt-1">
                                        <span>🛡️</span>
                                        SG : <span className="text-gray-900 dark:text-white not-italic">{level.surveillant?.name || <span className="text-gray-400">Non assigné</span>}</span>
                                    </p>
                                </div>
                                <div className="p-3 rounded-2xl" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 90%)' }}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary-color)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-50 dark:border-white/5 pt-6">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80" style={{ color: 'var(--primary-color)' }}>Structure Stable</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(level)}
                                        className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl text-[10px] font-black text-gray-400 hover:text-[var(--primary-color)] hover:bg-gray-100 transition-all uppercase tracking-widest"
                                    >
                                        Configurer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {levels.length === 0 && (
                        <div className="col-span-full py-20 bg-gray-50/50 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center">
                            <p className="text-gray-400 dark:opacity-40 font-black uppercase tracking-widest text-xs">Aucune classe définie</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
