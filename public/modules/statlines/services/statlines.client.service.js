'use strict';

//Statlines service used to communicate Statlines REST endpoints
angular.module('statlines').factory('Statlines', ['$resource',
	function($resource) {
		return $resource('statlines/:statlineId', { statlineId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);