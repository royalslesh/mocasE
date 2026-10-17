<?php
// app/Models/Eleve.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\schema;

class censeur extends Model

{
    use HasFactory;
    

    protected $fillable = [
        'nom',
        'email',
        'contact',
        'role',
         'password',
        
    ];
}
