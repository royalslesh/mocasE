import React, { useState, useEffect, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';

// Système d'événements léger et découplé
const listeners = new Set();
let toastCount = 0;

function notifyListeners(toasts) {
    listeners.forEach((listener) => listener(toasts));
}

let activeToasts = [];

export const toast = {
    show(options) {
        const id = options.id || `toast-${Date.now()}-${++toastCount}`;
        const duration = options.duration !== undefined
            ? options.duration
            : options.type === 'error'
                ? 6000
                : options.type === 'loading'
                    ? Infinity
                    : options.type === 'warning'
                        ? 5000
                        : 4000;

        const newToast = {
            id,
            type: options.type || 'info',
            title: options.title,
            message: options.message || '',
            duration,
            isClosing: false,
            createdAt: Date.now(),
        };

        // Si un toast avec le même id existe déjà, le mettre à jour sans scintillement
        const existingIdx = activeToasts.findIndex((t) => t.id === id);
        if (existingIdx !== -1) {
            activeToasts = activeToasts.map((t, idx) => (idx === existingIdx ? { ...t, ...newToast, isClosing: false } : t));
        } else {
            // Limiter à 5 toasts simultanés max pour éviter l'encombrement
            activeToasts = [...activeToasts.slice(-4), newToast];
        }

        notifyListeners(activeToasts);
        return id;
    },

    success(message, options = {}) {
        return this.show({
            ...options,
            type: 'success',
            title: options.title || 'Succès',
            message,
        });
    },

    error(message, options = {}) {
        return this.show({
            ...options,
            type: 'error',
            title: options.title || 'Échec de l\'opération',
            message,
        });
    },

    loading(message, options = {}) {
        return this.show({
            ...options,
            type: 'loading',
            title: options.title || 'Action en cours',
            message: message || 'Veuillez patienter...',
            duration: options.duration || Infinity,
        });
    },

    warning(message, options = {}) {
        return this.show({
            ...options,
            type: 'warning',
            title: options.title || 'Attention',
            message,
        });
    },

    info(message, options = {}) {
        return this.show({
            ...options,
            type: 'info',
            title: options.title || 'Information',
            message,
        });
    },

    update(id, options = {}) {
        const existing = activeToasts.find((t) => t.id === id);
        if (!existing) return;
        return this.show({ ...existing, ...options, id });
    },

    dismiss(id) {
        if (!id) {
            // Fermer tous les toasts
            activeToasts = activeToasts.map((t) => ({ ...t, isClosing: true }));
            notifyListeners(activeToasts);
            setTimeout(() => {
                activeToasts = [];
                notifyListeners(activeToasts);
            }, 300);
            return;
        }

        // Marquer comme fermant pour l'animation de sortie
        activeToasts = activeToasts.map((t) => (t.id === id ? { ...t, isClosing: true } : t));
        notifyListeners(activeToasts);

        setTimeout(() => {
            activeToasts = activeToasts.filter((t) => t.id !== id);
            notifyListeners(activeToasts);
        }, 300);
    },

    /**
     * Enveloppe une promesse pour afficher automatiquement loading -> success / error
     */
    async promise(promiseOrAsyncFn, { loading = 'Traitement en cours...', success = 'Action réussie !', error = 'Une erreur est survenue' } = {}) {
        const id = this.loading(loading);
        try {
            const result = typeof promiseOrAsyncFn === 'function' ? await promiseOrAsyncFn() : await promiseOrAsyncFn;
            const successMsg = typeof success === 'function' ? success(result) : success;
            this.update(id, {
                type: 'success',
                title: 'Succès',
                message: successMsg,
                duration: 4000,
            });
            return result;
        } catch (err) {
            const errorMsg = typeof error === 'function' ? error(err) : (err?.message || error);
            this.update(id, {
                type: 'error',
                title: 'Échec',
                message: errorMsg,
                duration: 6000,
            });
            throw err;
        }
    },
};

// Injection globale sur window pour un accès direct
if (typeof window !== 'undefined') {
    window.toast = toast;
}

// Hook React pour composants fonctionnels
export function useToast() {
    return toast;
}

// Composant barre de décompte animé
function ToastProgressBar({ duration, isPaused, onComplete, colorClass }) {
    const [progress, setProgress] = useState(100);
    const remainingRef = useRef(duration);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        if (!duration || duration === Infinity) return;

        let lastTime = Date.now();

        const step = () => {
            if (!isPaused) {
                const now = Date.now();
                const delta = now - lastTime;
                remainingRef.current = Math.max(0, remainingRef.current - delta);
                setProgress((remainingRef.current / duration) * 100);

                if (remainingRef.current <= 0) {
                    onComplete();
                    return;
                }
            }
            lastTime = Date.now();
            animationFrameRef.current = requestAnimationFrame(step);
        };

        animationFrameRef.current = requestAnimationFrame(step);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [duration, isPaused, onComplete]);

    if (!duration || duration === Infinity) {
        return (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden bg-sky-500/10">
                <div className="w-full h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-400 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden bg-black/5 dark:bg-white/5">
            <div
                className={`h-full transition-all duration-75 ease-linear ${colorClass}`}
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
        </div>
    );
}

// Carte de notification individuelle avec design ultra-moderne
function ToastCard({ toast: t, onDismiss }) {
    const [isPaused, setIsPaused] = useState(false);

    // Définitions de style selon le type avec code couleur haute précision
    const config = {
        success: {
            title: t.title || 'Succès',
            border: 'border-emerald-500/30 dark:border-emerald-500/40',
            bg: 'bg-white/95 dark:bg-[#0a1610]/95',
            glow: 'shadow-[0_16px_45px_-8px_rgba(16,185,129,0.30)]',
            iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
            titleColor: 'text-emerald-600 dark:text-emerald-400',
            progressColor: 'bg-gradient-to-r from-emerald-500 to-teal-400',
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
            ),
        },
        error: {
            title: t.title || 'Échec de l\'opération',
            border: 'border-rose-500/30 dark:border-rose-500/40',
            bg: 'bg-white/95 dark:bg-[#1a0c0e]/95',
            glow: 'shadow-[0_16px_45px_-8px_rgba(244,63,94,0.30)]',
            iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25 shadow-[0_0_15px_rgba(244,63,94,0.25)]',
            titleColor: 'text-rose-600 dark:text-rose-400',
            progressColor: 'bg-gradient-to-r from-rose-500 to-red-500',
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
        },
        loading: {
            title: t.title || 'Action en cours',
            border: 'border-sky-500/30 dark:border-sky-500/40',
            bg: 'bg-white/95 dark:bg-[#0a141e]/95',
            glow: 'shadow-[0_16px_45px_-8px_rgba(14,165,233,0.30)]',
            iconBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25 shadow-[0_0_15px_rgba(14,165,233,0.25)]',
            titleColor: 'text-sky-600 dark:text-sky-400',
            progressColor: 'bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-400',
            icon: (
                <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                    <svg className="animate-spin w-5 h-5 text-sky-500" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="absolute w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                </div>
            ),
        },
        warning: {
            title: t.title || 'Attention',
            border: 'border-amber-500/30 dark:border-amber-500/40',
            bg: 'bg-white/95 dark:bg-[#1a140a]/95',
            glow: 'shadow-[0_16px_45px_-8px_rgba(245,158,11,0.30)]',
            iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
            titleColor: 'text-amber-600 dark:text-amber-400',
            progressColor: 'bg-gradient-to-r from-amber-500 to-orange-400',
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
        },
        info: {
            title: t.title || 'Information',
            border: 'border-indigo-500/30 dark:border-indigo-500/40',
            bg: 'bg-white/95 dark:bg-[#0e121d]/95',
            glow: 'shadow-[0_16px_45px_-8px_rgba(99,102,241,0.30)]',
            iconBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 shadow-[0_0_15px_rgba(99,102,241,0.25)]',
            titleColor: 'text-indigo-600 dark:text-indigo-400',
            progressColor: 'bg-gradient-to-r from-indigo-500 to-blue-400',
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    };

    const cur = config[t.type] || config.info;

    return (
        <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={`
                group relative pointer-events-auto overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 ease-out
                ${cur.bg} ${cur.border} ${cur.glow}
                ${t.isClosing
                    ? 'opacity-0 translate-x-8 scale-95 pointer-events-none'
                    : 'opacity-100 translate-x-0 scale-100 animate-in slide-in-from-top-3 sm:slide-in-from-right-4 duration-300'
                }
                w-full sm:max-w-sm md:max-w-md p-4
            `}
            role="status"
            aria-live="polite"
        >
            <div className="flex items-start gap-3.5">
                {/* Icône avec badge lumineux */}
                <div className={`p-2.5 rounded-xl shrink-0 ${cur.iconBg}`}>
                    {cur.icon}
                </div>

                {/* Contenu textuel */}
                <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[11px] font-black uppercase tracking-wider ${cur.titleColor}`}>
                            {cur.title}
                        </span>
                        {t.type === 'loading' && (
                            <span className="inline-flex h-2 w-2 rounded-full bg-sky-400 animate-ping" />
                        )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug break-words">
                        {t.message}
                    </p>
                </div>

                {/* Bouton Fermer X */}
                <button
                    onClick={() => onDismiss(t.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none"
                    aria-label="Fermer la notification"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Barre de défilement temporelle */}
            <ToastProgressBar
                duration={t.duration}
                isPaused={isPaused}
                onComplete={() => onDismiss(t.id)}
                colorClass={cur.progressColor}
            />
        </div>
    );
}

// Conteneur principal des toasts
export default function ToastContainer() {
    const [toasts, setToasts] = useState(activeToasts);
    const page = usePage();
    const flash = page?.props?.flash;
    const errors = page?.props?.errors;
    const lastFlashRef = useRef(null);
    const lastErrorsRef = useRef(null);

    // Écoute les modifications de la file de toasts
    useEffect(() => {
        listeners.add(setToasts);
        return () => listeners.delete(setToasts);
    }, []);

    // Détection automatique des messages flash Inertia
    useEffect(() => {
        if (!flash) return;

        const flashSig = JSON.stringify({
            s: flash.success,
            e: flash.error,
            w: flash.warning,
            i: flash.info,
        });

        if (flashSig === lastFlashRef.current) return;
        lastFlashRef.current = flashSig;

        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        if (flash.warning) {
            toast.warning(flash.warning);
        }
        if (flash.info) {
            toast.info(flash.info);
        }
    }, [flash]);

    // Détection automatique des erreurs de validation globales
    useEffect(() => {
        if (!errors || Object.keys(errors).length === 0) return;

        const errorsSig = JSON.stringify(errors);
        if (errorsSig === lastErrorsRef.current) return;
        lastErrorsRef.current = errorsSig;

        const firstKey = Object.keys(errors)[0];
        const errorMsg = errors[firstKey];
        if (errorMsg && typeof errorMsg === 'string') {
            toast.error(errorMsg, { title: 'Erreur de saisie' });
        }
    }, [errors]);

    // Écoute des requêtes longues via le routeur Inertia pour afficher automatiquement l'état "en cours"
    useEffect(() => {
        let loadingTimer = null;
        let autoLoadingId = null;

        const removeStart = router.on('start', (event) => {
            const method = event.detail.visit.method?.toLowerCase();
            // N'activer le popup de chargement automatique que pour les actions modifiant des données (POST, PUT, DELETE, PATCH)
            if (method && method !== 'get') {
                loadingTimer = setTimeout(() => {
                    autoLoadingId = toast.loading('Opération en cours d\'exécution...', {
                        title: 'Traitement en cours',
                    });
                }, 400);
            }
        });

        const removeFinish = router.on('finish', () => {
            if (loadingTimer) {
                clearTimeout(loadingTimer);
                loadingTimer = null;
            }
            if (autoLoadingId) {
                toast.dismiss(autoLoadingId);
                autoLoadingId = null;
            }
        });

        return () => {
            removeStart();
            removeFinish();
            if (loadingTimer) clearTimeout(loadingTimer);
        };
    }, []);

    if (toasts.length === 0) return null;

    return (
        <aside
            aria-label="Notifications"
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[99999] pointer-events-none flex flex-col gap-3 max-w-[calc(100vw-2rem)] sm:max-w-md w-full"
        >
            {toasts.map((t) => (
                <ToastCard key={t.id} toast={t} onDismiss={(id) => toast.dismiss(id)} />
            ))}
        </aside>
    );
}
