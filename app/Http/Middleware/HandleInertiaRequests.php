<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'school_id' => $request->user()->school_id,
                    'status' => $request->user()->status,
                ] : null,
            ],
            'active_school_id' => session('active_school_id'),
            'school_name' => function () use ($request) {
                if (session('active_school_name')) {
                    return session('active_school_name');
                }
                if ($request->user() && $request->user()->school_id) {
                    return \App\Models\School::find($request->user()->school_id)?->name ?? 'SLASH MOCAS';
                }
                return \App\Models\SchoolSetting::where('key', 'school_name')->value('value') ?? 'SLASH MOCAS';
            },
            'theme_color' => function () use ($request) {
                // If super admin is "managing" a school, use that school's theme
                if (session('active_school_name')) {
                    $school = \App\Models\School::where('name', session('active_school_name'))->first();
                    return $school?->theme_color ?? 'emerald';
                }
                // If user is staff/student, use their school theme
                if ($request->user() && $request->user()->school_id) {
                    return \App\Models\School::find($request->user()->school_id)?->theme_color ?? 'emerald';
                }
                return 'emerald';
            },
            'school_logo' => function () use ($request) {
                if (session('active_school_name')) {
                    $school = \App\Models\School::where('name', session('active_school_name'))->first();
                    return $school?->logo_path ? asset('storage/' . $school->logo_path) : null;
                }
                if ($request->user() && $request->user()->school_id) {
                    $school = \App\Models\School::find($request->user()->school_id);
                    return $school?->logo_path ? asset('storage/' . $school->logo_path) : null;
                }
                return null;
            },
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error'   => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'info'    => fn() => $request->session()->get('info'),
            ],
        ];
    }
}
