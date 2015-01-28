angular.module("APPost", [])

.directive('apPostListItem', function($parse) {

  return {
    restrict: 'E',
    template: require('./postListItem.html'),
    link(scope, element, attrs) {
      scope.post = scope.$eval(attrs.post)
    }
  }

})

.directive('welcomePostItem', function($parse) {

  return {
    restrict: 'E',
    template: require('./postListItem2.html'),
    link(scope, element, attrs) {
      scope.post = scope.$eval(attrs.post)
    }
  }

})

.directive('apPost', function() {

  return {
    template: require('./post.html'),
    controller($scope,  $timeout, PostsService) {
      $timeout(function () {
        // Refactor this into a nicer angularjs way
        // console.log('DOM has finished rendering')
        pageHlpr.highlightSyntax();
      }, 100);

    }
  }

})


