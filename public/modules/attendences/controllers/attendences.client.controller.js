'use strict';

// Attendences controller
angular.module('attendences').controller('AttendencesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Attendences',
	function($scope, $stateParams, $location, Authentication, Attendences) {
		$scope.authentication = Authentication;

		// Create new Attendence
		$scope.create = function() {
			// Create new Attendence object
			var attendence = new Attendences ({
				name: this.name,
				created: this.created
			});

			// Redirect after save
			attendence.$save(function(response) {
				$location.path('attendences/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Attendence
		$scope.remove = function(attendence) {
			if ( attendence ) { 
				attendence.$remove();

				for (var i in $scope.attendences) {
					if ($scope.attendences [i] === attendence) {
						$scope.attendences.splice(i, 1);
					}
				}
			} else {
				$scope.attendence.$remove(function() {
					$location.path('attendences');
				});
			}
		};

		// Update existing Attendence
		$scope.update = function() {
			var attendence = $scope.attendence;

			attendence.$update(function() {
				$location.path('attendences/' + attendence._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Attendences
		$scope.find = function() {
			$scope.attendences = Attendences.query();
		};

		// Find existing Attendence
		$scope.findOne = function() {
			$scope.attendence = Attendences.get({ 
				attendenceId: $stateParams.attendenceId
			});
		};
	}
]);