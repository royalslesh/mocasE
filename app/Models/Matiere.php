<?php
// app/Models/Eleve.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'attribut',
        'coef',
        'categori',
        'school_id'
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function classes()
    {
        return $this->belongsToMany(Classe::class, 'matiere_classe')->withPivot('coefficient')->withTimestamps();
    }
}
