(function () {
    var app = angular.module('parkiller');

    app. controller('SimulationController', SimulationController)

    SimulationController.$inject = ['$scope', '$window', '$timeout', 'MapService', '$http'];

    function SimulationController($scope, $window, $timeout, MapService, $http) {
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
            
            // Added delay for OVER_QUERY_LIMIT
            $timeout(function () {
                processMarkersData(data);
            }, 500);
        });

        function processMarkersData(data) {
            console.log('Processing data received from backend', data)
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
                // Draw markers
                for (var i = 0; i < data.markers.length; i++) {
                    start(data.markers[i]);
                }

                // Draw directions
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

                $http
                    .get('/markers')
                    .then(function(response) {
                        processMarkersData(response.data);
                    }, function (error) {
                        console.log('Error retrieving markers from backend', error);
                    });
    	  	});
        }

        function start(rawMarker) {
            var result = MapService.createMarkerFromRawMarker(rawMarker, true);
            var marker = result.marker;

            marker.setMap(map);

            bounds.extend(result.location);

            markers.push(marker);

            google.maps.event.addListener(marker, 'click', function (marker) {
                console.log(this.markerIdentifier + ' : ' + this.markerType)
            });

            google.maps.event.addListener(marker, 'dragend', function (marker) {
                console.log(this.markerIdentifier + ' moved to ' + marker.latLng.lat() + ', ' + marker.latLng.lng());

                var parameters = { 
                                latitude: marker.latLng.lat(), 
                                longitude: marker.latLng.lng(), 
                                markerIdentifier: this.markerIdentifier 
                            };

                emitMarkerPositionUpdated(parameters);

                sendMarkerPositionUpdatedToBackend(parameters);

                updateMarkerPolyfill(this);
            });

            if (bounds !== false) {
                map.fitBounds(bounds);
            }
        }

        function emitMarkerPositionUpdated(parameters) {            
            console.log('Sending position-update event', parameters);

            simulation.emit('position-update', parameters);
        }

        function sendMarkerPositionUpdatedToBackend(parameters) {
            $http
                .put('/direction', parameters)
                .then(function () {
                    console.log('Marker position updated in backend successfully.');
                }, function (error) {
                    console.log('Backend error on update marker position.', error);
                });
        }

        function updateMarkerPolyfill(marker) {
            // Draw directions
            for (var i = 0; i < markers.length; i++) {
                if (marker.markerIdentifier == markers[i].markerIdentifier && marker.closestMarker && marker.markerType == 'driver') {
                    drawRouteWalking(markers[i], i, 0)
                    break;
                }
            }
        }

        function drawRouteWalking(marker, currentIndex) {
            var closestMarker;

            for (var i = 0; i < markers.length; i++) {
                if (marker.closestMarker == markers[i].markerIdentifier) {
                    closestMarker = i;
                    break;
                }
            }

            if (closestMarker) {
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
        }

        $timeout(function () {
            initialize();
        }, 300);
    }
})();