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

angular.module("APSideNav", ['ui.bootstrap', 'APSvcSession', 'APTagInput'])
	.directive('sideNav', ['SessionService', '$modal', function(SessionService, $modal) {
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
			      windowClass: 'stack',
			      template: require('./stack.html'),
			      controller: "ModalInstanceCtrl",
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
			      windowClass: 'bookmarks',
			      template: require('./bookmarks.html'),
			      controller: "ModalInstanceCtrl",
			      size: 'lg',
			      resolve: { session: () => $scope.session }
			    });
			  }

				$scope.openProfile = function() {
					var modalInstance = $modal.open({
						windowClass: 'profile',
						template: require('./profile.html'),
						controller: "ModalInstanceCtrl",
						size: 'lg'
					});
				}

				// $scope.openProfile()
			}
		};

	}])


	.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

		$scope.clearDefaultName = function() {
			console.log('focused', $scope.session.name)
			if ($scope.session.name.indexOf('Visitor') != -1) $scope.session.name = ''
		}

	  $scope.ok = () => $modalInstance.close();
	  $scope.cancel = () => $modalInstance.dismiss('cancel');

	})





;
