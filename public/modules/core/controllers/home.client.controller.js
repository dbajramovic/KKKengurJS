'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','Articles',
	function($scope, Authentication, Articles) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        var slides = $scope.slides = [];
        $scope.addSlide = function() {
            slides.push({
                image: 'http://res.cloudinary.com/kengurjs/image/upload/v1438546488/11823801_1105702629444113_1079615523_n_tkn2qy.jpg',
                text: 'KK Kengur'
            });
        };
        for (var i=0; i<4; i++) {
            $scope.addSlide();
        }
        $scope.broj_clanaka = 1;
        $scope.shownarticles = [];
        $scope.test = 'OVDJE';
        $scope.getnewarticles = function () {
                $scope.articles = Articles.query(
                    function() {
                        while($scope.broj_clanaka%5!==0) {
                            $scope.shownarticles.push($scope.articles[$scope.broj_clanaka-1]);
                            $scope.test = $scope.broj_clanaka+'';
                            $scope.broj_clanaka+=1;
                        }
                        //$scope.test=$scope.shownarticles.length+'';
                    }
                );
        };
	}
]);
