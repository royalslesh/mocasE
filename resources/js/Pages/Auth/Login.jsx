import { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
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

            <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                        Portail Sécurisé
                    </span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Connexion
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                    Accédez à votre espace administratif et pédagogique
                </p>
            </div>

            {status && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2 px-1"
                    >
                        Adresse Email
                    </label>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            autoFocus
                            placeholder="exemple@mocase.cm"
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-[#0c120f] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:bg-white dark:focus:bg-[#121a15] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition-all outline-none"
                            required
                        />
                    </div>

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                        <label
                            htmlFor="password"
                            className="text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                        >
                            Mot de Passe
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                                Mot de passe oublié ?
                            </Link>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            placeholder="••••••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full pl-10 pr-11 py-3 sm:py-3.5 bg-slate-50 dark:bg-[#0c120f] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:bg-white dark:focus:bg-[#121a15] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition-all outline-none"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            tabIndex="-1"
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded-lg text-emerald-600 focus:ring-emerald-500/20"
                        />
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                            Rester connecté
                        </span>
                    </label>
                </div>

                {/* Actions */}
                <div className="pt-3 space-y-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 sm:py-4 px-6 rounded-2xl text-white font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Connexion en cours...
                            </>
                        ) : (
                            <>
                                <span>Se Connecter</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </button>

                    <Link
                        href={route('visitor.schools')}
                        className="w-full block text-center py-3 sm:py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-emerald-500 dark:hover:border-emerald-500/50 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] bg-white/50 dark:bg-transparent"
                    >
                        Explorer les Établissements
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
