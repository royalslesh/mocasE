<?php
// app/Http/Controllers/NoteController.php

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Note;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->can('view_notes')) {
            // L'utilisateur a la permission de voir les notes
            $notes = Note::all();
            return view('notes.index', compact('notes'));
        } else {
            // L'utilisateur n'a pas la permission de voir les notes
            return redirect()->route('home')->with('error', 'Vous n\'avez pas la permission de voir les notes.');
        }
    }

    public function create(Request $request)
    {
        if ($request->user()->can('fill_notes')) {
                                                                 
            return view('notes.create');
        } else {
                                                                       
            return redirect()->route('home')->with('error', 'Vous n\'avez pas la permission de remplir les notes.');
        }
    }

    public function edit(Request $request, Note $note)
    {
        if ($request->user()->can('edit_notes')) {
            // L'utilisateur a la permission de modifier les notes
            return view('notes.edit', compact('note'));
        } else {
            // L'utilisateur n'a pas la permission de modifier les notes
            return redirect()->route('home')->with('error', 'Vous n\'avez pas la permission de modifier les notes.');
        }
    }
}

