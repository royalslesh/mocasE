import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout variant="card">
            <Head title="Connexion" />

            <div className="mb-6 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--primary-color)' }}>
                    Accès Sécurisé
                </p>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                    Connexion au Portail
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-1">
                    Entrez vos identifiants pour accéder à votre espace
                </p>
            </div>

            {status && (
                <div className="mb-4 text-xs font-bold uppercase tracking-wider text-center" style={{ color: 'var(--primary-color)' }}>
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">
                        Adresse Email
                    </label>

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-sm"
                        autoComplete="username"
                        isFocused={true}
                        placeholder="exemple@mocase.cm"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">
                        Mot de Passe
                    </label>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-sm"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            Se souvenir de moi
                        </span>
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Oublié ?
                        </Link>
                    )}
                </div>

                <div className="pt-4 flex flex-col items-center gap-3">
                    <PrimaryButton className="w-full justify-center !rounded-xl sm:!rounded-2xl !py-3.5 sm:!py-4 text-xs font-black uppercase tracking-wider shadow-lg active:scale-95" disabled={processing}>
                        Se Connecter
                    </PrimaryButton>

                    <Link
                        href={route('visitor.schools')}
                        className="w-full text-center py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 font-black uppercase text-[10px] sm:text-xs tracking-wider hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
                        style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                    >
                        Explorer les Établissements (Visiteur)
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
