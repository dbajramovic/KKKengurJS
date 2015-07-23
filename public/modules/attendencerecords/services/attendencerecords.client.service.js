'use strict';

//Attendencerecords service used to communicate Attendencerecords REST endpoints
angular.module('attendencerecords').factory('Attendencerecords', ['$resource',
	function($resource) {
		return $resource('attendencerecords/:attendencerecordId', { attendencerecordId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);