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
    <h1 class=pa>POUR GERER LES ENSEIGNANTS CHOISISSEZ VOTRE OPTION</h1>
    <form method=get action="{{url('/enregistrer')}}">
        @csrf
         <input type='hidden' name=val value=1 >    
        <button class=ol>NOUVEL enseignant</button>
    </form>
     <form method=post action="{{url('/enseignant')}}">
        @csrf
         <input type='hidden'name=val value=2 >    
        <button class=ul >MOFIER enseignant</button>
    </form>
     <form method=post action="{{url('/enseignant')}}">
        @csrf
        
         <input type='hidden' name=val value=3 >    
        <button class=il>SUPPRIMER enseignant</button>
    </form>
     @if($late==2)
<form method=post action="{{url('/enseignant')}}">
        @csrf
       <label for=EMAIL>EMAIL :</label>  <input type='text' class=ul1 name=EMAIL placehorder=nom >    
            
    <button class=ul>NEXT</button>
    </form>
    @endif
     @if($late==3)
<form method=post action="{{url('/enseignant')}}">
        @csrf
        <label for=EMAIL>EMAIL :</label>  <input type='text' class=ul1 name=EMAIL placehorder=nom >    
            
    <button class=il >SUPPRIMER</button>
    
    </form>
    @endif
</body>
</html>