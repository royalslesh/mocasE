import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Manage({ school }) {
    const { data, setData, put, processing, errors } = useForm({
        name: school.name,
        sections_config: school.sections_config || { anglophone: 0, francophone: 0 },
    });

    const updateSchool = (e) => {
        e.preventDefault();
        // Optionnel : ajouter la méthode update dans le controller si nécessaire pour modifier le nom/config
        // put(route('superadmin.schools.update', school.id));
        alert("La fonction de mise à jour des paramètres n'est pas encore connectée à la base de données, mais l'interface est prête !");
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('superadmin.schools.index')} className="text-gray-500 hover:opacity-80 transition-opacity" style={{ color: 'var(--primary-color)' }}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>
                    <h2 className="font-black text-2xl uppercase tracking-tight" style={{ color: 'var(--primary-color)' }}>Gestion: {school.name}</h2>
                </div>
            }
        >
            <Head title={`Gérer ${school.name}`} />

            <div className="space-y-8">
                {/* Header Section */}
                <div className="bg-white dark:bg-[var(--dark-bg)] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Directeur / Proviseur</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white" style={{ color: 'var(--primary-color)' }}>{school.proviseur?.name || 'Non défini'}</p>
                            <p className="text-sm text-gray-500 italic">{school.proviseur?.email}</p>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Adjoint</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white" style={{ color: 'var(--primary-color)' }}>{school.adjoint?.name || 'Non défini'}</p>
                            <p className="text-sm text-gray-500 italic">{school.adjoint?.email}</p>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Statut du Paiement</p>
                            <span className={`inline-block mt-1 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${school.is_active ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                                {school.is_active ? 'Actif - À jour' : 'Suspendu'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* General Settings */}
                    <div className="bg-white dark:bg-[var(--dark-bg)] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter" style={{ color: 'var(--primary-color)' }}>Paramètres Généraux</h3>
                        <form onSubmit={updateSchool} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest px-2" style={{ color: 'var(--primary-color)' }}>Nom de l'établissement</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-2xl p-4 font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-[var(--dark-bg)] transition-all"
                                    style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full text-white p-4 rounded-2xl font-black uppercase tracking-tighter transition-all disabled:opacity-50 transform hover:-translate-y-1 active:scale-95"
                                style={{ backgroundColor: 'var(--primary-color)', boxShadow: `0 10px 15px -3px var(--shadow-color)` }}
                            >
                                Enregistrer les modifications
                            </button>
                        </form>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-[var(--dark-bg)] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter text-red-600">Zone de Danger</h3>
                        <div className="space-y-4">
                            <div className="p-4 border border-red-100 dark:border-red-900/20 rounded-2xl bg-red-50/50 dark:bg-red-900/10">
                                <h4 className="font-bold text-red-800 dark:text-red-400 mb-2">Suspension de l'établissement</h4>
                                <p className="text-sm text-red-600/80 dark:text-red-300/80 mb-4">
                                    Bloquer l'établissement empêche tous les membres (Proviseur, Professeurs, Élèves) d'y accéder. Utile pour les défauts de paiement.
                                </p>
                                <Link
                                    href={route('superadmin.schools.toggle', school.id)}
                                    method="post"
                                    as="button"
                                    className={`w-full py-4 rounded-xl font-black text-sm transition-all uppercase tracking-widest ${school.is_active ? 'bg-red-600 text-white hover:bg-red-700' : 'text-white'}`}
                                    style={!school.is_active ? { backgroundColor: 'var(--primary-color)', boxShadow: `0 10px 15px -3px var(--shadow-color)` } : {}}
                                >
                                    {school.is_active ? 'Suspendre l\'accès' : 'Rétablir l\'accès'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
