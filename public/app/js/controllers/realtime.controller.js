(function () {
	var map; 
   	var marker = false;
   	var markers = [];
   	var bounds = new google.maps.LatLngBounds();   	

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
	   	}); 
	}

   	function showLocation() {
   	   	console.log('Source point: \n\tLatitude: ' + marker.position.lat() + '\n\tLongitude: ' + marker.position.lng());
   	}
   	
   	function searchAddr() {
   	   	var addrInput = document.getElementById('addr');

   	   	new google.maps.Geocoder().geocode({ 
   	   	   	   	'address': 
   	   	   	   	addrInput.value 
   	   	   	},
   	   	   	function(results, status) {
   	   	   	   	if (status == google.maps.GeocoderStatus.OK) {
   	   	   	   	   	if(!marker) {
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
   	   	   	   	   	for (var i = 0; i < markers.length; i++) {
   	   	   	   	   	   	markers[i].setMap(null);

   	   	   	   	   	   	if (markers[i].polyline) {
   	   	   	   	   	   		markers[i].polyline.setMap(null);
			    			markers[i].polyline.setPath([]);
   	   	   	   	   	   	}

   	   	   	   	   	   	markers[i].wasAddedToRoute = false;
   	   	   	   	   	}

   	   	   	   	   	markers = [];

   	   	   	   	   	showLocation();

   	   	   	   	   	start('./images/car.png', document.getElementById("conductores").value || 50, 'conductor');
   	   	   	   	   	start('./images/client.png', document.getElementById("clientes").value || 30, 'client');

			   	   	console.log('Emulate searching for closest location...');

   	   	   	   	} else {
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
   	   	   	   	markerType: markerType,
   	   	   	   	wasAddedToRoute: false
   	   	   	});

   	   	   	markers.push(_marker);

   	   	   	google.maps.event.addListener(_marker, 'click', function (marker) {
   	   	   		console.log(this.markerIdentifier + ' : ' + this.markerType)
   	   	   	});
   	   	}

   	   	if (bounds !== false) {
   	   	   	map.fitBounds(bounds);
   	   	}

   	   	for (var i = 0; i < markers.length; i++) {
   	   		if (markers[i].markerType == 'client') {
   	   	   		closestMarker(markers[i]);
   	   	   	}
   	   	}

   	   	console.log('Added ' + totalMarkers + ' markers for ' + markerType);

	    console.log(markers);
   	}

   	function closestMarker(marker) {
	    var closestMarker = -1;
	    var closestDistance = Number.MAX_VALUE;

	    for(i = 0; i < markers.length; i++) {
	    	if (markers[i].markerType == 'conductor' && !markers[i].wasAddedToRoute) {
		        var distance = google.maps.geometry.spherical.computeDistanceBetween(markers[i].getPosition(), marker.getPosition());

		        if ( distance < closestDistance ) {
		            closestMarker = i;
		            closestDistance = distance;
		        }
		    }
	    }

	    if (markers[closestMarker]) {
	    	console.log('Closest location for ' + marker.markerIdentifier + ' is marker ' + markers[closestMarker].markerIdentifier + ' [' + closestMarker + ']');

		    markers[closestMarker].wasAddedToRoute = true;
		    marker.wasAddedToRoute = true;

		    drawRouteWalking(marker, closestMarker);
	    } else {
	    	console.log('Unable to locate marker ' + closestMarker + ' for ' + marker.markerIdentifier + '. Request more drivers :)')
	    }
	}

	function drawRouteWalking(marker, closestMarker) {
		var directionsService = new google.maps.DirectionsService(); 
	    
	    var polyline = new google.maps.Polyline({
			path: [],
			strokeColor: getRandomColor(),
			strokeWeight: 3
		});

		var request = { 
			origin: marker.getPosition(), 
			destination: markers[closestMarker].getPosition(), 
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
	        	console.log('Route from ' + marker.markerIdentifier + ' to ' + markers[closestMarker].markerIdentifier)
	      	}
	    });
	}

	function getRandomColor() {
	    var letters = '0123456789ABCDEF';
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}

   	
   	document.getElementById("search").addEventListener("click", searchAddr);

   	var input = document.getElementById("addr");

   	input.addEventListener("keypress", searchKeys);

   	var autocomplete = new google.maps.places.Autocomplete(input);

   	window.onload = initialize;
})();