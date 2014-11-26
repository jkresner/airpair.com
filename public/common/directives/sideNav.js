var Validate = require('../../../shared/validation/users.js')

function storage(k, v) {
  if (window.localStorage)
  {
    if (typeof v == 'undefined')
    {
      return localStorage[k];
    }
    localStorage[k] = v;
    return v;
  }
}

angular.module("APSideNav", ['ui.bootstrap','APSvcSession', 'APTagInput'])

  .directive('sideNav', function($rootScope, $modal, SessionService) {
    return {
      template: require('./sideNav.html'),
      link: function(scope, element, attrs) {

        // Only track menu behavior for anonymous users
        SessionService.onAuthenticated( (session) =>
          scope.tracking = (session._id) ? false : true )

      },
      controllerAs: 'sideNav',
      controller: function($scope, $element, $attrs) {

        this.toggle = function() {
          if (storage('sideNavOpen') == 'true') storage('sideNavOpen', 'false');
          else storage('sideNavOpen', 'true');

          $element.toggleClass('collapse', storage('sideNavOpen') == 'false')
          $scope.toggleAction = (storage('sideNavOpen') != 'true') ? 'Show' : 'Hide';
        }
        $element.toggleClass('collapse', storage('sideNavOpen') != 'true')
        $scope.toggleAction = (storage('sideNavOpen') != 'true') ? 'Show' : 'Hide';

        $scope.openStack = function() {
          var modalInstance = $modal.open({
            template: require('./stack.html'),
            controller: "StackCtrl",
            size: 'lg'
          });
        }

        $scope.tags = () => $scope.session ? $scope.session.tags : null;
        $scope.updateTags = (scope, newTags) => {
          if (!$scope.session) return;

          $scope.session.tags = newTags;
          SessionService.tags(newTags, scope.sortSuccess, scope.sortFail);
        };

        $scope.bookmarks = () => $scope.session ? $scope.session.bookmarks : null;
        $scope.updateBookmarks = (scope, newBookmarks) => {
          if (!$scope.session) return;

          $scope.session.bookmarks = newBookmarks;
          SessionService.bookmarks(newBookmarks, scope.sortSuccess, scope.sortFail);
        }

        $scope.selectTag = function(tag) {
          var tags = $scope.session.tags;
          if ( _.contains(tags, tag) ) $scope.session.tags = _.without(tags, tag)
          else $scope.session.tags = _.union(tags, [tag])

          SessionService.updateTag(tag, angular.noop, (e) => alert(e.message));
        };

        $scope.deselectTag = (tag) => {
          $scope.session.tags = _.without($scope.session.tags, tag);
          SessionService.updateTag(tag, angular.noop, (e) => alert(e.message));
        };

        $scope.deselectBookmark = (bookmark) => {
          $scope.session.bookmarks = _.without($scope.session.bookmarks, bookmark);
          SessionService.bookmarks($scope.session.bookmarks);
        }

        $scope.openBookmarks = function() {
          var modalInstance = $modal.open({
            template: require('./bookmarks.html'),
            controller: "BookmarksCtrl",
            size: 'lg'
          });
        }

        var self = this;
        $rootScope.openProfile = function() {

          var modalInstance = $modal.open({
            template: require('./profile.html'),
            controller: 'ProileCtrl as ProileCtrl',
            size: 'lg'
          });
        }
      }
    };

  })


  .directive('sortable', function(SessionService) {
    return {
      link: function(scope, element, attrs) {
        $(element).sortable({
          stop: function(event, ui) {
            var list = scope[attrs['get']]();
            var elems = $(element).children();

            for (var i = 0; i < elems.length; i++) {
              var elem = $(elems[i]);
              var obj = _.find(list, (t) => t._id === elem.data('id'));
              obj.sort = i;
            }

            scope[attrs['set']](scope, list);
          }
        });
        $(element).disableSelection();
      }
    }
  })


  .controller('StackCtrl', function($scope, $modalInstance, $window, SessionService) {

    $scope.sortSuccess = function() {}
    $scope.sortFail = function() {}

    $scope.ok = () => $modalInstance.close();
    $scope.cancel = () => $modalInstance.dismiss('cancel');

  })


  .controller('BookmarksCtrl', function($scope, $modalInstance, $window, SessionService) {

    $scope.sortSuccess = function() {}
    $scope.sortFail = function() {}

    $scope.ok = () => $modalInstance.close();
    $scope.cancel = () => $modalInstance.dismiss('cancel');

  })


  .controller('ProileCtrl', function($scope, $rootScope, $modalInstance, $window, $timeout, SessionService) {

    $scope.data = { email: $scope.session.email, name: $scope.session.name }

    if (!$scope.session.email)
    {
      $scope.avatarQuestion = "Aren't you a little short for a storm trooper?";
      var avatar = $scope.session.avatar.replace('/v1/img/css/sidenav/default-','').replace('.png','')
      if (avatar == 'cat') $scope.avatarQuestion = "That's a nice hair tie...";
      if (avatar == 'mario') $scope.avatarQuestion = "Eating a little too many mushrooms aren't we?";
    }

    $scope.updateEmail = function(model) {
      if (!model.$valid) return
      $scope.emailChangeFailed = ""

      SessionService.changeEmail({ email: $scope.data.email },
        (result) => {
          analytics.track('Save', { type:'email', email: result.email });
          $scope.data.email = result.email
          $timeout(() => { angular.element('#signupName').trigger('focus'); }, 40)
        }
        ,
        (e) => {
        	$scope.emailChangeFailed = e.message
        	$scope.data.email = null
        }
      )
    }

    $scope.submit = (formValid, data) => {
      if (formValid)
      {
        SessionService.signup(data,
          (result) => {
          //$modalInstance.close();
          $timeout(() => { window.location = '/me'}, 250)
        },
          (e) => $scope.signupFail = e.error
        )
      }
    }

    $scope.cancel = () => $modalInstance.dismiss('cancel');

  })

;
