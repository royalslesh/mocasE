import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
                        Mon Profil & Sécurité
                    </h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                        Gestion de vos informations personnelles et identifiants de connexion
                    </p>
                </div>
            }
        >
            <Head title="Mon Profil & Sécurité" />

            <div className="space-y-8 max-w-5xl">
                {/* Informations Personnelles */}
                <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                {/* Sécurité & Mot de Passe (avec règle stricte de changement d'email) */}
                <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <UpdatePasswordForm />
                </div>

                {/* Zone de Danger */}
                <div className="bg-white dark:bg-white/5 border border-red-100 dark:border-red-950/30 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <DeleteUserForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
