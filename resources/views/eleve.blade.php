<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
     <link rel="stylesheet"  href="{{asset('acceuil.css')}}" >
</head>
<body><div  class="overlay">
    </div>
    <h1 class=pa>POUR GERER LES ELEVES CHOISISSEZ VOTRE OPTION</h1>
    <form method=post action="{{url('/eleve')}}">
        @csrf
         <input type='hidden' name=val value=1 >    
        <button class=ol>NOUVEL ELEVE</button>
    </form>
     <form method=post action="{{url('/eleve')}}">
        @csrf
         <input type='hidden'name=val value=2 >    
        <button class=ul >MOFIER ELEVE</button>
    </form>
     <form method=post action="{{url('/eleve')}}">
        @csrf
        
         <input type='hidden' name=val value=3 >    
        <button class=il>SUPPRIMER ELEVE</button>
    </form>
@if($late==1)
<form class=ele method=post action="{{url('/eleve')}}">
        @csrf
        <div><label for='NOM'>NOM :</label> <input type='text' name=name placehorder=nom  required > </div><div>   
          <label for='PRENOM'>PRENOM :</label><input type='text' name=prename placehorder=prenom  required>  </div><div>   
 <label for='DATE NAISSANCE'>DATE NAISS :</label><input type='date' name=date placehorder=date  required></div><div>    
<label for='LIEU NAISSANCE'>LIEU NAISS :</label> <input type='text' name=lieu placehorder=lieu  required> 
<label for='MATRICULE'>MATRICULE :</label> <input type='text' name=MATRICULE placehorder=lieu  required> 
   <input type='hidden' name=val value=10 >
<label for='classe'>CLASSE :  </label>  <select  name=classe placehorder=classe > <option value=1>6eme</option> <option value=20>FORM1</option><option value=2>5eme</option> <option value=21>FORM2</option><option value=3>4emeESP</option><option value=4>4emeALL</option><option value=22>FORM3</option><option value=5>3emeESP</option><option value=6>3emeALL</option><option value=23>FORM4</option><option value=9>2ndC</option><option value=7>2ndESP</option><option value=8>2ndALL</option><option value=24>FORM5</option><option value=12>1ereC</option><option value=13>1ereD</option><option value=14>1ereTI</option><option value=10>1ereESP</option><option value=11>1ereALL</option><option value=25>FORM6</option><option value=17>TleC</option><option value=18>TleD</option><option value=19>TleTI</option><option value=15>TleESP</option><option value=16>TleALL</option><option value=26>UPPER SIX</option></select></div>
<label for='section'>SECTION :</label>  <select  name=section> <option value=F>FRANCOPHONE</option><option value=A>ANGLOPHONE</option></select>
<div><label for='sexe'>SEXE :</label>  <select  name=sexe> <option value=F>MASCULIN</option><option value=F>FEMININ</option></select>      </div>
    <button class=ol>NEXT</button>
    </form>
    @endif
    @if($late==2)
<form method=post class=ele action="{{url('/eleve')}}">
        @csrf
         <input type='hidden' name=val value=20 >   
       <label for=MATRICULE>MATRICULE :</label>  <input type='text' class=ul1 name=MATRICULE placehorder=nom  required> 
         
      <div>    <label for=attri>ATTRIBUT A MODIFIER :</label><select name=attri><option value='nom'>NOM</option><option value='prenom'>PRENOM</option><option value='lieu_naissance'>LIEU DE NAISSANCE</option><option value='sexe'>SEXE</option></select>  
       <label for=valk>VALEUR</label><input type=text name=valk></div>
          <div>    <h2 class=er>LES CHAMPS en dessous sont OBLIGATOIRES<h2> <label for='classe'> CLASSE :  </label>  <select  name=classe placehorder=classe > <option value=1>6eme</option> <option value=20>FORM1</option><option value=2>5eme</option> <option value=21>FORM2</option><option value=3>4emeESP</option><option value=4>4emeALL</option><option value=22>FORM3</option><option value=5>3emeESP</option><option value=6>3emeALL</option><option value=23>FORM4</option><option value=9>2ndC</option><option value=7>2ndESP</option><option value=8>2ndALL</option><option value=24>FORM5</option><option value=12>1ereC</option><option value=13>1ereD</option><option value=14>1ereTI</option><option value=10>1ereESP</option><option value=11>1ereALL</option><option value=25>FORM6</option><option value=17>TleC</option><option value=18>TleD</option><option value=19>TleTI</option><option value=15>TleESP</option><option value=16>TleALL</option><option value=26>UPPER SIX</option></select>
 <label for='section'> SECTION :</label>  <select  name=section> <option value=F>FRANCOPHONE</option><option value=A>ANGLOPHONE</option></select>
 <label for='DATE NAISSANCE'>DATE NAISS :</label><input type='date' name=date placehorder=date required >
          <button class=ul>NEXT</button></div>
    </form>
    @endif
     @if($late==3)
