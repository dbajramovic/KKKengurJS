'use strict';

// Galleryitems controller
angular.module('galleryitems').controller('GalleryitemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Galleryitems','Upload','$http',
	function($scope, $stateParams, $location, Authentication, Galleryitems, Upload, $http) {
		$scope.authentication = Authentication;

		// Create new Galleryitem
		$scope.create = function() {
			// Create new Galleryitem object
			var i = 0;
			angular.forEach($scope.files, function(value, key) {
				var galleryitem = new Galleryitems ({
				name: 'Slika'
			});

			// Redirect after save
			/*galleryitem.$save(function(response) {
				$location.path('galleryitems/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});*/
			$scope.test = $scope.files.length;
			console.log(galleryitem);
			Upload.upload({
                url: '/galleryitems',
                method: 'POST',
                headers: {'Content-Type': 'multipart/form-data'},
                fields: {galleryitem: galleryitem},
                file: $scope.files[i]
            }).progress(function (evt) {
            //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            //console.log(evt);
        	}).success(function (response, status) {
                $location.path('gallery/');
                //toastr['success']('Artikal je kreiran!', 'Uspješno');
            }).error(function (err) {
                //toastr['success']('Artikal nije kreiran!', 'Greška');
                console.log(err);
            });
            	i+=1;
			});
		};
		// Remove existing Galleryitem
		$scope.remove = function(galleryitem) {
			if ( galleryitem ) { 
				galleryitem.$remove();

				for (var i in $scope.galleryitems) {
					if ($scope.galleryitems [i] === galleryitem) {
						$scope.galleryitems.splice(i, 1);
					}
				}
			} else {
				$scope.galleryitem.$remove(function() {
					$location.path('galleryitems');
				});
			}
		};

		// Update existing Galleryitem
		$scope.update = function() {
			var galleryitem = $scope.galleryitem;

			galleryitem.$update(function() {
				$location.path('galleryitems/' + galleryitem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Galleryitems
		$scope.find = function() {
			$scope.galleryitems = Galleryitems.query();
		};

		// Find existing Galleryitem
		$scope.findOne = function() {
			$scope.galleryitem = Galleryitems.get({ 
				galleryitemId: $stateParams.galleryitemId
			});
		};
	}
]);