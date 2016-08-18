(function () {
	var app = angular.module('parkiller');

	app.controller('AppController', AppController);

	AppController.$inject = ['$rootScope', '$mdSidenav'];	

	function AppController($rootScope, $mdSidenav) {
		console.log('App controller started.')

		var vm = this;
    	
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
        	$mdSidenav('left')
	          	.close()
	   	    	.then(function () {
	           		console.log('Close sidenav left is done');
	       		});
        });

    	vm.toggle = function () {
    	 	$mdSidenav('left')
	          	.toggle()
	          	.then(function () {
	            	console.log('Toogle sidenav left is done');
	        	});
    	}
	}
})();