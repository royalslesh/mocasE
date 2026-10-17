<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYearHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'academic_year',
        'total_students',
        'total_passed',
        'total_repeated',
        'total_excluded',
        'success_rate',
        'classes_stats',
        'closed_at',
        'closed_by',
    ];

    protected $casts = [
        'classes_stats' => 'array',
        'closed_at'     => 'datetime',
        'success_rate'  => 'float',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function closedBy()
    {
        return $this->belongsTo(User::class, 'closed_by');
    }
}
