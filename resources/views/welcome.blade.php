<!DOCTYPE html>
<html>
<head>
   <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
   <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
   <title>Xaamin - Parkiller</title>
   <style>
      html{ 
         height:100%; 
      }
      
      body{ 
         height:100%; 
         margin:0px;
         font-family: Helvetica,Arial;
      }
   </style>

   <script src="http://maps.google.com/maps/api/js?key=AIzaSyD-uRk4XfSL01xHPvdl1PgzXzIjJ2_3ytc&libraries=places,geometry"></script>
   <script src="http://www.geocodezip.com/scripts/v3_epoly.js"></script>
</head>
<body>

   <div>

      <input id="addr" type="text" style="min-width: 500px" value="Doctores, Obrera, 06800 Ciudad de México, D.F., México" autofocus/>
      <button type="button" name="search" id="search">Fijar</button>
      
      <br>
      
      <label for="clientes">Clientes</label>
      <input type="text" id="clientes" value="15" placeholder="Clientes">
      <label for="conductores">Conductores</label>
      <input type="text" id="conductores" value="10" placeholder="Conductores">

   </div>

   <div id="directions_panel"></div>
   <div id="direction_details"></div>
   <div id="map_canvas" style="width:100%;height:100%;"></div>

   <footer>
      <script src="./app/js/controllers/realtime.controller.js"></script>
   </footer>

</body>

</html>