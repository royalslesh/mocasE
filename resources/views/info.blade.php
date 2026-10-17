<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet"  href="{{asset('acceuil.css',)}}" >

<body>
   <div class="overlay">
       <h1></h1>
<table class="table table-striped">

 
        <tr><td>N°</td> <td >  {{ $eleve->id }}   </td></tr>
           <tr>  <td>NOM</td><td> {{ $eleve->nom }}   </td></tr>
            <tr> <td>PRENOM</td><td> {{ $eleve->prenom }}   </td></tr>
            <tr> <td>DATE NAISSANCE</td><td> {{ $eleve->date_naissance }}   </td></tr>
            <tr><td>LIEU NAISSANCE</td><td>{{ $eleve->lieu_naissance }}</td></tr>
            <tr> <td>CLASSE</td><td> {{ $eleve->classe }}   </td></tr></div></table>
    
            <h1 class=pa>BULLETINS SEQUENCIELS DE L'ELEVE  {{ $eleve->nom }} {{ $eleve->prenom }}</h1>
       
       <button class=pp>  <a class=ul3 href="{{url('/BULL/1',['id'=>$eleve->id])}}">TRIMESTRE 1</a></button></li>  <button class=pp>  <a class=ul3 href="{{url('/BULL/2',['id'=>$eleve->id])}}">TRIMESTRE 2</a></button></li>
       <button class=pp>  <a class=ul3 href="{{url('/BULL/3',['id'=>$eleve->id])}}">TRIMESTRE 3</a></button></li>  
            </div></ul>
          

 
</body>
</html>