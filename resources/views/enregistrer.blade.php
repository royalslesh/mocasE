<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
               <link rel="stylesheet"  href="{{asset('acceuil.css')}}" >

</head>
<body class=overlay><div>
    <form class=bolo method='post' action="{{url('/enregistrer')}}">
       @csrf
         <label for='nom'>Nom et Prénom:</label><input name=nom type=text placeholder='Slash Rayan' required>
        <label for='email'>Adresse email:</label><input name=email type=text placeholder=slash@gmail.com required>
          
          
             <label for='contact'>contat:</label><input name=contact type=text placeholder=600112233 required>
          <div> <label for='role'>statut :</label>  <select name=role><option value=visiteur>visiteur</option><option value=enseignant>enseignant</option><option value=censeur>censeur</option><option value=proviseur>proviseur</option></select></div>
           <label for='password'>password:</label><input name=password type=password required>
            <label for='code'>CODE(réservé ):</label><input name=code type=password required>
        
<div>  <button class=pl1 type=submit>CONTINUER</button></div>

       <a  href="{{url('/newUser')}}">Déjà inscrit</a>  <a  href="{{url('/')}}">retour</a>
         
           
           @if (isset($message))
            
            <div>  <p><h1 class=er>{{$message}}</h1></p></div>
            
            
            @elseif (isset($message1))
            
            <div>  <p><h1 class=er>{{$message1}}</h1></p></div>

            @elseif (isset($message5))
            
            <div>  <p><h1 class=va>{{$message5}}</h1></p></div>
            
            
            @elseif (isset($message2))
            
            <div>  <p><h1 class=er>{{$message2}}</h1></p></div>
            
            
            @elseif (isset($message3))
            
            <div>  <p><h1 class=er>{{$message3}}</h1></p></div>
            
            @endif
            
</form>
</body>
</html>