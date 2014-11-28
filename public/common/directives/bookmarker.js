angular.module("APBookmarker", ['APSvcSession'])


.directive('bookmarkerlist', function(SessionService, bookmarkerAnimation) {

  return {
    link: function(scope, element, attrs) {
    },
    controller: ['$rootScope', '$scope', function($rootScope, $scope) {

      SessionService.onAuthenticated(function(session) {
        _.each(session.bookmarks, function(bookmark) {
          $(".bookmark"+bookmark.objectId).attr('src', "/v1/img/css/bookmarked.png")
        })
      });

      window.toggleBookmark = function(e) {
        var $elem = $(e);
        var objectId = $elem.data('id');
        var type = $elem.data('type');

        SessionService.updateBookmark({ type:type, objectId:objectId }, success, error);

        function success(result) {
          if ($elem.attr('src') == "/v1/img/css/bookmarked.png") { //remove bookmark
            $elem.attr('src', "/v1/img/css/bookmark.png");
          } else { //add bookmark
            $elem.attr('src', "/v1/img/css/bookmarked.png");
            bookmarkerAnimation.active($elem);
          }
        }

        function error() {}
      }
    }]
  };

})

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

.factory('bookmarkerAnimation', function($animate, $document, $rootScope) {
  var body = angular.element($document[0].body);
  return {
    active : function(element) {
      var node = element[0] ? element[0] : element;
      element = angular.element(element);
      var clone = angular.element(node.cloneNode(true));
      body.append(clone);

      var start = element.offset();

      var destination = $('#navBookmarksToggle');
      var counter = destination.find('i');
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
      }).then(function() {
        $animate.animate(counter, null, null, 'bounce');
        !$rootScope.$$phase && $rootScope.$digest();
      });

      !$rootScope.$$phase && $rootScope.$digest();
    }
  }
})

.directive('bookmarker', function(BookmarkerService, SessionService, bookmarkerAnimation) {
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
        BookmarkerService.toggle(objectId, type, function(status) {
          $scope.$evalAsync(status ? ctrl.onActive : ctrl.onInactive);
        });
      }
    }],
    link : function(scope, element, attrs, bookmarker) {
      bookmarker.onActive = function() {
        bookmarkerAnimation.active(element);
      };
      bookmarker.onInactive = function() {};
    }
  };

});
