import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ auth, school }) {
    const { data, setData, post, processing, errors } = useForm({
        name: school.name || '',
        city: school.city || '',
        contacts: school.contacts || '',
        description: school.description || '',
        logo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('school.branding.update'), {
            forceFormData: true,
        });
    };

    const toggleConsent = () => {
        post(route('school.consent.toggle'), { preserveScroll: true });
    };

    const toggleGrades = () => {
        post(route('school.academic.grades_toggle'), { preserveScroll: true });
    };

    const toggleReports = () => {
        post(route('school.academic.reports_toggle'), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--primary-color)' }}>Identité Visuelle</p>
                    <h2 className="font-extrabold text-3xl text-gray-900 dark:text-white leading-tight tracking-tight">Paramètres de l'Établissement</h2>
                </div>
            }
        >
            <Head title="Branding École" />

            <div className="max-w-4xl space-y-8">
                {/* Consent Status Banner */}
                <div className={`p-6 rounded-3xl border flex items-center justify-between transition-all ${school.super_admin_consent
                        ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'
                        : 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400'
                    }`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${school.super_admin_consent ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-tight">Accès Super Admin</h4>
                            <p className="text-xs font-bold opacity-80">{school.super_admin_consent ? 'Le Super Admin est autorisé à configurer vos matières et classes.' : 'Le Super Admin n\'a pas accès aux réglages internes de votre école.'}</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleConsent}
                        className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-white dark:bg-black/20 shadow-sm border border-black/5 active:scale-95"
                    >
                        {school.super_admin_consent ? 'Révoquer l\'accès' : 'Autoriser l\'accès'}
                    </button>
                </div>

                {/* Academic Toggles Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Grades Toggle */}
                    <div className={`p-8 rounded-[2.5rem] border transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px] ${school.is_grades_submission_open
                        ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10'
                        }`}>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h4 className={`text-lg font-black tracking-tight ${school.is_grades_submission_open ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                                    Saisie des Notes
                                </h4>
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                    {school.is_grades_submission_open
                                        ? 'Les enseignants peuvent actuellement remplir les notes.'
                                        : 'La saisie des notes est clôturée pour les profs.'}
                                </p>
                            </div>
                            <div className={`p-3 rounded-2xl ${school.is_grades_submission_open ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </div>
                        </div>

                        <button
                            onClick={toggleGrades}
                            className={`mt-6 w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${school.is_grades_submission_open
                                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200'
                                : 'bg-white dark:bg-white/10 text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-white/10 hover:bg-gray-50'
                                }`}
                        >
                            {school.is_grades_submission_open ? 'Fermer la Saisie' : 'Ouvrir la Saisie'}
                        </button>
                    </div>

                    {/* Reports Toggle */}
                    <div className={`p-8 rounded-[2.5rem] border transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px] ${school.is_report_cards_visible
                        ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                        : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10'
                        }`}>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h4 className={`text-lg font-black tracking-tight ${school.is_report_cards_visible ? 'text-emerald-900 dark:text-emerald-100' : 'text-gray-900 dark:text-white'}`}>
                                    Publication des Bulletins
                                </h4>
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                    {school.is_report_cards_visible
                                        ? 'Les bulletins sont téléchargeables par les parents.'
                                        : 'Les bulletins sont masqués et en cours de calcul.'}
                                </p>
                            </div>
                            <div className={`p-3 rounded-2xl ${school.is_report_cards_visible ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                        </div>

                        <button
                            onClick={toggleReports}
                            className={`mt-6 w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${school.is_report_cards_visible
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                                : 'bg-white dark:bg-white/10 text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-white/10 hover:bg-gray-50'
                                }`}
                        >
                            {school.is_report_cards_visible ? 'Masquer les Bulletins' : 'Publier les Bulletins'}
                        </button>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-[var(--dark-bg)] p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary-color)' }}><path d="M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45z" /></svg>
                    </div>

                    <form onSubmit={submit} className="space-y-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">Nom Officiel</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="mt-2 text-xs text-red-500 font-bold italic">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">Ville</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">Contacts (Téléphone / Email)</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        value={data.contacts}
                                        onChange={e => setData('contacts', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">Logo / Blason</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden">
                                            {school.logo_path ? (
                                                <img src={`/storage/${school.logo_path}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-gray-100 dark:file:bg-white/10 file:text-gray-600 dark:file:text-white cursor-pointer"
                                            onChange={e => setData('logo', e.target.files[0])}
                                        />
                                    </div>
                                    {errors.logo && <p className="mt-2 text-xs text-red-500 font-bold italic">{errors.logo}</p>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 dark:opacity-50 uppercase tracking-widest mb-3 px-1">Description (S'affiche sur la page d'accueil)</label>
                            <textarea
                                rows="4"
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-3xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Présentez votre établissement aux futurs élèves..."
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-12 py-5 text-white font-black rounded-[2rem] shadow-xl transition-all active:scale-95 disabled:opacity-50"
                                style={{ backgroundColor: 'var(--primary-color)', boxShadow: `0 15px 25px -5px var(--shadow-color)` }}
                            >
                                Enregistrer les Modifications
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
