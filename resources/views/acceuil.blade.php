<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link rel="stylesheet"  href="{{ asset('acceuil.css') }}" >
    <title>Document</title>

  <style>
    .dropdown {
      position: relative;
      display: inline-block;
      margin-left:1330px;
      
    }

    .dropdown-btn {
      background-color: #05fb1a8b;
      color: #0d0d0dca;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      margin-right:30px;
    }

    .dropdown-content { 
       padding: 10px ;
      display: none;
      position: absolute;
      background-color: #00000096;
      min-width: 145px;
      border-radius: 8px;
      box-shadow: 0px 8px 16px rgba(0,0,0,0.15);
      z-index: 1;
      overflow-y:scroll;
      height: 250px;
    }

    .dropdown-content button{
      color: #000000ff;
      padding: 3px 5px;
      text-decoration: none;
      display: block;
      height: 30px;
      background-color: #2afa2a8e;
      border-radius:5px;
      border-color:#2afa2a8e;
    }

   

    .show {
      display: block;
    }
  </style>
</head>
<body>
 

  <script>
    function toggleMe(){document.getElementById("dropdownMe").classList.toggle("show");
      
window.onclick = function(event) {
      if (!event.target.matches('.dropdown-btn')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
          dropdowns[i].classList.remove("show");
        }
      }}
    }
    function toggleMenu() {
      document.getElementById("dropdownMenu").classList.toggle("show");
    }

    // Fermer le menu si on clique ailleurs
    window.onclick = function(event) {
      if (!event.target.matches('.dropdown-btn')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
          dropdowns[i].classList.remove("show");
        }
      }
    }
  </script>

                                                             
    <style>
        body {
            font-family: Arial, sans-serif;
                 
        }
        .container {
            margin-top: 50px;
            text-align: center;
        }
        .btn {
            margin: 10px;
            padding: 10px 20px;
            font-size: 18px;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body><header>
    <nav>    
                       
               <ul><nav> <img src="{{asset('slash11.png')}}"  class="menu-ico" alt="">  
               
                @if($role!='visiteur')
                  <form action="{{url('/notes')}}"    method=post>
                    @csrf 
                    <input type=hidden name=id value={{$id}}>   
                    <input type='hidden' name=ids value={{$ids}} >                            
                <li><button type=submit>| Notes  </button></li></form> 
                  @if($role!='enseignant') 
               
                  <form action="{{url('/eleve')}}"    method=post>
                    @csrf    
                    <input type='hidden' name=ids value={{$ids}} >                            
                <li><button type=submit>| Eleves  </button></li></form>
                @if($role!='censeur')
                 <form action="{{url('/enseignant')}}"    method=post>
                    @csrf    
                    <input type='hidden' name=ids value={{$ids}} >                            
                <li><button type=submit>| Enseignant  </button></li></form>
                    <form action="{{url('/censeur')}}"    method=post>
                    @csrf    
                    <input type='hidden' name=ids value={{$ids}} >                            
                <li><button type=submit>| Censeurs  </button></li></form>
                @endif
                   @endif
                      @endif
                      <li><button class=pl>  <a class=pl href="{{URL('/')}}">| Quitter</a></button></li>
            
                        <img src="{{asset('slash11.png')}}"  class="menu-icone" alt="">    
                    </ul>
           
               <nav>

</header>
<div class="overlay">
      <h1 class=pa1>Bienvennue  {{$role}}  {{$nom}}</h1>
         <div class="dropdown"><button onclick="toggleMe()" class="dropdown-btn">ACTIVATION BULLETINS</button></div>
       <div class="dropdown">
    <button onclick="toggleMenu()" class="dropdown-btn">CHOISISSEZ LA CLASSE </button>
    
    <div id="dropdownMenu" class="dropdown-content">
        <form method='post'  action="{{url('/acceuil')}}">
             @csrf    
             <input type='hidden' name=email value={{$email}} >
             <input type='hidden' name=classe value=1 >   
             <input type='hidden' name=password value={{$password}} >      
      <button>6ème</button></form><form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=20 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>FORM 1</button></form> <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} > 
         <input type='hidden' name=classe value=2 >               
       <input type='hidden' name=password value={{$password}} >      
      <button>5ème</button></form> <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=21>                
       <input type='hidden' name=password value={{$password}} >      
      <button>FORM 2</button></form>
         <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=3 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>4ème ESP</button></form>
      <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=4 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>4ème ALL</button></form>
         <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=22 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>FORM 3</button></form>
      <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=5 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>3ème ESP</button></form>
      <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=6 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>3ème ALL</button></form>
       <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=23 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>FORM 4</button></form>
        <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=7 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>2nd ESP</button></form>
      <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=8 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>2nd ALL</button></form>
        <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=9 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>2nd C</button></form>
       <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=24 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>FORM 5</button></form>
       <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=10 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>1ère ESP</button></form>
      <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=11 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>1ère ALL</button></form>
        <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=12 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>1ère C</button></form>
      <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=13 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>1ère D</button></form>
        <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=14 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>1ère TI</button></form>
      <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=25>                
       <input type='hidden' name=password value={{$password}} >      
      <button>FORM 6</button></form>
      <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=15 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>Tle ESP</button></form>
      <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=16 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>Tle ALL</button></form>
        <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=17 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>Tle C</button></form>
      <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=18 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>Tle D</button></form>
        <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=19 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>Tle TI</button></form>
      
    
        <form method='post'  action="{{url('/acceuil')}}">
       @csrf    
       <input type='hidden' name=email value={{$email}} >
         <input type='hidden' name=classe value=26 >                
       <input type='hidden' name=password value={{$password}} >      
      <button>UPPER SIX</button></form>
      
     
    <?php
    $al=0;
    ?>  
      
    </div>
  </div>
@if(isset($no))
  <table class="table table-striped">
    <thead>
        <tr><th>N°</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Date de naissance</th>
            <th>Classe</th>
            <th>Actions</th>
        </tr>
     
    </thead>
  
        @foreach($eleves as $eleve)
           
    <?php
    $al=$eleve->id;
    ?>  
 @if($al==0)
      <tr><td>AUCUN ELELVES DABS CETTE SALLE DE CLASSE</td></tr>
   @endif
        <tr> <td >  {{ $eleve->id }}   </td>
            <td>  {{ $eleve->nom }}   </td>
            <td>  {{ $eleve->prenom }}   </td>
            <td>  {{ $eleve->date_naissance }}   </td>
            <td>  {{ $eleve->classe }}   </td>
            <td>
                                                 
              <button  style='width:200px'> <a href="{{url('/info',['id'=>$eleve->id])}}">Plus d'info sur cet élève</a></button>
            </td>
        </tr>
        @endforeach
    
</table></div>
  @endif 
</body>
</html>
 