<?php
namespace App\Http\Controllers;

use App\Models\Matiere;
use Illuminate\Http\Request;

class MatiereController extends Controller
{
    public function index()
    {
        $matieres = Matiere::all();
        return response()->json($matieres);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
        ]);

        $matiere = new Matiere();
        $matiere->nom = $request->input('nom');
        $matiere->save();

        return response()->json($matiere, 201);
    }

    public function show($id)
    {
        $matiere = Matiere::find($id);
        if (!$matiere) {
            return response()->json(['error' => 'matière non trouvée'], 404);
        }
        return response()->json($matiere);
    }

    public function update(Request $request, $id)
    {
        $matiere = Matiere::find($id);
        if (!$matiere) {
            return response()->json(['error' => 'matière non trouvée'], 404);
        }

        $request->validate([
            'nom' => 'string',
        ]);

        $matiere->update($request->all());

        return response()->json($matiere);
    }

    public function destroy($id)
    {
        $matiere = Matiere::find($id);
        if (!$matiere) {
            return response()->json(['error' => 'matière non trouvée'], 404);
        }
        $matiere->delete();

        return response()->json(['message' => 'matière supprimée avec succès']);
    }
}