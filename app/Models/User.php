<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    const ROLE_SUPER_ADMIN = 'super_admin';
    const ROLE_PROVISEUR = 'proviseur';
    const ROLE_CENSEUR = 'censeur';
    const ROLE_ENSEIGNANT = 'enseignant';
    const ROLE_ETUDIANT = 'etudiant';
    const ROLE_VISITEUR = 'visiteur';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'school_id',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isSuperAdmin()
    {
        return $this->role === self::ROLE_SUPER_ADMIN;
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function levelsControlled()
    {
        return $this->hasMany(Level::class, 'censeur_id');
    }

    public function teacherAssignments()
    {
        return $this->hasMany(\App\Models\TeacherAssignment::class);
    }

    public function isBlocked()
    {
        return $this->status === 'blocked';
    }

    protected static function booted()
    {
        static::deleting(function ($user) {
            if ($user->role === self::ROLE_SUPER_ADMIN) {
                throw new \Exception("Le profil Super Administrateur ne peut jamais être supprimé.");
            }
        });
    }
}
