angular.module("APChatNav", [])

  .directive('chatNav', function($rootScope, $modal, SessionService) {
    return {
      template: require('./chatNav.html'),
      link: function(scope, element, attrs) {
      },
      controllerAs: 'chatNav',
      controller: function($scope, $element, $attrs, $timeout) {

        this.toggle = function() {
          if (storage('chatNavOpen') == 'true') storage('chatNavOpen', 'false');
          else storage('chatNavOpen', 'true');

          $element.toggleClass('collapse', storage('chatNavOpen') == 'false')
          $scope.toggleAction = (storage('chatNavOpen') != 'true') ? 'Show' : 'Hide';

          storage('chatOpenedOnce', 'true');
        }
        $element.toggleClass('collapse', storage('chatNavOpen') != 'true')
        $scope.toggleAction = (storage('chatNavOpen') != 'true') ? 'Show' : 'Hide';

        if (!storage('chatOpenedOnce'))
        {
          $timeout(this.toggle, 20000)
        }
      }
    };

  })

;
