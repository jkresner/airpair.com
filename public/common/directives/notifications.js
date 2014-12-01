
angular.module("APNotifications", ['APFilters'])

  .directive('notifications', function() {

    return {
      template: require('./notifications.html'),
      //-- Sometimes controller may run before link
      controller : function() {

      },

      link : function(scope, element, attrs, ctrls) {
        element.addClass('notify')
      }

    };

  })

;
