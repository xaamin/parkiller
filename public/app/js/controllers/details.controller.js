(function () {
   var app = angular.module('parkiller');

   app. controller('DetailsController', DetailsController)

   DetailsController.$inject = ['$scope', '$window', '$timeout'];

   function DetailsController($scope, $window, $timeout) {
      console.log('Details controller started');
      var vm = this;
      var simulation = io.connect(_BASE_ + ':8080/simulation');
      vm.markers = [];
           
      simulation.on('clear-markers', function (data) {
         if (data.markers) {
            vm.markers = data.markers;
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
                  })
                  break;
               }
            }
         }
      });

      $.get('/markers', function(response) {
         if (response) {
            vm.markers = response.markers;
         }
      });
   }
})();