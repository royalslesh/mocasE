<?php
namespace App\Http\Controllers;

use App\Models\Bulletin;
use Illuminate\Http\Request;

class BulletinController extends Controller
{
    public function index()
    {
        $bulletins = Bulletin::all();
        return response()->json($bulletins);
    }

    public function store(Request $request)
    {
        $request->validate([
            'moyenne' => 'required|numeric',
            'date' => 'required|date',
            'enseignant_id' => 'required|exists:enseignants,id',
            'principal_id' => 'required|exists:principals,id',
            'eleve_id' => 'required|exists:eleves,id',
            'classe_id' => 'required|exists:classes,id',
        ]);

        $bulletin = new Bulletin();
        $bulletin->moyenne = $request->input('moyenne');
        $bulletin->date = $request->input('date');
        $bulletin->enseignant_id = $request->input('enseignant_id');
        $bulletin->principal_id = $request->input('principal_id');
        $bulletin->eleve_id = $request->input('eleve_id');
        $bulletin->classe_id = $request->input('classe_id');
        $bulletin->save();

        return response()->json($bulletin, 201);
    }

    public function show($id)
    {
        $bulletin = Bulletin::find($id);
        if (!$bulletin) {
            return response()->json(['error' => 'Bulletin non trouvé'], 404);
        }
        return response()->json($bulletin);
    }

    public function update(Request $request, $id)
    {
        $bulletin = Bulletin::find($id);
        if (!$bulletin) {
            return response()->json(['error' => 'Bulletin non trouvé'], 404);
        }

        $request->validate([
            'moyenne' => 'numeric',
            'date' => 'date',
            'enseignant_id' => 'exists:enseignants,id',
            'principal_id' => 'exists:principals,id',
            'eleve_id' => 'exists:eleves,id',
            'classe_id' => 'exists:classes,id',
        ]);

        $bulletin->update($request->all());

        return response()->json($bulletin);
    }

    public function destroy($id)
    {
        $bulletin = Bulletin::find($id);
        if (!$bulletin) {
            return response()->json(['error' => 'Bulletin non trouvé'], 404);
        }
        $bulletin->delete();

        return response()->json(['message' => 'Bulletin supprimé avec succès']);
    }
}
