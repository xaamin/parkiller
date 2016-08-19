(function () {
    var app = angular.module('parkiller');

    app. controller('RealtimeController', RealtimeController)

    RealtimeController.$inject = ['$scope', '$window', '$timeout', 'MapService', '$http']

    function RealtimeController($scope, $window, $timeout, MapService, $http) {
        console.log('Realtime controller started');
        var map; 
        var marker = false;
        var markers = [];
        var bounds = new google.maps.LatLngBounds();    	
        var simulation = io.connect(_BASE_ + ':8080/simulation');

        var vm = this;

        vm.map = {
                address: 'Doctores, Obrera, 06800 Ciudad de México, D.F., México',
                clients: 15,
                drivers: 10
            };

        vm.showOptions = false;

        simulation.on('marker-update', function (data) {
            console.log('Receiving marker ' +  data.markerIdentifier + ' update position', data);
            if (data) {
                var newPosition = new google.maps.LatLng(data.latitude, data.longitude);
                for (var i = 0; i < markers.length; i++) {
                    if (markers[i].markerIdentifier == data.markerIdentifier) {
                        markers[i].setPosition(newPosition);
                        updateMarkerPolyfill(markers[i]);
                        break;
                    }
                }
            }
        });

        function initialize() {
    	  	var myOptions = {
                            zoom: 10,
                        	mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

    	  	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    	  	address = 'Avenida Sonora 113, Roma Norte, Ciudad de México, D.F.';

    	  	geocoder = new google.maps.Geocoder();
    	    	geocoder.geocode({ 'address': address }, function(results, status) {
    	  		map.fitBounds(results[0].geometry.viewport);
    	  	});
        }

        function showLocation() {
          	console.log('Source point: \n\tLatitude: ' + marker.position.lat() + '\n\tLongitude: ' + marker.position.lng());
        }
        	
        function searchAddr() {
            vm.showOptions = false;

          	var addrInput = document.getElementById('addr');

            MapService
                .createMarkerFromAddress(addrInput.value)
                .then(function (result) {
                    console.log(result)
                    if(!marker) {
                        marker = result.marker
                        marker.setMap(map);
                                                    
                        google.maps.event.addListener(marker, 'click', showLocation);

                        google.maps.event.addListener(marker, 'dragend', showLocation);
                    }

                    marker.setPosition(result.result.geometry.location);
                    map.setCenter(result.result.geometry.location);
                    map.setZoom(15)
                    addrInput.value = result.result.formatted_address;

                    deleteMarkers();
                    
                    showLocation();

                    renderMarkersOnMap();

                    sendMarkersToBackend();
                    
                }, function (error) {
                    console.log(error);
                });
        }

        function renderMarkersOnMap() {
            var clients = document.getElementById("clientes").value || 50;
            var drivers = document.getElementById("conductores").value || 30;

            start('./images/car.png', drivers, 'driver');
            start('./images/client.png', clients, 'client');

            console.log('Emulate searching for closest location...');
        }

        function updateMarkerPolyfill(marker) {
            // Draw directions
            if (marker.closestMarker && marker.markerType == 'driver') {
                var closestMarker;

                for (var i = 0; i < markers.length; i++) {
                    if (markers[i].markerIdentifier == marker.closestMarker) {
                        closestMarker = i;
                        break;
                    }
                }

                if (closestMarker) {
                    drawRouteWalking(marker, closestMarker, 0);
                }                
            }
        }

        function sendMarkersToBackend() {
            var parameters = {
                markers: [],
                marker: {
                    latitude: marker.getPosition().lat(), 
                    longitude: marker.getPosition().lng()
                }
            };

            for (var i = 0; i < markers.length; i++) {
                if (markers[i].markerType == 'driver') {
                    closestMarker(markers[i]);
                }

                parameters.markers.push({ markerType: markers[i].markerType, markerIdentifier: markers[i].markerIdentifier, latitude: markers[i].getPosition().lat(), longitude: markers[i].getPosition().lng(), closestMarker: markers[i].closestMarker, markerIcon: markers[i].markerIcon });
            }

            $http
                .post('/markers', parameters)
                .then(function (response) {
                    console.log('Succesfull markers registration in backend');
                }, function (error) {
                    console.log('Error regitering markers in backend', error)
                });

                emitEventsToRestartSimulationMarkers(parameters);
        }

        function emitEventsToRestartSimulationMarkers(parameters) {
            console.log('Sending start-simulation event', parameters);
            simulation.emit('start-simulation', parameters);  
        }

        function deleteMarkers() {
            // Delete markers
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);

                if (markers[i].polyline) {
                    markers[i].polyline.setMap(null);
                    markers[i].polyline.setPath([]);
                }

                markers[i].wasAddedToRoute = false;
            }

            if (markers.length) {
                delete markers;
                markers = [];
                console.log('Clear markers');
            }
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
                var rawMarker = {
                                latitude: (southWest.lat() + latSpan * Math.random()) - 0.006071063, 
                                longitude: (southWest.lng() + lngSpan * Math.random()) - 0.021071063,
                                markerIdentifier: markers.length + 1,
                                markerType: markerType,
                                wasAddedToRoute: false,
                                markerIcon: icon
                            };

                var result = MapService.createMarkerFromRawMarker(rawMarker, false);
                var _marker = result.marker;

                _marker.setMap(map);

                bounds.extend(result.location);

            	markers.push(_marker);

            	google.maps.event.addListener(_marker, 'click', function (marker) {
            		console.log(this.markerIdentifier + ' : ' + this.markerType)
            	});
            }

            if (bounds !== false) {
              	map.fitBounds(bounds);
            }

            console.log('Added ' + totalMarkers + ' markers for ' + markerType);
        }

        function closestMarker(marker) {
    	    var closestMarker = -1;
            var closestDistance = Number.MAX_VALUE;

            if (marker.markerType == 'driver') {
                for(i = 0; i < markers.length; i++) {
    	     	    if (markers[i].markerType == 'client' && markers[i].markerIdentifier != marker.markerIdentifier && !markers[i].wasAddedToRoute) {
    		            var distance = MapService.computeDistanceBetween(markers[i], marker);

                        if ( distance < closestDistance ) {
        		            closestMarker = i;
        		            closestDistance = distance;
        		        }
        		    }
        	    }
            }

        	if (markers[closestMarker]) {
        	    console.log('Closest location for ' + marker.markerType + ' ' + marker.markerIdentifier + ' is marker ' + markers[closestMarker].markerIdentifier + ' [' + closestMarker + ' -> ' + closestDistance + '] ' + markers[closestMarker].markerType);

        	    markers[closestMarker].wasAddedToRoute = true;
        	    marker.wasAddedToRoute = true;
                markers[closestMarker].closestMarker = marker.markerIdentifier;
                marker.closestMarker = markers[closestMarker].markerIdentifier;

        	    drawRouteWalking(marker, closestMarker);
            } else {
    	 	    console.log('Unable to locate marker ' + closestMarker + ' for ' + marker.markerIdentifier + '. Request more drivers :) ' + '.Type: ' + marker.markerType);
            }
        }

    	function drawRouteWalking(marker, closestMarker) {
    		MapService
                .getPolylineForMap(marker, markers[closestMarker])
                .then(function (result) {
                    $timeout(function () {
                        marker = result.origin;
                        markers[closestMarker] = result.destination;
                        marker.polyline.setMap(map);
                    });
                }, function (error) {
                    console.log('Error', error);
                });
    	}

        $timeout(function () {
            document.getElementById("search").addEventListener("click", searchAddr);

            var input = document.getElementById("addr");

            input.addEventListener("keypress", searchKeys);

            var autocomplete = new google.maps.places.Autocomplete(input);
            
            initialize();
        }, 300);
    }
})();