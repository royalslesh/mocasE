import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, classes = [], userRole }) {
    const [selectedClasse, setSelectedClasse] = useState('');
    const [selectedFiltre, setSelectedFiltre] = useState('tous');
    const [selectedClasseCards, setSelectedClasseCards] = useState('');

    const handlePrintStudents = () => {
        const params = new URLSearchParams();
        if (selectedClasse) params.append('classe_id', selectedClasse);
        if (selectedFiltre) params.append('filtre', selectedFiltre);
        window.open(`${route('exports.students')}?${params.toString()}`, '_blank');
    };

    const handlePrintStaff = () => {
        window.open(route('exports.staff'), '_blank');
    };

    const handlePrintIdCards = () => {
        const params = new URLSearchParams();
        if (selectedClasseCards) params.append('classe_id', selectedClasseCards);
        window.open(`${route('exports.id_cards')}?${params.toString()}`, '_blank');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--primary-color)' }}>
                            Documents Officiels
                        </p>
                        <h2 className="font-extrabold text-3xl text-gray-900 dark:text-white leading-tight tracking-tight">
                            Centre d'Exports & Impressions PDF
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Exports & Listes Officielles" />

            <div className="py-12 bg-transparent min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Notice informatif */}
                    <div className="p-6 bg-white dark:bg-[var(--dark-bg)] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 85%)' }}>
                            <svg className="w-6 h-6" style={{ color: 'var(--primary-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {userRole === 'censeur' 
                                    ? 'Espace Censeur : Vos exports sont automatiquement restreints aux classes et aux enseignants de votre niveau de responsabilité.'
                                    : 'Espace Proviseur : Vous avez un accès complet à l\'ensemble des classes, élèves et membres du personnel de l\'établissement.'}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Chaque document généré respecte les normes officielles avec en-tête, logo de l'établissement et zones d'émargement et signature.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Carte 1 : Export Élèves */}
                        <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl p-8 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-white/5">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 88%)' }}>
                                        <svg className="w-6 h-6" style={{ color: 'var(--primary-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Liste des Élèves</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Listes d'appel & Registre officiel</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Classe ciblée</label>
                                        <select
                                            value={selectedClasse}
                                            onChange={(e) => setSelectedClasse(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                                        >
                                            <option value="" className="dark:bg-[#111614]">Toutes les classes disponibles</option>
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id} className="dark:bg-[#111614]">
                                                    {cls.nom} {cls.section ? `(${cls.section.toUpperCase()})` : ''} — {cls.eleves_count || 0} élève(s)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Filtre du Statut</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { id: 'tous', label: 'Tous' },
                                                { id: 'nouveaux', label: 'Nouveaux' },
                                                { id: 'redoublants', label: 'Redoublants' },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => setSelectedFiltre(opt.id)}
                                                    className={`py-3 px-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all text-center ${
                                                        selectedFiltre === opt.id
                                                            ? 'text-white border-transparent shadow-md'
                                                            : 'bg-gray-50 dark:bg-white/5 text-gray-500 border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                                                    }`}
                                                    style={selectedFiltre === opt.id ? { backgroundColor: 'var(--primary-color)' } : {}}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                        <p className="font-bold text-gray-900 dark:text-white">Inclus dans ce document :</p>
                                        <p>• Numérotation, Matricule, Nom & Prénom, Sexe</p>
                                        <p>• Badge Redoublant / Nouveau et colonne d'émargement</p>
                                        <p>• Espaces officiels de visa Censeur et Proviseur</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePrintStudents}
                                className="mt-8 w-full py-4 text-xs font-black uppercase tracking-widest text-white rounded-2xl shadow-xl transition-all hover:opacity-90 active:scale-95 inline-flex items-center justify-center gap-2"
                                style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                Générer la Liste des Élèves (PDF)
                            </button>
                        </div>

                        {/* Carte 2 : Export Personnel */}
                        <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl p-8 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-white/5">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color), transparent 88%)' }}>
                                        <svg className="w-6 h-6" style={{ color: 'var(--primary-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Liste du Personnel</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Corps enseignant & Encadrement</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/5 space-y-3">
                                        <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                            {userRole === 'censeur' ? 'Périmètre Censeur :' : 'Périmètre Proviseur :'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {userRole === 'censeur'
                                                ? 'La liste contient uniquement les enseignants assignés aux classes sous votre supervision directe, avec leurs matières enseignées.'
                                                : 'La liste regroupe l\'ensemble des effectifs par catégorie : Censeurs, Enseignants (avec matières et classes), Surveillants Généraux et Comptables.'}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                        <p className="font-bold text-gray-900 dark:text-white">Inclus dans ce document :</p>
                                        <p>• Répartition par corps de métier (Censeurs, Profs, Surveillants...)</p>
                                        <p>• Matières attribuées à chaque enseignant</p>
                                        <p>• Logo officiel et signatures administratives</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePrintStaff}
                                className="mt-8 w-full py-4 text-xs font-black uppercase tracking-widest text-white rounded-2xl shadow-xl transition-all hover:opacity-90 active:scale-95 inline-flex items-center justify-center gap-2"
                                style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                Générer la Liste du Personnel (PDF)
                            </button>
                        </div>

                        {/* Carte 3 : Cartes d'Identité Scolaires (Badges) */}
                        <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl p-8 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-white/5">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Cartes Scolaires</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Badges Élèves Imprimables (A4)</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Classe à imprimer</label>
                                        <select
                                            value={selectedClasseCards}
                                            onChange={(e) => setSelectedClasseCards(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all"
                                        >
                                            <option value="" className="dark:bg-[#111614]">Toutes les classes de l'école</option>
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id} className="dark:bg-[#111614]">
                                                    {cls.nom} {cls.section ? `(${cls.section.toUpperCase()})` : ''} — {cls.eleves_count || 0} élève(s)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                        <p className="font-bold text-gray-900 dark:text-white">Caractéristiques du Badge :</p>
                                        <p>• Planche de 8 cartes au format standard par page A4</p>
                                        <p>• Liseré national Cameroun, cadre photo &amp; matricule</p>
                                        <p>• Code-barres de contrôle &amp; signature Proviseur</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePrintIdCards}
                                className="mt-8 w-full py-4 text-xs font-black uppercase tracking-widest text-white rounded-2xl shadow-xl transition-all hover:opacity-90 active:scale-95 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                Imprimer les Badges Élèves (A4)
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
