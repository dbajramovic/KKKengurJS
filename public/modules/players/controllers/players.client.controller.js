'use strict';

// Players controller
angular.module('players').controller('PlayersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Players','Competitions','Statlines',
	function($scope, $stateParams, $location, Authentication, Players,Competitions,Statlines) {
		$scope.authentication = Authentication;
        $scope.years = [];
		// Create new Player
		$scope.create = function() {
            var Year = new Date(this.year,1,1,0,0,0,0);
			// Create new Player object
			var player = new Players ({
				name: this.name,
                year: Year
			});

			// Redirect after save
			player.$save(function(response) {
				$location.path('players/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Player
		$scope.remove = function(player) {
			if ( player ) { 
				player.$remove();

				for (var i in $scope.players) {
					if ($scope.players [i] === player) {
						$scope.players.splice(i, 1);
					}
				}
			} else {
				$scope.player.$remove(function() {
					$location.path('players');
				});
			}
		};

		// Update existing Player
		$scope.update = function() {
			var player = $scope.player;

			player.$update(function() {
				$location.path('players/' + player._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
        $scope.fillyears = function(){
            for(var i=1980;i<2015;i++) {
                $scope.years.push(i);
            }
        }
		// Find a list of Players
		$scope.find = function() {
			$scope.players = Players.query();
		};
        $scope.findStats = function() {
            /*$scope.competitions = Competitions.query(function() {
                $scope.statlines = Statlines.query(function()
                    {}
                );
            });*/
        };
		// Find existing Player
		$scope.findOne = function() {
			$scope.player = Players.get({
				playerId: $stateParams.playerId
			});
		};
	}
]);
