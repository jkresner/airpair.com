angular.module("APChatNav", [])

  .directive('chatNav', function($rootScope, $modal, SessionService, corechat) {
    return {
      template: require('./chatNav.html'),
      transclude: true,
      link: function(scope, element, attrs) {

        element.bind('mouseenter', function() {
          element.removeClass('collapse');
          storage('chatNavOpen', 'true');
        });
        element.bind('mouseleave', function() {
          element.addClass('collapse');
          storage('chatNavOpen', 'false');
        });

        // focus the input when the chatNav is clicked
        element.bind('click', function(e) {
          element.removeClass('collapse');
          angular.element("#chatInput input").focus();
        });

      },
      controllerAs: 'chatNav',
      controller: function($scope, $element, $attrs, $timeout) {

        this.toggle = function() {
          console.log('toggling', storage('chatNavOpen'));
          // if there's an activeRoom, clear it and let chat stay open
          if( corechat.activeRoom ) {
            console.log('activeRoom true');
            corechat.activeRoom = null;
            return false;
          }

          if (storage('chatNavOpen') == 'true') storage('chatNavOpen', 'false');
          else storage('chatNavOpen', 'true');

          console.log('toggling', storage('chatNavOpen'));

          $element.toggleClass('collapse', storage('chatNavOpen') != 'true');
          $scope.toggleAction = (storage('chatNavOpen') != 'true') ? 'Show' : 'Hide';

          storage('chatOpenedOnce', 'true');
        }

        $element.toggleClass('collapse', storage('chatNavOpen') != 'true');
        $scope.toggleAction = (storage('chatNavOpen') != 'true') ? 'Show' : 'Hide';

        // if (!storage('chatOpenedOnce'))
        // {
        //   $timeout(this.toggle, 20000)
        // }
      }
    };

  })

;
