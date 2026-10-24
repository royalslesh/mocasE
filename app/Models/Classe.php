<?php
// app/Models/classes.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'niveau',
        'section',
        'censeur_id',
        'level_id',
        'school_id',
        'filiere_id',
        'code',
        'seq1_auth',
        'seq2_auth',
        'seq3_auth',
        'seq4_auth',
        'seq5_auth',
        'seq6_auth',
        'principal_teacher_id',
        'annee_academique',
        'capacity',
        'next_classe_id',
    ];

    public function nextClasse()
    {
        return $this->belongsTo(Classe::class, 'next_classe_id');
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function professeurPrincipal()
    {
        return $this->belongsTo(User::class, 'principal_teacher_id');
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function matieres()
    {
        return $this->belongsToMany(Matiere::class, 'matiere_classe')->withPivot('coefficient')->withTimestamps();
    }

    public function eleves()
    {
        return $this->hasMany(Eleve::class, 'classe_id');
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function enseignants()
    {
        return $this->belongsToMany(Enseignant::class);
    }

    public function bulletins()
    {
        return $this->hasMany(Bulletin::class);
    }
    public function timetables()
    {
        return $this->hasMany(Timetable::class)->orderBy('order');
    }
}