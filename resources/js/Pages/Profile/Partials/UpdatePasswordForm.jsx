import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const emailInput = useRef();
    const user = usePage().props.auth.user;

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const isSameEmail = Boolean(
        data.email &&
        data.email.trim().toLowerCase() === (user.email || '').trim().toLowerCase()
    );

    const updatePassword = (e) => {
        e.preventDefault();

        if (isSameEmail) {
            return;
        }

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.email) {
                    emailInput.current?.focus();
                } else if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                } else if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="border-b border-gray-100 dark:border-white/5 pb-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Sécurité & Changement de Mot de Passe
                </h2>

                {/* Encadré d'information règle de sécurité */}
                <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-200">
                            Règle de sécurité obligatoire
                        </p>
                        <p className="mt-1 text-xs text-amber-700 dark:text-amber-300/90 leading-relaxed">
                            Pour garantir l'intégrité et la traçabilité de votre compte, <strong>vous ne pouvez pas changer de mot de passe sans modifier simultanément votre adresse email</strong>. Veuillez saisir votre nouvelle adresse email ci-dessous.
                        </p>
                    </div>
                </div>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                {/* Mot de passe actuel */}
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Mot de passe actuel"
                        className="font-bold text-xs uppercase text-gray-700 dark:text-gray-300"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full rounded-xl border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:ring-emerald-500"
                        autoComplete="current-password"
                        required
                        placeholder="••••••••"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                {/* Nouvelle adresse email requise */}
                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel
                            htmlFor="new_email"
                            value="Nouvelle adresse email (obligatoire)"
                            className="font-bold text-xs uppercase text-emerald-700 dark:text-emerald-400"
                        />
                        <span className="text-[10px] text-gray-400">
                            Actuelle : <strong className="text-gray-600 dark:text-gray-300">{user.email}</strong>
                        </span>
                    </div>

                    <TextInput
                        id="new_email"
                        ref={emailInput}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        type="email"
                        className={`mt-1 block w-full rounded-xl dark:bg-white/5 dark:text-white focus:ring-emerald-500 ${isSameEmail ? 'border-red-500 bg-red-50/50' : 'border-gray-200 dark:border-white/10'}`}
                        placeholder="Saisissez une nouvelle adresse email différente"
                        autoComplete="email"
                        required
                    />

                    {isSameEmail && (
                        <p className="mt-1.5 text-xs font-bold text-red-600 dark:text-red-400">
                            Cette adresse est identique à votre adresse email actuelle. Vous devez saisir une nouvelle adresse email.
                        </p>
                    )}

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Nouveau mot de passe et confirmation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Nouveau mot de passe"
                            className="font-bold text-xs uppercase text-gray-700 dark:text-gray-300"
                        />

                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full rounded-xl border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:ring-emerald-500"
                            autoComplete="new-password"
                            required
                            placeholder="Au moins 8 caractères"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirmer le nouveau mot de passe"
                            className="font-bold text-xs uppercase text-gray-700 dark:text-gray-300"
                        />

                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type="password"
                            className="mt-1 block w-full rounded-xl border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:ring-emerald-500"
                            autoComplete="new-password"
                            required
                            placeholder="Répétez le mot de passe"
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton
                        disabled={processing || isSameEmail}
                        className="!bg-emerald-600 hover:!bg-emerald-700 disabled:!opacity-50 !px-6 !py-3 !rounded-xl !font-bold text-xs !uppercase !tracking-wider"
                    >
                        {processing ? 'Modification en cours...' : 'Modifier le mot de passe & l\'email'}
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
                            Mot de passe et email mis à jour avec succès.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
