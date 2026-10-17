import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function EnseignantDashboard({ auth, assignments, students_count }) {
    const { school_name } = usePage().props;

    // Group assignments by class
    const groupedAssignments = assignments.reduce((acc, assignment) => {
        if (!assignment.classe) return acc;
        
        const classId = assignment.classe.id;
        if (!acc[classId]) {
            acc[classId] = {
                classe: assignment.classe,
                subjects: []
            };
        }
        acc[classId].subjects.push(assignment.subject);
        return acc;
    }, {});

    const classesArray = Object.values(groupedAssignments);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--primary-color)' }}>Espace Enseignant</p>
                    <h2 className="font-extrabold text-3xl text-gray-900 dark:text-white leading-tight tracking-tight">Tableau de Bord</h2>
                </div>
            }
        >
            <Head title="Tableau de Bord - Enseignant" />

            <div className="space-y-10">
                {/* Banner */}
                <div className="relative overflow-hidden dark:bg-[var(--dark-bg)] bg-gray-950 rounded-[3rem] shadow-2xl p-12 group">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full blur-[120px] opacity-20 group-hover:opacity-30 transition-all duration-700" style={{ backgroundColor: 'var(--primary-color)' }}></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black text-white uppercase tracking-widest">Connecte</span>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                                Bonjour, <br />
                                <span style={{ color: 'var(--primary-color)' }}>{auth.user.name}</span>
                            </h1>
                            <p className="text-gray-400 text-base font-medium leading-relaxed max-w-md">
                                Bienvenue sur votre espace enseignant de <span className="text-white font-bold">{school_name || "l'etablissement"}</span>.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center min-w-[120px]">
                                <p className="text-3xl font-black text-white mb-1">{classesArray.length}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classes</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center min-w-[120px]">
                                <p className="text-3xl font-black text-white mb-1">{students_count}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Eleves</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mes Classes */}
                <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">Mes Classes Assignees</h3>
                    
                    {classesArray.length === 0 ? (
                        <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2rem] p-12 text-center border border-gray-100 dark:border-white/5">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Aucune classe ne vous a ete assignee pour le moment.</p>
                            <p className="text-gray-500 text-xs mt-2">Veuillez contacter l'administration.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {classesArray.map((item, index) => (
                                <div key={index} className="bg-white dark:bg-[var(--dark-bg)] rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                                {item.classe.nom}
                                            </h4>
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                                {item.classe.level?.name || 'Niveau indÃ©fini'}
                                            </span>
                                        </div>
                                        <div className="space-y-2 mb-8">
                                            {item.subjects.map(sub => (
                                                <div key={sub.id} className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                                                    {sub.nom} (Coef {sub.coefficient})
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <Link 
                                        href={route('grades.create', { classe_id: item.classe.id })}
                                        className="w-full py-3 px-4 rounded-xl text-center text-sm font-black text-white uppercase tracking-widest transition-all hover:opacity-90 shadow-lg"
                                        style={{ backgroundColor: 'var(--primary-color)' }}
                                    >
                                        Saisir les Notes
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}