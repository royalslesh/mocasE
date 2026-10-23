<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = [
        'name',
        'motto',
        'is_active',
        'sections_config',
        'proviseur_id',
        'adjoint_id',
        'theme_color',
        'city',
        'contacts',
        'description',
        'video_url',
        'logo_path',
        'cover_image_path',
        'gallery_images',
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
        'gallery_images' => 'array',
    ];

    protected $appends = ['logo_url', 'cover_image_url'];

    public function getLogoUrlAttribute(): ?string
    {
        if (!$this->logo_path) {
            return null;
        }
        if (str_starts_with($this->logo_path, 'http')) {
            return $this->logo_path;
        }
        return asset('storage/' . ltrim($this->logo_path, '/'));
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        if (!$this->cover_image_path) {
            return null;
        }
        if (str_starts_with($this->cover_image_path, 'http')) {
            return $this->cover_image_path;
        }
        return asset('storage/' . ltrim($this->cover_image_path, '/'));
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

    public function histories()
    {
        return $this->hasMany(AcademicYearHistory::class)->orderBy('created_at', 'desc');
    }
}
