'use strict';

//Comments service used to communicate Comments REST endpoints
angular.module('comments').factory('Comments', ['$resource',
	function($resource) {
		return $resource('comments/:articleId/:commentId', { articleId: '@article',
        commentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		},
            {
                findbyArticle: {
                    method: 'GET',
                    isArray: true,
                    params: {article:'@article'}
                }
            });
	}
]);
