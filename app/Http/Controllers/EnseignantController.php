<?php




namespace App\Http\Controllers;

use App\Models\Enseignant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EnseignantController extends Controller
{
    public function index()
    {
        $enseignants = Enseignant::all();
        return response()->json($enseignants);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:enseignants',
            'contact' => 'required|string',
            'password' => 'required|string',
            'matiere_id' => 'required|exists:matieres,id',
        ]);

        $enseignant = new Enseignant();
        $enseignant->nom = $request->input('nom');
        $enseignant->prenom = $request->input('prenom');
        $enseignant->email = $request->input('email');
        $enseignant->contact = $request->input('contact');
        $enseignant->password = Hash::make($request->input('password'));
        $enseignant->matiere_id = $request->input('matiere_id');
        $enseignant->save();

        return response()->json($enseignant, 201);
    }

    public function show($id)
    {
        $enseignant = Enseignant::find($id);
        if (!$enseignant) {
            return response()->json(['error' => 'Enseignant non trouvé'], 404);
        }
        return response()->json($enseignant);
    }

    public function update(Request $request, $id)
    {
        $enseignant = Enseignant::find($id);
        if (!$enseignant) {
            return response()->json(['error' => 'Enseignant non trouvé'], 404);
        }

        $request->validate([
            'nom' => 'string',
            'prenom' => 'string',
            'email' => 'email|unique:enseignants,email,' . $enseignant->id,
            'contact' => 'string',
            'password' => 'string',
            'matiere_id' => 'exists:matieres,id',
        ]);

        if ($request->has('password')) {
            $enseignant->password = Hash::make($request->input('password'));
        }

        $enseignant->update($request->except('password'));

        return response()->json($enseignant);
    }

    public function destroy($id)
    {
        $enseignant = Enseignant::find($id);
        if (!$enseignant) {
            return response()->json(['error' => 'Enseignant non trouvé'], 404);
        }
        $enseignant->delete();

        return response()->json(['message' => 'Enseignant supprimé avec succès']);
    }
}

