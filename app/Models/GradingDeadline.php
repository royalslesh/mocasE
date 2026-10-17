<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradingDeadline extends Model
{
    protected $fillable = [
        'school_id',
        'sequence',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}