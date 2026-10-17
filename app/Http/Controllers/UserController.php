<?php

use app\Http\Controllers\controller;
use app\Models\user;
use app\Models\Role;
class UserController extends controller
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
       
   $user = User::creae([
    'name'=> 'slash royals',
    'email'=>'slash@gmail.com',
    'password'=>bcrypt('password'),
   ]);
   $teacherRole = Role::where('name','enseignant')->first();
   $user->roles()->attach($teacherRole);

   return 'Utilisateur crée avec succèes';
   
        }
}

