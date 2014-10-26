angular.module("APBookmarker", ['APSvcSession'])

	.directive('bookmarker', ['SessionService', function(SessionService) {

		return {
			restrict: 'E',
			template: '<a href="#" class="bookmark" ng-click="bookmark(post._id)">bookmark</a>',
			link: function(scope, element, attrs) {
				scope.type = attrs.type
			},
			controller: ['$rootScope', '$scope', function($rootScope, $scope) {
				// console.log('bookmarker loaded', $scope.post)
				$scope.bookmark = function(objectId) {
					var data = { type: $scope.type, objectId }
					var success = function(result) {
						$rootScope.session = result
					}
					SessionService.updateBookmark(data, success, (e) => alert(e.message));
				}
			}]
		};

	}])


;
