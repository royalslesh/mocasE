import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Deadlines({ auth, deadlines, extensionRequests }) {
    // Preparer form data
    const initialDeadlines = [1, 2, 3, 4, 5, 6].map(seq => {
        const found = deadlines.find(d => d.sequence === seq);
        return {
            sequence: seq,
            start_date: found?.start_date ? found.start_date.split('T')[0] : '',
            end_date: found?.end_date ? found.end_date.split('T')[0] : '',
        };
    });

    const { data, setData, post, processing } = useForm({
        deadlines: initialDeadlines
    });

    const handleDateChange = (index, field, value) => {
        const newDeadlines = [...data.deadlines];
        newDeadlines[index][field] = value;
        setData('deadlines', newDeadlines);
    };

    const submitDeadlines = (e) => {
        e.preventDefault();
        post(route('proviseur.deadlines.store'));
    };

    const respondToExtension = (id, status) => {
        if (!confirm(`Confirmer cette action ?`)) return;
        router.put(route('proviseur.extensions.respond', id), { status }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-gray-900 dark:text-white uppercase tracking-tight">Delais & Derogations</h2>}
        >
            <Head title="Delais de notes" />

            <div className="space-y-8">
                {/* Configuration des delais */}
                <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 p-8">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">Configurer les periodes de saisie</h3>
                    
                    <form onSubmit={submitDeadlines} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.deadlines.map((d, index) => (
                                <div key={d.sequence} className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">Sequence {d.sequence}</h4>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date de debut</label>
                                            <input 
                                                type="date" 
                                                value={d.start_date}
                                                onChange={(e) => handleDateChange(index, 'start_date', e.target.value)}
                                                className="w-full px-4 py-2 bg-white dark:bg-black/20 border-none rounded-xl text-sm font-bold focus:ring-2"
                                                style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date de fin</label>
                                            <input 
                                                type="date" 
                                                value={d.end_date}
                                                onChange={(e) => handleDateChange(index, 'end_date', e.target.value)}
                                                className="w-full px-4 py-2 bg-white dark:bg-black/20 border-none rounded-xl text-sm font-bold focus:ring-2"
                                                style={{ '--tw-ring-color': 'var(--primary-color)' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-6 py-3 text-white font-black rounded-xl uppercase tracking-widest text-sm shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
                                style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                                {processing ? 'Enregistrement...' : 'Sauvegarder les delais'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Demandes de derogations */}
                <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="px-8 py-5 border-b border-gray-50 dark:border-white/5">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Demandes de derogations ({extensionRequests.length})</h3>
                    </div>
                    
                    {extensionRequests.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 font-bold text-sm uppercase tracking-widest">
                            Aucune demande de derogation en attente.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50 dark:divide-white/5">
                            {extensionRequests.map(req => (
                                <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                                                req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                                req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {req.status === 'pending' ? 'En attente' : req.status === 'approved' ? 'Approuvee' : 'Rejetee'}
                                            </span>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Seq. {req.sequence}</span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">
                                            {req.teacher?.name} â€” {req.subject?.nom} ({req.classe?.nom})
                                        </h4>
                                        <p className="text-sm text-gray-500 italic mt-2">"{req.reason}"</p>
                                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">{new Date(req.created_at).toLocaleString('fr-FR')}</p>
                                    </div>

                                    {req.status === 'pending' && (
                                        <div className="flex gap-2 shrink-0">
                                            <button 
                                                onClick={() => respondToExtension(req.id, 'approved')}
                                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-colors"
                                            >
                                                Accepter
                                            </button>
                                            <button 
                                                onClick={() => respondToExtension(req.id, 'rejected')}
                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-colors"
                                            >
                                                Refuser
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}