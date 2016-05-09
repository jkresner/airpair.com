angular.module("APExpertsDirectives", [])


.directive('expertListItem', () => ({
  restrict: 'E',
  template: require('./expertListItem.html'),
  link(scope, element, attrs) {
    scope.expert = scope.$eval(attrs.expert)
  }
}))

