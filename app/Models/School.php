<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = [
        'name',
        'is_active',
        'sections_config',
        'proviseur_id',
        'adjoint_id',
        'theme_color',
        'city',
        'contacts',
        'description',
        'logo_path',
        'code',
        'region',
        'departement',
        'super_admin_consent',
        'academic_year',
        'passing_grade',
        'repeat_grade',
        'enrollments_open',
        'is_grades_submission_open',
        'is_report_cards_visible',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sections_config' => 'array',
        'super_admin_consent' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function proviseur()
    {
        return $this->belongsTo(User::class, 'proviseur_id');
    }

    public function adjoint()
    {
        return $this->belongsTo(User::class, 'adjoint_id');
    }

    public function classes()
    {
        return $this->hasMany(Classe::class);
    }

    public function histories()
    {
        return $this->hasMany(AcademicYearHistory::class)->orderBy('created_at', 'desc');
    }
}
