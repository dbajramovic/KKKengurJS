'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles','Comments','Upload',
	function($scope, $stateParams, $location, Authentication, Articles, Comments,Upload) {
		$scope.authentication = Authentication;
		$scope.relevantcomments = [];
		$scope.create = function() {
            var cb = this.content.substr(0,150)+'...';
			var article = new Articles({
				title: this.title,
				content: this.content,
                contentbit: cb,
                user: $scope.authentication.user._id
			});
			/*article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});*/
			Upload.upload({
                url: '/articles',
                method: 'POST',
                headers: {'Content-Type': 'multipart/form-data'},
                fields: {article: article},
                file: $scope.files
            }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file[0].name);
            console.log(evt);
        	}).success(function (response, status) {
                $location.path('articles/' + response._id);
                $scope.title = '';
                $scope.content = '';
                //toastr['success']('Artikal je kreiran!', 'Uspješno');
            }).error(function (err) {
                //toastr['success']('Artikal nije kreiran!', 'Greška');
            });
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.isUser = false;
			if(typeof Authentication.user._id !== 'undefined')
				$scope.isUser = true;
			$scope.articles = Articles.query();
		};
        $scope.findComments = function() {
            $scope.comments = Comments.query(
            	function() {
            		 for(var i = 0;i < $scope.comments.length;i++) {
            		 	if($scope.article._id === $scope.comments[i].article) {
            		 		$scope.relevantcomments.push($scope.comments[i]);
            		 	}
            		}
            	}
            );
        };
		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
