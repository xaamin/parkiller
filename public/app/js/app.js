(function () {
	var app = angular.module( 'parkiller', [ 'ngMaterial', 'ui.router', 'ngMdIcons', 'md.data.table', 'ngMessages' ] );

    app.config(function($stateProvider, $urlRouterProvider) {		
		/**
         * TODO
         * Add states
         */

		// if none of the above states are matched, use this as the fallback
       	$urlRouterProvider.otherwise('/realtime');

       	$stateProvider
        .state('app', {
            url: '/',
            abstract: true,
            templateUrl: 'app/templates/menu.html',
            controller: 'AppController as app'
        })

        /*
         * 
         */
        .state('app.realtime', {
            url: 'realtime',
            views: {
                'content': {
                    templateUrl: 'app/templates/realtime.html',
                    controller: 'RealtimeController as vm'
                }
            }
        })

        /*
         * 
         */
        .state('app.simulation', {
            url: 'simulation',
            views: {
                'content': {
                    templateUrl: 'app/templates/simulation.html',                    
                    controller: 'SimulationController as vm'
                }
            }
        })

        /*
         * 
         */
        .state('app.details', {
            url: 'details',
            views: {
                'content': {
                    templateUrl: 'app/templates/details.html',                    
                    controller: 'DetailsController as vm'
                }
            }
        });
	});

	app.config(function($mdThemingProvider) {
  		$mdThemingProvider.theme('default')
    	.primaryPalette('blue')
    	.accentPalette('orange');
	});
})();