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
   <script src="http://192.168.48.1:8080/socket.io/socket.io.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
</head>
<body>

   <div id="directions_panel"></div>
   <div id="direction_details"></div>
   <div id="map_canvas" style="width:100%;height:100%;"></div>

   <footer>
      <script src="./app/js/controllers/simulation.controller.js"></script>
   </footer>

</body>

</html>