import { Link, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Schools({ schools, auth }) {
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout
            header={
                <h2 className="font-black text-lg sm:text-2xl uppercase tracking-tight" style={{ color: 'var(--primary-color)' }}>
                    Répertoire des Établissements
                </h2>
            }
        >
            <Head title="Écoles" />

            <div className="max-w-7xl mx-auto py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-16">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-4 tracking-tight uppercase" style={{ color: 'var(--primary-color)' }}>
                        Explorez les Écoles
                    </h1>
                    <p className="text-xs sm:text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-medium px-2">
                        Découvrez les performances et les effectifs des établissements partenaires de SLASH MOCAS.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                    {schools.map((school) => {
                        const themeMap = {
                            emerald: '#10b981', blue: '#3b82f6', indigo: '#6366f1',
                            purple: '#a855f7', rose: '#f43f5e', amber: '#f59e0b',
                            slate: '#475569', orange: '#f97316', cyan: '#06b6d4', teal: '#14b8a6'
                        };
                        const schoolColor = themeMap[school.theme_color] || themeMap.emerald;

                        return (
                            <Link
                                key={school.id}
                                href={route('visitor.schoolDetails', school.id)}
                                className="bg-white dark:bg-white/5 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden active:scale-[0.99]"
                            >
                                <div className="absolute top-0 left-0 w-1.5 sm:w-2 h-full transition-all group-hover:w-3 sm:group-hover:w-4" style={{ backgroundColor: schoolColor }}></div>

                                <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden shadow-md shrink-0 flex items-center justify-center border border-gray-100 dark:border-white/5" style={{ backgroundColor: `color-mix(in srgb, ${schoolColor}, transparent 90%)` }}>
                                        {school.logo_path ? (
                                            <img src={`/storage/${school.logo_path}`} className="w-full h-full object-cover" alt="Logo" />
                                        ) : (
                                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: schoolColor }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m0 0h10" />
                                            </svg>
                                        )}
                                    </div>
                                    <h3 className="text-base sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-snug line-clamp-2">
                                        {school.name}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-8">
                                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-3xl" style={{ backgroundColor: `color-mix(in srgb, ${schoolColor}, transparent 95%)` }}>
                                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider mb-0.5 sm:mb-1" style={{ color: schoolColor }}>Statut</p>
                                        <p className="text-base sm:text-xl font-black" style={{ color: schoolColor }}>{school.is_active ? 'Actif' : 'Inactif'}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-3xl">
                                        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">Localisation</p>
                                        <p className="text-sm sm:text-lg font-black text-gray-900 dark:text-white truncate">{school.city || 'Non déf.'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between font-bold text-xs sm:text-sm" style={{ color: schoolColor }}>
                                    <span>Découvrir l'établissement</span>
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}
