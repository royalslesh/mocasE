<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
        <link rel="stylesheet"  href="{{asset('acceuil.css',)}}" >

</head>
    @if(empty($notes))
    {{$message}}
     @else
<?php
$th=0;
$la=0;
$th1=0;
$s1=5;
$seq1=0;
$seq2=0;
if($no==1){$s1=1;}
elseif($no==2){$s1=3;}
$s2=$s1+1;
?>
<body>
       <div class="overlay">
       <h1></h1>
       
<table class="zo">
<tr><th style='background-color:white;' colspan=8><img src="{{asset('s.png')}}" ></th></tr>
<tr><th style='height:50px; font-size:25px; color:white' colspan=6>COMPLEXSCOLAIRE BILINGUE ERIC ET NATHAN</th><th colspan=2 rowspan=8></th></tr>
<tr><th colspan=6></th></tr>
<tr><th colspan=6></th></tr>
<tr><th colspan=3>Professeur Principal</th><th colspan=3>Mr/Mme</th></tr>
<tr> <th colspan=2>CLASSE</th><th colspan=2> {{ $eleve->classe }}   </th><th colspan=1>Effectif</th><th>{{$eff}}</th></tr>
<tr>  <th  rowspan=2>NOM</th><th  rowspan=2 colspan=3> {{ $eleve->nom }} {{ $eleve->prenom }}    </th><th colspan=1 >SEXE</th><th  >{{ $eleve->sexe }} </th></tr>

<tr><th>matricule</th> <th >{{ $eleve->MATRICULE }} </th></tr><tr> <th >Année Scolaire</th><th>2025/2026</th><TH>Date Naissance</TH><TH>{{ $eleve->date_naissance }}</TH><th>Lieu</th><th>{{ $eleve->lieu_naissance }}</th></tr>
           
      <tr><th rowspan=2  class=oi> Matières</th><th rowspan=2 class=oi>SEQ{{$s1}}</th><th rowspan=2 class=oi> SEQ{{$s2}}</th><th rowspan=2  class=oi>TRIM{{$no}}</th><th rowspan=2  class=oi>COEF</th><th rowspan=2 class=oi>COEF*NOTE</th><th rowspan=2 class=oi>MENTION</th><th rowspan=2 class=oi>PROFFESSEUR</th></tr> <tr></tr>    
          
  <?php
  $pa="Mr/Mme";

  ?>@foreach($matières1 as $matières)     
  <?php
  $copt=0;
  ?>
  <tr><td>  {{ $matières->nom }}</td>@foreach($notes as $note)


  @if($note->matière_id==$matières->id )
  <?php $copt=$copt+1; ?>
@if($copt==1 && $note->SEQUENCE==$s1)
  @php {{$ro1=$note->note;}}
  $seq1=$seq1+$ro1*$matières->coef;
  @endphp
  @elseif($copt==2 && $note->SEQUENCE==$s2)
  @php 
  $ro2=$note->note;
   $seq2=$seq2+$ro2*$matières->coef;
  $tr=($ro1+$ro2)/2;
  @endphp
  @foreach($prof as $pro)
@if($pro->id==$note->enseignant_id )
 @php
$pa="Mr/Mme  $pro->nom";
 @endphp
@endif
@endforeach
@endif
  
  @endif  @endforeach<td>@if(isset($ro1))
    {{$ro1}}
   
  </td>@php 
   {{$ro1=0;}}
   @endphp
     @endif
   <td>
  
    @if(isset($ro2))
    {{$ro2}}
    
    @endif
  </td>@php 
  {{$ro2=0;}}
  @endphp
  <td>
     @if(isset($tr))
    {{$tr}}
    
    </td>
    @endif<td><?php
$coefs=$matières->coef;
$lo=$lo+$coefs;
$la=$la+$coefs;

?>{{$coefs}}</td><td>@if(isset($tr))
    {{$tc=$tr*$coefs}}
    @php
    
    $th=$th+$tc;
    $th1=$th1+$tc;
    @endphp
    
    

</td>@php 
{{$tr=0;}}
@endphp
@endif<td></td><td>


{{$pa}}
@php
$pa="Mr/Mme";
@endphp
</td></tr>
  @endforeach  
  
<tr ><th colspan=4 class=o>Matières Litteraires</th><th>{{$la}}</th><th>{{$th1}}</th><th colspan=2 class=oi>Moyenne group:{{number_format($th1/$la,2,'.','')}}</th></tr><?php  ?>
  <?php
  $la=0;
  $th1=0;
  $copt=0;
  ?>@foreach($matières2 as $matières)     
     <?php
     $copt=0;
     ?>
     <tr><td>  {{ $matières->nom }}</td>@foreach($notes as $note)


  @if($note->matière_id==$matières->id)
  <?php $copt=$copt+1; ?>
@if($copt==1)
  @php {{$ro1=$note->note;}}
  $seq1=$seq1+$ro1*$matières->coef;
  @endphp
  @elseif($copt==2)
  @php 
  $ro2=$note->note;
   $seq2=$seq2+$ro2*$matières->coef;
  $tr=($ro1+$ro2)/2;
  @endphp
  @foreach($prof as $pro)
