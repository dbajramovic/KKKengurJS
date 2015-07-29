'use strict';

// Statlines controller
angular.module('statlines').controller('StatlinesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Statlines','Players','Competitions','$log',
	function($scope, $stateParams, $location, Authentication, Statlines,Players,Competitions,$log) {
		$scope.authentication = Authentication;
        $scope.listPlayers = function() {
            $scope.players = Players.query( function() {
                $scope.competitions = Competitions.query();
            });
        };
		// Create new Statline
		$scope.create = function() {
			// Create new Statline object
            $scope.$log = $log;
			var statline = new Statlines ({
				name: this.name,
                competition: this.competition._id,
                player: this.player._id,
                points: this.points,
                fouls: this.fouls
			});
            $scope.test = statline;
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
		};

		// Find existing Statline
		$scope.findOne = function() {
			$scope.statline = Statlines.get({ 
				statlineId: $stateParams.statlineId
			});
		};
	}
]);
