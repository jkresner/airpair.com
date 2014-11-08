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
        var booked = _.find($rootScope.session.bookmarks, (b) =>
          b.objectId == objectId)
        return booked ? 'bookmarked' : 'bookmark';
      }


      $scope.bookmark = function() {
        var data = { type: $scope.type, objectId: $scope.objectId }
        var success = function(result) {
          // console.log('bookmarked')
        }
        SessionService.updateBookmark(data, success, (e) => alert(e.message));
      }
    }]
  };

}])

;
