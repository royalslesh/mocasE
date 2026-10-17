<?php
namespace App\Http\Controllers;

use App\Models\censeur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CenseurController extends Controller
{
    public function index()
    {
        $censeurs = censeur::all();
        return response()->json($censeurs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'telephone' => 'required|string',
            'contact' => 'required|string',
            'password' => 'required|string',
            'niveau' => 'required|string',
            'email' => 'required|email|unique:censeurs',
        ]);

        $censeur = new censeurs();
        $censeur->nom = $request->input('nom');
     
        $censeur->contact = $request->input('contact');
        $censeur->password = Hash::make($request->input('password'));
        $censeur->niveau = $request->input('role');
        $censeur->email = $request->input('email');
        $censeur->save();

        return response()->json($censeur, 201);
    }

    public function show($id)
    {
        $censeur = Censeur::find($id);
        if (!$censeur) {
            return response()->json(['error' => 'Censeur non trouvé'], 404);
        }
        return response()->json($censeur);
    }

    public function update(Request $request, $id)
    {
        $censeur = Censeur::find($id);
        if (!$censeur) {
            return response()->json(['error' => 'Censeur non trouvé'], 404);
        }

        $request->validate([
            'nom' => 'string',
            'telephone' => 'string',
            'contact' => 'string',
            'password' => 'string',
            'niveau' => 'string',
            'email' => 'email|unique:censeurs,email,' . $censeur->id,
        ]);

        if ($request->has('password')) {
            $censeur->password = Hash::make($request->input('password'));
        }

        $censeur->update($request->except('password'));

        return response()->json($censeur);
    }

    public function destroy($id)
    {
        $censeur = Censeur::find($id);
        if (!$censeur) {
            return response()->json(['error' => 'Censeur non trouvé'], 404);
        }
        $censeur->delete();

        return response()->json(['message' => 'Censeur supprimé avec succès']);
    }
}


