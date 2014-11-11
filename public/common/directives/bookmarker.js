angular.module("APBookmarker", ['APSvcSession'])


.directive('bookmarkerlist', ['SessionService', function(SessionService) {

  return {
    link: function(scope, element, attrs) {
    },
    controller: ['$rootScope', '$scope', function($rootScope, $scope) {

      SessionService.onAuthenticated(function(session) {
        _.each(session.bookmarks, function(bookmark) {
          $(".bookmark"+bookmark.objectId).attr('src', "/v1/img/css/bookmarked.png")
        })
      });

      alert('asd');
      window.toggleBookmark = function(e) {
        var $elem = $(e)
        var objectId = $elem.data('id')
        var type = $elem.data('type')

        var success = function(result) {
          //-- Update the
          if ($elem.attr('src') == "/v1/img/css/bookmarked.png")
            $elem.attr('src', "/v1/img/css/bookmark.png")
          else
            $elem.attr('src', "/v1/img/css/bookmarked.png")

        }
        var error = function(result) {
          console.log('bookmarked.error', result)
        }
        SessionService.updateBookmark({ type:type, objectId:objectId }, success, error);
      }
    }]
  };

}])

.factory('BookmarkerService',
  ['SessionService', '$rootScope', function(SessionService, $rootScope) {

  var bookmarkLookup = {};
  var bookmarksChanged = false;
  function populateBookmarkLookup() {
    bookmarkLookup = {};
    bookmarksChanged = false;
    var bookmarks = $rootScope.session ? $rootScope.session.bookmarks : [];
    _.each(bookmarks, function(b) {
      bookmarkLookup[b.objectId] = true;
    });
  }

  function lookup(objectId) {
    if (bookmarksChanged) populateBookmarkLookup();
    return bookmarkLookup[objectId];
  }

  SessionService.onAuthenticated(function() {
    bookmarksChanged = true;
  });

  var self;
  return self = {
    exists : lookup,
    toggle : function(objectId, type, success, error) {
      SessionService.updateBookmark({
        objectId: objectId,
        type: type
      }, function(response) {
        bookmarksChanged = true;
        success(lookup(objectId));
      }, error);
    }
  }
}])

.directive('bookmarker',
         ['BookmarkerService', 'SessionService', '$document', '$animate',
  function(BookmarkerService,   SessionService,   $document,   $animate) {

  return {
    restrict: 'EA',
    template:  require('./bookmarker.html'),
    require: 'bookmarker',
    controllerAs: 'bookmarker',
    controller: ['$scope', '$attrs', function($scope, $attrs) {
      $scope.type = $scope.$eval($attrs.type);
      $scope.objectId = $scope.$eval($attrs.objectId);

      var authenticated = false;
      SessionService.onAuthenticated(function(e) {
        authenticated = e && e._id && e._id.length;
      });

      var ctrl = this;
      ctrl.exists = function(objectId) {
        return BookmarkerService.exists(objectId);
      };

      ctrl.toggle = function(objectId, type) {
        if (!authenticated) return;
        BookmarkerService.toggle(objectId, type, function(status) {
          $scope.$evalAsync(status ? ctrl.onActive : ctrl.onInactive);
        });
      }
    }],
    link : function(scope, element, attrs, bookmarker) {
      var body = angular.element($document[0].body);
      bookmarker.onActive = function() {
        var clone = angular.element(element[0].cloneNode(true));
        body.append(clone);

        var start = element.offset();

        var destination = $('#navBookmarksToggle');
        var end = destination.offset();

        clone.addClass('bookmark-animation');
        $animate.leave(clone, {
          from : {
            position: 'absolute',
            left: start.left,
            top: start.top
          },
          to: {
            left: end.left,
            top: end.top
          }
        });
      };
      bookmarker.onInactive = function() {};
    }
  };

}]);
