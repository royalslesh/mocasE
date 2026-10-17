import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="border-b border-gray-100 dark:border-white/5 pb-4">
                <h2 className="text-xl font-black text-red-600 dark:text-red-400 tracking-tight">
                    Zone de Danger — Suppression de Compte
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Une fois votre compte supprimé, l'ensemble de ses données et accès seront définitivement effacés de l'établissement.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="!rounded-xl !px-6 !py-3 !font-bold text-xs uppercase tracking-wider">
                Supprimer mon compte
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">
                        Confirmer la suppression de votre compte ?
                    </h2>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Cette action est irréversible. Veuillez saisir votre mot de passe pour confirmer la suppression définitive de votre compte.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Mot de passe de confirmation"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4 rounded-xl border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white"
                            isFocused
                            placeholder="Mot de passe"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal} className="!rounded-xl">
                            Annuler
                        </SecondaryButton>

                        <DangerButton className="!rounded-xl" disabled={processing}>
                            {processing ? 'Suppression...' : 'Supprimer définitivement'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
