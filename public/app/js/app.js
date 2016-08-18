(function () {
	var app = angular.module( 'parkiller', [ 'ngMaterial', 'ui.router', 'ngMdIcons', 'md.data.table', 'ngMessages' ] );

    app.config(function($stateProvider, $urlRouterProvider) {		
		/**
         * TODO
         * Add states
         */
		
		// if none of the above states are matched, use this as the fallback
       	$urlRouterProvider.otherwise('/empleados');
	});
})();