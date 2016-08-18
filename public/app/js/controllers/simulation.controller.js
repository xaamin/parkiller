(function () {
   var app = angular.module('parkiller');

   app. controller('SimulationController', SimulationController)

   SimulationController.$inject = ['$scope', '$window', '$timeout'];

   function SimulationController($scope, $window, $timeout) {
      var map; 
      var marker = false;
      var markers = [];
      var bounds = new google.maps.LatLngBounds();   	
      var simulation = io.connect(_BASE_ + ':8080/simulation');
           
      simulation.on('clear-markers', function (data) {
         for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);

            if (markers[i].polyline) {
               markers[i].polyline.setMap(null);
               markers[i].polyline.setPath([]);
               console.log('Deleteing polyline for ' + i);
            }

            markers[i].wasAddedToRoute = false;
         }

         if (markers.length) {
            delete markers;
            markers = [];
            console.log('Clear markers');
         }
         
         processMarkersData(data);
      });

      function processMarkersData(data) {
         console.log('Processing', data)
         if (data.marker) {
            if(!marker) {
               marker = new google.maps.Marker({
                           map: map,
                           draggable: true
                        });

               var position = new google.maps.LatLng(data.marker.latitude, data.marker.longitude);

               marker.setPosition(position);
               map.setCenter(position);
               map.setZoom(15);
            }
         }

         if (data.markers) {
            for (var i = 0; i < data.markers.length; i++) {
               start(data.markers[i]);
            }

            for (var i = 0; i < markers.length; i++) {
               if (markers[i].closestMarker && markers[i].markerType == 'driver') {
                  drawRouteWalking(markers[i], i)
               }
            }
         }
      }

      function initialize() {
   	  	var myOptions = {
   	  	 	zoom: 10,
   	  	  	mapTypeId: google.maps.MapTypeId.ROADMAP
   	  	}

   	  	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

   	  	address = 'Avenida Sonora 113, Roma Norte, Ciudad de México, D.F.';

   	  	geocoder = new google.maps.Geocoder();
   	   	geocoder.geocode({ 'address': address }, function(results, status) {
   	  		map.fitBounds(results[0].geometry.viewport);

            $.get('/markers', function(response) {
               processMarkersData(response);
            });
   	  	});
      }

      function start(markerRaw) {
         var location = new google.maps.LatLng(markerRaw.latitude, markerRaw.longitude);

         bounds.extend(location);

         var pinIcon = new google.maps.MarkerImage(
                           markerRaw.markerIcon,
                           null, /* size is determined at runtime */
                           null, /* origin is 0,0 */
                           null, /* anchor is bottom center of the scaled image */
                           new google.maps.Size(32, 32)
                     );

         var _marker = new google.maps.Marker({
                           position: location,
                           map: map,                                    
                           icon: pinIcon,
                           markerIdentifier: markerRaw.markerIdentifier,
                           markerType: markerRaw.markerType,
                           closestMarker: markerRaw.closestMarker,
                           wasAddedToRoute: false,
                           draggable: true
                     });

         markers.push(_marker);

         google.maps.event.addListener(_marker, 'click', function (marker) {
            console.log(this.markerIdentifier + ' : ' + this.markerType)
         });

         google.maps.event.addListener(_marker, 'dragend', function (marker) {
            console.log(this.markerIdentifier + ' moved to ' + marker.latLng.lat() + ', ' + marker.latLng.lng())
            simulation.emit('position-update', { latitude: marker.latLng.lat(), longitude: marker.latLng.lng(), markerIdentifier: this.markerIdentifier });
         });

         if (bounds !== false) {
            map.fitBounds(bounds);
         }
      }

      function drawRouteWalking(marker, currentIndex) {
         var directionsService = new google.maps.DirectionsService(); 
          
         var polyline = new google.maps.Polyline({
                           path: [],
                           strokeColor: Color.random(),
                           strokeWeight: 3
                        });

         var closestMarker;

         for (var i = 0; i < markers.length; i++) {
            if (marker.closestMarker == markers[i].markerIdentifier) {
               closestMarker = i;
               break;
            }
         }

         if (closestMarker) {
            var origin = markers[currentIndex].getPosition();
            var destination = markers[closestMarker].getPosition();

            var request = { 
               origin: origin, 
               destination: destination, 
               travelMode: google.maps.DirectionsTravelMode.WALKING 
            };

            if (!marker.polyline) {
               marker.polyline = polyline;
               console.log('Marker ' +  marker.markerIdentifier + ' : ' +  marker.markerType + ' doesn\'t have Polyline');
            } else {
               // Remove route from map
                marker.polyline.setMap(null);
                marker.polyline.setPath([]);
                console.log('Marker ' +  marker.markerIdentifier + ' : ' +  marker.markerType + ' have Polyline');
            }

            directionsService.route(request, function(response, status) {
               if (status == google.maps.DirectionsStatus.OK) {
                  var route = response.routes[0];
                        
                  var path = response.routes[0].overview_path;
                  var legs = response.routes[0].legs;
                 
                  for (i = 0; i < legs.length; i++) {
                     var steps = legs[i].steps;

                        for (j = 0; j < steps.length; j++) {
                           var nextSegment = steps[j].path;

                           for ( k = 0; k < nextSegment.length; k++) {
                              marker.polyline.getPath().push(nextSegment[k]);
                           }
                        }
                  }

                  marker.polyline.setMap(map);

                  console.log('Route from ' + marker.markerIdentifier + ' to ' + markers[closestMarker].markerIdentifier);
               }
            });
         }
      }

      $timeout(function () {
         initialize();
      })
   }
})();