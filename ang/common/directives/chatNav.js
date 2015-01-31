angular.module("APChatNav", [])

  .directive('chatNav', function($rootScope, $timeout, $modal, SessionService, corechat) {
    return {
      template: require('./chatNav.html'),
      transclude: true,
      link: function(scope, element, attrs) {
        var lastActiveRoom,
          closeTimer;

        var openChatElemClicked = (e) =>
          $(e.target).hasClass('openchat') ||
          $(e.target).parent('.openchat').length > 0

        var focus = () => $timeout(function () {
              angular.element("input#chatInput").focus();
            }, 20);

        var collapse = () => $timeout(() => {
            console.log('collapsing')
            corechat.collapsed = true
            element.addClass('collapse')
            if (closeTimer != null) $timeout.cancel(closeTimer)
            if (corechat.initialized) {
                $timeout(function () {
                  corechat.lastActiveRoom = corechat.activeRoomId;
                  corechat.leaveActiveRoom()
                }, 10)
              }
          }, 20)

        var open = () => {
          if (closeTimer != null) $timeout.cancel(closeTimer)
          element.removeClass('collapse')
          corechat.collapsed = false
          focus()
        }

        element.bind('mouseenter', open)
        element.bind('mouseleave', () => closeTimer = $timeout(collapse, 3000))

        //-- Allow users to click out of chat being open
        $('html').click((e) => {
          if (openChatElemClicked(e)) return open()
          collapse()
        })
        $(element).click((e) => e.stopPropagation())
      },
      controllerAs: 'chatNav',
      controller: function($scope, $element, $attrs, $timeout) {}
    };
  })

;
