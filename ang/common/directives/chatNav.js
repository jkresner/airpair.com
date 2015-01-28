angular.module("APChatNav", [])

  .directive('chatNav', function($rootScope, $timeout, $modal, SessionService, corechat) {
    return {
      template: require('./chatNav.html'),
      transclude: true,
      link: function(scope, element, attrs) {
        var lastActiveRoom,
            active;
        
        element.bind('mouseenter', function() {
          active = true;
         /* if (!corechat.activeRoomId && corechat.lastActiveRoom) {
            $timeout(function () {
              corechat.setActiveRoom(corechat.lastActiveRoom);
              element.removeClass('collapse');
            });
            
            corechat.collapsed = false;
            
            // Slight delay to allow Angular to render widget
            $timeout(function () {
              element.removeClass('collapse');
            }, 10);
            $timeout(function () {
              angular.element("input#chatInput").focus();
            }, 20);
          } else {
            //element.removeClass('collapse');
            corechat.collapsed = false;
          }*/
          
            $timeout(function () {
              element.removeClass('collapse');
              //console.log('collapsed')
              corechat.collapsed = false;
            }, 20);
            
            $timeout(function () {
              angular.element("input#chatInput").focus();
            }, 20);
        });
        
        element.bind('mouseleave', function() {
          $timeout(function () {
            if (!active) {
              element.addClass('collapse');
              //console.log('setting colapsed')
              corechat.collapsed = true;
              
              if (corechat.initialized) {
                $timeout(function () {
                  corechat.lastActiveRoom = corechat.activeRoomId;
                  corechat.leaveActiveRoom()
                }, 10)
              }
            }
          }, 3000);
          active = false;
        });
      },
      controllerAs: 'chatNav',
      controller: function($scope, $element, $attrs, $timeout) {}
    };
  })

;
