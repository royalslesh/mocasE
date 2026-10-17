<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
      <link rel="stylesheet"  href="{{asset('acceuil.css')}}" >

</head>
<body class=overlay>
    @if(isset($message))
    <h1 class=er>{{$message}}</h1>
    @endif
</body>
</html>