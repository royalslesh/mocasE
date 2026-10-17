<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ce middleware garantit qu'un utilisateur ne peut accéder
 * qu'aux ressources de son propre établissement.
 *
 * Il intercepte les paramètres de route courants (classe, eleve, matiere,
 * level, user, grade, etc.) et vérifie que leur school_id correspond
 * bien au school_id de l'utilisateur connecté.
 *
 * Le super_admin et les admins gérant une école via session sont exemptés.
 */
class EnsureSchoolIsolation
{
    /**
     * Les noms des paramètres de route à vérifier avec leur colonne school_id.
     */
    protected array $routeModels = [
        'classe'   => \App\Models\Classe::class,
        'eleve'    => \App\Models\Eleve::class,
        'level'    => \App\Models\Level::class,
        'matiere'  => \App\Models\Matiere::class,
        'grade'    => \App\Models\Grade::class,
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Super admin est toujours exempt
        if (!$user || $user->role === 'super_admin') {
            return $next($request);
        }

        $userSchoolId = $user->school_id;

        // Vérifier chaque paramètre de route modèle connu
        foreach ($this->routeModels as $paramName => $modelClass) {
            $routeParam = $request->route($paramName);

            if (!$routeParam) continue;

            // Peut être un objet (route model binding) ou un ID
            $model = is_object($routeParam)
                ? $routeParam
                : $modelClass::find($routeParam);

            if ($model && isset($model->school_id) && $model->school_id != $userSchoolId) {
                abort(403, 'Accès refusé : cette ressource appartient à un autre établissement.');
            }
        }

        // Vérifier aussi si l'utilisateur cible dans les routes "staff" appartient
        // au même établissement (ex: /staff/{user}/password)
        $targetUser = $request->route('user');
        if ($targetUser) {
            $targetModel = is_object($targetUser)
                ? $targetUser
                : \App\Models\User::find($targetUser);

            if ($targetModel && isset($targetModel->school_id) && $targetModel->school_id != $userSchoolId) {
                abort(403, 'Accès refusé : ce membre du personnel appartient à un autre établissement.');
            }
        }

        return $next($request);
    }
}
