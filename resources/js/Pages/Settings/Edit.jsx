import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Edit({ auth, settings }) {
    const { school_name } = usePage().props;
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        school_name: settings.school_name || school_name || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('settings.update'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Configuration</p>
                    <h2 className="font-extrabold text-3xl text-gray-900 dark:text-emerald-50 leading-tight tracking-tight">Paramètres Généraux</h2>
                </div>
            }
        >
            <Head title="Paramètres" />

            <div className="max-w-4xl space-y-8">
                <div className="bg-white dark:bg-[#111915] p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-emerald-900/20">
                    <div className="mb-10">
                        <h3 className="text-xl font-black text-gray-900 dark:text-emerald-50 mb-2">Identité de l'Établissement</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium italic">Configurez les informations qui apparaîtront sur les bulletins et dans l'interface.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 dark:text-emerald-600 uppercase tracking-widest mb-3 px-1">Nom de l'École / Collège</label>
                            <input
                                type="text"
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0a0f0d] border-none rounded-2xl text-gray-900 dark:text-emerald-50 font-bold focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300"
                                value={data.school_name}
                                onChange={(e) => setData('school_name', e.target.value)}
                                placeholder="Ex: Collège Bilingue Mocas"
                            />
                            {errors.school_name && <p className="mt-2 text-xs font-bold text-red-500 uppercase tracking-tighter italic">{errors.school_name}</p>}
                        </div>

                        <div className="flex items-center gap-6 pt-4 border-t border-gray-50 dark:border-emerald-900/10">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 hover:translate-y-[-2px] transition-all active:scale-95 disabled:opacity-50"
                            >
                                Enregistrer les modifications
                            </button>

                            {recentlySuccessful && (
                                <span className="text-sm font-black text-emerald-500 animate-in fade-in transition-all">
                                    ✓ Paramètres mis à jour avec succès
                                </span>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-emerald-600/5 dark:bg-emerald-600/5 p-8 rounded-[2rem] border-2 border-dashed border-emerald-100 dark:border-emerald-900/20">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-50 uppercase tracking-tight">Accès Super-Administrateur</h4>
                            <p className="text-xs text-emerald-700 dark:text-gray-400 font-medium">Vous avez le contrôle total sur cette instance. Les changements de nom affectent instantanément tous les utilisateurs connectés.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
