<?php
// app/Http/Controllers/EleveController.php

namespace App\Http\Controllers;

use App\Models\Eleve;
use Illuminate\Http\Request;

class EleveController extends Controller
{
    public function index()
    {
        $eleves = Eleve::all();
        return response()->json($eleves);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'required|string',
            'classe' => 'required|string',
            'classe_id' => 'required|exists:classe,id',
        ]);

        $eleve = new Eleve();
        $eleve->nom = $request->input('nom');
        $eleve->prenom = $request->input('prenom');
        $eleve->date_naissance = $request->input('date_naissance');
        $eleve->lieu_naissance = $request->input('lieu_naissance');
        $eleve->classe = $request->input('classe');
        $eleve->classe_id = $request->input('classe_id');
        $eleve->save();

        return response()->json($eleve, 201);
    }

    public function show($id)
    {
        $eleve = Eleve::find($id);
        if (!$eleve) {
            return response()->json(['error' => 'Élève non trouvé'], 404);
        }
        return response()->json($eleve);
    }

    public function update(Request $request, $id)
    {
        $eleve = Eleve::find($id);
        if (!$eleve) {
            return response()->json(['error' => 'Élève non trouvé'], 404);
        }

        $request->validate([
            'nom' => 'string',
            'prenom' => 'string',
            'date_naissance' => 'date',
            'lieu_naissance' => 'string',
            'classe' => 'string',
            'classe_id' => 'exists:classe,id',
        ]);

        $eleve->update($request->all());

        return response()->json($eleve);
    }

    public function destroy($id)
    {
        $eleve = Eleve::find($id);
        if (!$eleve) {
            return response()->json(['error' => 'Élève non trouvé'], 404);
        }
        $eleve->delete();

        return response()->json(['message' => 'Élève supprimé avec succès']);
    }
}

