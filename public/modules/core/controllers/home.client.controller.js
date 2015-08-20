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
                text: 'KK Kengur Zenica'
            });
            slides.push({
                image: 'http://res.cloudinary.com/kengurjs/image/upload/v1440070530/11790176_1105701079444268_1171366701_o_givv9t.jpg',
                text: 'KK Kengur'
            });
            slides.push({
                image: 'http://res.cloudinary.com/kengurjs/image/upload/v1440070653/11872751_1115469121800797_449450529_n_wvnpiq.jpg',
                text: 'Pobijednici Kengur Kupa'
            });
        };
        for (var i=0; i<1; i++) {
            $scope.addSlide();
        }
        $scope.broj_clanaka = 1;
        $scope.shownarticles = [];
        $scope.test = 'OVDJE';
        $scope.sendmail = function() {
            var parsedtext = $scope.emailtekst.replace(/ /g, "%20");
            $scope.href = "mailto:kontaktkengurjs@gmail.com?Subject=Mail:%20" + $scope.email+ "\nTekst:%20" + parsedtext;
            //console.log(href);
        };
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
