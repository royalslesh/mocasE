<?php
// app/Models/Eleve.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class trimestre extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'note',
        'eleve_id',
        'matiere_id',
        'coef',
        'classe_id',
        'trimestre',
        'mension',
    ];
}
