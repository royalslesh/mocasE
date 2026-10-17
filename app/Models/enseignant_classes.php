<?php
// app/Models/Eleve.php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class enseignant_classes extends pivot
{
   

    protected $fillable = [
   
        'classe_id',
       
        'enseignant_id',
       
    ];
}
