angular.module("APBookmarker", ['APSvcSession'])


.factory('BookmarkerService', function($rootScope, SessionService, ServerErrors) {

  var bookmarkLookup = {};
  function populateBookmarkLookup() {
    bookmarkLookup = {};
    var bookmarks = $rootScope.session ? $rootScope.session.bookmarks : [];
    _.each(bookmarks, function(b) {
      bookmarkLookup[b.objectId] = true;
    });
  }

  SessionService.onAuthenticated(populateBookmarkLookup);

  var self;
  return self = {
    exists : (objectId) => bookmarkLookup[objectId],
    toggle : function(data, success, error) {
      SessionService.updateBookmark(data, function(response) {
        populateBookmarkLookup()
        success(bookmarkLookup[data.objectId]);
      }, ServerErrors.add);
    }
  }
})

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

.directive('bookmarker', function(BookmarkerService, bookmarkerAnimation) {
  return {
    restrict: 'EA',
    template:  require('./bookmarker.html'),
    require: 'bookmarker',
    controllerAs: 'bookmarker',
    controller: function($scope, $attrs) {
      $scope.data = {
        type: $scope.$eval($attrs.type),
        objectId: $scope.$eval($attrs.objectId)
      }

      var ctrl = this;
      ctrl.exists = BookmarkerService.exists;
      ctrl.toggle = () =>
        BookmarkerService.toggle($scope.data, function(status) {
          $scope.$evalAsync(status ? ctrl.onActive : ctrl.onInactive);
        });
    },
    link : function(scope, element, attrs, bookmarker) {
      bookmarker.onActive = function() {
        bookmarkerAnimation.active(element);
      };
      bookmarker.onInactive = function() {};
    }
  };
})

.directive('bookmarkerserver', function(BookmarkerService, bookmarkerAnimation) {
  return {
    restrict: 'EA',
    template:  require('./bookmarker.html'),
    require: 'bookmarkerserver',
    controllerAs: 'bookmarker',
    scope: {},
    controller: function($scope, $attrs) {
      $scope.data = {
        type: $scope.$eval($attrs.type),
        objectId: $scope.$eval($attrs.objectId)
      }

      var ctrl = this;
      ctrl.exists = BookmarkerService.exists;
      ctrl.toggle = () =>
        BookmarkerService.toggle($scope.data, function(status) {
          $scope.$evalAsync(status ? ctrl.onActive : ctrl.onInactive);
        });
    },
    link : function(scope, element, attrs, bookmarker) {
      bookmarker.onActive = function() {
        bookmarkerAnimation.active(element);
      };
      bookmarker.onInactive = function() {};
    }
  };
})
