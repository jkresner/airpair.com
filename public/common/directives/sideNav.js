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

			},
      controllerAs: 'sideNav',
			controller: function($scope, $element, $attrs) {

        this.toggle = function() {
        	if (storage('sideNavOpen') == 'true')
						storage('sideNavOpen', 'false');
					else
						storage('sideNavOpen', 'true');

        	$element.toggleClass('collapse', storage('sideNavOpen') == 'false')
        }
        $element.toggleClass('collapse', storage('sideNavOpen') != 'true')

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
			      size: 'lg'
			    });
			  }

			}
		};

	}])


	.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

	  $scope.ok = () => $modalInstance.close();
	  $scope.cancel = () => $modalInstance.dismiss('cancel');

	})





;
