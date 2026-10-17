<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    protected $fillable = ['name', 'section', 'order', 'school_id', 'censeur_id', 'surveillant_id'];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function censeur()
    {
        return $this->belongsTo(User::class, 'censeur_id');
    }

    public function surveillant()
    {
        return $this->belongsTo(User::class, 'surveillant_id');
    }

    public function classes()
    {
        return $this->hasMany(Classe::class, 'level_id');
    }
}
