<?php
// app/Models/Eleve.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Eleve extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'date_naissance',
        'lieu_naissance',
        'section',
        'classe_id',
        'school_id',
        'classe',
        'MATRICULE',
        'photo_path',
        'sexe',
        'parent_phone',
        'parent_name',
        'adresse',
        'moy1',
        'rang1',
        'moy2',
        'rang2',
        'moy3',
        'rang3',
        'moy_annuelle',
        'rang_annuel',
        'decision_passage',
        'decision_override',
        'statut',
        'next_classe_id',
        'is_redoublant',
    ];

    protected $appends = ['photo_url'];

    public function getPhotoUrlAttribute(): ?string
    {
        if (empty($this->photo_path)) {
            return null;
        }

        if (str_starts_with($this->photo_path, 'http://') || str_starts_with($this->photo_path, 'https://')) {
            return $this->photo_path;
        }

        $clean = ltrim(preg_replace('#^storage/#', '', $this->photo_path), '/');
        return asset('storage/' . $clean);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class, 'classe_id');
    }

    public function nextClasse()
    {
        return $this->belongsTo(Classe::class, 'next_classe_id');
    }

    public function notes()
    {
        return $this->hasMany(Note::class);
    }
    
    public function disciplineRecords()
    {
        return $this->hasMany(DisciplineRecord::class);
    }

    /**
     * Calcule le total cumulé des heures d'absences de l'élève
     */
    public function getTotalAbsences(?int $sequence = null): int
    {
        $query = $this->disciplineRecords()->where('type', 'absence');
        if ($sequence !== null) {
            $query->where('sequence', $sequence);
        }
        return (int) $query->sum('valeur');
    }

    /**
     * Vérifie et applique l'exclusion automatique dès 30h d'absences
     */
    public function checkExclusionStatus(): bool
    {
        $totalAbsences = $this->getTotalAbsences();
        if ($totalAbsences >= 30 && $this->statut !== 'exclu') {
            $this->update(['statut' => 'exclu']);
            return true;
        }
        return $this->statut === 'exclu';
    }

    public function isExcluded(): bool
    {
        return $this->statut === 'exclu';
    }
}
