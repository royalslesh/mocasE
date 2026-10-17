<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DisciplineRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'eleve_id',
        'school_id',
        'user_id',
        'type',
        'valeur',
        'motif',
        'date_incident',
        'sequence',
    ];

    protected $casts = [
        'date_incident' => 'date',
        'valeur' => 'integer',
        'sequence' => 'integer',
    ];

    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
