'use strict';

// Statlines controller
angular.module('statlines').controller('StatlinesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Statlines','Users',
	function($scope, $stateParams, $location, Authentication, Statlines,Users) {
		$scope.authentication = Authentication;

		// Create new Statline
		$scope.create = function() {
			// Create new Statline object
			var statline = new Statlines ({
				name: this.name
			});

			// Redirect after save
			statline.$save(function(response) {
				$location.path('statlines/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Statline
		$scope.remove = function(statline) {
			if ( statline ) { 
				statline.$remove();

				for (var i in $scope.statlines) {
					if ($scope.statlines [i] === statline) {
						$scope.statlines.splice(i, 1);
					}
				}
			} else {
				$scope.statline.$remove(function() {
					$location.path('statlines');
				});
			}
		};

		// Update existing Statline
		$scope.update = function() {
			var statline = $scope.statline;

			statline.$update(function() {
				$location.path('statlines/' + statline._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Statlines
		$scope.find = function() {
			$scope.statlines = Statlines.query();
            $scope.users = Users.query();
		};

		// Find existing Statline
		$scope.findOne = function() {
			$scope.statline = Statlines.get({ 
				statlineId: $stateParams.statlineId
			});
		};
	}
]);
