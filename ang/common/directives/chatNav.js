angular.module("APChatNav", [])

  .directive('chatNav', function($rootScope, $modal, SessionService, corechat) {
    return {
      template: require('./chatNav.html'),
      link: function(scope, element, attrs) {

        // uncomment for mouse events -- (disabled for now)
        // element.bind('mouseenter', function() {
        //   element.removeClass('collapse');
        // });
        // element.bind('mouseleave', function() {
        //   element.addClass('collapse');
        // });

      },
      controllerAs: 'chatNav',
      controller: function($scope, $element, $attrs, $timeout) {

        this.toggle = function() {

          // if there's an activeRoom, clear it and let chat stay open
          if( corechat.activeRoom ) {
            console.log( 'removing activeRoom' );
            corechat.activeRoom = null;
            return false;
          }

          if (storage('chatNavOpen') == 'true') storage('chatNavOpen', 'false');
          else storage('chatNavOpen', 'true');

          $element.toggleClass('collapse', storage('chatNavOpen') == 'false')
          $scope.toggleAction = (storage('chatNavOpen') != 'true') ? 'Show' : 'Hide';

          storage('chatOpenedOnce', 'true');
        }
        $element.toggleClass('collapse', storage('chatNavOpen') != 'true')
        $scope.toggleAction = (storage('chatNavOpen') != 'true') ? 'Show' : 'Hide';

        // if (!storage('chatOpenedOnce'))
        // {
        //   $timeout(this.toggle, 20000)
        // }
      }
    };

  })

;
