import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, subjects, classes }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nom: '',
        coef_default: 1,
        selected_classes: [], // Array of { id, coefficient }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleEdit = (subject) => {
        setIsEditing(true);
        setEditId(subject.id);
        setData({
            nom: subject.nom,
            coef_default: subject.coef_default || 1,
            selected_classes: (subject.classes || []).map(c => ({
                id: c.id,
                nom: c.nom,
                coefficient: c.pivot ? c.pivot.coefficient : 1
            }))
        });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        reset();
    };

    const handleDelete = (id) => {
        if (confirm('Supprimer cette matière ? Les coefficients associés dans toutes les classes seront perdus.')) {
            router.delete(route('subjects.destroy', id));
        }
    };

    const [tempClassId, setTempClassId] = useState('');
    const [tempCoef, setTempCoef] = useState(1);

    const addClassToMatiere = () => {
        if (!tempClassId) return;
        const exists = data.selected_classes.find(c => c.id === parseInt(tempClassId));
        if (exists) return;

        const classObj = classes.find(c => c.id === parseInt(tempClassId));
        setData('selected_classes', [
            ...data.selected_classes,
            { id: classObj.id, nom: classObj.nom, coefficient: tempCoef }
        ]);
        setTempClassId('');
        setTempCoef(1);
    };

    const removeClass = (id) => {
        setData('selected_classes', data.selected_classes.filter(c => c.id !== id));
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('subjects.update', editId), {
                onSuccess: () => {
                    cancelEdit();
                },
            });
        } else {
            post(route('subjects.store'), {
                onSuccess: () => {
                    reset();
                    setTempClassId('');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--primary-color)' }}>Configuration</p>
                    <h2 className="font-extrabold text-3xl text-gray-900 dark:text-white leading-tight tracking-tight">Gestion des Matières</h2>
                </div>
            }
        >
            <Head title="Matières" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Form Card */}
                <div className="bg-white dark:bg-[var(--dark-bg)] p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 px-1">
                        {isEditing ? 'Réviser la Matière' : 'Nouvelle Matière & Coeffs'}
                    </h3>
                    <form onSubmit={submit} className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 dark:text-emerald-500/80 uppercase tracking-widest mb-3 px-1">Nom de la Matière</label>
                            <input
                                type="text"
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0a0f0d] border border-gray-100 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold transition-all focus:ring-2"
                                style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                value={data.nom}
                                onChange={(e) => setData('nom', e.target.value)}
                                placeholder="Ex: Mathématiques"
                                required
                            />
                            {errors.nom && <p className="mt-2 text-xs text-red-500 font-bold italic">{errors.nom}</p>}
                        </div>

                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigner aux Classes & Fixer Coeffs</p>
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <select
                                        className="w-full px-4 py-3 bg-white dark:bg-[#0a0f0d] border border-gray-100 dark:border-white/10 rounded-xl text-sm font-bold transition-all appearance-none"
                                        value={tempClassId}
                                        onChange={(e) => setTempClassId(e.target.value)}
                                    >
                                        <option value="" className="dark:bg-[#1a221f] text-gray-400 italic px-2">-- Classe --</option>
                                        {classes.map(c => (
                                            <option key={c.id} value={c.id} className="dark:bg-[#1a221f] text-white py-2">{c.nom}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full px-4 py-3 bg-white dark:bg-[#0a0f0d] border border-gray-100 dark:border-white/10 rounded-xl text-sm font-bold text-center"
                                        value={tempCoef}
                                        onChange={(e) => setTempCoef(parseInt(e.target.value))}
                                        placeholder="Coef"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addClassToMatiere}
                                    className="p-3 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:scale-105 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                </button>
                            </div>

                            {/* List of temp assigned classes */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {data.selected_classes.map(c => (
                                    <div key={c.id} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/10 rounded-lg border border-black/5 shadow-sm animate-in zoom-in-50 duration-300">
                                        <span className="text-[10px] font-black uppercase">{c.nom}</span>
                                        <span className="w-5 h-5 rounded-md bg-gray-900 dark:bg-white text-[10px] font-black flex items-center justify-center text-white dark:text-gray-900">x{c.coefficient}</span>
                                        <button type="button" onClick={() => removeClass(c.id)} className="text-red-500 hover:text-red-700">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-6 py-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-black rounded-2xl hover:bg-gray-200 transition-all"
                                >
                                    Annuler
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 px-10 py-5 text-white font-black rounded-3xl shadow-2xl transition-all active:scale-95 disabled:opacity-50 transform hover:-translate-y-1"
                                style={{ backgroundColor: 'var(--primary-color)', boxShadow: `0 10px 15px -3px var(--shadow-color)` }}
                            >
                                {isEditing ? 'Sauvegarder les Changements' : 'Inscrire la Matière'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table Card */}
                <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[550px]">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Matières</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Classes & Coeffs</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {subjects.map((subject) => (
                                <tr key={subject.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase italic tracking-tight">{subject.nom}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-wrap gap-1.5">
                                            {subject.classes?.map(c => (
                                                <span key={c.id} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-[8px] font-black uppercase text-gray-500 border border-black/[0.03]">
                                                    {c.nom} <span className="text-[var(--primary-color)]">x{c.pivot?.coefficient}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(subject)}
                                                className="p-2 text-gray-300 hover:text-[var(--primary-color)] transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(subject.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
