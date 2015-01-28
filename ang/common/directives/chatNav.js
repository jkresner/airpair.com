angular.module("APChatNav", [])

  .directive('chatNav', function($rootScope, $timeout, $modal, SessionService, corechat) {
    return {
      template: require('./chatNav.html'),
      transclude: true,
      link: function(scope, element, attrs) {
        var lastActiveRoom;
        
        element.bind('mouseenter', function() {
          if (!corechat.activeRoomId && corechat.lastActiveRoom) {
            $timeout(function () {
              corechat.setActiveRoom(corechat.lastActiveRoom);
              element.removeClass('collapse');
            });
            
            // Slight delay to allow Angular to render widget
            $timeout(function () {
              angular.element("input#chatInput").focus();
            }, 10);
          } else {
            element.removeClass('collapse');
          }
        });
        
        element.bind('mouseleave', function() {
          element.addClass('collapse');
          if (corechat.initialized) {
            $timeout(function () {
              corechat.lastActiveRoom = corechat.activeRoomId;
              corechat.leaveActiveRoom()
            }, 10)
          }
        });
      },
      controllerAs: 'chatNav',
      controller: function($scope, $element, $attrs, $timeout) {}
    };
  })

;
