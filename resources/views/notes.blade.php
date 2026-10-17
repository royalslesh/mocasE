<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
     <link rel="stylesheet"  href="{{asset('acceuil.css')}}" >
</head>
<body>
    
@if($verifi!=2)
  <form class=ele method=post action="{{url('/notes')}}">
<h1 class=fo>SELECTIONNEZ LA CLASSE DONT VOUS VOULEZ ENREGISTRER LES NOTES</h1>
    
     @csrf
         <input type='hidden' name=id value={{$id}} > 
     <input type='hidden' name=verifi value=1 > 
      <label for=code>Entrez le code de correspondence  CLASSE :</label> <input type="password" name=code>
        <label for=codem>Entrez le code de  matière :</label> <input type=password name=codem>
      <label for=classe>Selectionnez la classe :</label>  <select  name=classe placehorder=classe > <option value=1>6eme</option> <option value=20>FORM1</option><option value=2>5eme</option> <option value=21>FORM2</option><option value=3>4emeESP</option><option value=4>4emeALL</option><option value=22>FORM3</option><option value=5>3emeESP</option><option value=6>3emeALL</option><option value=23>FORM4</option><option value=9>2ndC</option><option value=7>2ndESP</option><option value=8>2ndALL</option><option value=24>FORM5</option><option value=12>1ereC</option><option value=13>1ereD</option><option value=14>1ereTI</option><option value=10>1ereESP</option><option value=11>1ereALL</option><option value=25>FORM6</option><option value=17>TleC</option><option value=18>TleD</option><option value=19>TleTI</option><option value=15>TleESP</option><option value=16>TleALL</option><option value=26>UPPER SIX</option></select>
    <label for=seq>Sequence :</label> <select  name=seq placehorder=classe ><option value=1>1</option><option value=2>2</option><option value=3>3</option><option value=4>4</option><option value=5>5</option><option value=6>6</option></select>  <button class=ol>NEXT</button> 
               @if(isset($message))
      <h1 class=er>{{$message}}</h1>
      @endif  </form>
      
@else
<form class=ele method=post action="{{url('/noté')}}">
      <h1 class=fo>SELECTIONNEZ LA CLASSE DONT VOUS VOULEZ ENREGISTRER LES NOTES DE {{$codenom}}</h1>
        @csrf
  <input type='hidden' name=classe value={{$classe}} > 
        <input type='hidden' name=seq value={{$seq}} > 
      <input type='hidden' name=id value={{$id}} > 
           <input type='hidden' name=codem value={{$codem}} > 
<div><table class="table table-striped">
    <thead>
        <tr><th>N°{{$id}}</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Date de naissance</th>
            <th>Classe</th>
            <th>Actions</th>
        </tr>
     
    </thead>
   
        @foreach($eleves as $eleve)

        <tr> <td >  {{ $eleve->id }}   </td>
            <td>  {{ $eleve->nom }}   </td>
            <td>  {{ $eleve->prenom }}   </td>
            <td>  {{ $eleve->date_naissance }}   </td>
            <td>  {{ $eleve->classe }}   </td>
            <td>                                   
             <input type=numder name="noté[{{$eleve->id}}]" value="{{ old('noté.' .$eleve->$id) }}">
            </td>
        </tr>
        @endforeach</table>
         <button class=ol>NEXT</button>
          </form>
        @endif      
     
    
</body>
</html>