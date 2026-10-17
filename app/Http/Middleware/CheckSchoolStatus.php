<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSchoolStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Super Admin is ALWAYS exempt from any blocking - they control the system
        if ($user && $user->role === 'super_admin') {
            return $next($request);
        }

        // Check if the user's school is active (school-level block by super admin)
        if ($user && $user->school_id) {
            $school = \App\Models\School::find($user->school_id);
            if ($school && !$school->is_active) {
                auth()->logout();
                return redirect()->route('login')->with('error', 'Votre établissement est temporairement suspendu. Contactez l\'administrateur.');
            }
        }

        // Check if user's personal account is blocked
        if ($user && $user->status === 'blocked') {
            auth()->logout();
            return redirect()->route('login')->with('error', 'Votre compte a été bloqué. Contactez votre Proviseur.');
        }

        return $next($request);
    }
}
