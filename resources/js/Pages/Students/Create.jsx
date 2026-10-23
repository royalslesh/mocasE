import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function Create({ auth, classes, levels, student = null }) {
    const isEditing = !!student;
    const fileInputRef = useRef(null);

    const initialPhotoPreview = student?.photo_url || (student?.photo_path ? (student.photo_path.startsWith('http') ? student.photo_path : `/storage/${student.photo_path}`) : null);
    const [photoPreview, setPhotoPreview] = useState(initialPhotoPreview);

    const { data, setData, post, processing, errors } = useForm({
        nom: student?.nom || '',
        prenom: student?.prenom || '',
        MATRICULE: student?.MATRICULE || '',
        date_naissance: student?.date_naissance || '',
        lieu_naissance: student?.lieu_naissance || '',
        section: student?.section || 'F',
        classe_id: student?.classe_id || '',
        sexe: student?.sexe || 'M',
        parent_name: student?.parent_name || '',
        parent_phone: student?.parent_phone || '',
        adresse: student?.adresse || '',
        statut: student?.statut || 'nouveau',
        photo: null,
        _method: isEditing ? 'put' : undefined,
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            const objectUrl = URL.createObjectURL(file);
            setPhotoPreview(objectUrl);
        }
    };

    const handleRemovePhoto = () => {
        setData('photo', null);
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            post(route('students.update', student.id));
        } else {
            post(route('students.store'));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">
                        {isEditing ? 'Mise à Jour' : 'Inscription'}
                    </p>
                    <h2 className="font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-emerald-50 leading-tight tracking-tight">
                        {isEditing ? 'Dossier Scolaire' : 'Nouvel Élève'}
                    </h2>
                </div>
            }
        >
            <Head title={isEditing ? `Modifier ${student.nom}` : "Inscription Élève"} />

            <div className="max-w-4xl mx-auto px-2 sm:px-4">
                <div className="bg-white dark:bg-[#111915] overflow-hidden shadow-2xl rounded-2xl sm:rounded-[2.5rem] border border-gray-100 dark:border-emerald-900/20 p-5 sm:p-10">
                    <form onSubmit={submit} className="space-y-8 sm:space-y-10" encType="multipart/form-data">

                        {/* Matricule — saisie obligatoire en création, modifiable en édition */}
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-emerald-600 p-2 rounded-xl text-white shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Matricule de l'Élève</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Numéro officiel unique. Ex : CM-2025-00123</p>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={data.MATRICULE}
                                onChange={(e) => setData('MATRICULE', e.target.value.toUpperCase())}
                                className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-white dark:bg-[#0a0f0d] border border-emerald-200 dark:border-emerald-900/40 rounded-2xl text-emerald-900 dark:text-emerald-50 text-sm font-black tracking-widest focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 placeholder:font-normal uppercase"
                                placeholder="Ex: CM-2025-00123"
                                required
                                maxLength={50}
                            />
                            {errors.MATRICULE && <p className="text-red-500 text-xs mt-2 font-bold italic uppercase tracking-tighter">{errors.MATRICULE}</p>}
                        </div>


                        {/* Photo d'Identité Section */}
                        <div className="space-y-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gray-50/70 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                        Photo d'Identité de l'Élève
                                    </h3>
                                    <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                                        Utilisée pour les cartes scolaires (badges) et le dossier académique.
                                    </p>
                                </div>
                                <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                                    Optionnel
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 pt-2">
                                {/* Aperçu Photo 3:4 */}
                                <div className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden bg-white dark:bg-black/30 border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center shadow-inner shrink-0 group">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Aperçu photo élève"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-3">
                                            <svg className="w-10 h-10 text-gray-300 dark:text-white/20 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                            </svg>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Sans Photo</span>
                                        </div>
                                    )}

                                    {photoPreview && (
                                        <button
                                            type="button"
                                            onClick={handleRemovePhoto}
                                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
                                            title="Retirer la photo"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Actions Upload */}
                                <div className="space-y-3 text-center sm:text-left flex-1">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                        id="student_photo_input"
                                    />
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                                        <label
                                            htmlFor="student_photo_input"
                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-700 dark:text-white cursor-pointer hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm active:scale-95 uppercase tracking-wider"
                                        >
                                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {photoPreview ? 'Changer la photo' : 'Importer une photo'}
                                        </label>
                                        {photoPreview && (
                                            <button
                                                type="button"
                                                onClick={handleRemovePhoto}
                                                className="px-3 py-2.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider"
                                            >
                                                Supprimer
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        Format JPG, PNG ou WEBP. Taille max : 2 Mo. Format d'identité recommandé (portrait).
                                    </p>
                                    {errors.photo && (
                                        <p className="text-red-500 text-xs font-bold italic uppercase tracking-tighter">
                                            {errors.photo}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Personal Info Section */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1">Informations Personnelles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-emerald-800 uppercase tracking-widest mb-2 sm:mb-3 px-1">Nom</label>
                                    <input
                                        type="text"
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 dark:bg-[#0a0f0d] border-none rounded-2xl text-gray-900 dark:text-emerald-50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300"
                                        placeholder="Ex: TCHANA"
                                        required
                                    />
                                    {errors.nom && <p className="text-red-500 text-xs mt-2 font-bold italic uppercase tracking-tighter">{errors.nom}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-emerald-800 uppercase tracking-widest mb-2 sm:mb-3 px-1">Prénom</label>
                                    <input
                                        type="text"
                                        value={data.prenom}
                                        onChange={(e) => setData('prenom', e.target.value)}
                                        className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 dark:bg-[#0a0f0d] border-none rounded-2xl text-gray-900 dark:text-emerald-50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300"
                                        placeholder="Ex: Franck"
                                        required
                                    />
                                    {errors.prenom && <p className="text-red-500 text-xs mt-2 font-bold italic uppercase tracking-tighter">{errors.prenom}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-emerald-800 uppercase tracking-widest mb-2 sm:mb-3 px-1">Date de Naissance</label>
                                    <input
                                        type="date"
                                        value={data.date_naissance}
                                        onChange={(e) => setData('date_naissance', e.target.value)}
                                        className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 dark:bg-[#0a0f0d] border-none rounded-2xl text-gray-900 dark:text-emerald-50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all"
                                        required={!isEditing}
                                    />
                                    {errors.date_naissance && <p className="text-red-500 text-xs mt-2 font-bold italic uppercase tracking-tighter">{errors.date_naissance}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-emerald-800 uppercase tracking-widest mb-2 sm:mb-3 px-1">Lieu de Naissance</label>
                                    <input
                                        type="text"
                                        value={data.lieu_naissance}
                                        onChange={(e) => setData('lieu_naissance', e.target.value)}
                                        className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 dark:bg-[#0a0f0d] border-none rounded-2xl text-gray-900 dark:text-emerald-50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300"
                                        placeholder="Ex: Yaoundé"
                                        required={!isEditing}
                                    />
                                    {errors.lieu_naissance && <p className="text-red-500 text-xs mt-2 font-bold italic uppercase tracking-tighter">{errors.lieu_naissance}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-emerald-800 uppercase tracking-widest mb-2 sm:mb-3 px-1">Nom Complet du Parent / Tuteur</label>
                                    <input
                                        type="text"
                                        value={data.parent_name}
                                        onChange={(e) => setData('parent_name', e.target.value)}
                                        className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 dark:bg-[#0a0f0d] border-none rounded-2xl text-gray-900 dark:text-emerald-50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300"
                                        placeholder="Ex: M. NGUEKAM Pierre"
                                    />
                                    {errors.parent_name && <p className="text-red-500 text-xs mt-2 font-bold italic uppercase tracking-tighter">{errors.parent_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-emerald-800 uppercase tracking-widest mb-2 sm:mb-3 px-1">Téléphone du Parent / Tuteur</label>
                                    <input
                                        type="tel"
                                        value={data.parent_phone}
                                        onChange={(e) => setData('parent_phone', e.target.value)}
                                        className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 dark:bg-[#0a0f0d] border-none rounded-2xl text-gray-900 dark:text-emerald-50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300"
                                        placeholder="Ex: 6XX XXX XXX"
                                        required
                                    />
                                    {errors.parent_phone && <p className="text-red-500 text-xs mt-2 font-bold italic uppercase tracking-tighter">{errors.parent_phone}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 dark:text-emerald-800 uppercase tracking-widest mb-2 sm:mb-3 px-1">Adresse de Résidence / Quartier</label>
                                <input
                                    type="text"
                                    value={data.adresse}
                                    onChange={(e) => setData('adresse', e.target.value)}
                                    className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 dark:bg-[#0a0f0d] border-none rounded-2xl text-gray-900 dark:text-emerald-50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300"
                                    placeholder="Ex: Quartier Biyem-Assi, Montée des Soeurs"
                                />
                                {errors.adresse && <p className="text-red-500 text-xs mt-2 font-bold italic uppercase tracking-tighter">{errors.adresse}</p>}
                            </div>
                        </div>

                        {/* Academy Section */}
                        <div className="space-y-6 pt-8 sm:pt-10 border-t border-gray-50 dark:border-emerald-900/10">
                            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1">Données Académiques</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-emerald-800 uppercase tracking-widest mb-2 sm:mb-3 px-1">Genre</label>
                                    <select
                                        value={data.sexe}
                                        onChange={(e) => setData('sexe', e.target.value)}
                                        className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 dark:bg-[#0a0f0d] border-none rounded-2xl text-gray-900 dark:text-emerald-50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="M" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Masculin</option>
                                        <option value="F" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Féminin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-emerald-800 uppercase tracking-widest mb-2 sm:mb-3 px-1">Section</label>
                                    <select
                                        value={data.section}
                                        onChange={(e) => setData('section', e.target.value)}
                                        className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 dark:bg-[#0a0f0d] border-none rounded-2xl text-gray-900 dark:text-emerald-50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="F" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Francophone</option>
                                        <option value="A" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Anglophone</option>
                                        <option value="B" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Bilingue</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-emerald-800 uppercase tracking-widest mb-2 sm:mb-3 px-1">Statut de l'Élève</label>
                                    <select
                                        value={data.statut}
                                        onChange={(e) => setData('statut', e.target.value)}
                                        className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 dark:bg-[#0a0f0d] border-none rounded-2xl text-gray-900 dark:text-emerald-50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="nouveau" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Nouveau</option>
                                        <option value="ancien" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Ancien</option>
                                        <option value="redoublant" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Redoublant</option>
                                        {/* Option Exclu réservée au Proviseur / SuperAdmin */}
                                        {(isEditing && ['super_admin', 'proviseur'].includes(auth.user.role)) && (
                                            <option value="exclu" className="bg-red-50 text-red-700 font-bold">Exclu (Action Direction)</option>
                                        )}
                                        {(isEditing && student?.statut === 'exclu' && !['super_admin', 'proviseur'].includes(auth.user.role)) && (
                                            <option value="exclu" disabled className="text-red-500 font-bold">Exclu (Non modifiable)</option>
                                        )}
                                    </select>
                                    {errors.statut && <p className="text-red-500 text-xs mt-2 font-bold italic uppercase tracking-tighter">{errors.statut}</p>}
                                    {student?.statut === 'exclu' && !['super_admin', 'proviseur'].includes(auth.user.role) && (
                                        <p className="text-[10px] text-amber-500 font-bold mt-1">
                                            ℹ️ Seul le Chef d'Établissement (Directeur / Proviseur) peut modifier le statut d'un élève exclu.
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-emerald-800 uppercase tracking-widest mb-2 sm:mb-3 px-1">Affectation Classe</label>
                                    <select
                                        value={data.classe_id}
                                        onChange={(e) => setData('classe_id', e.target.value)}
                                        className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 dark:bg-[#0a0f0d] border-none rounded-2xl text-gray-900 dark:text-emerald-50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="" className="bg-white dark:bg-gray-900 text-gray-400">Choisir une classe...</option>
                                        {classes.map((c) => (
                                            <option key={c.id} value={c.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">{c.nom}</option>
                                        ))}
                                    </select>
                                    {errors.classe_id && <p className="text-red-500 text-xs mt-2 font-bold italic uppercase tracking-tighter">{errors.classe_id}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-8 sm:pt-10 border-t border-gray-50 dark:border-emerald-900/10">
                            <Link
                                href={route('students.index')}
                                className="text-xs font-black text-gray-400 dark:text-emerald-800 hover:text-red-500 transition-colors uppercase tracking-widest"
                            >
                                ← Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 hover:translate-y-[-2px] transition-all active:scale-95 disabled:opacity-50 text-sm uppercase tracking-wider"
                            >
                                {isEditing ? 'Enregistrer les Modifications' : 'Finaliser l\'Inscription'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
