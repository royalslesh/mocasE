<?php
// app/Models/eleve.php

namespace App\Models;

use Illuminate\Database\eloquent\Factories\HasFactory;
use Illuminate\Database\eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Bulletin extends Model
{
    use HasFactory;

    protected $fillable = [
        'eleve_id',
        'classe_id',
        'date',
        'enseignant_princip',
        'moyenne',
    ];

    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function enseignant()
    {
        return $this->belongsTo(Enseignant::class, 'enseignant_princip', 'id');
    }
}
