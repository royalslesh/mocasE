<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                \Illuminate\Validation\Rule::unique(\App\Models\User::class)->ignore($user->id),
                function ($attribute, $value, $fail) use ($user) {
                    if (strtolower(trim($value)) === strtolower(trim($user->email))) {
                        $fail("Vous ne pouvez pas changer de mot de passe sans changer d'adresse email. Veuillez renseigner une nouvelle adresse email différente de votre adresse actuelle.");
                    }
                },
            ],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ], [
            'email.required' => "La nouvelle adresse email est obligatoire pour changer de mot de passe.",
            'email.email' => "Le format de la nouvelle adresse email est invalide.",
            'email.unique' => "Cette adresse email est déjà utilisée par un autre compte.",
            'current_password.required' => "Le mot de passe actuel est obligatoire.",
            'current_password.current_password' => "Le mot de passe actuel saisi est incorrect.",
            'password.required' => "Le nouveau mot de passe est obligatoire.",
            'password.confirmed' => "La confirmation du nouveau mot de passe ne correspond pas.",
        ]);

        $user->forceFill([
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => null,
        ])->save();

        return back()->with('success', 'Votre mot de passe et votre adresse email ont été mis à jour avec succès.');
    }
}
