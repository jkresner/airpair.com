angular.module("APAnalytics", [])

  .directive('trackClick', ['$location', '$timeout', '$parse',
    function($location, $timeout, $parse) {

    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var event = "Click";
        var target = attrs.target;
        var location = attrs.href;
        var type = attrs.trackClick;

        element.click(function(){
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

  }]);
