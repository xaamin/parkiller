<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
<title>Directions</title>
  

<style>
  html{height:100%;}
  body{height:100%;margin:0px;font-family: Helvetica,Arial;}
</style>

<script type="text/javascript" src="http://maps.google.com/maps/api/js?key=AIzaSyD-uRk4XfSL01xHPvdl1PgzXzIjJ2_3ytc&libraries&libraries=places,geometry"></script>
<script type ="text/javascript" src="http://www.geocodezip.com/scripts/v3_epoly.js"></script>
<script type="text/javascript">
var map, marker;
var startPos = [19.429152465937552, -99.12497546743373];
var speed = 50; // km/h

var delay = 100;
// If you set the delay below 1000ms and you go to another tab,
// the setTimeout function will wait to be the active tab again
// before running the code.
// See documentation :
// https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout#Inactive_tabs

function animateMarker(marker, coords, km_h)
{
    var target = 0;
    var km_h = km_h || 50;
    coords.push([startPos[0], startPos[1]]);
    
    function goToPoint()
    {
        var lat = marker.position.lat();
        var lng = marker.position.lng();
        var step = (km_h * 1000 * delay) / 3600000; // in meters
        
        var dest = new google.maps.LatLng(coords[target][0], coords[target][1]);
        
        var distance = google.maps.geometry.spherical.computeDistanceBetween(dest, marker.position); // in meters
        
        var numStep = distance / step;
        var i = 0;
        var deltaLat = (coords[target][0] - lat) / numStep;
        var deltaLng = (coords[target][1] - lng) / numStep;
        
        function moveMarker()
        {
            lat += deltaLat;
            lng += deltaLng;
            i += step;
            
            if (i < distance)
            {
                marker.setPosition(new google.maps.LatLng(lat, lng));
                setTimeout(moveMarker, delay);
            }
            else
            {   marker.setPosition(dest);
                target++;
                if (target != coords.length){ setTimeout(goToPoint, delay); }
            }
        }
        moveMarker();
    }
    goToPoint();
}

function initialize()
{
    var myOptions = {
        zoom: 16,
        center: new google.maps.LatLng(19.42038856512342, -99.14053479105905),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(startPos[0], startPos[1]),
        map: map
    });
    
    google.maps.event.addListenerOnce(map, 'idle', function()
    {
        animateMarker(marker, [
            // The coordinates of each point you want the marker to go to.
            // You don't need to specify the starting position again.
            [19.42538857591364, -99.12557628225306],
            [19.4253683397101, -99.12733581136683]
        ], speed);
    });
}
</script>
</head>
<body onload="initialize()">

<div id="tools">

    <button onclick="setRoutes();">Start</button>

</div>

<div id="map_canvas" style="width:100%;height:100%;"></div>
</body>
</html>