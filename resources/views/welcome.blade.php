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

   <script src="http://maps.google.com/maps/api/js?key=AIzaSyD-uRk4XfSL01xHPvdl1PgzXzIjJ2_3ytc&libraries=places"></script>
   <script src="http://www.geocodezip.com/scripts/v3_epoly.js"></script>
   <script type="text/javascript">
   
      var map; 
      var position;
      var infowindow = null;
      function initialize() {   

      infowindow = new google.maps.InfoWindow(
      { 
         size: new google.maps.Size(150,50)
      });

      var myOptions = {
         zoom: 10,
         mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

      address = 'Avenida Sonora 113, Roma Norte, Ciudad de México, D.F.';
      geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': address}, function(results, status) {
         map.fitBounds(results[0].geometry.viewport);
      }); 
   } 

</script>
</head>
<body onload="initialize()">

<div id="tools">

   <div>
      <input id="addr" type="text" style="min-width: 500px" value="Doctores, Obrera, 06800 Ciudad de México, D.F., México" autofocus/>
      <button type="button" name="search" id="search">Fijar</button>
   
      <br>
   
      <label for="clientes">Clientes</label>
      <input type="text" id="clientes" value="15" placeholder="Clientes">
      <label for="conductores">Conductores</label>
      <input type="text" id="conductores" value="10" placeholder="Conductores">
   </div>

</div>

<div id="map_canvas" style="width:100%;height:100%;"></div>
<script type="text/javascript">
   var marker = false;
   var markers = [];
   var bounds = new google.maps.LatLngBounds();

   function showLocation() {
      console.log('Source point: \n\tLatitude: ' + marker.position.lat() + '\n\tLongitude: ' + marker.position.lng());
   }
   
   function searchAddr() {
      var addrInput = document.getElementById('addr');

      new google.maps.Geocoder().geocode( 
         { 
            'address': 
            addrInput.value 
         },
         function(results, status)
         {
            if (status == google.maps.GeocoderStatus.OK) 
            {
               if(!marker)
               {
                  marker = new google.maps.Marker({
                     map: map,
                     draggable: true
                  });
                  
                  google.maps.event.addListener(marker, 'click', showLocation);

                  google.maps.event.addListener(marker, 'dragend', showLocation);
               }
               marker.setPosition(results[0].geometry.location);
               map.setCenter(results[0].geometry.location);
               map.setZoom(15)
               addrInput.value = results[0].formatted_address;

               // Delete markers
               for (var i = markers.length - 1; i >= 0; i--) {
                  markers[i].setMap(null);
               }

               markers = [];

               showLocation();

               start('./images/car.png', document.getElementById("conductores").value || 50, 'conductor');
               start('./images/client.png', document.getElementById("clientes").value || 30, 'client');


            } 
            else 
            {
               alert("Geocode was not successful for the following reason: " + status);
            }
         }
      );
   }

   function searchKeys(e) {
      var code = ('charCode' in e) ? e.charCode : e.keyCode;

      if(code != undefined && code == 13) {
         searchAddr();
      }
   }

   function start(icon, totalMarkers, markerType) {
      var southWest = new google.maps.LatLng(19.435281340836195, -99.08507481152344);
      var northEast = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
      var lngSpan = northEast.lng() - southWest.lng() + 0.021071063;
      var latSpan = northEast.lat() - southWest.lat() - 0.000321654684213;

      // Create some markers
      for (var i = 1; i <= totalMarkers; i++) {
            var location = new google.maps.LatLng((southWest.lat() + latSpan * Math.random()) - 0.006071063, (southWest.lng() + lngSpan * Math.random()) - 0.021071063);


               bounds.extend(location);

            var pinIcon = new google.maps.MarkerImage(
                  icon,
                  null, /* size is determined at runtime */
                  null, /* origin is 0,0 */
                  null, /* anchor is bottom center of the scaled image */
                  new google.maps.Size(32, 32)
            );

            var _marker = new google.maps.Marker({
                  position: location,
                  map: map,                  
                  icon: pinIcon,
                  markerIdentifier: i + markers.length,
                  markerType: markerType
            });

            markers.push(_marker);
      }

      if (bounds !== false) {
         map.fitBounds(bounds);
      }

      console.log('Added ' + totalMarkers + ' markers for ' + markerType);
   }

   document.getElementById("search").addEventListener("click", searchAddr);

   var input = document.getElementById("addr");

   input.addEventListener("keypress", searchKeys);

   var autocomplete = new google.maps.places.Autocomplete(input);

</script>
</body>
</html>