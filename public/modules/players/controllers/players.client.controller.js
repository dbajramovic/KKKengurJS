'use strict';

// Players controller
angular.module('players').controller('PlayersController', ['$scope', '$stateParams', '$location', 'Authentication','Players','Competitions','Statlines','Attendences','Attendencerecords','Upload',
	function($scope, $stateParams, $location, Authentication, Players,Competitions,Statlines,Attendences,Attendencerecords,Upload) {
		$scope.authentication = Authentication;
        $scope.years = [];
        $scope.playerstats = [];
        $scope.compnames = [];
        $scope.competition = null;
        $scope.init = function() {
        	$scope.findOne();
        	$scope.findStats();
        };
		// Create new Player
		$scope.create = function() {
            var Year = new Date(this.year,1,1,0,0,0,0);
			// Create new Player object
			var player = new Players ({
				name: this.name,
                year: Year
			});
			// Redirect after save
			/*player.$save(function(response) {
				$location.path('players/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});*/
            Upload.upload({
                url: '/players',
                method: 'POST',
                headers: {'Content-Type': 'multipart/form-data'},
                fields: {test:'AAA', player: player},
                file: $scope.files
            }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file[0].name);
            console.log(evt);
        	}).success(function (response, status) {
                $location.path('players/' + response._id);
                $scope.title = '';
                $scope.content = '';
                //toastr['success']('Artikal je kreiran!', 'Uspješno');
            }).error(function (err) {
                //toastr['success']('Artikal nije kreiran!', 'Greška');
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
        };
		// Find a list of Players
		$scope.find = function() {
			$scope.players = Players.query();
		};
		$scope.findcompname = function(compId) {
			$scope.competition = Competitions.get({
		        competitionId: compId
		    });
		};
        $scope.findStats = function() {
        	$scope.competitions = Competitions.query(function() {
        		 $scope.statlines = Statlines.query(function()
                    {
	                    	angular.forEach($scope.statlines, function (value) {
		                    	if(value.player === $stateParams.playerId)
		                    	{	
		                    		var temp = value;
		                    		var newstat = value;
		                    		angular.forEach($scope.competitions, function(value) {
		                    			if(value._id === temp.competition)
		                    				newstat.competition = value.name;
		                    		});
		                    		$scope.test = newstat.competition;
		                    		$scope.playerstats.push(newstat);
		                    	}
	                    });
                    });
        	});     
        };
		// Find existing Player
		$scope.findOne = function() {
			$scope.player = Players.get({
				playerId: $stateParams.playerId
			});
		};
		//Calendar
		
		$scope.getEvents = function() {
			$scope.calendarView = 'month';
			$scope.calendarDay = new Date();
			$scope.relevantattendencerecords = [];
			$scope.attendences = Attendences.query(
				function() {
					for(var i = 0;i < $scope.attendences.length;i++) {						
						var godina = $scope.attendences[i].created.substring(0,4);
						var mjesec = $scope.attendences[i].created.substring(5,7);
						var dan = $scope.attendences[i].created.substring(8,10);
            		 	$scope.events.push(
							  {
							    title: $scope.attendences[i].name, // The title of the event
							    type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
							    startsAt: new Date(godina,mjesec-1,dan) // A javascript date object for when the event starts
							  }
					);
            	}
				});
			$scope.attendencerecords = Attendencerecords.query(
            	function() {
            		 for(var i = 0;i < $scope.attendencerecords.length;i++) {
            		 	if($stateParams.playerId === $scope.attendencerecords[i].player) {
            		 		$scope.relevantattendencerecords.push($scope.attendencerecords[i]);
            		 	}
            		}
            	}
            );
		};
	}
]);
