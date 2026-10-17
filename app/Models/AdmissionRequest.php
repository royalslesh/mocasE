<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdmissionRequest extends Model
{
    protected $fillable = [
        'school_id',
        'level_id',
        'nom_eleve',
        'prenom_eleve',
        'date_naissance',
        'sexe',
        'nom_parent',
        'contact_parent',
        'status',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }
}