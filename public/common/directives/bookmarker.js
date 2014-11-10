angular.module("APBookmarker", ['APSvcSession'])

.directive('bookmarker', ['SessionService', function(SessionService) {

  return {
    restrict: 'EA',
    template:  require('./bookmarker.html'),
    scope: {
      objectId: '=objectId'
    },
    link: function(scope, element, attrs) {
      scope.type = attrs.type

    },
    controller: ['$rootScope', '$scope', function($rootScope, $scope) {
      $scope.bookmarked = (objectId) => {
        if (viewData.post) objectId = viewData.post._id
        if (viewData.workshop) objectId = viewData.workshop._id

        if (!$rootScope.session) return 'bookmark'

        var booked = _.find($rootScope.session.bookmarks, (b) =>
          b.objectId == objectId)
        return booked ? 'bookmarked' : 'bookmark';
      }


      $scope.bookmark = function() {
        var objectId = $scope.objectId || viewData.post._id || viewData.workshop._id

        var data = { type: $scope.type, objectId }
        var success = function(result) {
          // console.log('bookmarked')
        }
        var error = function(result) {
          console.log('bookmarked.error', result)
        }
        SessionService.updateBookmark(data, success, error);
      }
    }]
  };

}])

;
