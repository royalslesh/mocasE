import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name || '',
            phone: user.phone || '',
            email: user.email || '',
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const getRoleBadge = (role) => {
        const roles = {
            super_admin: { label: 'Super Administrateur', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
            proviseur: { label: 'Chef d\'Établissement / Proviseur', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
            censeur: { label: 'Censeur des Études', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
            surveillant: { label: 'Surveillant Général', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
            enseignant: { label: 'Enseignant', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
            comptable: { label: 'Comptable / Économe', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
            visiteur: { label: 'Visiteur', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
        };
        const r = roles[role] || { label: role, color: 'bg-gray-100 text-gray-700' };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${r.color}`}>
                {r.label}
            </span>
        );
    };

    return (
        <section className={className}>
            <header className="border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                            Informations Personnelles
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Consultez et mettez à jour les informations relatives à votre compte utilisateur.
                        </p>
                    </div>
                    <div>
                        {getRoleBadge(user.role)}
                    </div>
                </div>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="name" value="Nom Complet" className="font-bold text-xs uppercase text-gray-700 dark:text-gray-300" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full rounded-xl border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:ring-emerald-500"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                            placeholder="Ex: Jean Dupont"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone" value="Numéro de Téléphone / WhatsApp" className="font-bold text-xs uppercase text-gray-700 dark:text-gray-300" />
                        <TextInput
                            id="phone"
                            type="tel"
                            className="mt-1 block w-full rounded-xl border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:ring-emerald-500"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Ex: +237 6XX XX XX XX"
                            autoComplete="tel"
                        />
                        <InputError className="mt-2" message={errors.phone} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Adresse Email Actuelle" className="font-bold text-xs uppercase text-gray-700 dark:text-gray-300" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full rounded-xl border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:ring-emerald-500"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                    <p className="mt-1.5 text-xs text-gray-400">
                        Pour modifier uniquement vos coordonnées sans toucher à votre mot de passe, enregistrez directement ici.
                    </p>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                            Votre adresse email n'est pas encore vérifiée.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 font-bold underline hover:text-amber-900"
                            >
                                Renvoyer le lien de vérification
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-xs font-bold text-emerald-600">
                                Un nouveau lien de vérification a été envoyé à votre adresse email.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton
                        disabled={processing}
                        className="!bg-emerald-600 hover:!bg-emerald-700 !px-6 !py-3 !rounded-xl !font-bold text-xs !uppercase !tracking-wider"
                    >
                        {processing ? 'Enregistrement...' : 'Enregistrer les informations'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-500"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                            Enregistré avec succès.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
