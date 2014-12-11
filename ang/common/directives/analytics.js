angular.module("APAnalytics", [])

  .directive('trackClick', function($location, $timeout) {

    return {
      restrict: 'A',
      link(scope, element, attrs) {
        var event = "Click";
        var target = attrs.target;
        var location = attrs.href;
        var type = attrs.trackClick;

        element.click(function() {
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

  })


  .directive('trackFocus', function($timeout) {

    return {
      restrict: 'A',
      link(scope, element, attrs) {
        var event = "Focus";
        var type = attrs.trackFocus;

        element.one('focus', function() {
          if (scope.tracking === false) return

          var props = {
            id: element.attr('id'),
            location: window.location.pathname, // $location.path() no good...
            type: type
          };

          var data = element.attr('track-data');
          if (data) props.data = data;

          if (window.analytics)
            analytics.track(event, props);
          else
            console.log('debug.analytics', 'track', event, props);
        })
      }
    };

  })

;
