import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ auth, school }) {
    const [galleryPreview, setGalleryPreview] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        name: school.name || '',
        motto: school.motto || '',
        code: school.code || '',
        region: school.region || '',
        departement: school.departement || '',
        city: school.city || '',
        contacts: school.contacts || '',
        description: school.description || '',
        video_url: school.video_url || '',
        logo: null,
        cover_image: null,
        gallery_files: [],
        remove_gallery_index: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('school.branding.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setGalleryPreview([]);
                setData('gallery_files', []);
                setData('logo', null);
                setData('cover_image', null);
            }
        });
    };

    const handleRemoveExistingGalleryImage = (index) => {
        if (!confirm('Confirmez-vous la suppression de cette photo de la galerie ?')) return;
        router.post(route('school.branding.update'), {
            name: data.name,
            remove_gallery_index: index,
        }, {
            preserveScroll: true,
        });
    };

    const handleGalleryFilesChange = (e) => {
        const files = Array.from(e.target.files);
        setData('gallery_files', files);
        const previews = files.map(f => URL.createObjectURL(f));
        setGalleryPreview(previews);
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--primary-color)' }}>
                            Identité & Vitrine Publique
                        </p>
                        <h2 className="font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white leading-tight tracking-tight">
                            Présentation & Réglages de l'Établissement
                        </h2>
                    </div>
                    <a
                        href={route('visitor.schoolDetails', school.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-white/10 text-gray-800 dark:text-white font-extrabold text-xs uppercase tracking-wider border border-gray-200 dark:border-white/10 shadow-sm hover:border-[var(--primary-color)] transition-all"
                    >
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Voir la Vitrine Publique
                    </a>
                </div>
            }
        >
            <Head title="Présentation & Branding de l'École" />

            <div className="max-w-5xl space-y-8 pb-16">
                {/* Consent Status Banner */}
                <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${school.super_admin_consent
                        ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'
                        : 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400'
                    }`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl shrink-0 ${school.super_admin_consent ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-tight">Accès Super Admin</h4>
                            <p className="text-xs font-bold opacity-80">{school.super_admin_consent ? 'Le Super Admin est autorisé à configurer vos matières et classes.' : 'Le Super Admin n\'a pas accès aux réglages internes de votre école.'}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={toggleConsent}
                        className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-white dark:bg-black/20 shadow-sm border border-black/5 active:scale-95 shrink-0"
                    >
                        {school.super_admin_consent ? 'Révoquer l\'accès' : 'Autoriser l\'accès'}
                    </button>
                </div>

                {/* Academic Toggles Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Grades Toggle */}
                    <div className={`p-7 rounded-[2.5rem] border transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px] ${school.is_grades_submission_open
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
                            type="button"
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
                    <div className={`p-7 rounded-[2.5rem] border transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px] ${school.is_report_cards_visible
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
                                        ? 'Les bulletins sont consultables par les visiteurs/parents.'
                                        : 'Les bulletins sont masqués et en cours de calcul.'}
                                </p>
                            </div>
                            <div className={`p-3 rounded-2xl ${school.is_report_cards_visible ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                        </div>

                        <button
                            type="button"
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
                <div className="bg-white dark:bg-[var(--dark-bg)] p-6 sm:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 relative">
                    <form onSubmit={submit} className="space-y-8">
                        {/* Section 1 : Informations Officielles */}
                        <div>
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 85%)', color: 'var(--primary-color)' }}>
                                    01
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Informations Officielles & Administratives</h3>
                                    <p className="text-xs text-gray-400">Ces informations apparaissent sur tous les documents officiels et sur votre vitrine.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nom Officiel de l'Établissement *</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500 font-bold">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Devise de l'Établissement (Motto)</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        placeholder="Ex: Travail - Discipline - Succès"
                                        value={data.motto}
                                        onChange={e => setData('motto', e.target.value)}
                                    />
                                    {errors.motto && <p className="mt-1 text-xs text-red-500 font-bold">{errors.motto}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Code / Matricule Établissement (MINESEC)</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        placeholder="Ex: CSBEN-2026"
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                    />
                                    {errors.code && <p className="mt-1 text-xs text-red-500 font-bold">{errors.code}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Ville</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                    />
                                    {errors.city && <p className="mt-1 text-xs text-red-500 font-bold">{errors.city}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Délégation Régionale</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        placeholder="Ex: RÉGION DU CENTRE"
                                        value={data.region}
                                        onChange={e => setData('region', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Délégation Départementale</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        placeholder="Ex: DÉPARTEMENT DU MFOUNDI"
                                        value={data.departement}
                                        onChange={e => setData('departement', e.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Contacts & Coordonnées (Tél, Email, Adresse)</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        placeholder="Ex: BP 1420 Yaoundé • Tél: +237 690 00 00 00 • contact@ecole.cm"
                                        value={data.contacts}
                                        onChange={e => setData('contacts', e.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Présentation / Description Générale</label>
                                    <textarea
                                        rows="3"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                        style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Présentez les filières, l'excellence pédagogique, l'encadrement..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2 : Identité Visuelle & Bannière */}
                        <div>
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 85%)', color: 'var(--primary-color)' }}>
                                    02
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Logo & Bannière de Couverture</h3>
                                    <p className="text-xs text-gray-400">Illustrez la vitrine publique de votre établissement avec des visuels haute qualité.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Logo / Blason */}
                                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Logo / Blason Officiel
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                            {school.logo_url || school.logo_path ? (
                                                <img src={school.logo_url || `/storage/${school.logo_path}`} className="w-full h-full object-cover" alt="Logo" />
                                            ) : (
                                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-gray-200 dark:file:bg-white/10 file:text-gray-800 dark:file:text-white cursor-pointer"
                                                onChange={e => setData('logo', e.target.files[0])}
                                            />
                                            <p className="text-[10px] text-gray-400 mt-1">Format carré recommandé (PNG, JPG, SVG)</p>
                                        </div>
                                    </div>
                                    {errors.logo && <p className="text-xs text-red-500 font-bold">{errors.logo}</p>}
                                </div>

                                {/* Bannière de couverture */}
                                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Grande Bannière / Couverture
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-28 h-20 rounded-2xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                            {school.cover_image_url || school.cover_image_path ? (
                                                <img src={school.cover_image_url || `/storage/${school.cover_image_path}`} className="w-full h-full object-cover" alt="Couverture" />
                                            ) : (
                                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-gray-200 dark:file:bg-white/10 file:text-gray-800 dark:file:text-white cursor-pointer"
                                                onChange={e => setData('cover_image', e.target.files[0])}
                                            />
                                            <p className="text-[10px] text-gray-400 mt-1">Image panoramique (1920x600 recommandé)</p>
                                        </div>
                                    </div>
                                    {errors.cover_image && <p className="text-xs text-red-500 font-bold">{errors.cover_image}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 3 : Vidéo & Galerie Photos */}
                        <div>
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 85%)', color: 'var(--primary-color)' }}>
                                    03
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Vidéo & Galerie Multimédia</h3>
                                    <p className="text-xs text-gray-400">Présentez vos infrastructures, cours, activités et laboratoires en vidéo et photos.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Vidéo de présentation */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        Lien de la Vidéo de Présentation (YouTube, Vimeo, ou MP4 direct)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            className="w-full pl-12 pr-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                            style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                            placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                                            value={data.video_url}
                                            onChange={e => setData('video_url', e.target.value)}
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Collez simplement le lien YouTube, Vimeo ou le lien vidéo Cloudinary.</p>
                                    {errors.video_url && <p className="mt-1 text-xs text-red-500 font-bold">{errors.video_url}</p>}
                                </div>

                                {/* Galerie Photos existante */}
                                {school.gallery_images && school.gallery_images.length > 0 && (
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                            Photos Actuelles de la Galerie ({school.gallery_images.length})
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {school.gallery_images.map((imgUrl, index) => (
                                                <div key={index} className="relative group rounded-2xl overflow-hidden aspect-video border border-gray-200 dark:border-white/10 shadow-sm bg-black">
                                                    <img src={imgUrl} alt={`Galerie ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingGalleryImage(index)}
                                                        className="absolute top-2 right-2 p-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                                                        title="Supprimer cette photo"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Ajouter de nouvelles photos */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        Ajouter des Photos à la Galerie (Sélection multiple)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 rounded-2xl text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-[var(--primary-color)] file:text-white cursor-pointer"
                                        onChange={handleGalleryFilesChange}
                                    />
                                    {galleryPreview.length > 0 && (
                                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                                            {galleryPreview.map((src, i) => (
                                                <div key={i} className="aspect-video rounded-xl overflow-hidden border border-emerald-500/50 shadow-sm">
                                                    <img src={src} className="w-full h-full object-cover" alt="Aperçu nouveau" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bouton d'enregistrement */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
                            <p className="text-xs text-gray-400">
                                Vos modifications seront immédiatement visibles sur la vitrine publique.
                            </p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-10 py-4 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
                                style={{ backgroundColor: 'var(--primary-color)', boxShadow: '0 12px 24px -6px var(--shadow-color)' }}
                            >
                                {processing ? 'Enregistrement en cours...' : 'Enregistrer la Présentation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
