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

	.directive('sideNav', ['$rootScope', '$modal', 'SessionService', function($rootScope, $modal, SessionService) {
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
        	if (storage('sideNavOpen') == 'true')
						storage('sideNavOpen', 'false');
					else
						storage('sideNavOpen', 'true');

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

			  $scope.selectedTags = () => ($scope.session) ? $scope.session.tags : null;

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

	}])


	.controller('StackCtrl', ['$scope', '$modalInstance', '$window', 'SessionService',
		function($scope, $modalInstance, $window, SessionService) {

		$scope.ok = () => $modalInstance.close();
		$scope.cancel = () => $modalInstance.dismiss('cancel');

	}])


	.controller('BookmarksCtrl', ['$scope', '$modalInstance', '$window', 'SessionService',
		function($scope, $modalInstance, $window, SessionService) {

		$scope.ok = () => $modalInstance.close();
		$scope.cancel = () => $modalInstance.dismiss('cancel');

	}])


	.controller('ProileCtrl', ['$scope', '$rootScope', '$modalInstance', '$window', '$timeout', 'SessionService',
		function($scope, $rootScope, $modalInstance, $window, $timeout, SessionService) {

		$scope.data = { email: $scope.session.email, name: $scope.session.name }

		$scope.updateEmail = function(model) {
			if (!model.$valid) return
			$scope.emailChangeFailed = ""

		  SessionService.changeEmail({ email: $scope.data.email },
		    (result) => {
		    	analytics.track('Save', { type:'email', email: result.email });
		    	$rootScope.session = result
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
				  	$rootScope.session = result;
				  	//$modalInstance.close();
				  },
				  (e) => $scope.signupFail = e.error
				)
			}
		}

		$scope.cancel = () => $modalInstance.dismiss('cancel');

	}])

;
