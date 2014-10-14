angular.module("APAnalytics", [])

  .directive('trackClick', ['$location', '$timeout',
    function($location, $timeout) {

    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var event = "Click";
        var target = attrs.target;
        var location = attrs.href;

        element.click(function(){
          var props = {
            id: element.attr('id'),
            text: element.text(),
            location: $location.path(),
            type: attrs.trackClick
          };

          analytics.track(event, props);

          // delay redirect so tracking finishes properly
          if (target == '_blank' || target == '_self')
          {
            $timeout(function () {
              window.location.href = location;
            }, 250);

            return false;
          }
        })
      }
    };

  }]);
