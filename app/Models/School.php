<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'motto',
        'is_active',
        'academic_year',
        'code',
        'passing_grade',
        'repeat_grade',
        'enrollments_open',
        'sections_config',
        'proviseur_id',
        'adjoint_id',
        'theme_color',
        'city',
        'region',
        'departement',
        'contacts',
        'description',
        'video_url',
        'logo_path',
        'cover_image_path',
        'gallery_images',
        'super_admin_consent',
        'is_grades_submission_open',
        'is_report_cards_visible',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'enrollments_open' => 'boolean',
        'sections_config' => 'array',
        'gallery_images' => 'array',
        'super_admin_consent' => 'boolean',
        'is_grades_submission_open' => 'boolean',
        'is_report_cards_visible' => 'boolean',
    ];

    protected $appends = [
        'logo_url',
        'cover_image_url',
    ];

    public function getLogoUrlAttribute(): ?string
    {
        if (!$this->logo_path) return null;
        if (str_starts_with($this->logo_path, 'http')) {
            return $this->logo_path;
        }
        return asset('storage/' . $this->logo_path);
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        if (!$this->cover_image_path) return null;
        if (str_starts_with($this->cover_image_path, 'http')) {
            return $this->cover_image_path;
        }
        return asset('storage/' . $this->cover_image_path);
    }

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

    public function eleves()
    {
        return $this->hasMany(Eleve::class);
    }

    public function matieres()
    {
        return $this->hasMany(Matiere::class);
    }

    public function histories()
    {
        return $this->hasMany(AcademicYearHistory::class)->orderBy('created_at', 'desc');
    }
}
