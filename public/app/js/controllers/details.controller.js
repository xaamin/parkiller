(function () {
    var app = angular.module('parkiller');

    app. controller('DetailsController', DetailsController)

    DetailsController.$inject = ['$scope', '$window', '$timeout', '$http', 'MapService'];

    function DetailsController($scope, $window, $timeout, $http, MapService) {
        console.log('Details controller started');
        var vm = this;
        var simulation = io.connect(_BASE_ + ':8080/simulation');
        vm.markers = [];
              
        simulation.on('clear-markers', function (data) {
            if (data.markers) {
                vm.markers = data.markers;
                processMarkersDistanceAndTime();
            }
        });

        simulation.on('marker-update', function (data) {
            if (data) {
                console.log('Request update row in table for ' + data.markerIdentifier, data);
                for (var i = 0; i < vm.markers.length; i++) {
                    if (vm.markers[i].markerIdentifier == data.markerIdentifier) {
                        $timeout(function () {
                            vm.markers[i].latitude = data.latitude;
                            vm.markers[i].longitude = data.longitude;

                            updateDistanceAndTimeInDataTable(vm.markers[i]);
                        });

                        break;
                    }
                }
            }
        });

        function processMarkersDistanceAndTime() {
            for (var i = 0; i < vm.markers.length; i++) {                
                updateDistanceAndTimeInDataTable(vm.markers[i]);
            }
        }

        function updateDistanceAndTimeInDataTable(marker) {
            var closestMarker;
            
            for (var j = 0; j < vm.markers.length; j++) {
                if (marker.closestMarker == vm.markers[j].markerIdentifier) {
                    closestMarker = j;
                    break;
                }
            }
            
            if (marker.markerType == 'driver' && closestMarker) {
                var directionsService = new google.maps.DirectionsService(); 
                var origin = new google.maps.LatLng(marker.latitude, marker.longitude);
                var destination = new google.maps.LatLng(vm.markers[j].latitude, vm.markers[j].longitude);

                var request = { 
                            origin: origin, 
                            destination: destination, 
                            travelMode: google.maps.DirectionsTravelMode.WALKING 
                        };

                directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        var route = response.routes[0];

                        $timeout(function () {
                            marker.time = route.legs[0].distance.text;
                            marker.distance = route.legs[0].duration.text;
                            console.log('Successfully calculated distance and time', marker);
                        });
                    } else {
                        console.log('Can\'t determine steps between points: ' + status);
                    }
                });
            }
        }

        $http
            .get('/markers')
            .then(function(response) {
                if (response.data) {
                    vm.markers = response.data.markers;
                    processMarkersDistanceAndTime();
                }
            }, function (error) {
                console.log('Error retrieving markers from backend');
            });
    }
})();