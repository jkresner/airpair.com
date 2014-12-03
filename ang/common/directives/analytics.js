angular.module("APAnalytics", [])

  .directive('trackClick', function($location, $timeout, $parse) {

    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var event = "Click";
        var target = attrs.target;
        var location = attrs.href;
        var type = attrs.trackClick;

        element.click(function() {
          console.log('track', scope.tracking)
          if (scope.tracking === false) return

          var props = {
            id: element.attr('id'),
            text: element.text().trim(),
            location: window.location.pathname, // $location.path() no good...
            type: type
          };

          var data = element.attr('data');
          if (data) props.data = data;

          if (window.analytics)
          {
            // console.log('track', event)
            analytics.track(event, props);
            // delay redirect so tracking finishes properly
            if (target == '_blank' || target == '_self')
            {
              var location = this.href
              $timeout(function () {
                window.location.href = location;
              }, 250);

              return false;
            }
          }
          else
          {
          	console.log('debug.analytics', 'track', event, props);
          }
        })
      }
    };

  });
