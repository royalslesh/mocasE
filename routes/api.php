<?php
Route::group(['middleware'=>'auth:api'],function(){
    Route::apiResource('user',UserController::class);
     Route::apiResource('notes',NoteController::class);
  Route::get('/censeurs', [conCenseur::class, 'index']);
Route::post('/censeurs', [conCenseur::class, 'store']);
Route::get('/censeurs/{id}', [conCenseur::class, 'show']);
Route::put('/censeurs/{id}', [conCenseur::class, 'update']);
Route::delete('/censeurs/{id}', [conCenseur::class, 'destroy']);
Route::get('/bulletins', [conBulletins::class, 'index']);
Route::post('/bulletins', [conBulletins::class, 'store']);
Route::get('/bulletins/{id}', [conBulletins::class, 'show']);
Route::put('/bulletins/{id}', [conBulletins::class, 'update']);
Route::delete('/bulletins/{id}', [conBulletins::class, 'destroy']);
Route::get('/matieres', [con_matiere::class, 'index']);
Route::post('/matieres', [con_matiere::class, 'store']);
Route::get('/matieres/{id}', [con_matiere::class, 'show']);
Route::put('/matieres/{id}', [con_matiere::class, 'update']);
Route::delete('/matieres/{id}', [con_matiere::class, 'destroy']);
Route::get('/eleves', [conEleve::class, 'index']);
Route::post('/eleves', [conEleve::class, 'store']);
Route::get('/eleves/{id}', [conEleve::class, 'show']);
Route::put('/eleves/{id}', [conEleve::class, 'update']);
Route::delete('/eleves/{id}', [conEleve::class, 'destroy']);
Route::get('/classes', [con_classe::class, 'index']);
Route::post('/classes', [con_classe::class, 'store']);
Route::get('/classes/{id}', [con_classe::class, 'show']);
Route::put('/classes/{id}', [con_classe::class, 'update']);
Route::delete('/classes/{id}', [con_classe::class, 'destroy']);
Route::get('/enseignants', [conEnseignant::class, 'index']);
Route::post('/enseignants', [conEnseignant::class, 'store']);
Route::get('/enseignants/{id}', [conEnseignant::class, 'show']);
Route::put('/enseignants/{id}', [conEnseignant::class, 'update']);
Route::delete('/enseignants/{id}', [conEnseignant::class, 'destroy']);


     
});
