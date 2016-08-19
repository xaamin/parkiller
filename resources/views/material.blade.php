<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<title>Parkiller</title>
	<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
    <link rel="stylesheet" href="./vendor/angular-material/angular-material.css">
    <link href="./vendor/angular-material-data-table/dist/md-data-table.min.css" rel="stylesheet" type="text/css"/>

    <link rel="stylesheet" href="./app/css/material.css">
</head>
<body ng-app="parkiller" layout="column">
	
	<div ui-view layout="row" flex></div>

    <script src="./vendor/angular/angular.js"></script>
    <script src="./vendor/angular-aria/angular-aria.js"></script>
    <script src="./vendor/angular-animate/angular-animate.js"></script>
    <script src="./vendor/angular-material/angular-material.js"></script>
    <script src="./vendor/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script src="./vendor/angular-material-icons/angular-material-icons.min.js"></script>
    <script src="./vendor/angular-material-data-table/dist/md-data-table.min.js"></script>
    <script src="./vendor/angular-messages/angular-messages.min.js"></script>

    <!-- Plugins -->
    <script src="http://maps.google.com/maps/api/js?key=AIzaSyD-uRk4XfSL01xHPvdl1PgzXzIjJ2_3ytc&libraries=places,geometry"></script>
    <script type="text/javascript" src="{{ url('')  }}:8080/socket.io/socket.io.js"></script>

    <script type="text/javascript">
         _BASE_ = "{{ url('') }}";
    </script>
    <!-- Main JS -->
    <script src="./app/js/app.js"></script>
    
    <!-- Controllers -->
    <script src="./app/js/controllers/app.controller.js"></script>
    <script src="./app/js/controllers/realtime.controller.js"></script>
    <script src="./app/js/controllers/simulation.controller.js"></script>
    <script src="./app/js/controllers/details.controller.js"></script>

    <!-- -->
    <script src="./app/js/services/color.service.js"></script>
    <script src="./app/js/services/map.service.js"></script>
</body>
</html>