'use strict';

//Setting up route
angular.module('galleryitems').config(['$stateProvider',
	function($stateProvider) {
		// Galleryitems state routing
		$stateProvider.
		state('listGalleryitems', {
			url: '/galleryitems',
			templateUrl: 'modules/galleryitems/views/list-galleryitems.client.view.html'
		}).
		state('createGalleryitem', {
			url: '/galleryitems/create',
			templateUrl: 'modules/galleryitems/views/create-galleryitem.client.view.html'
		}).
		state('viewGalleryitem', {
			url: '/galleryitems/:galleryitemId',
			templateUrl: 'modules/galleryitems/views/view-galleryitem.client.view.html'
		}).
		state('editGalleryitem', {
			url: '/galleryitems/:galleryitemId/edit',
			templateUrl: 'modules/galleryitems/views/edit-galleryitem.client.view.html'
		});
	}
]);