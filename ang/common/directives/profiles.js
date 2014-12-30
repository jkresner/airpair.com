angular.module("APProfileDirectives", [])

.directive('socialLinks', function() {

  return {
    template: require('./socialLinks.html'),
    scope: { p: '=profile' },
    link(scope, element, attrs) { },
    controller($scope, $attrs) { }
  };

})


.directive('socialScores', function() {

  return {
    template: require('./socialScores.html'),
    scope: { p: '=profile' },
    link(scope, element, attrs) { },
    controller($scope, $attrs) { }
  };

})
