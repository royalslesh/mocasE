import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ schools }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewMode, setViewMode] = useState('choice'); // 'choice', 'list'

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        proviseur_name: '',
        proviseur_email: '',
        adjoint_name: '',
        adjoint_email: '',
        sections_config: { anglophone: 0, francophone: 0 },
        theme_color: 'emerald'
    });

    const themes = [
        { name: 'emerald', color: '#10b981', label: 'Mocas Nature' },
        { name: 'blue', color: '#3b82f6', label: 'Océan Savoir' },
        { name: 'indigo', color: '#6366f1', label: 'Espace Royal' },
        { name: 'purple', color: '#a855f7', label: 'Luxe Éducatif' },
        { name: 'rose', color: '#f43f5e', label: 'Passion Étude' },
        { name: 'orange', color: '#f97316', label: 'Énergie Solaire' },
        { name: 'amber', color: '#f59e0b', label: 'Or Académique' },
        { name: 'cyan', color: '#06b6d4', label: 'Pure Clarté' },
        { name: 'slate', color: '#475569', label: 'Gris Prestige' },
        { name: 'teal', color: '#14b8a6', label: 'Modernité' },
    ];

    const submit = (e) => {
        e.preventDefault();
        post(route('superadmin.schools.store'), {
            onSuccess: () => {
                reset();
                setShowCreateModal(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-black text-2xl uppercase tracking-tight" style={{ color: 'var(--primary-color)' }}>Console Super Admin</h2>}
        >
            <Head title="Console Super Admin" />

            {viewMode === 'choice' ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 py-12 animate-in fade-in zoom-in-95 duration-700">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase truncate max-w-4xl dark:text-white" style={{ color: 'var(--primary-color)' }}>Bonjour, Super Administrateur</h1>
                        <p className="text-xl text-gray-500 font-medium italic opacity-80">Que souhaitez-vous faire aujourd'hui ?</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
                        {/* Action 1: Create */}
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="group relative bg-white dark:bg-[var(--dark-bg)] p-10 rounded-[3rem] border-2 border-transparent transition-all text-left shadow-2xl overflow-hidden hover:border-[var(--primary-color)]"
                            style={{ boxShadow: `0 20px 25px -5px var(--shadow-color)` }}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary-color)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            </div>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg" style={{ backgroundColor: 'var(--primary-color)' }}>
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            </div>
                            <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-2" style={{ color: 'var(--primary-color)' }}>Inscrire une École</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-xs tracking-widest">Ajouter un nouvel établissement et son proviseur.</p>
                        </button>

                        {/* Action 2: Connect */}
                        <button
                            onClick={() => setViewMode('list')}
                            className="group relative bg-white dark:bg-[var(--dark-bg)] p-10 rounded-[3rem] border-2 border-blue-50 dark:border-blue-900/10 hover:border-blue-500 transition-all text-left shadow-2xl overflow-hidden"
                            style={{ boxShadow: `0 20px 25px -5px rgba(59, 130, 246, 0.1)` }}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg className="w-32 h-32 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </div>
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 dark:shadow-none">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </div>
                            <h2 className="text-3xl font-black text-blue-900 dark:text-blue-50 uppercase tracking-tighter mb-2">Se connecter</h2>
                            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Gérer les paramètres d'une école existante.</p>
                            <div className="mt-4 inline-block bg-blue-50 dark:bg-blue-900/20 px-4 py-1 rounded-full text-[10px] font-black text-blue-600 uppercase">
                                {schools.length} Établissement(s) inscrit(s)
                            </div>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="animate-in slide-in-from-right-8 duration-500">
                    <button
                        onClick={() => setViewMode('choice')}
                        className="flex items-center gap-2 font-black uppercase text-xs tracking-widest mb-8 hover:translate-x-[-4px] transition-transform"
                        style={{ color: 'var(--primary-color)' }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                        Retour aux choix
                    </button>

                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-4xl font-black dark:text-white tracking-tighter uppercase" style={{ color: 'var(--primary-color)' }}>Liste des écoles</h1>
                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 italic">Sélectionnez un établissement pour le gérer</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {schools.map((school) => (
                            <div key={school.id} className="bg-white dark:bg-[var(--dark-bg)] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
                                {!school.is_active && (
                                    <div className="absolute top-0 right-0 bg-red-600 text-white px-6 py-1 -rotate-[-45deg] translate-x-[20px] translate-y-[10px] text-[8px] font-black uppercase tracking-widest z-10 shadow-lg">
                                        Suspendue
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 90%)' }}>
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary-color)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    </div>
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${school.is_active ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                                        {school.is_active ? 'Active' : 'Bloquée'}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1 tracking-tight" style={{ color: 'var(--primary-color)' }}>{school.name}</h3>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Directeur: {school.proviseur?.name || '---'}</p>

                                <div className="flex gap-3">
                                    <Link href={route('superadmin.schools.manage', school.id)} className="flex-1 text-center bg-gray-950 text-white py-4 rounded-2xl font-black text-xs transition-all uppercase tracking-widest hover:opacity-90 transform active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none translate-z-0">
                                        Se connecter
                                    </Link>
                                    <button
                                        onClick={() => post(route('superadmin.schools.toggle', school.id))}
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${school.is_active ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                                        title={school.is_active ? 'Suspendre' : 'Rétablir'}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={school.is_active ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[var(--dark-bg)] w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl animate-in zoom-in-95 duration-300 border border-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-4xl font-black dark:text-white tracking-tighter uppercase" style={{ color: 'var(--primary-color)' }}>Nouvelle École</h2>
                            <button onClick={() => setShowCreateModal(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l18 18" /></svg>
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-4 mb-8">
                                <div className="bg-blue-600 p-2 rounded-lg text-white mt-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-blue-900 dark:text-blue-100 uppercase tracking-tight">Identifiants par défaut</p>
                                    <p className="text-xs font-bold text-blue-600/80 dark:text-blue-400 mt-1">Le mot de passe provisoire pour le Proviseur sera <span className="bg-white dark:bg-[#0a0f0d] px-2 py-0.5 rounded-md text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800">Mocas2026</span></p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest px-2" style={{ color: 'var(--primary-color)' }}>Nom de l'établissement</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-3xl p-5 font-bold text-gray-900 dark:text-white transition-all focus:ring-4"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        placeholder="Ex: GS Bilingue Mocas"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs px-2 font-bold">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest px-2" style={{ color: 'var(--primary-color)' }}>Nom du Proviseur</label>
                                    <input
                                        type="text"
                                        value={data.proviseur_name}
                                        onChange={e => setData('proviseur_name', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-3xl p-5 font-bold text-gray-900 dark:text-white transition-all focus:ring-4"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        placeholder="Monsieur le Proviseur"
                                    />
                                    {errors.proviseur_name && <p className="text-red-500 text-xs px-2 font-bold">{errors.proviseur_name}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black uppercase tracking-widest px-2" style={{ color: 'var(--primary-color)' }}>Email pour la connexion Proviseur</label>
                                    <input
                                        type="email"
                                        value={data.proviseur_email}
                                        onChange={e => setData('proviseur_email', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-3xl p-5 font-bold text-gray-900 dark:text-white transition-all focus:ring-4"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        placeholder="admin@ecole.com"
                                    />
                                    {errors.proviseur_email && <p className="text-red-500 text-xs px-2 font-bold">{errors.proviseur_email}</p>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest px-2" style={{ color: 'var(--primary-color)' }}>Thème de l'établissement (10 Choix)</label>
                                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                                    {themes.map((theme) => (
                                        <button
                                            key={theme.name}
                                            type="button"
                                            onClick={() => setData('theme_color', theme.name)}
                                            className={`group relative w-full aspect-square rounded-2xl transition-all border-4 ${data.theme_color === theme.name ? 'scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                                            style={data.theme_color === theme.name ? { borderColor: 'var(--primary-color)' } : {}}
                                            title={theme.label}
                                        >
                                            <div
                                                className="w-full h-full rounded-xl shadow-inner"
                                                style={{ backgroundColor: theme.color }}
                                            ></div>
                                            {data.theme_color === theme.name && (
                                                <div className="absolute -top-2 -right-2 text-white rounded-full p-1 shadow-md" style={{ backgroundColor: 'var(--primary-color)' }}>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center italic">
                                    Thème sélectionné : <span style={{ color: 'var(--primary-color)' }}>{themes.find(t => t.name === data.theme_color)?.label}</span>
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full text-white p-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl transition-all disabled:opacity-50 transform hover:-translate-y-1 active:scale-95"
                                style={{ backgroundColor: 'var(--primary-color)', boxShadow: `0 20px 25px -5px var(--shadow-color)` }}
                            >
                                {processing ? 'Transaction en cours...' : 'Inscrire l\'établissement'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

