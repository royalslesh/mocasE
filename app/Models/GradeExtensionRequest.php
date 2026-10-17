<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeExtensionRequest extends Model
{
    protected $fillable = [
        'user_id',
        'school_id',
        'classe_id',
        'subject_id',
        'sequence',
        'status',
        'reason',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function subject()
    {
        return $this->belongsTo(Matiere::class, 'subject_id');
    }
}