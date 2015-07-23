'use strict';

//Setting up route
angular.module('statlines').config(['$stateProvider',
	function($stateProvider) {
		// Statlines state routing
		$stateProvider.
		state('listStatlines', {
			url: '/statlines',
			templateUrl: 'modules/statlines/views/list-statlines.client.view.html'
		}).
		state('createStatline', {
			url: '/statlines/create',
			templateUrl: 'modules/statlines/views/create-statline.client.view.html'
		}).
		state('viewStatline', {
			url: '/statlines/:statlineId',
			templateUrl: 'modules/statlines/views/view-statline.client.view.html'
		}).
		state('editStatline', {
			url: '/statlines/:statlineId/edit',
			templateUrl: 'modules/statlines/views/edit-statline.client.view.html'
		});
	}
]);