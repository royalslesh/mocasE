<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherAssignment extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'subject_id', 'classe_id', 'school_id'];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function subject()
    {
        return $this->belongsTo(Matiere::class, 'subject_id');
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class, 'classe_id');
    }
}