@if($pro->id==$note->enseignant_id )
 @php
$pa="Mr/Mme  $pro->nom";
 @endphp
@endif
@endforeach
@endif
  
  @endif  @endforeach<td>@if(isset($ro1))
    {{$ro1}}
   
  </td>@php 
   {{$ro1=0;}}
   @endphp
     @endif
   <td>
  
    @if(isset($ro2))
    {{$ro2}}
    
    @endif
  </td>@php 
  {{$ro2=0;}}
  @endphp
  <td>
     @if(isset($tr))
    {{$tr}}
    
    </td>
    @endif<td><?php
$coefs=$matières->coef;
$lo=$lo+$coefs;
$la=$la+$coefs;?>{{$coefs}}</td><td>@if(isset($tr))
    {{$tc=$tr*$coefs}}
    @php
    
    $th=$th+$tc;
    $th1=$th1+$tc;
    @endphp
    
    

</td>@php 
{{$tr=0;}}
@endphp
@endif<td></td><td>


  {{$pa}}
  @php
  $pa="Mr/Mme";
  @endphp
  @endforeach

    </td></tr>
<tr><th colspan=4 class=o>Matières Scientifiquess</th><th>{{$la}}</th><th>{{$th1}}</th><th colspan=2 class=oi>Moyenne group:{{number_format($th1/$la,2,'.','')}}</th></tr><?php  ?>
  <?php
  $la=0;
  $th1=0;
  $copt=0;
  ?>@foreach($matières3 as $matières)     
  <?php
  $copt=0;
  ?>
  <tr><td>  {{ $matières->nom }}</td>@foreach($notes as $note)


  @if($note->matière_id==$matières->id)
  <?php $copt=$copt+1; ?>
@if($copt==1)
  @php {{$ro1=$note->note;}}
  $seq1=$seq1+$ro1*$matières->coef;
  @endphp
  @elseif($copt==2)
  @php 
  $ro2=$note->note;
   $seq2=$seq2+$ro2*$matières->coef;
  $tr=($ro1+$ro2)/2;
  @endphp
  @foreach($prof as $pro)
@if($pro->id==$note->enseignant_id )
 @php
$pa="Mr/Mme  $pro->nom";
 @endphp
@endif
@endforeach
@endif
  
  @endif  @endforeach<td>@if(isset($ro1))
    {{$ro1}}
   
  </td>@php 
   {{$ro1=0;}}
   @endphp
     @endif
   <td>
  
    @if(isset($ro2))
    {{$ro2}}
    
    @endif
  </td>@php 
  {{$ro2=0;}}
  @endphp
  <td>
     @if(isset($tr))
    {{$tr}}
    
    </td>
    @endif<td><?php
$coefs=$matières->coef;
$lo=$lo+$coefs;
$la=$la+$coefs;?>{{$coefs}}</td><td>@if(isset($tr))
    {{$tc=$tr*$coefs}}
    @php
    
    $th=$th+$tc;
    $th1=$th1+$tc;
    @endphp
    
    

</td>@php 
{{$tr=0;}}
@endphp
@endif<td></td><td>


{{$pa}}
@php
$pa="Mr/Mme";
@endphp
</td></tr>
  @endforeach  
  <tr><th colspan=4 class=o>Autres Matières</th><th>{{$la}}</th><th>{{$th1}}</th><th colspan=2 class=oi>Moyenne group:{{number_format($th1/$la,2,'.','')}}</th></tr><?php  ?>
<tr><th class=o colspan=4>TOTAL TRIMESTRIELLE</th><th colspan=1>{{$lo}}</th><th colspan=3>{{$th}}</th></tr>
<tr><th>Moyenne de la classe</th><th colspan=2></th><th rowspan=2>SEQ{{$s1}}</th><th rowspan=2>SEQ{{$s2}}</th><th rowspan=2>Moyenne Trimestre {{$no}}</th><th colspan=2 rowspan=2>{{number_format($th/$lo,2,'.','')}}</th></tr>
<tr><th>Pourcentage de reussite </th><th colspan=2></th></tr>
<tr><th>Moy premier</th><th  colspan=2>{{$moy_premier}}</th><th rowspan=2>moy: {{number_format($seq1/$lo,2,'.','')}}</th><th rowspan=2 >moy: {{number_format($seq2/$lo,2,'.','')}}</th><th rowspan=2>Rang Trimestre {{$no}}</th><th colspan=2 rowspan=2>{{$range}}</th></tr>
    <tr><th>Moy dernier</th><th  colspan=2>{{$moy_dernier}}</th></tr>
    <tr><th style='background-color:white;' colspan=8><img src="{{asset('o.png')}}" ></th></tr>
</table>   <div  style='margin:100px; '>  <a   class=poll href="{{URL::previous()}}">| Quitter</a></div></div>
     
 
        


  

@endif 

</body>
</html>