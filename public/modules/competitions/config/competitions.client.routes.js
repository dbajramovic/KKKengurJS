'use strict';

//Setting up route
angular.module('competitions').config(['$stateProvider',
	function($stateProvider) {
		// Competitions state routing
		$stateProvider.
		state('listCompetitions', {
			url: '/competitions',
			templateUrl: 'modules/competitions/views/list-competitions.client.view.html'
		}).
		state('createCompetition', {
			url: '/competitions/create',
			templateUrl: 'modules/competitions/views/create-competition.client.view.html'
		}).
		state('viewCompetition', {
			url: '/competitions/:competitionId',
			templateUrl: 'modules/competitions/views/view-competition.client.view.html'
		}).
		state('editCompetition', {
			url: '/competitions/:competitionId/edit',
			templateUrl: 'modules/competitions/views/edit-competition.client.view.html'
		});
	}
]);