<?php
// app/Models/enseignants.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enseignant extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'matière',
        'contacte',
        'e-mail',
        'matière_id',
        'password',

    ];
    public function classes()
    {
        return $this->belongsToMany(Classe::class);
    }

    public function bulletins()
    {
        return $this->hasMany(Bulletin::class, 'enseignant_princip', 'id');
    }
}
