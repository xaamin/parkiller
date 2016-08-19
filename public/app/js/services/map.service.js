(function () {
    var app = angular.module('parkiller');

	app.service('MapService', MapService);

	MapService.$inject = ['$q', '$timeout'];

	function MapService($q, $timeout) {
		var service = {};

		service.computeDistanceBetween = computeDistanceBetween;
		service.getPolylineForMap = getPolylineForMap;
		service.createMarkerFromRawMarker = createMarkerFromRawMarker;
		service.createMarkerFromAddress = createMarkerFromAddress;

		return service;

		function computeDistanceBetween(origin, destination) {
			return google.maps.geometry.spherical.computeDistanceBetween(origin.getPosition(), destination.getPosition());
		}

		function createMarkerFromAddress(address, draggable) {
			var deferred = $q.defer();

			new google.maps.Geocoder().geocode({ 
        	   		'address': address
            	}, function(results, status) {
      	     	if (status == google.maps.GeocoderStatus.OK) {
	      	     	var marker = new google.maps.Marker({
	      	     	   	   	   		draggable: draggable || false
	      	      	   	   		});

	         	    return deferred.resolve({ marker: marker, result: results[0] });
	         	} else {
	         		return deferred.reject('Can\'t geocode address: ' + status);
	         	}
	         });

			return deferred.promise;
		}

		function createMarkerFromRawMarker(rawMarker, draggable) {
			var location = new google.maps.LatLng(rawMarker.latitude, rawMarker.longitude);

         	var pinIcon = new google.maps.MarkerImage(
                           	rawMarker.markerIcon,
                           	null, /* size is determined at runtime */
                           	null, /* origin is 0,0 */
                           	null, /* anchor is bottom center of the scaled image */
                           	new google.maps.Size(32, 32)
                     	);

         	var marker = new google.maps.Marker({
                           	position: location,
                           	icon: pinIcon,
                           	markerIdentifier: rawMarker.markerIdentifier,
                           	markerType: rawMarker.markerType,
                           	closestMarker: rawMarker.closestMarker,
                           	wasAddedToRoute: false,
                           	markerIcon: rawMarker.markerIcon,
                           	draggable: draggable || false
                     	});
         	return {
         		location: location,
         		marker: marker
         	};
		}

		function getPolylineForMap(origin, destination, delay) {
			var deferred = $q.defer();

			var directionsService = new google.maps.DirectionsService(); 
   	    
	   	   	var polyline = new google.maps.Polyline({
	   			path: [],
	   			strokeColor: Color.random(),
	   			strokeWeight: 3
	   		});

	   		var request = { 
	   			origin: origin.getPosition(), 
	   			destination: destination.getPosition(), 
	   			travelMode: google.maps.DirectionsTravelMode.WALKING 
	   		};

	   		if (!origin.polyline) {
   				origin.polyline = polyline;
   				console.log('Marker ' +  origin.markerIdentifier + ' : ' +  origin.markerType + ' doesn\'t have Polyline');
   			}

	   		// Added delay for OVER_QUERY_LIMIT
			$timeout(function () {
				directionsService.route(request, function(response, status) {
		   	      	if (status == google.maps.DirectionsStatus.OK) {
		   	        	var route = response.routes[0];
		   	        			
		   				var path = response.routes[0].overview_path;
		   				var legs = response.routes[0].legs;

		   	        	if (origin.polyline) {
				   			origin.polyline.setMap(null);
			   		    	origin.polyline.setPath([]);
			   		    	console.log('Marker ' +  origin.markerIdentifier + ' : ' +  origin.markerType + ' have Polyline');
				   		}
		   	        
		   	        	for (i = 0; i < legs.length; i++) {
		   	        		var steps = legs[i].steps;

		   	          		for (j = 0; j < steps.length; j++) {
		   	            		var nextSegment = steps[j].path;

		   	            		for ( k = 0; k < nextSegment.length; k++) {
		   	              			origin.polyline.getPath().push(nextSegment[k]);
		   	            		}
		   	          		}
		   	        	}

		   	        	console.log('Route from ' + origin.markerIdentifier + ' to ' + destination.markerIdentifier + ' successfully');
		   	        	return deferred.resolve({ origin: origin, destination: destination, response: response });
		   	      	} else {
		   	      		return deferred.reject('Can\'t determine steps between points: ' + status);
		   	      	}
		   	    });
			}, delay || ((Math.floor(Math.random() * 10) + 2) * 100));

	   	    return deferred.promise;
		}
	}
})();