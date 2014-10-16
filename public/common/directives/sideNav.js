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

angular.module("APSideNav", ['APSvcSession'])

	.directive('sideNav', ['SessionService', function(SessionService) {

		return {
			template: require('./sideNav.html'),
			// link: function(scope, element) {

			// },
			controllerAs: 'sideNav',
			controller: function($scope, $element) {

				// SessionService.onAuthenticated( (session) => {
    //   		// console.log('got the session', session)
    //   		// ??
    // 		})

        this.toggle = function() {
        	if (storage('sideNavOpen') == 'true')
						storage('sideNavOpen', 'false');
					else
						storage('sideNavOpen', 'true');

        	$element.toggleClass('collapse', storage('sideNavOpen') == 'false')
        }

        $element.toggleClass('collapse', storage('sideNavOpen') == 'false')
      }
		};

	}]);
