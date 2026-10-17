<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
           <link rel="stylesheet"  href="{{asset('acceuil.css')}}" >

</head>
<body class=overlay>
    <form method='post' class=bolo action="{{url('/acceuil')}}">
        @csrf
        <label for='email'>email:</label><input name=email type=text placehorder=slash@gmail.com>
          <label for='password'>password:</label><input name=password type=password >
       <div>   <button  class=pl1 type=submit>CONTINUER</button></div>
        <a  href="{{url('/enregistrer')}}">pas de compte</a>    <a  href="{{url('/')}}">retour</a>
       @if(isset($message))
          <p><h1 class=er>{{$message}}</h1></p>
        @endif    
       
</form>

 <div></div>
</body>
</html>