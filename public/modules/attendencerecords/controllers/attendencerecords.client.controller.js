'use strict';

// Attendencerecords controller
angular.module('attendencerecords').controller('AttendencerecordsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Attendencerecords',
	function($scope, $stateParams, $location, Authentication, Attendencerecords) {
		$scope.authentication = Authentication;

		// Create new Attendencerecord
		$scope.create = function() {
			// Create new Attendencerecord object
			var attendencerecord = new Attendencerecords ({
				name: this.name,
				created: this.created
			});

			// Redirect after save
			attendencerecord.$save(function(response) {
				$location.path('attendencerecords/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Attendencerecord
		$scope.remove = function(attendencerecord) {
			if ( attendencerecord ) { 
				attendencerecord.$remove();

				for (var i in $scope.attendencerecords) {
					if ($scope.attendencerecords [i] === attendencerecord) {
						$scope.attendencerecords.splice(i, 1);
					}
				}
			} else {
				$scope.attendencerecord.$remove(function() {
					$location.path('attendencerecords');
				});
			}
		};

		// Update existing Attendencerecord
		$scope.update = function() {
			var attendencerecord = $scope.attendencerecord;

			attendencerecord.$update(function() {
				$location.path('attendencerecords/' + attendencerecord._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Attendencerecords
		$scope.find = function() {
			$scope.attendencerecords = Attendencerecords.query();
		};

		// Find existing Attendencerecord
		$scope.findOne = function() {
			$scope.attendencerecord = Attendencerecords.get({ 
				attendencerecordId: $stateParams.attendencerecordId
			});
		};
	}
]);