<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSuperAdminConsent
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role === 'super_admin') {
            $schoolId = $request->route('school')?->id ?? session('active_school_id');

            if ($schoolId) {
                $school = \App\Models\School::find($schoolId);
                if ($school && !$school->super_admin_consent) {
                    return back()->with('error', "Le Proviseur n'a pas encore donné son accord pour les modifications par le Super Admin.");
                }
            }
        }

        return $next($request);
    }
}
