'use strict';

//Galleryitems service used to communicate Galleryitems REST endpoints
angular.module('galleryitems').factory('Galleryitems', ['$resource',
	function($resource) {
		return $resource('galleryitems/:galleryitemId', { galleryitemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);