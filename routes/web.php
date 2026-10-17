<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VisitorController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SchoolSettingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SchoolBrandingController;
use App\Http\Controllers\ClasseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public / Visitor Routes
Route::get('/', [VisitorController::class, 'welcome'])->name('welcome');
Route::get('/schools', [VisitorController::class, 'schools'])->name('visitor.schools');
Route::get('/schools/{school}/details', [VisitorController::class, 'schoolDetails'])->name('visitor.schoolDetails');
Route::post('/schools/{school}/admission', [VisitorController::class, 'submitAdmission'])->name('visitor.admission');

Route::middleware(['auth', 'verified', 'school.isolate'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Super Admin Routes
    Route::middleware(['role:super_admin'])->group(function () {
        Route::get('/super-admin/schools', [SuperAdminController::class, 'index'])->name('superadmin.schools.index');
        Route::post('/super-admin/schools', [SuperAdminController::class, 'storeSchool'])->name('superadmin.schools.store');

        // These actions are ALWAYS available to Super Admin (regardless of consent):
        // - Suspending/unsuspending a school (toggle)
        // - Toggling consent status
        Route::post('/super-admin/schools/{school}/toggle', [SuperAdminController::class, 'toggleSchoolStatus'])->name('superadmin.schools.toggle');
        Route::post('/super-admin/schools/{school}/consent/toggle', [SuperAdminController::class, 'toggleSuperAdminConsent'])->name('superadmin.schools.consent.toggle');

        // These actions require the school's consent (manage dashboard & edit school info):
        Route::middleware(['consent'])->group(function () {
            Route::get('/super-admin/schools/{school}/manage', [SuperAdminController::class, 'manage'])->middleware('password.confirm')->name('superadmin.schools.manage');
            Route::patch('/super-admin/schools/{school}', [SuperAdminController::class, 'update'])->name('superadmin.schools.update');
        });
    });

    // Branding / Identity (Proviseur)
    Route::middleware(['role:proviseur'])->group(function () {
        Route::get('/my-school/branding', [SchoolBrandingController::class, 'edit'])->name('school.branding.edit');
        Route::post('/my-school/branding', [SchoolBrandingController::class, 'update'])->name('school.branding.update');
        Route::post('/my-school/consent/toggle', [SchoolBrandingController::class, 'toggleConsent'])->name('school.consent.toggle');
        
        // Academic Toggles
        Route::post('/my-school/academic/grades-toggle', [SchoolBrandingController::class, 'toggleGrades'])->name('school.academic.grades_toggle');
        Route::post('/my-school/academic/reports-toggle', [SchoolBrandingController::class, 'toggleReports'])->name('school.academic.reports_toggle');
    });

    // Options non disponibles -> Coming Soon
    Route::get('/settings', function () {
        return Inertia::render('ComingSoon');
    })->name('settings.edit');
    Route::get('/coming-soon', function () {
        return Inertia::render('ComingSoon');
    })->name('coming.soon');

    // Academic Management (Proviseur & Censeur)
    Route::middleware(['role:super_admin,proviseur,censeur'])->group(function () {
        Route::resource('students', StudentController::class);
        Route::post('/students/{student}/reinstate', [StudentController::class, 'reinstate'])->name('students.reinstate');
        Route::resource('subjects', SubjectController::class);
        Route::resource('levels', LevelController::class);
        Route::resource('classes', ClasseController::class);
        Route::post('/classes/{classe}/sequence-auth', [ClasseController::class, 'toggleSequenceAuth'])->name('classes.sequence.auth');
        Route::post('/classes/sequence-auth-all', [ClasseController::class, 'toggleAllClassesSequence'])->name('classes.sequence.auth.all');
    });

    // Enseignant Routes
    Route::middleware(['role:super_admin,proviseur,censeur,enseignant'])->group(function () {
        Route::get('/grades/create', [GradeController::class, 'create'])->name('grades.create');
        Route::post('/grades', [GradeController::class, 'store'])->name('grades.store');
        Route::post('/grades/single', [GradeController::class, 'storeSingle'])->name('grades.single');
        Route::post('/extensions/request', [\App\Http\Controllers\DeadlineController::class, 'requestExtension'])->name('extensions.request');
    });

    // Student & Report Routes
    Route::middleware(['role:super_admin,proviseur,censeur,enseignant,etudiant'])->group(function () {
        Route::get('/reports/{id}', [ReportController::class, 'show'])->name('reports.show');
        Route::post('/reports/{id}/sign', [ReportController::class, 'sign'])->name('reports.sign');
        // PDF Downloads
        Route::get('/reports/{id}/pdf/seq/{sequence}', [ReportController::class, 'downloadPdf'])->name('reports.pdf.seq');
        Route::get('/reports/{id}/pdf/tri/{trimestre}', [ReportController::class, 'downloadPdfTrimestre'])->name('reports.pdf.tri');
        Route::get('/reports/class/{classeId}/sequence/{sequence?}', [ReportController::class, 'classBulletins'])->name('reports.class.bulletins');
        // Tableaux d'Honneur (Moyenne >= 14/20)
        Route::get('/reports/{id}/tableau-honneur/seq/{sequence}', [ReportController::class, 'downloadTableauHonneur'])->name('reports.tableau.seq');
        Route::get('/reports/{id}/tableau-honneur/tri/{trimestre}', [ReportController::class, 'downloadTableauHonneurTrimestre'])->name('reports.tableau.tri');
        Route::get('/reports/class/{classeId}/tableau-honneur/seq/{sequence}', [ReportController::class, 'classTableauHonneur'])->name('reports.class.tableau');
    });

    // Prof Principal (Proviseur & Censeur)
    Route::middleware(['role:super_admin,proviseur,censeur'])->group(function () {
        Route::put('/classes/{classeId}/principal', [ReportController::class, 'setPrincipalTeacher'])->name('classes.principal');
    });

    // Staff Management & Deadlines (Proviseur specific)
    Route::middleware(['role:super_admin,proviseur'])->group(function () {
        Route::get('/staff', [\App\Http\Controllers\ProviseurController::class, 'staffIndex'])->name('proviseur.staff.index');
        Route::post('/staff', [\App\Http\Controllers\ProviseurController::class, 'storeStaff'])->name('proviseur.staff.store');
        Route::put('/staff/{user}', [\App\Http\Controllers\ProviseurController::class, 'updateStaff'])->name('proviseur.staff.update');
        Route::delete('/staff/{user}', [\App\Http\Controllers\ProviseurController::class, 'destroyStaff'])->name('proviseur.staff.destroy');
        // Mise ÃƒÂ  jour mot de passe du personnel
        Route::put('/staff/{user}/password', [\App\Http\Controllers\ProviseurController::class, 'updatePassword'])->name('proviseur.staff.password');
        
        // Deadlines & Extensions
        Route::get('/deadlines', [\App\Http\Controllers\DeadlineController::class, 'index'])->name('proviseur.deadlines.index');
        Route::post('/deadlines', [\App\Http\Controllers\DeadlineController::class, 'storeDeadlines'])->name('proviseur.deadlines.store');
        Route::put('/extensions/{extension}/respond', [\App\Http\Controllers\DeadlineController::class, 'respondToExtension'])->name('proviseur.extensions.respond');

        // Clôture d'Année & Délibérations
        Route::get('/year-closure', [\App\Http\Controllers\YearClosureController::class, 'index'])->name('year.closure.index');
        Route::post('/year-closure/thresholds', [\App\Http\Controllers\YearClosureController::class, 'updateThresholds'])->name('year.closure.thresholds');
        Route::post('/year-closure/calculate', [\App\Http\Controllers\YearClosureController::class, 'calculate'])->name('year.closure.calculate');
        Route::put('/year-closure/students/{student}', [\App\Http\Controllers\YearClosureController::class, 'updateStudentDecision'])->name('year.closure.students.update');
        Route::put('/year-closure/classes/{classe}/progression', [\App\Http\Controllers\YearClosureController::class, 'updateClassProgression'])->name('year.closure.classes.progression');
        Route::post('/year-closure/close', [\App\Http\Controllers\YearClosureController::class, 'closeYear'])->name('year.closure.close');
    });

    // Module Discipline (Proviseur, Censeur, Surveillant)
    Route::middleware(['role:super_admin,proviseur,censeur,surveillant'])->group(function () {
        Route::get('/discipline', [\App\Http\Controllers\DisciplineController::class, 'index'])->name('discipline.index');
        Route::get('/discipline/classe/{classe}', [\App\Http\Controllers\DisciplineController::class, 'classe'])->name('discipline.classe');
        Route::post('/discipline', [\App\Http\Controllers\DisciplineController::class, 'store'])->name('discipline.store');
        Route::delete('/discipline/{disciplineRecord}', [\App\Http\Controllers\DisciplineController::class, 'destroy'])->name('discipline.destroy');
    });

    
    // Export / Impression PDF (Proviseur + Censeur)
    Route::middleware(['role:super_admin,proviseur,censeur'])->group(function () {
        Route::get('/exports', [\App\Http\Controllers\ExportController::class, 'index'])->name('exports.index');
        Route::get('/exports/students', [\App\Http\Controllers\ExportController::class, 'studentList'])->name('exports.students');
        Route::get('/exports/staff', [\App\Http\Controllers\ExportController::class, 'staffList'])->name('exports.staff');
        Route::get('/exports/id-cards', [\App\Http\Controllers\ExportController::class, 'idCards'])->name('exports.id_cards');
    });
Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

require __DIR__ . '/auth.php';
