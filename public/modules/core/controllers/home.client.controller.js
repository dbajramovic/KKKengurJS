'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','Articles',
	function($scope, Authentication, Articles) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        $scope.broj_clanaka = 1;
        $scope.shownarticles = [];
        $scope.test = 'OVDJE';
        $scope.getnewarticles = function () {
                $scope.articles = Articles.query(
                    function() {
                        $scope.test = $scope.articles.length+'';
                        while($scope.broj_clanaka%4!==0) {
                            $scope.shownarticles.push($scope.articles);
                            $scope.test = $scope.broj_clanaka+'';
                            $scope.broj_clanaka+=1;
                        }
                    }
                );
        };
	}
]);
