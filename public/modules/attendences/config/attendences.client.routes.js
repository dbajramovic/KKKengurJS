'use strict';

//Setting up route
angular.module('attendences').config(['$stateProvider',
	function($stateProvider) {
		// Attendences state routing
		$stateProvider.
		state('listAttendences', {
			url: '/attendences',
			templateUrl: 'modules/attendences/views/list-attendences.client.view.html'
		}).
		state('createAttendence', {
			url: '/attendences/create',
			templateUrl: 'modules/attendences/views/create-attendence.client.view.html'
		}).
		state('viewAttendence', {
			url: '/attendences/:attendenceId',
			templateUrl: 'modules/attendences/views/view-attendence.client.view.html'
		}).
		state('editAttendence', {
			url: '/attendences/:attendenceId/edit',
			templateUrl: 'modules/attendences/views/edit-attendence.client.view.html'
		});
	}
]);