<form method=post class=ele action="{{url('/eleve')}}">
        @csrf
          <input type='hidden' name=val value=30 >   
      <label for=MATRICULE>MATRICULE :</label>  <input class=il1 type='text' name=MATRICULE placehorder=nom >   
       <label for=MATRICULE>CONFIRMEZ :</label>  <input class=il1 type='text' name=MATRICULE1 placehorder=nom >   
            
    <button class=il >SUPPRIMER</button>
    @if(isset($messageu))
    
    <h1 class=er>{{$messageu}}</h1>

    @endif
    </form>
    @endif
     @if(isset($message1))
      <h1 class=va>{{$message1}}</h1>
    @endif
    @if(isset($message))
    <form class=ele method=post action="{{url('/eleve')}}">
        @csrf
        <div><label for='NOM'>NOM :</label> <input type='text' name=name placehorder=nom  required >    
          <label for='PRENOM'>PRENOM :</label><input type='text' name=prename placehorder=prenom  required>    
 <label for='DATE NAISSANCE'>DATE NAISS :</label><input type='date' name=date placehorder=date  required></div><div>    
<label for='LIEU NAISSANCE'>LIEU NAISS :</label> <input type='text' name=lieu placehorder=lieu  required> 
<label for='MATRICULE'>MATRICULE :</label> <input type='text' name=MATRICULE placehorder=lieu  required> 
   <input type='hidden' name=val value=10 >
<label for='classe'>CLASSE :  </label>  <select  name=classe placehorder=classe > <option value=1>6eme</option> <option value=20>FORM1</option><option value=2>5eme</option> <option value=21>FORM2</option><option value=3>4emeESP</option><option value=4>4emeALL</option><option value=22>FORM3</option><option value=5>3emeESP</option><option value=6>3emeALL</option><option value=23>FORM4</option><option value=9>2ndC</option><option value=7>2ndESP</option><option value=8>2ndALL</option><option value=24>FORM5</option><option value=12>1ereC</option><option value=13>1ereD</option><option value=14>1ereTI</option><option value=10>1ereESP</option><option value=11>1ereALL</option><option value=25>FORM6</option><option value=17>TleC</option><option value=18>TleD</option><option value=19>TleTI</option><option value=15>TleESP</option><option value=16>TleALL</option><option value=26>UPPER SIX</option></select></div>
<label for='section'>SECTION :</label>   <select  name=section  ><option value=F>FRANCOPHONE</option><option value=A>ANGLOPHONE</option></select>   
<label for='sexe'>SEXE :</label>  <select  name=sexe> <option value=F>MASCULIN</option><option value=F>FEMININ</option></select>  
<button class=ol>NEXT</button>
    </form>
    <h1 class=er>{{$message}}</h1>
    @endif
    @if(isset($messageu1)&&$late==30)
   <h1 class=va> {{$messageu1}}</h1>
    @endif
    @if(isset($message8))
     <h1 class=va> {{$message8}}</h1>
    @endif
        @if(isset($message81))
     <h1 class=er> {{$message81}}</h1>
    @endif
</body>
</html>