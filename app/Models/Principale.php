<?php
// app/Models/Eleve.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class principal extends Authentificable
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'role',
        'e-mail',
        'contact',
     'password',
    ];
}
