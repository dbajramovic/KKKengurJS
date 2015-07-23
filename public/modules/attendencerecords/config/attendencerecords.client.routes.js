'use strict';

//Setting up route
angular.module('attendencerecords').config(['$stateProvider',
	function($stateProvider) {
		// Attendencerecords state routing
		$stateProvider.
		state('listAttendencerecords', {
			url: '/attendencerecords',
			templateUrl: 'modules/attendencerecords/views/list-attendencerecords.client.view.html'
		}).
		state('createAttendencerecord', {
			url: '/attendencerecords/create',
			templateUrl: 'modules/attendencerecords/views/create-attendencerecord.client.view.html'
		}).
		state('viewAttendencerecord', {
			url: '/attendencerecords/:attendencerecordId',
			templateUrl: 'modules/attendencerecords/views/view-attendencerecord.client.view.html'
		}).
		state('editAttendencerecord', {
			url: '/attendencerecords/:attendencerecordId/edit',
			templateUrl: 'modules/attendencerecords/views/edit-attendencerecord.client.view.html'
		});
	}
]);