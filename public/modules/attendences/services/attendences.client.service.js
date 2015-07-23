'use strict';

//Attendences service used to communicate Attendences REST endpoints
angular.module('attendences').factory('Attendences', ['$resource',
	function($resource) {
		return $resource('attendences/:attendenceId', { attendenceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);