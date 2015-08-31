'use strict';

//Setting up route
angular.module('statlines').config(['$stateProvider',
	function($stateProvider) {
		// Statlines state routing
		$stateProvider.
		state('listStatlines', {
			url: '/statlines/:playerId',
			templateUrl: 'modules/statlines/views/list-statlines.client.view.html'
		}).
		state('createStatline', {
			url: '/statlines/:playerId/create',
			templateUrl: 'modules/statlines/views/create-statline.client.view.html'
		}).
		state('viewStatline', {
			url: '/statlines/:playerId/:statlineId',
			templateUrl: 'modules/statlines/views/view-statline.client.view.html'
		}).
		state('editStatline', {
			url: '/statlines/:playerId/:statlineId/edit',
			templateUrl: 'modules/statlines/views/edit-statline.client.view.html'
		});
	}
]);