angular.module("APChatNav", [])

  .directive('chatNav', function($rootScope, $timeout, $modal, SessionService, corechat) {
    return {
      template: require('./chatNav.html'),
      transclude: true,
      link: function(scope, element, attrs) {
        var lastActiveRoom,
            active;
            
        corechat.$watch('collapsed', function (isCollapsed) {
          if (!isCollapsed) {
            active = true;
            element.removeClass('collapse');
          } else {
              element.addClass('collapse');
              
              if (corechat.initialized) {
                $timeout(function () {
                  corechat.lastActiveRoom = corechat.activeRoomId;
                  corechat.leaveActiveRoom()
                }, 10)
              }
          }
        });
        
        element.bind('mouseenter', function() {
            $timeout(function () {
              corechat.collapsed = false;
            }, 20);
            
            $timeout(function () {
              angular.element("input#chatInput").focus();
            }, 20);
        });
        
        element.bind('mouseleave', function() {
            active = false;
            $timeout(function () {
              if (!active) {
                corechat.collapsed = true; 
              }
            }, 3000);
        });
      },
      controllerAs: 'chatNav',
      controller: function($scope, $element, $attrs, $timeout) {}
    };
  })

;
