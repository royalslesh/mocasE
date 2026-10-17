<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\SchoolSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolSettingController extends Controller
{
    public function edit()
    {
        return Inertia::render('Settings/Edit', [
            'settings' => SchoolSetting::pluck('value', 'key')->toArray(),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'school_name' => 'required|string|max:255',
        ]);

        foreach ($data as $key => $value) {
            SchoolSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return redirect()->back()->with('message', 'Paramètres mis à jour avec succès !');
    }
}
