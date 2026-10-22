import { createContext, useContext, useState, useEffect } from 'react';

const ModalContext = createContext({
    confirm: () => Promise.resolve(false),
    notify: () => {},
});

export const useModernModal = () => useContext(ModalContext);

export function ModernModalProvider({ children }) {
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'confirm', // 'confirm' | 'danger' | 'info' | 'success'
        confirmText: 'Confirmer',
        cancelText: 'Annuler',
        resolve: null,
    });

    const [toast, setToast] = useState(null);

    const confirm = ({
        title = 'Confirmation',
        message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
        type = 'confirm',
        confirmText = 'Confirmer',
        cancelText = 'Annuler',
    }) => {
        return new Promise((resolve) => {
            setModalState({
                isOpen: true,
                title,
                message,
                type,
                confirmText,
                cancelText,
                resolve,
            });
        });
    };

    const notify = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleConfirm = () => {
        if (modalState.resolve) modalState.resolve(true);
        setModalState((prev) => ({ ...prev, isOpen: false }));
    };

    const handleCancel = () => {
        if (modalState.resolve) modalState.resolve(false);
        setModalState((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <ModalContext.Provider value={{ confirm, notify }}>
            {children}

            {/* Modale interactive ultra-moderne avec backdrop glassmorphic */}
            {modalState.isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div 
                        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity" 
                        onClick={handleCancel}
                    />

                    <div className="relative w-full max-w-md bg-white dark:bg-[#111815] border border-gray-100 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 overflow-hidden">
                        {/* Glow color background */}
                        <div 
                            className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-30 ${
                                modalState.type === 'danger' ? 'bg-red-500' : 'bg-emerald-500'
                            }`}
                        />

                        {/* Icon Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                                modalState.type === 'danger'
                                    ? 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                                    : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                            }`}>
                                {modalState.type === 'danger' ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                                    {modalState.title}
                                </h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Attention requise</p>
                            </div>
                        </div>

                        {/* Message */}
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                            {modalState.message}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                            >
                                {modalState.cancelText}
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all active:scale-95 ${
                                    modalState.type === 'danger'
                                        ? 'bg-red-600 hover:bg-red-700 shadow-red-500/25'
                                        : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                                }`}
                            >
                                {modalState.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast flottant haute fidélité */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-[250] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/95 dark:bg-[#111915]/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-300">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                        {toast.type === 'error' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                        )}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{toast.message}</span>
                </div>
            )}
        </ModalContext.Provider>
    );
}
